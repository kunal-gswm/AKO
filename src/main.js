/**
 * AKO Labs — Main Entry Point
 * 
 * Orchestrates loader dismissal, then initializes:
 *   1. Lenis smooth scroll (inertial, heavy camera feel)
 *   2. Color engine (scroll-driven CSS custom properties)
 *   3. SplitReveal (character wrapping for hero)
 *   4. Project card interactions (tilt, glow, warp)
 *   5. Scroll animations + parallax depth layers
 *   6. Contact form (submission + TextScramble success)
 *   7. Footer scramble (hover effect)
 */

import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initColorEngine } from './color-engine.js';
import { initSplitReveal } from './split-reveal.js';
import { TextScramble } from './text-scramble.js';
import { initCursor } from './cursor.js';
import { initScrollAnimations, initParallax, initVelocitySkew } from './scroll-animations.js';

gsap.registerPlugin(ScrollTrigger);

/* ── Boot sequence ── */

document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Step 1: Prepare SplitReveal characters (before anything is visible)
  const splitRevealData = initSplitReveal();

  // Step 2: Initialize Lenis smooth scroll immediately
  // duration 2.4s + exponential deceleration = heavy camera through cinematic environment
  const lenis = new Lenis({
    duration: 2.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.45,     // Reduced = heavy feel per scroll tick
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Lock scroll during loader — user shouldn't drift before the experience begins
  lenis.stop();

  // Connect Lenis ↔ GSAP ScrollTrigger
  // Lenis reports its scroll position to ScrollTrigger on every frame
  lenis.on('scroll', ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker (syncs both animation systems to the same RAF)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP's lag smoothing — Lenis handles its own interpolation
  gsap.ticker.lagSmoothing(0);

  // Step 3: Wait for fonts, then dismiss loader and init everything
  document.fonts.ready.then(() => {
    const loader = document.getElementById('loader');

    // Hold the loader for 2.2s (let bar + text animations complete)
    setTimeout(() => {
      // Dismiss loader
      if (loader) {
        loader.classList.add('is-done');
      }

      // Small delay after loader fade begins, then init systems
      setTimeout(() => {
        // Unlock scroll — the experience begins
        lenis.start();

        // Init all systems
        initCursor();
        initColorEngine();
        initScrollAnimations(splitRevealData, lenis);
        initParallax();
        initVelocitySkew(lenis);
        initContactForm();
        initFooterScramble();

        // Recalculate all ScrollTrigger positions now that everything is ready
        ScrollTrigger.refresh();
      }, 400);
    }, 2200);
  });
});

/* ── Contact Form ── */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  const successMsg = successEl?.querySelector('.form-success__msg');

  if (!form || !successEl || !successMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fade out form
    gsap.to(form, {
      opacity: 0,
      y: -20,
      duration: 0.7,
      ease: 'power3.out',
      onComplete() {
        form.style.display = 'none';
        successEl.classList.add('is-visible');

        // TextScramble the success message
        const scramble = new TextScramble(successMsg);
        scramble.setText("Thank you. We'll be in touch.");
      },
    });
  });
}

/* ── Footer Logo Scramble on Hover ── */

function initFooterScramble() {
  const logo = document.getElementById('footer-logo');
  if (!logo) return;

  const originalText = logo.textContent;
  const scramble = new TextScramble(logo);
  let isAnimating = false;

  logo.addEventListener('mouseenter', () => {
    if (isAnimating) return;
    isAnimating = true;

    scramble.setText(originalText).then(() => {
      isAnimating = false;
    });
  });
}
