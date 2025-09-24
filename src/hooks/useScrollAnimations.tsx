import { useEffect, useRef } from 'react';

interface AnimationConfig {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimations = (config: AnimationConfig = {}) => {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = config;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animatedElements = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Counter animation function
    const animateCounter = (element: HTMLElement) => {
      const finalText = element.getAttribute('data-final-value') || element.textContent || '';
      
      if (finalText.trim() === '∞') {
        return;
      }

      const hasPlus = /\+$/.test(finalText);
      const hasLat = /lat$/.test(finalText);
      const num = parseInt(finalText.replace(/[^\d]/g, ''), 10) || 0;
      const suffix = hasLat ? ' lat' : hasPlus ? '+' : '';

      if (num > 0) {
        let current = 0;
        const increment = num / 60; // 60 frames for smooth animation
        const duration = 2000; // 2 seconds
        const frameTime = duration / 60;

        const timer = setInterval(() => {
          current += increment;
          if (current >= num) {
            current = num;
            clearInterval(timer);
          }
          element.textContent = Math.round(current).toString() + suffix;
        }, frameTime);
      }
    };

    // Animation functions
    const animateElement = (element: Element) => {
      if (animatedElements.current.has(element)) return;
      animatedElements.current.add(element);

      const classList = element.classList;
      
      // Welcome section animation
      if (classList.contains('welcome-header')) {
        // Welcome header jest animowany bezpośrednio w komponencie
        // Tutaj możemy dodać dodatkowe animacje jeśli potrzebne
      }
      
      // Offer cards animation
      if (classList.contains('offer-card')) {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translateY(0) rotateX(0deg)';
        (element as HTMLElement).style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
      
      // Stats section animation
      if (classList.contains('stat-card')) {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translateY(0) scale(1)';
        (element as HTMLElement).style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Animate counter
        const counterElement = element.querySelector('.stat-number') as HTMLElement;
        if (counterElement && !counterElement.hasAttribute('data-animated')) {
          counterElement.setAttribute('data-animated', 'true');
          setTimeout(() => animateCounter(counterElement), 500);
        }
      }
      
      // Gallery images animation
      if (classList.contains('image-slide')) {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'scale(1)';
        (element as HTMLElement).style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
      
      // Contact items animation
      if (classList.contains('contact-item')) {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translateX(0)';
        (element as HTMLElement).style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    };

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateElement(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe elements
    const elementsToObserve = document.querySelectorAll(`
      .welcome-header,
      .offer-card,
      .stat-card,
      .image-slide,
      .contact-item
    `);

    elementsToObserve.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      animatedElements.current.clear();
    };
  }, [threshold, rootMargin]);

  return observerRef.current;
};