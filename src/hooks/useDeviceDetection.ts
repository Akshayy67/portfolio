import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  isTouchDevice: boolean;
  isLowEndDevice: boolean;
  prefersReducedMotion: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initial values for SSR compatibility
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080,
        isTouchDevice: false,
        isLowEndDevice: false,
        prefersReducedMotion: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      screenWidth: width,
      screenHeight: height,
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      isLowEndDevice: detectLowEndDevice(),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: height,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isLowEndDevice: detectLowEndDevice(),
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    };

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);
    
    // Listen for orientation changes on mobile
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = () => updateDeviceInfo();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMotionPreferenceChange);
    }

    // Initial update
    updateDeviceInfo();

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      } else {
        mediaQuery.removeListener(handleMotionPreferenceChange);
      }
    };
  }, []);

  return deviceInfo;
};

// Helper function to detect low-end devices
function detectLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for hardware concurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check for connection type (if available)
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g' || 
     connection.effectiveType === '3g');
  
  // Consider it low-end if:
  // - Less than 4 CPU cores
  // - Less than 4GB RAM
  // - Slow network connection
  return cores < 4 || memory < 4 || isSlowConnection;
}

export default useDeviceDetection;
