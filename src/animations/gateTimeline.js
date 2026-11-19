/**
 * INK & IVORY — TEMPLATE 01
 * Gate Opening GSAP Animation Timeline
 * Coordinates the signature cinematic 5-phase palace entrance.
 */

import gsap from 'gsap';

export const createGateOpeningTimeline = ({
  gateWrapperRef,
  leftGateRef,
  rightGateRef,
  introContentRef,
  palaceBgRef,
  namesRef,
  btnRef,
  onComplete,
}) => {
  // Master Timeline
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    },
  });

  // Phase 1 — Button Fade & Glow
  tl.to(btnRef, {
    scale: 0.95,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  });

  // Phase 2 — Names Upward Flourish & Letter Spacing
  tl.to(
    namesRef,
    {
      y: -25,
      letterSpacing: '0.12em',
      opacity: 0.85,
      duration: 0.8,
      ease: 'power2.out',
    },
    '-=0.2'
  );

  tl.to(
    introContentRef,
    {
      opacity: 0,
      y: -40,
      duration: 0.7,
      ease: 'power2.in',
    },
    '+=0.1'
  );

  // Phase 3 — Cinematic 3D Gate Swing & Slide
  // Left gate swings back on left hinge & slides out
  tl.to(
    leftGateRef,
    {
      xPercent: -105,
      rotationY: -45,
      transformOrigin: 'left center',
      duration: 2.2,
      ease: 'power3.inOut',
    },
    '-=0.3'
  );

  // Right gate swings back on right hinge & slides out
  tl.to(
    rightGateRef,
    {
      xPercent: 105,
      rotationY: 45,
      transformOrigin: 'right center',
      duration: 2.2,
      ease: 'power3.inOut',
    },
    '<' // Run synchronized with left gate
  );

  // Phase 4 — Cinematic Background Reveal & Zoom Out
  tl.fromTo(
    palaceBgRef,
    {
      scale: 1.15,
      filter: 'brightness(0.65)',
    },
    {
      scale: 1,
      filter: 'brightness(1)',
      duration: 2.4,
      ease: 'power2.out',
    },
    '<-=0.2'
  );

  // Phase 5 — Hide entire gate container and hand over to page scroll
  tl.to(
    gateWrapperRef,
    {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      pointerEvents: 'none',
    },
    '-=0.4'
  );

  return tl;
};
