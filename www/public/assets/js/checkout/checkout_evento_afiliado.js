const API_BASE = String(window.__BACKEND_API_URL__ || '').replace(/\/$/, '');

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function moneyBRL(valueNumber) {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(valueNumber));
    } catch (e) {
      const v = Math.round(Number(valueNumber || 0) * 100) / 100;
      return 'R$ ' + v.toFixed(2).replace('.', ',');
    }
  }

  function sanitizeCode(raw) {
    const c = (raw || '').trim().toUpperCase();
    if (!c) return '';
    if (!/^[A-Z0-9_-]{2,50}$/.test(c)) return '';
    return c;
  }

  function setStatus(type, text) {
    const box = $('cupomStatus');
    if (!box) return;
    box.classList.remove('ok', 'bad');
    box.style.display = text ? 'block' : 'none';
    if (!text) return;
    box.classList.add(type);
    box.textContent = text;
  }

  function showMsg(text) {
    const msg = $('msg');
    const err = $('error-msg');
    if (err) err.style.display = 'none';
    if (!msg) return;
    msg.textContent = text || '';
    msg.style.display = text ? 'block' : 'none';
  }

  function showErr(text) {
    const msg = $('msg');
    const err = $('error-msg');
    if (msg) msg.style.display = 'none';
    if (!err) return;
    err.textContent = text || '';
    err.style.display = text ? 'block' : 'none';
  }

  function disableButton() {
    const btn = $('btnPay');
    if (btn) btn.disabled = true;
  }

  function enableButton() {
    const btn = $('btnPay');
    if (btn) btn.disabled = false;
  }

  function resetPriceUI() {
    const base = Number(window.__PRICE_BASE__ || 0);
    const priceNow = $('priceNow');
    const priceSmall = $('priceSmall');
    const priceWas = $('priceWas');

    if (priceNow && base) priceNow.textContent = moneyBRL(base);
    if (priceSmall) priceSmall.textContent = 'à vista';

    if (priceWas) priceWas.style.display = 'none';

    const priceOld = $('priceOld');
    const priceNew = $('priceNew');
    const pricePct = $('pricePct');

    if (priceOld) priceOld.textContent = '';
    if (priceNew) priceNew.textContent = '';
    if (pricePct) pricePct.textContent = '';
  }

  function applyDiscountUI(precoOriginal, precoFinal, pct) {
    const priceWas = $('priceWas');
    const priceOld = $('priceOld');
    const priceNew = $('priceNew');
    const pricePct = $('pricePct');

    if (!priceWas || !priceOld || !priceNew || !pricePct) return;

    priceOld.textContent = moneyBRL(precoOriginal);
    priceNew.textContent = moneyBRL(precoFinal);
    pricePct.textContent = `-${Number(pct)}%`;
    priceWas.style.display = 'inline';
  }

  async function validateAffiliate(code) {
    const slug = window.__CHECKOUT_SLUG__ || 'ticket-founder';
    const codigo = sanitizeCode(code);

    if (!codigo) {
      setStatus('bad', 'Cupom inválido.');
      resetPriceUI();
      return { ok: false };
    }

    try {
      const res = await fetch(buildApiUrl('/api/library/coupons/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, slug })
      });

      const data = await res.json().catch(() => ({}));

      if (!data || data.ok !== true) {
        setStatus('bad', data?.message || 'Cupom não encontrado.');
        resetPriceUI();
        return { ok: false, data };
      }

      setStatus('ok', `Cupom aplicado: ${data.codigo} • Desconto ${data.desconto_percentual}%`);

      if (
        data.preco_original != null &&
        data.preco_final != null &&
        data.desconto_percentual != null
      ) {
        applyDiscountUI(data.preco_original, data.preco_final, data.desconto_percentual);
      }

      return { ok: true, data };
    } catch (e) {
      setStatus('bad', 'Falha ao validar cupom (conexão).');
      resetPriceUI();
      return { ok: false, error: e };
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const form = $('checkoutEventoAfiliadoForm');
    if (!form) return;

    const inputCupom = $('cupom');
    const preset = sanitizeCode(window.__AF_CODE__);
    const btn = $('btnPay');

    resetPriceUI();

    if (!API_BASE) {
      disableButton();
      showErr('BACKEND_PUBLIC_URL não configurada na biblioteca.');
      return;
    }

    const code = sanitizeCode(preset || (inputCupom ? inputCupom.value : ''));

    if (inputCupom && preset) {
      inputCupom.value = preset;
      inputCupom.readOnly = true;
      inputCupom.setAttribute('aria-readonly', 'true');
    }

    if (code) {
      showMsg('Validando cupom do afiliado...');
      const vr = await validateAffiliate(code);
      showMsg('');
      if (!vr.ok) {
        showErr('Cupom inválido. Confira o link do afiliado.');
      }
    } else {
      showErr('Link sem cupom. Use o link do afiliado corretamente.');
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nome = ($('nome')?.value || '').trim();
      const email = ($('email')?.value || '').trim();
      const afiliadoCodigo = sanitizeCode(preset || (inputCupom ? inputCupom.value : ''));

      showErr('');
      showMsg('Gerando checkout...');

      try {
        disableButton();

        const vr = await validateAffiliate(afiliadoCodigo);
        if (!vr.ok) {
          showMsg('');
          showErr('Cupom inválido. Não foi possível iniciar o checkout.');
          enableButton();
          return;
        }

        const res = await fetch(buildApiUrl('/api/library/checkout/create'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            email,
            slug: window.__CHECKOUT_SLUG__ || 'ticket-founder',
            afiliado_codigo: afiliadoCodigo
          })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          showMsg('');
          showErr(data.message || 'Erro ao iniciar checkout.');
          enableButton();
          return;
        }

        if (!data.init_point) {
          showMsg('');
          showErr('Checkout criado, mas init_point não retornou.');
          enableButton();
          return;
        }

        window.location.href = data.init_point;

      } catch (e2) {
        console.error(e2);
        showMsg('');
        showErr('Erro de conexão.');
        enableButton();
      }
    });
  });
})();