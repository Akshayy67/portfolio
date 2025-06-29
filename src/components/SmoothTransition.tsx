import React, { ReactNode, useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useDeviceDetection } from "../hooks/useDeviceDetection";

interface SmoothTransitionProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  parallax?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

const SmoothTransition: React.FC<SmoothTransitionProps> = ({
  children,
  className = "",
  direction = "up",
  duration = 0.8,
  delay = 0,
  threshold = 0.05,
  once = true,
  parallax = false,
  stagger = false,
  staggerDelay = 0.1,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceDetection();
  const { scrollYProgress } = useScroll();

  // Reduce animations on mobile or for users who prefer reduced motion
  const shouldAnimate =
    !deviceInfo.isMobile &&
    !deviceInfo.prefersReducedMotion &&
    !deviceInfo.isLowEndDevice;

  // Parallax transform
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasAnimated(true);
            observer.disconnect();
          }
        } else if (!once && !hasAnimated) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin: "50px",
      }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [threshold, once, hasAnimated]);

  const getInitialVariant = () => {
    if (!shouldAnimate) return { opacity: 1 };

    switch (direction) {
      case "up":
        return { opacity: 0, y: 50 };
      case "down":
        return { opacity: 0, y: -50 };
      case "left":
        return { opacity: 0, x: 50 };
      case "right":
        return { opacity: 0, x: -50 };
      case "scale":
        return { opacity: 0, scale: 0.8 };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateVariant = () => {
    if (!shouldAnimate) return { opacity: 1 };

    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "scale":
        return { opacity: 1, scale: 1 };
      case "fade":
      default:
        return { opacity: 1 };
    }
  };

  const getTransition = () => {
    const baseTransition = {
      duration: shouldAnimate ? duration : 0.3,
      delay: shouldAnimate ? delay : 0,
      ease: "easeOut",
    };

    if (deviceInfo.isMobile) {
      return {
        ...baseTransition,
        duration: Math.min(duration, 0.5), // Faster on mobile
      };
    }

    return baseTransition;
  };

  const containerVariants = stagger
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : undefined;

  const itemVariants = stagger
    ? {
        hidden: getInitialVariant(),
        visible: getAnimateVariant(),
      }
    : undefined;

  if (parallax && shouldAnimate) {
    return (
      <motion.div
        ref={elementRef}
        className={className}
        style={{ y: parallax ? y : 0, opacity: parallax ? opacity : 1 }}
      >
        <motion.div
          initial={getInitialVariant()}
          animate={isInView ? getAnimateVariant() : getInitialVariant()}
          transition={getTransition()}
          variants={itemVariants}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial={stagger ? "hidden" : getInitialVariant()}
      animate={
        isInView
          ? stagger
            ? "visible"
            : getAnimateVariant()
          : stagger
          ? "hidden"
          : getInitialVariant()
      }
      transition={stagger ? undefined : getTransition()}
      variants={containerVariants}
    >
      {stagger
        ? React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
};

// Higher-order component for page transitions
export const withPageTransition = <P extends object>(
  Component: React.ComponentType<P>,
  transitionProps?: Partial<SmoothTransitionProps>
) => {
  return (props: P) => (
    <SmoothTransition {...transitionProps}>
      <Component {...props} />
    </SmoothTransition>
  );
};

// Hook for scroll-based animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      const windowHeight = window.innerHeight;
      const elementTop = latest;
      const elementVisible = elementTop < windowHeight * (1 - threshold);
      setIsInView(elementVisible);
    });

    return unsubscribe;
  }, [scrollY, threshold]);

  return isInView;
};

// Preset transition configurations
export const transitionPresets = {
  fadeIn: { direction: "fade" as const, duration: 0.6 },
  slideUp: { direction: "up" as const, duration: 0.8 },
  slideDown: { direction: "down" as const, duration: 0.8 },
  slideLeft: { direction: "left" as const, duration: 0.8 },
  slideRight: { direction: "right" as const, duration: 0.8 },
  scaleIn: { direction: "scale" as const, duration: 0.6 },
  staggerUp: { direction: "up" as const, stagger: true, staggerDelay: 0.1 },
  parallaxFade: { direction: "fade" as const, parallax: true },
};

export default SmoothTransition;
