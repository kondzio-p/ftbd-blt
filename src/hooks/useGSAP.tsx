import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    Lenis: any;
  }
}

export const useGSAP = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    // Load GSAP and plugins
    const loadScripts = async () => {
      try {
        // Load scripts in order
        await loadScript('/js/gsap.min.js');
        await loadScript('/js/ScrollToPlugin.min.js');
        await loadScript('/js/ScrollTrigger.min.js');
        await loadScript('/js/lenis.min.js');

        // Initialize GSAP
        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          
          // Initialize Lenis smooth scrolling
          if (window.Lenis) {
            const lenis = new window.Lenis({
              duration: 0.3,
              easing: (t: number) => t * (2 - t),
            });

            function raf(time: number) {
              lenis.raf(time);
              requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
          }

          initialized.current = true;
        }
      } catch (error) {
        console.warn('Failed to load GSAP libraries:', error);
      }
    };

    loadScripts();
  }, []);

  return window.gsap;
};

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};