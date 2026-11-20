"use client";

import React, { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

/**
 * Synthesizes a celebratory firecracker pop and romantic chime using Web Audio API
 */
function playCelebrationSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Chime melody (romantic harp-like arpeggio)
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 1.3);
    });

    // 2. Firecracker crackle pops
    const crackleCount = 12;
    for (let i = 0; i < crackleCount; i++) {
      const crackleTime = ctx.currentTime + 0.15 + Math.random() * 0.9;
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200 + Math.random() * 800;
      filter.Q.value = 3;

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.12, crackleTime);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.04);

      noise.connect(filter);
      filter.connect(crackleGain);
      crackleGain.connect(ctx.destination);

      noise.start(crackleTime);
      noise.stop(crackleTime + 0.05);
    }
  } catch (e) {
    // Audio play ignored if context blocked by browser
  }
}

/**
 * Triggers full-screen firecrackers and love hearts celebration blast
 */
export function triggerLoveAndCrackersBlast() {
  if (typeof window === "undefined") return;

  // Sound
  playCelebrationSound();

  // Create custom heart shape for confetti
  const heartShape = confetti.shapeFromText({ text: "❤️", scalar: 2 });
  const sparkleShape = confetti.shapeFromText({ text: "✨", scalar: 1.8 });
  const roseShape = confetti.shapeFromText({ text: "🌹", scalar: 2 });

  const romanticColors = ["#B51F3B", "#641A2A", "#E7A5A4", "#FFD700", "#FFF2ED", "#FF4D6D"];

  // 1. Center Explosive Blast
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6, x: 0.5 },
    colors: romanticColors,
    shapes: [heartShape, sparkleShape, "circle"],
    scalar: 1.4,
    gravity: 0.8,
    ticks: 250,
  });

  // 2. Left Firecracker Cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.7 },
      colors: ["#FFD700", "#FF6B6B", "#B51F3B"],
      shapes: [heartShape, "circle"],
      scalar: 1.3,
      gravity: 0.9,
    });
  }, 180);

  // 3. Right Firecracker Cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.7 },
      colors: ["#FFD700", "#FF6B6B", "#641A2A"],
      shapes: [heartShape, roseShape],
      scalar: 1.3,
      gravity: 0.9,
    });
  }, 320);

  // 4. Cascading Shower of Love & Gold Sparkles
  setTimeout(() => {
    confetti({
      particleCount: 65,
      spread: 140,
      origin: { y: 0.25, x: 0.5 },
      colors: romanticColors,
      shapes: [heartShape, sparkleShape, "circle"],
      gravity: 0.6,
      scalar: 1.5,
      ticks: 350,
    });
  }, 600);
}

export default function LoveFirecrackerBlast({ active }: { active?: boolean }) {
  useEffect(() => {
    if (active) {
      triggerLoveAndCrackersBlast();
    }
  }, [active]);

  return null;
}
