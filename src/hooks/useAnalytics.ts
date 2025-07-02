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

    console.log("Initializing analytics hook");
    
    try {
      initGA();
      startSession();

      // Track initial page view
      trackPageView(window.location.pathname);
      trackLocalPageView(window.location.pathname);
      
      console.log("Analytics hook initialized successfully");
    } catch (error) {
      console.error("Failed to initialize analytics hook:", error);
    }

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
      console.log("Tracking click on:", element);
      trackUserInteraction(element, "click");
    }, []),

    trackHover: useCallback((element: string) => {
      console.log("Tracking hover on:", element);
      trackUserInteraction(element, "hover");
    }, []),

    trackSectionView: useCallback((section: string) => {
      console.log("Tracking section view:", section);
      trackSectionView(section);
    }, []),

    trackVoiceCommand: useCallback((command: string) => {
      console.log("Tracking voice command:", command);
      trackVoiceCommand(command);
    }, []),

    trackThemeChange: useCallback((theme: string) => {
      console.log("Tracking theme change:", theme);
      trackThemeChange(theme);
    }, []),

    trackProjectClick: useCallback((projectName: string) => {
      console.log("Tracking project click:", projectName);
      trackProjectClick(projectName);
    }, []),

    trackContactForm: useCallback((method: string) => {
      console.log("Tracking contact form:", method);
      trackContactForm(method);
    }, []),

    trackDownload: useCallback((fileName: string) => {
      console.log("Tracking download:", fileName);
      trackUserInteraction(fileName, "download");
    }, []),

    trackExternalLink: useCallback((url: string) => {
      console.log("Tracking external link:", url);
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
