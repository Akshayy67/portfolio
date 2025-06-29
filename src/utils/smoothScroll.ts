// Smooth scrolling utilities with performance optimizations

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  offset?: number;
  callback?: () => void;
}

// Easing functions
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
};

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get optimal duration based on distance and device
const getOptimalDuration = (distance: number, isMobile: boolean): number => {
  const baseDuration = Math.min(Math.max(Math.abs(distance) / 3, 300), 1200);
  return isMobile ? baseDuration * 0.7 : baseDuration; // Faster on mobile
};

// Main smooth scroll function
export const smoothScrollTo = (
  target: number | string | Element,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const {
      duration,
      easing = easingFunctions.easeInOutCubic,
      offset = 0,
      callback,
    } = options;

    // If user prefers reduced motion, use instant scroll
    if (prefersReducedMotion()) {
      const targetPosition = getTargetPosition(target) + offset;
      window.scrollTo(0, targetPosition);
      callback?.();
      resolve();
      return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = getTargetPosition(target) + offset;
    const distance = targetPosition - startPosition;

    // If already at target, resolve immediately
    if (Math.abs(distance) < 1) {
      callback?.();
      resolve();
      return;
    }

    const isMobile = window.innerWidth < 768;
    const scrollDuration = duration || getOptimalDuration(distance, isMobile);

    let startTime: number | null = null;
    let animationId: number;
    let userScrolled = false;

    // Cancel animation if user manually scrolls
    const handleUserScroll = () => {
      userScrolled = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
        (window as any).scrollingAnimationId = null;
        window.removeEventListener("wheel", handleUserScroll);
        window.removeEventListener("touchmove", handleUserScroll);
        resolve();
      }
    };

    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });

    const animateScroll = (currentTime: number) => {
      if (userScrolled) return;
      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / scrollDuration, 1);
      const easedProgress = easing(progress);

      const currentPosition = startPosition + distance * easedProgress;
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        animationId = requestAnimationFrame(animateScroll);
        // Store animation ID globally for cancellation
        (window as any).scrollingAnimationId = animationId;
      } else {
        // Clear the global animation ID and event listeners
        (window as any).scrollingAnimationId = null;
        window.removeEventListener("wheel", handleUserScroll);
        window.removeEventListener("touchmove", handleUserScroll);
        callback?.();
        resolve();
      }
    };

    animationId = requestAnimationFrame(animateScroll);
  });
};

// Get target position from various input types
const getTargetPosition = (target: number | string | Element): number => {
  if (typeof target === "number") {
    return target;
  }

  if (typeof target === "string") {
    const element = document.querySelector(target);
    if (!element) {
      console.warn(`Smooth scroll target not found: ${target}`);
      return 0;
    }
    return element.getBoundingClientRect().top + window.pageYOffset;
  }

  if (target instanceof Element) {
    return target.getBoundingClientRect().top + window.pageYOffset;
  }

  return 0;
};

// Smooth scroll to element with enhanced options
export const scrollToElement = (
  selector: string,
  options: SmoothScrollOptions & {
    behavior?: "smooth" | "instant" | "auto";
    block?: "start" | "center" | "end" | "nearest";
  } = {}
): Promise<void> => {
  const element = document.querySelector(selector);

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return Promise.resolve();
  }

  // Use native smooth scrolling if supported and no custom options
  if (
    !options.duration &&
    !options.easing &&
    !options.callback &&
    "scrollIntoView" in element &&
    !prefersReducedMotion()
  ) {
    element.scrollIntoView({
      behavior: options.behavior || "smooth",
      block: options.block || "start",
    });
    return Promise.resolve();
  }

  return smoothScrollTo(element, options);
};

// Smooth scroll to top
export const scrollToTop = (
  options: SmoothScrollOptions = {}
): Promise<void> => {
  return smoothScrollTo(0, {
    duration: 800,
    easing: easingFunctions.easeOutQuart,
    ...options,
  });
};

// Smooth scroll to bottom
export const scrollToBottom = (
  options: SmoothScrollOptions = {}
): Promise<void> => {
  const targetPosition =
    document.documentElement.scrollHeight - window.innerHeight;
  return smoothScrollTo(targetPosition, {
    duration: 1000,
    easing: easingFunctions.easeInOutCubic,
    ...options,
  });
};

// Enhanced navigation scroll with offset for fixed headers
export const scrollToSection = (
  sectionId: string,
  headerOffset: number = 80
): Promise<void> => {
  const section = document.getElementById(sectionId);

  if (!section) {
    console.warn(`Section not found: ${sectionId}`);
    return Promise.resolve();
  }

  // Cancel any ongoing scroll animations
  if (typeof window !== "undefined" && window.scrollingAnimationId) {
    cancelAnimationFrame(window.scrollingAnimationId);
  }

  // Use optimized smooth scrolling with better easing
  return smoothScrollTo(section, {
    offset: -headerOffset,
    duration: 1200, // Slightly longer for smoother feel
    easing: easingFunctions.easeInOutQuart, // Smoother easing
  });
};

// Parallax scroll effect
export const createParallaxEffect = (
  elements: { selector: string; speed: number }[]
): (() => void) => {
  let ticking = false;

  const updateParallax = () => {
    const scrollTop = window.pageYOffset;

    elements.forEach(({ selector, speed }) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      }
    });

    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

// Intersection Observer for scroll-triggered animations
export const createScrollTrigger = (
  selector: string,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);

  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => observer.observe(element));

  return observer;
};

// Smooth horizontal scroll for carousels
export const smoothHorizontalScroll = (
  container: Element,
  targetX: number,
  duration: number = 500
): Promise<void> => {
  return new Promise((resolve) => {
    const startX = container.scrollLeft;
    const distance = targetX - startX;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easingFunctions.easeInOutCubic(progress);

      container.scrollLeft = startX + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};
