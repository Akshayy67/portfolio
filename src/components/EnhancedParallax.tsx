import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  useDeviceDetection,
  useParallaxEffect,
} from "../hooks/useDeviceDetection";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  offset?: number;
}

interface EnhancedParallaxProps {
  children: React.ReactNode;
  className?: string;
  backgroundLayers?: ParallaxLayerProps[];
  enableMobileOnly?: boolean;
  intensity?: "subtle" | "medium" | "strong";
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
  offset = 0,
}) => {
  const deviceInfo = useDeviceDetection();
  const parallaxOffset = useParallaxEffect(speed, true);

  const getTransform = () => {
    if (deviceInfo.prefersReducedMotion) {
      return {};
    }

    const adjustedOffset = parallaxOffset + offset;

    switch (direction) {
      case "up":
        return { transform: `translateY(${-adjustedOffset}px)` };
      case "down":
        return { transform: `translateY(${adjustedOffset}px)` };
      case "left":
        return { transform: `translateX(${-adjustedOffset}px)` };
      case "right":
        return { transform: `translateX(${adjustedOffset}px)` };
      default:
        return { transform: `translateY(${-adjustedOffset}px)` };
    }
  };

  return (
    <div className={className} style={getTransform()}>
      {children}
    </div>
  );
};

const EnhancedParallax: React.FC<EnhancedParallaxProps> = ({
  children,
  className = "",
  backgroundLayers = [],
  enableMobileOnly = true,
  intensity = "medium",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceDetection();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Intensity-based speed multipliers
  const intensityMultiplier = {
    subtle: 0.3,
    medium: 0.5,
    strong: 0.8,
  }[intensity];

  // Enhanced parallax transforms for mobile
  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * intensityMultiplier]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -150 * intensityMultiplier]
  );
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -200 * intensityMultiplier]
  );

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothY1 = useSpring(y1, springConfig);
  const smoothY2 = useSpring(y2, springConfig);
  const smoothY3 = useSpring(y3, springConfig);

  // Opacity transforms for depth effect
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 0.8, 0.4]
  );

  // Enable parallax on all devices for now (can be toggled back to mobile-only later)
  const shouldApplyParallax = !deviceInfo.prefersReducedMotion;
  const shouldAnimate = shouldApplyParallax;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Background Parallax Layers - Always show backgrounds */}
      {backgroundLayers.map((layer, index) =>
        shouldAnimate ? (
          <ParallaxLayer
            key={index}
            speed={layer.speed || (0.2 + index * 0.1) * intensityMultiplier}
            direction={layer.direction}
            className={`absolute inset-0 ${layer.className || ""}`}
            offset={layer.offset}
          >
            {layer.children}
          </ParallaxLayer>
        ) : (
          <div
            key={index}
            className={`absolute inset-0 ${layer.className || ""}`}
          >
            {layer.children}
          </div>
        )
      )}

      {/* Main Content with Parallax */}
      {shouldAnimate ? (
        <motion.div
          style={{
            y: smoothY1,
            opacity: opacity1,
          }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      ) : (
        <div className="relative z-10">{children}</div>
      )}

      {/* Additional Floating Elements for Mobile */}
      {shouldAnimate && (
        <>
          {/* Floating particles */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: smoothY2, opacity: opacity2 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + i * 8}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>

          {/* Background geometric shapes */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: smoothY3 }}
          >
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-orange-400/10 rounded-full" />
            <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/5 rounded-full" />
            <div className="absolute top-1/2 left-3/4 w-16 h-16 border border-orange-300/15 rounded-full" />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default EnhancedParallax;
export { ParallaxLayer };
