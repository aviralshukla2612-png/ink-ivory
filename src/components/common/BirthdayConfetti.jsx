'use client';

import React, { useEffect, useRef } from 'react';

export function BirthdayConfetti({ active = true, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#B62A42', '#E9CFA9', '#681C2C', '#F4CFCA', '#D9A441', '#FFFCF9', '#F9E3DE'];
    const confettiCount = 140;

    const pieces = Array.from({ length: confettiCount }).map(() => ({
      x: width * 0.5 + (Math.random() - 0.5) * 120,
      y: height * 0.65,
      size: Math.random() * 8 + 5,
      speedX: (Math.random() - 0.5) * 18,
      speedY: -Math.random() * 22 - 12,
      gravity: 0.42,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
    }));

    let startTime = performance.now();

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;
      pieces.forEach((p) => {
        p.speedY += p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.speedX *= 0.98;

        if (p.y > height * 0.5) {
          p.opacity -= 0.008;
        }

        if (p.opacity > 0 && p.y < height + 50) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0 && time - startTime < 6500) {
        animationFrameId = requestAnimationFrame(render);
      } else if (onComplete) {
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
