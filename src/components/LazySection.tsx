import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  animationDelay?: number;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = "",
  threshold = 0.05,
  rootMargin = "200px",
  fallback,
  animationDelay = 0,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true);
          setHasLoaded(true);
          // Keep observing for animation triggers
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  const defaultFallback = (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-white/40 font-mono text-sm">Loading...</p>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className={className}>
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: animationDelay,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazySection;
