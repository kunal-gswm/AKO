/**
 * Color Engine — scroll-driven color interpolation
 * 
 * Maps normalized scroll progress (0→1) to four CSS custom properties
 * using the exact keyframe arrays from the AKO Labs spec.
 * 
 * Uses GSAP's color interpolation for smooth transitions between hex values.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Color stop definitions (from spec) ── */

const STOPS = {
  bg: {
    input:  [0, 0.12, 0.22, 0.30, 0.38, 0.50, 0.58, 0.72, 0.82, 1.0],
    output: [
      '#0a0c12', '#0d0f18', '#130d20', '#1e0f28', '#2a1635',
      '#6B2D5E', '#B06040', '#F5F0E8', '#C8A84A', '#8B6914',
    ],
  },
  text: {
    input:  [0, 0.50, 0.58, 1.0],
    output: ['#E8E4DC', '#E8E4DC', '#1a1208', '#1a1208'],
  },
  accent: {
    input:  [0, 0.28, 0.50, 0.82, 1.0],
    output: ['#9090C0', '#C090B0', '#C4A86A', '#C4A86A', '#E8DCA0'],
  },
  muted: {
    input:  [0, 0.50, 0.58, 1.0],
    output: ['#6070A0', '#6070A0', '#7a6a50', '#5a4a20'],
  },
};

/**
 * Interpolate a color value from non-uniform stops.
 * Uses GSAP's built-in color interpolation (handles hex → rgb internally).
 */
function interpolate(progress, stops) {
  const { input, output } = stops;

  // Clamp
  if (progress <= input[0]) return output[0];
  if (progress >= input[input.length - 1]) return output[output.length - 1];

  // Find which segment we're in
  for (let i = 0; i < input.length - 1; i++) {
    if (progress <= input[i + 1]) {
      const t = (progress - input[i]) / (input[i + 1] - input[i]);
      return gsap.utils.interpolate(output[i], output[i + 1], t);
    }
  }

  return output[output.length - 1];
}

/**
 * Initialize the color engine.
 * Creates a single ScrollTrigger that updates CSS custom properties every frame.
 */
export function initColorEngine() {
  const root = document.documentElement;
  const progressFill = document.querySelector('.scroll-progress__fill');

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      const p = self.progress;

      // Update CSS custom properties
      root.style.setProperty('--bg', interpolate(p, STOPS.bg));
      root.style.setProperty('--text', interpolate(p, STOPS.text));
      root.style.setProperty('--accent', interpolate(p, STOPS.accent));
      root.style.setProperty('--muted', interpolate(p, STOPS.muted));

      // Update scroll progress bar
      if (progressFill) {
        progressFill.style.width = `${(p * 100).toFixed(2)}%`;
      }
    },
  });
}
