'use client';

import React, { useEffect, useRef } from 'react';

export function FloatingBalloons({ count = 8 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      { fill: '#F4CFCA', stroke: '#E5ADA6' }, // soft blush
      { fill: '#E9CFA9', stroke: '#D9B885' }, // champagne gold
      { fill: '#F9E3DE', stroke: '#ECC4BC' }, // cream peach
      { fill: '#B62A42', stroke: '#901B30' }, // romantic red
      { fill: '#FFE7E2', stroke: '#F2CCC4' }, // warm white blush
    ];

    const balloons = Array.from({ length: count }).map((_, i) => ({
      x: (width / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 80,
      y: height + Math.random() * 200 + 40,
      r: Math.random() * 12 + 18,
      speedY: Math.random() * 0.45 + 0.35,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      swayWidth: Math.random() * 25 + 15,
      color: colors[i % colors.length],
      stringLen: Math.random() * 25 + 35,
      opacity: Math.random() * 0.3 + 0.45,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      balloons.forEach((b) => {
        b.y -= b.speedY;
        const currentX = b.x + Math.sin(b.y * b.swaySpeed + b.swayOffset) * b.swayWidth;

        // Draw String
        ctx.beginPath();
        ctx.moveTo(currentX, b.y + b.r * 1.25);
        ctx.bezierCurveTo(
          currentX - 5,
          b.y + b.r * 1.25 + b.stringLen * 0.5,
          currentX + 5,
          b.y + b.r * 1.25 + b.stringLen * 0.8,
          currentX,
          b.y + b.r * 1.25 + b.stringLen
        );
        ctx.strokeStyle = `rgba(180, 150, 130, ${b.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw Balloon Body (Egg/Oval shape)
        ctx.save();
        ctx.translate(currentX, b.y);
        ctx.beginPath();
        ctx.ellipse(0, 0, b.r, b.r * 1.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = b.color.fill;
        ctx.globalAlpha = b.opacity;
        ctx.fill();

        ctx.strokeStyle = b.color.stroke;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Small Balloon Knot
        ctx.beginPath();
        ctx.moveTo(-3, b.r * 1.25);
        ctx.lineTo(3, b.r * 1.25);
        ctx.lineTo(0, b.r * 1.25 + 4);
        ctx.closePath();
        ctx.fillStyle = b.color.stroke;
        ctx.fill();

        // Specular Highlight
        ctx.beginPath();
        ctx.ellipse(-b.r * 0.35, -b.r * 0.4, b.r * 0.22, b.r * 0.38, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();
        ctx.restore();

        // Recycle if passed top
        if (b.y < -120) {
          b.y = height + 80;
          b.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.85 }}
    />
  );
}
