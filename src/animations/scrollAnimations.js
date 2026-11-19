/**
 * INK & IVORY — TEMPLATE 01
 * GSAP ScrollTrigger Animation Helpers
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes editorial section reveals with ScrollTrigger inside a GSAP context
 * @param {HTMLElement|string} scopeRef - optional container to scope selectors
 * @returns {Function} cleanup function that reverts all triggers
 */
export const initSectionReveals = (scopeRef = document) => {
  if (typeof window === 'undefined') return () => {};

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  const ctx = gsap.context(() => {
    // 1. Reveal editorial text on right side
    const revealElements = document.querySelectorAll('.editorial-reveal');
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 2. Parallax background elements
    const parallaxBgs = document.querySelectorAll('.parallax-layer');
    parallaxBgs.forEach((bg) => {
      gsap.to(bg, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: bg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });
  }, scopeRef);

  return () => {
    ctx.revert();
  };
};
