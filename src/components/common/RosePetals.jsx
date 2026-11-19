'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Ambient Falling Rose Petals Canvas
 * Generates soft, organic rose petals drifting gently across the screen.
 */
export const RosePetals = ({ active = true, count = 28 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose petal colors
    const colors = [
      '#B51F3B', // Romantic red
      '#C42A45', // Deep rose
      '#E9A7A9', // Soft blush rose
      '#8B1E34', // Dark wine
      '#F6D3D0', // Delicate petal pink
    ];

    const petals = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: 8 + Math.random() * 12,
      speedY: 0.8 + Math.random() * 1.4,
      speedX: (Math.random() - 0.5) * 0.7,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      oscillationSpeed: 0.02 + Math.random() * 0.03,
      oscillationDistance: 20 + Math.random() * 30,
      oscillationOffset: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.35 + Math.random() * 0.45,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        const currentX =
          p.x + Math.sin(p.y * p.oscillationSpeed + p.oscillationOffset) * p.oscillationDistance;

        // Reset if offscreen
        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Draw organic petal shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.3, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 1s ease' }}
    />
  );
};
