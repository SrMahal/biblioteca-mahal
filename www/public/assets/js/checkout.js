document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  if (!form) return; // <<< não quebra outras páginas

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    const emailEl = document.getElementById('email');
    const email = (emailEl?.value || '').trim();
    const slug = window.__CHECKOUT_SLUG__;
    const msg = document.getElementById('msg');
    const err = document.getElementById('error-msg');

    if (msg) msg.style.display = 'none';
    if (err) err.style.display = 'none';

    try {
      if (msg) { msg.innerText = "Gerando checkout..."; msg.style.display = 'block'; }

      const r = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, slug })
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        if (err) { err.innerText = data.message || "Erro ao iniciar checkout."; err.style.display = 'block'; }
        if (msg) msg.style.display = 'none';
        return;
      }

      window.location.href = data.init_point;

    } catch (e2) {
      console.error(e2);
      if (err) { err.innerText = "Erro de conexão com o servidor."; err.style.display = 'block'; }
      if (msg) msg.style.display = 'none';
    }
  });
});
