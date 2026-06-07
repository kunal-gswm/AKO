import gsap from 'gsap';

export function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorText = document.getElementById('cursor-text');
  
  if (!cursor || !cursorDot) return;

  // Track mouse coordinates
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  // Smooth interpolated coordinates for the trailing effect
  let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Update mouse coords on move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Immediately unhide if hidden
    if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
  });

  // Ticker for smooth trailing interpolation
  gsap.ticker.add(() => {
    // Lerp (linear interpolation) for smooth lagging follow
    pos.x += (mouse.x - pos.x) * 0.15;
    pos.y += (mouse.y - pos.y) * 0.15;
    
    gsap.set(cursor, {
      x: pos.x,
      y: pos.y
    });
  });

  // Hover states
  const viewElements = document.querySelectorAll('[data-cursor="view"]');
  const linkElements = document.querySelectorAll('a, button, [data-cursor="link"]');

  viewElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorDot, {
        scale: 6,
        backgroundColor: '#E8E4DC',
        duration: 0.4,
        ease: 'power3.out'
      });
      if (cursorText) {
        cursorText.textContent = "VIEW";
        gsap.to(cursorText, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.1
        });
      }
      cursor.classList.add('cursor--view');
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cursorDot, {
        scale: 1,
        backgroundColor: '#E8E4DC',
        duration: 0.4,
        ease: 'power3.out'
      });
      if (cursorText) {
        gsap.to(cursorText, {
          opacity: 0,
          scale: 0.5,
          duration: 0.2
        });
      }
      cursor.classList.remove('cursor--view');
    });
  });

  linkElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      // Small pop for links
      gsap.to(cursorDot, {
        scale: 0.5,
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cursorDot, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
  });
}
