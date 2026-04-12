(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tilt (igual ao seu servicos.js)
  if (!prefersReduced) {
    const el = document.querySelector('[data-tilt]');
    if (el) {
      let raf = null;

      function onMove(e) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rx = (y - 0.5) * -6;
        const ry = (x - 0.5) * 10;

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
    }
  }

  // Console logs animados
  const box = document.getElementById('homeConsole');
  if (!box || prefersReduced) return;

  const pool = [
    '[OK] sync: trilhas carregadas',
    '[OK] cache: templates prontos',
    '[RUN] missão detectada: Primeiro commit',
    '[OK] auth: roles aplicados',
    '[RUN] IA: preparando contexto...',
    '[OK] deploy: ambiente pronto',
    '[RUN] ranking: atualizando XP',
    '[OK] sistema estável'
  ];

  let idx = 0;
  setInterval(() => {
    const line = document.createElement('div');
    line.className = 'line';

    const tag = document.createElement('span');
    tag.className = 'k';
    tag.textContent = pool[idx].slice(0, 4); // [OK] / [RUN]

    const rest = document.createTextNode(' ' + pool[idx].slice(4));

    line.appendChild(tag);
    line.appendChild(rest);

    box.appendChild(line);

    // mantém no máximo 8 linhas
    while (box.children.length > 8) {
      box.removeChild(box.firstChild);
    }

    idx = (idx + 1) % pool.length;
  }, 1600);
})();
