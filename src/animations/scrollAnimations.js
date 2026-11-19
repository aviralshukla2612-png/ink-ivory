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
 * Initializes editorial section reveals with ScrollTrigger
 */
export const initSectionReveals = () => {
  if (typeof window === 'undefined') return () => {};

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  const triggers = [];

  // 1. Reveal editorial cards and headings
  const revealElements = document.querySelectorAll('.editorial-reveal');
  revealElements.forEach((el) => {
    const trigger = gsap.fromTo(
      el,
      {
        y: 45,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
    triggers.push(trigger);
  });

  // 2. Parallax background elements
  const parallaxBgs = document.querySelectorAll('.parallax-layer');
  parallaxBgs.forEach((bg) => {
    const trigger = gsap.to(bg, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: bg,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
    triggers.push(trigger);
  });

  // Cleanup handler
  return () => {
    triggers.forEach((t) => {
      if (t.scrollTrigger) t.scrollTrigger.kill();
      t.kill();
    });
  };
};
