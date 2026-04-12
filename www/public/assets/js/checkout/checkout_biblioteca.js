const API_BASE = String(window.__BACKEND_API_URL__ || '').replace(/\/$/, '');

function getAffiliateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const af = (params.get('af') || '').trim();
  if (!af) return null;
  if (af.length > 64) return null;
  return af;
}

function formatBRL(value) {
  try {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch {
    return 'R$ ' + String(value);
  }
}

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutBibliotecaForm');
  if (!form) return;

  const slug = window.__CHECKOUT_SLUG__ || 'biblioteca-mahal';

  const inputCupom = document.getElementById('cupom');
  const statusBox = document.getElementById('cupomStatus');

  const priceWas = document.getElementById('priceWas');
  const priceOld = document.getElementById('priceOld');
  const priceNew = document.getElementById('priceNew');
  const pricePct = document.getElementById('pricePct');

  const msg = document.getElementById('msg');
  const err = document.getElementById('error-msg');
  const btn = document.getElementById('btnPay');

  let debounceTimer = null;
  let cupomValidoAtual = null;

  function showMsg(text) {
    if (err) err.style.display = 'none';
    if (!msg) return;
    msg.innerText = text || '';
    msg.style.display = text ? 'block' : 'none';
  }

  function showErr(text) {
    if (msg) msg.style.display = 'none';
    if (!err) return;
    err.innerText = text || '';
    err.style.display = text ? 'block' : 'none';
  }

  function disableButton() {
    if (btn) btn.setAttribute('disabled', 'disabled');
  }

  function enableButton() {
    if (btn) btn.removeAttribute('disabled');
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

  if (!API_BASE) {
    disableButton();
    showErr('BACKEND_PUBLIC_URL não configurada na biblioteca.');
    return;
  }

  async function validarCupom(codigo) {
    if (!codigo) return null;

    const r = await fetch(buildApiUrl('/api/library/coupons/validate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, slug })
    });

    return await r.json().catch(() => ({}));
  }

  if (inputCupom) {
    inputCupom.addEventListener('input', () => {
      const codigo = (inputCupom.value || '').trim();

      if (!codigo) {
        resetPreview();
        return;
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        showStatus('Validando cupom...', true);

        let resp = null;
        try {
          resp = await validarCupom(codigo);
        } catch (e) {
          console.error(e);
          resp = { ok: false, message: 'Erro ao validar cupom.' };
        }

        if (!resp || !resp.ok) {
          cupomValidoAtual = null;
          if (priceWas) priceWas.style.display = 'none';
          showStatus(resp?.message || 'Cupom inválido.', false);
          return;
        }

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

    if (msg) msg.style.display = 'none';
    if (err) err.style.display = 'none';

    if (!nome || nome.length < 2) {
      showErr('Digite seu nome.');
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showErr('E-mail inválido.');
      return;
    }

    const afiliado = cupomValidoAtual || cupomDigitado || getAffiliateFromUrl();

    try {
      disableButton();
      showMsg('Gerando checkout...');

      const r = await fetch(buildApiUrl('/api/library/checkout/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          slug,
          afiliado_codigo: afiliado
        })
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        showErr(data.message || 'Erro ao iniciar checkout.');
        enableButton();
        return;
      }

      window.location.href = data.init_point;

    } catch (e2) {
      console.error(e2);
      showErr('Erro de conexão com o servidor.');
      enableButton();
    }
  });
});