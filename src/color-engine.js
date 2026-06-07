import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initColorEngine() {
  const root = document.documentElement;
  const progressFill = document.querySelector('.scroll-progress__fill');

  // 1. Maintain the scroll progress bar logic
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      if (progressFill) {
        progressFill.style.width = `${(self.progress * 100).toFixed(2)}%`;
      }
    },
  });

  // Proxy object to store current colors so GSAP can interpolate them smoothly
  const currentColors = {
    bg: '#0a0c12',
    text: '#E8E4DC',
    accent: '#9090C0',
    muted: '#7888B8'
  };

  // Helper to apply colors from proxy to CSS variables
  const applyColors = () => {
    root.style.setProperty('--bg', currentColors.bg);
    root.style.setProperty('--text', currentColors.text);
    root.style.setProperty('--accent', currentColors.accent);
    root.style.setProperty('--muted', currentColors.muted);
  };

  // Set initial colors just to be safe
  applyColors();

  // 2. Binary Light Theme Switch triggered by the door reveal
  ScrollTrigger.create({
    trigger: '.scene--reveal',
    start: 'top 65%', // Synced exactly with the door animation trigger
    onEnter: () => {
      // Transition to Light Theme
      gsap.to(currentColors, {
        bg: '#F5F0E8',
        text: '#1a1208',
        accent: '#9A6045',
        muted: '#7a6a50',
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: applyColors
      });
    },
    onLeaveBack: () => {
      // Revert to Dark Theme if scrolling back up
      gsap.to(currentColors, {
        bg: '#0a0c12',
        text: '#E8E4DC',
        accent: '#9090C0',
        muted: '#7888B8',
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: applyColors
      });
    }
  });
}
