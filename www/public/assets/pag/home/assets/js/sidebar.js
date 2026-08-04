document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');

  if (!btn) return;

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function setButtonState(open) {
    // Texto + acessibilidade
    btn.innerHTML = open ? '✕ Fechar' : '☰ Menu';
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  function openSidebar() {
    document.body.classList.add('sidebar-open');
    document.body.style.overflow = 'hidden'; // trava scroll (mobile)
    setButtonState(true);
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = ''; // libera scroll
    setButtonState(false);
  }

  function toggleSidebar() {
    const open = document.body.classList.toggle('sidebar-open');
    document.body.style.overflow = open ? 'hidden' : '';
    setButtonState(open);
  }

  // estado inicial
  setButtonState(document.body.classList.contains('sidebar-open'));

  // Click no botão
  btn.addEventListener('click', () => {
    // No desktop você pode ignorar (não precisa abrir)
    if (!isMobile()) return;
    toggleSidebar();
  });

  // Click no overlay
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Fechar ao clicar em um link
  document.querySelectorAll('.sidebar nav a').forEach((a) => {
    a.addEventListener('click', () => {
      if (isMobile()) closeSidebar();
    });
  });

  // Se sair do mobile (virar desktop), garante fechar
  const mq = window.matchMedia('(min-width: 901px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) closeSidebar();
  });
});
