import { useState, useEffect } from 'react';

export function useBreakpoint(breakpoint: number = 900) {
  const [isMobile, setIsMobile] = useState(() => {
    // Try to get from localStorage first, fallback to reasonable default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('isMobile');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return window.innerWidth < breakpoint;
    }
    return false; // SSR default
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
      localStorage.setItem('isMobile', JSON.stringify(mobile));
      setIsInitialized(true);
    };

    // Check immediately
    checkSize();

    const handleResize = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
      localStorage.setItem('isMobile', JSON.stringify(mobile));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return { isMobile, isInitialized };
}
