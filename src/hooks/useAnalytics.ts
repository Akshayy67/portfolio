import { useEffect, useCallback } from "react";
import {
  initGA,
  trackPageView,
  trackLocalPageView,
  startSession,
  endSession,
  trackUserInteraction,
  trackSectionView,
  trackVoiceCommand,
  trackThemeChange,
  trackProjectClick,
  trackContactForm,
} from "../services/analytics";

// Custom hook for analytics
export const useAnalytics = () => {
  // Initialize analytics on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    initGA();
    startSession();

    // Track initial page view
    trackPageView(window.location.pathname);
    trackLocalPageView(window.location.pathname);

    // End session on page unload
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      endSession();
    };
  }, []);

  // Analytics functions
  const analytics = {
    trackClick: useCallback((element: string) => {
      trackUserInteraction(element, "click");
    }, []),

    trackHover: useCallback((element: string) => {
      trackUserInteraction(element, "hover");
    }, []),

    trackSectionView: useCallback((section: string) => {
      trackSectionView(section);
    }, []),

    trackVoiceCommand: useCallback((command: string) => {
      trackVoiceCommand(command);
    }, []),

    trackThemeChange: useCallback((theme: string) => {
      trackThemeChange(theme);
    }, []),

    trackProjectClick: useCallback((projectName: string) => {
      trackProjectClick(projectName);
    }, []),

    trackContactForm: useCallback((method: string) => {
      trackContactForm(method);
    }, []),

    trackDownload: useCallback((fileName: string) => {
      trackUserInteraction(fileName, "download");
    }, []),

    trackExternalLink: useCallback((url: string) => {
      trackUserInteraction(url, "external_link");
    }, []),
  };

  return analytics;
};

// Hook for section view tracking with Intersection Observer
export const useSectionTracking = (sectionName: string, threshold = 0.5) => {
  const analytics = useAnalytics();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            analytics.trackSectionView(sectionName);
          }
        });
      },
      { threshold }
    );

    const element = document.getElementById(sectionName.toLowerCase());
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [sectionName, analytics, threshold]);
};
