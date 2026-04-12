function getAffiliateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const af = (params.get('af') || '').trim();
  if (!af) return null;
  if (af.length > 64) return null;
  return af;
}

function formatBRL(value) {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch {
    return 'R$ ' + String(value);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutEventoForm');
  if (!form) return;

  const inputCupom = document.getElementById('cupom');
  const statusBox = document.getElementById('cupomStatus');

  const priceWas = document.getElementById('priceWas');
  const priceOld = document.getElementById('priceOld');
  const priceNew = document.getElementById('priceNew');
  const pricePct = document.getElementById('pricePct');
  const priceNow = document.getElementById('priceNow');

  // preço base “da tela” (fallback)
  const baseText = (priceNow?.innerText || '').trim();

  let debounceTimer = null;
  let cupomValidoAtual = null; // guarda o cupom validado (pra usar no submit)

  async function validarCupom(codigo) {
    if (!codigo) return null;

    const r = await fetch('/api/cupom/validar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, slug: 'ticket-founder' })
    });

    const data = await r.json().catch(() => ({}));
    return data;
  }

  function showStatus(text, ok = true) {
    if (!statusBox) return;
    statusBox.style.display = 'block';
    statusBox.classList.remove('ok', 'bad');
    statusBox.classList.add(ok ? 'ok' : 'bad');
    statusBox.innerText = text;
  }


  function resetPreview() {
    cupomValidoAtual = null;
    if (priceWas) priceWas.style.display = 'none';
    if (statusBox) statusBox.style.display = 'none';
  }


  if (inputCupom) {
    inputCupom.addEventListener('input', () => {
      const codigo = (inputCupom.value || '').trim();

      // vazio -> reseta
      if (!codigo) {
        resetPreview();
        return;
      }

      // debounce
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        // “carregando”
        showStatus('Validando cupom...', true);

        const resp = await validarCupom(codigo);

        if (!resp || !resp.ok) {
          cupomValidoAtual = null;
          if (priceWas) priceWas.style.display = 'none';
          showStatus(resp?.message || 'Cupom inválido.', false);
          return;
        }

        // ok -> aplica preview
        cupomValidoAtual = resp.codigo;

        const oldV = resp.preco_original;
        const newV = resp.preco_final;
        const pct = resp.desconto_percentual;

        if (priceOld) priceOld.innerText = formatBRL(oldV);
        if (priceNew) priceNew.innerText = formatBRL(newV);
        if (pricePct) pricePct.innerText = `${pct}% OFF`;
        if (priceWas) priceWas.style.display = 'inline-flex';


        showStatus('Cupom aplicado com sucesso ✅', true);
      }, 450);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = (document.getElementById('nome')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const cupomDigitado = (document.getElementById('cupom')?.value || '').trim();

    const msg = document.getElementById('msg');
    const err = document.getElementById('error-msg');
    const btn = document.getElementById('btnPay');

    if (msg) msg.style.display = 'none';
    if (err) err.style.display = 'none';

    if (!nome || nome.length < 2) {
      if (err) { err.innerText = "Digite seu nome."; err.style.display = 'block'; }
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      if (err) { err.innerText = "E-mail inválido."; err.style.display = 'block'; }
      return;
    }

    // prioridade:
    // 1) cupom validado (live)
    // 2) cupom digitado (se não validou ainda, o backend valida no create)
    // 3) af da URL
    const afiliado = cupomValidoAtual || cupomDigitado || getAffiliateFromUrl();

    try {
      if (btn) btn.setAttribute('disabled', 'disabled');
      if (msg) { msg.innerText = "Gerando checkout..."; msg.style.display = 'block'; }

      const r = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          slug: 'ticket-founder',
          afiliado_codigo: afiliado
        })
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        if (err) { err.innerText = data.message || "Erro ao iniciar checkout."; err.style.display = 'block'; }
        if (msg) msg.style.display = 'none';
        if (btn) btn.removeAttribute('disabled');
        return;
      }

      window.location.href = data.init_point;

    } catch (e2) {
      console.error(e2);
      if (err) { err.innerText = "Erro de conexão com o servidor."; err.style.display = 'block'; }
      if (msg) msg.style.display = 'none';
      if (btn) btn.removeAttribute('disabled');
    }
  });
});
