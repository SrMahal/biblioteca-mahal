async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || ("HTTP " + res.status));
  }
  return data;
}

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

async function refresh() {
  const data = await api(`/api/instructor/track/${encodeURIComponent(window.TRACK_SLUG)}`);
  const tbody = qs("#trackItems");
  tbody.innerHTML = data.items.map(it => `
    <tr data-lesson-slug="${it.lesson_slug}">
      <td style="padding:10px 12px;white-space:nowrap;">${it.order_index}</td>
      <td style="padding:10px 12px;">
        <div><strong>${escapeHtml(it.lesson_title)}</strong></div>
        <div style="opacity:.7;"><code>${escapeHtml(it.lesson_slug)}</code></div>
      </td>
      <td style="padding:10px 12px;opacity:.85;">
        ${it.source_module_slug ? `
          <div>${escapeHtml(it.source_module_title || '')}</div>
          <div style="opacity:.7;"><code>${escapeHtml(it.source_module_slug)}</code></div>
        ` : `<span style="opacity:.7;">—</span>`}
      </td>
      <td style="padding:10px 12px;white-space:nowrap;">
        <button class="btnMove btn" data-dir="up">↑</button>
        <button class="btnMove btn" data-dir="down">↓</button>
      </td>
    </tr>
  `).join("");

  bindMoveButtons();
}

function bindMoveButtons() {
  qsa(".btnMove").forEach(btn => {
    btn.onclick = async () => {
      const tr = btn.closest("tr");
      const lessonSlug = tr.getAttribute("data-lesson-slug");
      const dir = btn.getAttribute("data-dir");
      await api(`/api/instructor/track/${encodeURIComponent(window.TRACK_SLUG)}/move`, {
        method: "POST",
        body: JSON.stringify({ lesson_slug: lessonSlug, dir })
      });
      await refresh();
    };
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// Modal
function openModal() { qs("#modal").style.display = "block"; }
function closeModal() { qs("#modal").style.display = "none"; }

qs("#btnOpenInsert").onclick = openModal;
qs("#btnCloseModal").onclick = closeModal;

qs("#btnReindex").onclick = async () => {
  await api(`/api/instructor/track/${encodeURIComponent(window.TRACK_SLUG)}/reindex`, { method: "POST", body: "{}" });
  await refresh();
};

let timer = null;
qs("#qLesson").addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(searchLessons, 250);
});

async function searchLessons() {
  const q = qs("#qLesson").value.trim();
  const box = qs("#results");
  if (!q) { box.innerHTML = ""; return; }

  const res = await fetch(`/api/instructor/lessons/search?q=${encodeURIComponent(q)}`, { credentials: "same-origin" });
  const data = await res.json().catch(() => ({ ok:false }));
  if (!data.ok) { box.innerHTML = `<div style="padding:10px;opacity:.7;">Erro ao buscar</div>`; return; }

  box.innerHTML = data.items.map(it => `
    <div class="resultRow" data-lesson-slug="${it.slug}" style="padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);cursor:pointer;">
      <div><strong>${escapeHtml(it.title)}</strong></div>
      <div style="opacity:.7;"><code>${escapeHtml(it.slug)}</code></div>
    </div>
  `).join("");

  qsa(".resultRow").forEach(row => {
    row.onclick = async () => {
      const lessonSlug = row.getAttribute("data-lesson-slug");
      const position = parseInt(qs("#pos").value || "1", 10);
      const sourceModuleSlug = qs("#sourceModule").value.trim() || null;

      await api(`/api/instructor/track/${encodeURIComponent(window.TRACK_SLUG)}/insert`, {
        method: "POST",
        body: JSON.stringify({ lesson_slug: lessonSlug, position, source_module_slug: sourceModuleSlug })
      });

      closeModal();
      qs("#qLesson").value = "";
      qs("#results").innerHTML = "";
      await refresh();
    };
  });
}

// init
bindMoveButtons();