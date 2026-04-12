(() => {
  const root = document.querySelector('.trail');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll('.trail-step'));
  const title = root.querySelector('#trailTitle');
  const desc = root.querySelector('#trailDesc');
  const tagsBox = root.querySelector('#trailTags');
  const bulletsBox = root.querySelector('#trailBullets');
  const consoleBox = root.querySelector('#trailConsole');
  const grid = root.querySelector('.trail__grid');

  const setProgress = (index) => {
    // 4 etapas -> cada uma 25%
    const total = steps.length;
    const h = 100 / total;
    const y = h * index;

    if (grid) {
      grid.style.setProperty('--trail-h', `${h}%`);
      grid.style.setProperty('--trail-y', `${y}%`);
    }
  };

  const setPanel = (btn, idx) => {
    // active state
    steps.forEach(s => {
      s.classList.toggle('is-active', s === btn);
      s.setAttribute('aria-selected', s === btn ? 'true' : 'false');
    });

    // content
    title.textContent = btn.dataset.title || '';
    desc.textContent = btn.dataset.desc || '';

    // tags
    const tags = (btn.dataset.tags || '').split(';').map(t => t.trim()).filter(Boolean);
    tagsBox.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

    // bullets
    const bullets = (btn.dataset.bullets || '').split(';').map(t => t.trim()).filter(Boolean);
    bulletsBox.innerHTML = bullets.map(t => `<li>${t}</li>`).join('');

    // mini console (simples e “vivo”)
    const stepNum = String(btn.dataset.step || (idx + 1)).padStart(2, '0');
    const key = (btn.querySelector('strong')?.textContent || 'etapa').toLowerCase();
    consoleBox.innerHTML = `
      <div class="line"><span class="k">> etapa</span> ${stepNum} • ${key}</div>
      <div class="line">carregando missão…</div>
      <div class="line">montando stack…</div>
      <div class="line"><span class="k">ok</span> pronto para avançar ✅</div>
    `;

    setProgress(idx);
  };

  // init (pega o que está ativo no HTML)
  const active = steps.find(s => s.classList.contains('is-active')) || steps[0];
  setPanel(active, steps.indexOf(active));

  // events
  steps.forEach((btn, idx) => {
    btn.addEventListener('click', () => setPanel(btn, idx));
    btn.addEventListener('mouseenter', () => setPanel(btn, idx));
  });
})();
