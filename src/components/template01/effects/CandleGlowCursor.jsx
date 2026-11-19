'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * CandleGlowCursor Component (Feature 5.12)
 * Desktop: Warm flickering candle-glow with short fading trail following mouse.
 * Phones: Soft warm ripple blooms where guest taps.
 * Warm tint of champagne gold (#C5A46D).
 * Canvas sleeps when idle (0% CPU).
 * pointer-events: none; disabled if prefers-reduced-motion.
 */
export const CandleGlowCursor = () => {
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle & trail storage
    const particles = [];
    const ripples = [];
    let isMouseMoving = false;
    let idleTimeout = null;
    let animId = null;

    let mouseX = -100;
    let mouseY = -100;

    const addParticle = (x, y) => {
      if (particles.length > 24) particles.shift();
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        radius: 12 + Math.random() * 16,
        alpha: 0.35 + Math.random() * 0.25,
        decay: 0.02 + Math.random() * 0.02,
      });
    };

    const addRipple = (x, y) => {
      ripples.push({
        x,
        y,
        radius: 6,
        maxRadius: 65,
        alpha: 0.6,
      });
      wakeLoop();
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      addParticle(mouseX, mouseY);
      isMouseMoving = true;
      clearTimeout(idleTimeout);
      wakeLoop();
      idleTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 350);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        addRipple(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    let isRunning = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render candle glow particles (desktop)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;
        p.radius *= 0.96;
        if (p.alpha <= 0 || p.radius <= 1) {
          particles.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(255, 243, 214, ${p.alpha * 0.7})`);
        grad.addColorStop(0.4, `rgba(197, 164, 109, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(16, 22, 36, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render touch ripples (mobile)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.5;
        r.alpha -= 0.025;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(216, 195, 154, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // If active elements remain, keep loop alive; otherwise sleep canvas
      if (particles.length > 0 || ripples.length > 0 || isMouseMoving) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const wakeLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handler);
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(idleTimeout);
    };
  }, []);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none"
      aria-hidden="true"
    />
  );
};

export default CandleGlowCursor;
