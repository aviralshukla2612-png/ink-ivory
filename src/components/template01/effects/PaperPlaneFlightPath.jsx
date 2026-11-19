'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * PaperPlaneFlightPath Component (Feature 5.9)
 * An SVG layer covering the page height that draws a smooth S-curve zig-zagging
 * between ~12% and ~88% of page width.
 * Base trail: round dots (~3.4px wide, 15px apart at 40% opacity in champagne gold).
 * Traveled stretch: turns into a dashed trail (12px dashes).
 * Airplane: ~64px wide at 60% opacity with a tiny heart trail, riding the path ~42%
 * down the screen and turning to match the tangent of the curve as the guest scrolls.
 * pointer-events: none; fully responsive and rebuilt on window resize.
 */
export const PaperPlaneFlightPath = () => {
  const svgRef = useRef(null);
  const basePathRef = useRef(null);
  const activePathRef = useRef(null);
  const planeRef = useRef(null);

  const [pathData, setPathData] = useState('');
  const [totalLength, setTotalLength] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Generate the S-curve path based on document dimensions
  const buildFlightPath = useCallback(() => {
    if (typeof window === 'undefined') return;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight * 5
    );
    const docWidth = window.innerWidth;

    setDimensions({ width: docWidth, height: docHeight });

    // Waypoints that weave gently down the page
    // Oscillating between ~15% and ~85% width
    const pointsCount = Math.max(8, Math.floor(docHeight / 900));
    const stepY = docHeight / (pointsCount - 1);

    const points = [];
    for (let i = 0; i < pointsCount; i++) {
      const y = i * stepY;
      // Alternate left & right
      const isRight = i % 2 === 1;
      // On narrow mobile, stay between 20% and 80%; on desktop 15% and 85%
      const minX = docWidth < 640 ? docWidth * 0.18 : docWidth * 0.12;
      const maxX = docWidth < 640 ? docWidth * 0.82 : docWidth * 0.88;
      const x = isRight ? maxX : minX;
      points.push({ x, y });
    }

    // Build smooth cubic Bézier curve through waypoints
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpYOffset = (p1.y - p0.y) * 0.5;
      const cp1x = p0.x;
      const cp1y = p0.y + cpYOffset;
      const cp2x = p1.x;
      const cp2y = p1.y - cpYOffset;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }

    setPathData(d);
  }, []);

  // Initialize and attach resize listener
  useEffect(() => {
    buildFlightPath();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildFlightPath, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [buildFlightPath]);

  // Measure path length once path is set
  useEffect(() => {
    if (basePathRef.current) {
      try {
        const len = basePathRef.current.getTotalLength();
        setTotalLength(len);
      } catch (e) {
        // SVG not fully attached yet
      }
    }
  }, [pathData]);

  // Scroll listener: update airplane position and dashed progress path
  useEffect(() => {
    if (reducedMotion || !basePathRef.current || totalLength <= 0) return;

    let rafId = null;

    const updatePlane = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowH = window.innerHeight;
      const docH = dimensions.height || document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docH - windowH);

      // Target position sits ~42% down the viewport (Feature 5.9)
      const targetScreenY = scrollY + windowH * 0.42;
      const scrollProgress = Math.min(1, Math.max(0, targetScreenY / docH));
      const currentLength = scrollProgress * totalLength;

      try {
        const point = basePathRef.current.getPointAtLength(currentLength);
        // Tangent for rotation
        const delta = 2;
        const forwardPoint = basePathRef.current.getPointAtLength(
          Math.min(totalLength, currentLength + delta)
        );
        const backwardPoint = basePathRef.current.getPointAtLength(
          Math.max(0, currentLength - delta)
        );
        const dx = forwardPoint.x - backwardPoint.x;
        const dy = forwardPoint.y - backwardPoint.y;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI;

        if (planeRef.current) {
          planeRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0px) rotate(${angleDeg}deg)`;
        }

        // Update active dashed trail up to plane position
        if (activePathRef.current) {
          activePathRef.current.style.strokeDashoffset = `${totalLength - currentLength}`;
        }
      } catch (err) {
        // Ignore math domain errors during fast DOM resize
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePlane);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updatePlane();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [totalLength, dimensions.height, reducedMotion]);

  if (reducedMotion || !pathData) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none"
      style={{ height: dimensions.height || '100%' }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{
          width: '100%',
          height: dimensions.height || '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          {/* Subtle gold gradient for active trail */}
          <linearGradient id="flightGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C5A46D" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E2D4B7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C5A46D" stopOpacity="0.9" />
          </linearGradient>

          {/* Airplane drop shadow */}
          <filter id="planeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 1. Base Dotted Flight Path (Round dots 3.4px wide, 15px apart, 40% opacity) */}
        <path
          ref={basePathRef}
          d={pathData}
          fill="none"
          stroke="#C5A46D"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="0.1 15"
          strokeOpacity="0.35"
        />

        {/* 2. Traveled Stretch: Dashed Trail (12px dashes with 8px spaces) */}
        <path
          ref={activePathRef}
          d={pathData}
          fill="none"
          stroke="url(#flightGoldGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="12 8"
          strokeDashoffset={totalLength}
          style={{
            strokeDasharray: `${totalLength} ${totalLength}`,
            transition: 'stroke-dashoffset 0.05s linear',
          }}
        />
      </svg>

      {/* 3. Paper Airplane with Trailing Heart */}
      <div
        ref={planeRef}
        className="absolute top-0 left-0 will-change-transform pointer-events-none"
        style={{
          width: '68px',
          height: '42px',
          marginLeft: '-34px',
          marginTop: '-21px',
          transformOrigin: 'center center',
          opacity: 0.65,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* SVG Paper Airplane (Luxury Royal Champagne Gold Origami) */}
          <svg
            viewBox="0 0 68 42"
            className="w-full h-full drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
            fill="none"
          >
            {/* Main fuselage & top wing */}
            <polygon
              points="64,21 4,4 20,21"
              fill="#FAF5ED"
              stroke="#C5A46D"
              strokeWidth="1.2"
            />
            {/* Bottom wing shadow */}
            <polygon
              points="64,21 20,21 4,38"
              fill="#EADBC0"
              stroke="#C5A46D"
              strokeWidth="1.2"
            />
            {/* Center crease fold */}
            <polygon
              points="64,21 16,21 20,28"
              fill="#D4B67F"
              stroke="#A88B54"
              strokeWidth="0.8"
            />
            <line
              x1="4"
              y1="4"
              x2="64"
              y2="21"
              stroke="#C5A46D"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Subtle nose highlight */}
            <circle cx="64" cy="21" r="1.5" fill="#FFF8E7" />
          </svg>

          {/* Tiny Trailing Glowing Heart */}
          <div
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A46D] opacity-80 animate-pulse"
            style={{ filter: 'drop-shadow(0 0 4px rgba(197,164,109,0.8))' }}
          >
            <svg viewBox="0 0 24 24" fill="#C5A46D" stroke="#FAF5ED" strokeWidth="1">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperPlaneFlightPath;
