/**
 * SplitReveal — cinematic character reveal animation
 * 
 * Letters emerge from below an invisible clip boundary.
 * After reveal: underline draws in → tagline fades up → copy appears.
 */

import gsap from 'gsap';

/**
 * Prepare the split-reveal element by wrapping each character
 * in clip containers. Returns character elements for animation.
 */
export function initSplitReveal() {
  const el = document.querySelector('[data-split-reveal]');
  if (!el) return null;

  const text = el.textContent.trim();
  el.textContent = '';

  const chars = [];

  for (const character of text) {
    if (character === ' ') {
      // Preserve word spacing
      const space = document.createElement('span');
      space.className = 'split-char-wrap';
      space.innerHTML = '&nbsp;';
      el.appendChild(space);
    } else {
      const wrap = document.createElement('span');
      wrap.className = 'split-char-wrap';

      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.textContent = character;

      // Start below clip boundary
      inner.style.transform = 'translateY(105%)';

      wrap.appendChild(inner);
      el.appendChild(wrap);
      chars.push(inner);
    }
  }

  // Now that characters are wrapped and hidden below clip,
  // make the container visible
  el.style.opacity = '1';

  return { el, chars };
}

/**
 * Play the SplitReveal animation sequence.
 * Characters rise → underline draws → tagline fades → copy appears.
 */
export function playSplitReveal(chars) {
  if (!chars || chars.length === 0) return null;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = (d) => isReducedMotion ? 0 : d;
  const stagger = (s) => isReducedMotion ? 0 : s;

  const tl = gsap.timeline();

  // 0. Zoom effect through the doors
  const leftDoor = document.querySelector('.door--left');
  const rightDoor = document.querySelector('.door--right');
  const sceneGrid = document.querySelector('.scene--reveal .scene__grid');
  
  if (sceneGrid) {
    // Start the scene pushed back
    gsap.set(sceneGrid, { scale: isReducedMotion ? 1 : 0.8, opacity: 0 });
    tl.to(sceneGrid, { scale: 1, opacity: 1, duration: duration(2.4), ease: 'power3.out' }, 0);
  }

  if (leftDoor && rightDoor) {
    // Doors scale up as they open, simulating camera moving forward
    tl.to([leftDoor, rightDoor], { scale: isReducedMotion ? 1 : 1.4, duration: duration(2.0), ease: 'power3.inOut' }, 0);
    tl.to(leftDoor, { xPercent: isReducedMotion ? 0 : -120, duration: duration(2.0), ease: 'power3.inOut' }, 0);
    tl.to(rightDoor, { xPercent: isReducedMotion ? 0 : 120, duration: duration(2.0), ease: 'power3.inOut' }, 0);
  }

  // 1. Characters emerge from below
  tl.to(chars, {
    y: '0%',
    duration: duration(1.4),
    stagger: stagger(0.06),
    ease: 'power4.out',
  }, leftDoor ? (isReducedMotion ? 0 : 0.6) : 0);

  // 2. Underline draws in from center
  tl.to('#brand-underline', {
    width: '100px',
    duration: duration(0.9),
    ease: 'power3.inOut',
  }, isReducedMotion ? 0 : '-=0.5');

  // 3. Tagline fades upward
  tl.to('#brand-tagline', {
    opacity: 1,
    y: 0,
    duration: duration(0.9),
    ease: 'power3.out',
  }, isReducedMotion ? 0 : '-=0.3');

  // 4. Supporting copy appears
  tl.to('#brand-copy', {
    opacity: 1,
    y: 0,
    duration: duration(0.9),
    ease: 'power3.out',
  }, isReducedMotion ? 0 : '-=0.5');

  return tl;
}
