(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const el = document.querySelector('[data-tilt]');
  if (!el) return;

  let raf = null;

  function onMove(e) {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1

    const rx = (y - 0.5) * -6; // tilt vertical
    const ry = (x - 0.5) * 10; // tilt horizontal

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }

  function onLeave() {
    if (raf) cancelAnimationFrame(raf);
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  }

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
})();
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    "produto digital escalável",
    "Website",
    "Landing Pages",
    "Software as a Service",
    "Plataforma SaaS"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function loop() {
    const word = words[wordIndex];

    if (!deleting) {
      el.textContent = word.slice(0, charIndex++);
      if (charIndex > word.length) {
        setTimeout(() => (deleting = true), 1200);
      }
    } else {
      el.textContent = word.slice(0, charIndex--);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(loop, deleting ? 50 : 80);
  }

  loop();
})();
