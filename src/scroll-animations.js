/**
 * Scroll Animations — all ScrollTrigger-driven reveals
 * 
 * Orchestrates the entrance animations for every element
 * across all four acts. Each animation feels deliberate,
 * heavy, and editorial — never bouncy or playful.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSplitReveal } from './split-reveal.js';

gsap.registerPlugin(ScrollTrigger);

// Editorial ease — heavy, deliberate, mechanical
const EASE = 'power4.out';

export function initScrollAnimations(splitRevealData, lenis) {

  /* ── Generic [data-reveal] elements ── */
  const reveals = document.querySelectorAll('[data-reveal]');

  reveals.forEach((el) => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 150,
      },
      {
        opacity: 1,
        y: 0,
        duration: 2.0,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ── Brand Reveal (SplitReveal) ── */
  if (splitRevealData && splitRevealData.chars) {
    ScrollTrigger.create({
      trigger: '.scene--reveal',
      start: 'top 65%',
      once: true,
      onEnter() {
        playSplitReveal(splitRevealData.chars);
      },
    });
  }



  /* ── Testimonials — staggered per item ── */
  const testimonials = document.querySelectorAll('.testimonial');

  testimonials.forEach((t, i) => {
    gsap.fromTo(t,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: i * 0.12,
        ease: EASE,
        scrollTrigger: {
          trigger: t,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      },
    );
  });

  /* ── About Section ── */
  const aboutQuote = document.querySelector('.about__quote');
  if (aboutQuote) {
    gsap.fromTo(aboutQuote,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: EASE,
        scrollTrigger: {
          trigger: aboutQuote,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      },
    );
  }

  const aboutBody = document.querySelector('.about__body');
  if (aboutBody) {
    gsap.fromTo(aboutBody,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: EASE,
        scrollTrigger: {
          trigger: aboutBody,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      },
    );
  }

  /* ── Final CTA — scale + fade ── */
  const cta = document.querySelector('.type-cta');
  if (cta) {
    gsap.fromTo(cta,
      {
        opacity: 0,
        y: 120,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 2.0,
        ease: EASE,
        scrollTrigger: {
          trigger: cta,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      },
    );
  }

  /* ── Contact Form Fields — staggered entrance ── */
  const formFields = document.querySelectorAll('.form-field');
  const submitBtn = document.querySelector('.contact-submit');

  if (formFields.length) {
    formFields.forEach((field, i) => {
      gsap.fromTo(field,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          delay: i * 0.1,
          ease: EASE,
          scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        },
      );
    });
  }

  if (submitBtn) {
    gsap.fromTo(submitBtn,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        delay: 0.35,
        ease: EASE,
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      },
    );
  }

  /* ── Footer — subtle rise ── */
  const footerWrap = document.querySelector('.footer-wrap');
  if (footerWrap) {
    gsap.fromTo(footerWrap,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE,
        scrollTrigger: {
          trigger: '.scene--footer',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      },
    );
  }
}

/**
 * Parallax depth layers — perceived mass system.
 * 
 * Uses yPercent (independent from y used by reveal animations).
 * GSAP composes y + yPercent additively in the final CSS transform,
 * so these don't conflict with reveal fromTo animations.
 * 
 * Three mass tiers:
 *   Light  — text elements (small yPercent range, fast scrub)
 *   Medium — stat numerals, quotes (larger range, slower scrub)
 *   Heavy  — project cards (largest range, slowest scrub)
 * 
 * Higher scrub values = more lag = heavier perceived mass.
 */
export function initParallax() {
  const layers = [
    // ── Light mass (text) — barely perceptible depth ──
    {
      selector: '.scene--opening .type-hero',
      range: 12,
      scrub: 1.0,
    },
    {
      selector: '.scene--bridge .type-hero',
      range: 10,
      scrub: 1.0,
    },
    {
      selector: '.type-philosophy',
      range: 9,
      scrub: 0.8,
    },
    {
      selector: '.type-cta',
      range: 14,
      scrub: 1.2,
    },

    // ── Medium mass (numerals, quotes) — noticeable weight ──
    {
      selector: '.stat__number',
      range: 20,
      scrub: 1.5,
    },
    {
      selector: '.about__quote',
      range: 12,
      scrub: 1.2,
    },
    {
      selector: '.testimonial__quote',
      range: 10,
      scrub: 1.1,
    },

    {
      selector: '.project-split__image img, .visual-scene__img, [data-parallax-img]',
      range: 25, // Uses the 20% extra height
      scrub: 2.0,
    },
  ];

  layers.forEach(({ selector, range, scrub }) => {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.fromTo(el,
        { yPercent: range * 0.5 },
        {
          yPercent: range * -0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        },
      );
    });
  });
}

/**
 * Velocity Skew System
 * Adds cinematic inertia by skewing elements slightly during fast scrolling.
 */
export function initVelocitySkew(lenis) {
  const skewElements = document.querySelectorAll('.type-hero, .visual-scene__img');
  
  if (!skewElements.length || !lenis) return;

  // Max skew angle to prevent extreme distortion
  const maxSkew = 3;

  gsap.ticker.add(() => {
    // lenis.velocity represents scroll speed
    let velocity = lenis.velocity || 0;
    
    // Map velocity to skew
    let skew = velocity * 0.05;
    
    // Clamp skew
    skew = Math.max(-maxSkew, Math.min(skew, maxSkew));
    
    // Apply to elements
    skewElements.forEach(el => {
      // Use quickSetter for performance if possible, but GSAP set is fine
      gsap.set(el, { skewY: skew });
    });
  });
}
