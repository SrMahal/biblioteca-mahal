(function () {
    'use strict';

    const API_BASE = String(window.MAHAL_API_BASE || window.location.origin || '').replace(/\/$/, '');

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString('pt-BR');
    }

    function showError(text) {
        const loading = document.getElementById('missionsLoading');
        const error = document.getElementById('missionsError');
        const app = document.getElementById('missionsApp');

        if (loading) loading.style.display = 'none';
        if (app) app.style.display = 'none';

        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        const loading = document.getElementById('missionsLoading');
        const error = document.getElementById('missionsError');
        const app = document.getElementById('missionsApp');

        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        if (app) app.style.display = 'grid';
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-content').forEach((content) => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    function applyFilter(tabName) {
        const searchInput = document.getElementById(`busca-${tabName}`);
        const statusSelect = document.getElementById(`status-${tabName}`);
        const wrapper = document.getElementById(`missions${tabName.charAt(0).toUpperCase() + tabName.slice(1)}List`);

        if (!wrapper) return;

        const termo = (searchInput?.value || '').trim().toLowerCase();
        const statusEscolhido = (statusSelect?.value || 'todas').trim();

        wrapper.querySelectorAll('.missao-card').forEach((card) => {
            const titulo = (card.getAttribute('data-titulo') || '').toLowerCase();
            const status = (card.getAttribute('data-status') || '').trim();

            const matchBusca = titulo.includes(termo);
            const matchStatus = statusEscolhido === 'todas' || status === statusEscolhido;

            card.style.display = matchBusca && matchStatus ? 'flex' : 'none';
        });
    }

    function renderRanking(meId, ranking) {
        const rankingList = document.getElementById('rankingList');
        const rankingEmpty = document.getElementById('rankingEmpty');

        if (!rankingList) return;

        if (!Array.isArray(ranking) || ranking.length === 0) {
            rankingList.innerHTML = '';
            if (rankingEmpty) rankingEmpty.style.display = 'block';
            return;
        }

        if (rankingEmpty) rankingEmpty.style.display = 'none';

        rankingList.innerHTML = ranking.map((user, index) => {
            const isMe = Number(user.id) === Number(meId);

            return `
                <div class="rank-item ${isMe ? 'is-me' : ''}">
                    <div class="rank-pos">${index + 1}º</div>
                    <div class="rank-nome">
                        ${isMe ? `<strong>${escapeHtml(user.nome)}</strong>` : escapeHtml(user.nome)}
                        <span class="rank-nivel">${escapeHtml(user.nivel_nome || 'Sem Rank')}</span>
                    </div>
                    <div class="rank-exp">${formatNumber(user.exp)} XP</div>
                </div>
            `;
        }).join('');
    }

    function renderExplorar(missoes, minhaExp) {
        const list = document.getElementById('missionsExplorarList');
        const empty = document.getElementById('missionsExplorarEmpty');

        if (!list) return;

        const cards = [];

        (missoes || []).forEach((missao) => {
            const jaPeguei = !!missao.meu_status;
            if (jaPeguei) return;

            const bloqueadaNivel = Number(minhaExp) < Number(missao.exp_necessaria || 0);
            const takenByOther = String(missao.tipo || '') === 'rotativa' && !!missao.executor_id;
            const statusFiltro = takenByOther ? 'ocupada' : (bloqueadaNivel ? 'bloqueada' : 'livre');

            let actionHtml = '';
            if (takenByOther) {
                actionHtml = `<button class="btn-mahal is-muted" disabled>Indisponível</button>`;
            } else if (bloqueadaNivel) {
                actionHtml = `<button class="btn-mahal is-muted" disabled><i class="fa-solid fa-lock"></i> Nível Baixo</button>`;
            } else {
                actionHtml = `<a href="/missoes/${Number(missao.id)}" class="btn-mahal">Ver Detalhes</a>`;
            }

            cards.push(`
                <div class="missao-card ${bloqueadaNivel || takenByOther ? 'is-disabled' : ''}"
                     data-titulo="${escapeHtml(missao.titulo).toLowerCase()}"
                     data-status="${statusFiltro}">
                    <div class="missao-conteudo">
                        <h3>${escapeHtml(missao.titulo)}</h3>
                        <p>${escapeHtml(missao.descricao)}</p>
                        <div class="missao-tags">
                            <span class="tag-exp">+${formatNumber(missao.exp_recompensa)} EXP</span>
                            ${takenByOther
                    ? `<span class="tag-nivel is-muted"><i class="fa-solid fa-lock"></i> Pega por outro</span>`
                    : `<span class="tag-nivel ${bloqueadaNivel ? 'is-danger' : ''}">
                                            ${bloqueadaNivel ? 'Requer: ' : 'Mínimo: '}${escapeHtml(missao.nivel_minimo_nome)}
                                       </span>`
                }
                        </div>
                    </div>
                    <div class="missao-acao">${actionHtml}</div>
                </div>
            `);
        });

        list.innerHTML = cards.join('');
        if (empty) empty.style.display = cards.length ? 'none' : 'block';
    }

    function renderMinhas(missoes) {
        const list = document.getElementById('missionsMinhasList');
        const empty = document.getElementById('missionsMinhasEmpty');

        if (!list) return;

        const cards = [];

        (missoes || []).forEach((missao) => {
            if (!missao.meu_status) return;

            let statusLabel = '';
            if (missao.meu_status === 'concluida') {
                statusLabel = `<span class="tag-nivel" style="background: rgba(76, 175, 80, 0.2); color: #4caf50;"><i class="fa-solid fa-check-double"></i> Finalizada</span>`;
            } else if (missao.meu_status === 'em_analise') {
                statusLabel = `<span class="tag-nivel" style="background: rgba(255, 183, 0, 0.2); color: #ffb700;"><i class="fa-solid fa-clock"></i> Em Análise</span>`;
            } else {
                statusLabel = `<span class="tag-nivel" style="background: rgba(33, 150, 243, 0.2); color: #2196f3;"><i class="fa-solid fa-person-running"></i> Em Progresso</span>`;
            }

            cards.push(`
                <div class="missao-card"
                     data-titulo="${escapeHtml(missao.titulo).toLowerCase()}"
                     data-status="${escapeHtml(missao.meu_status)}">
                    <div class="missao-conteudo">
                        <h3>${escapeHtml(missao.titulo)}</h3>
                        <p>${escapeHtml(missao.descricao)}</p>
                        <div class="missao-tags">
                            <span class="tag-exp">+${formatNumber(missao.exp_recompensa)} EXP</span>
                            ${statusLabel}
                        </div>
                    </div>
                    <div class="missao-acao">
                        <a href="/missoes/${Number(missao.id)}" class="btn-mahal">Gerenciar</a>
                    </div>
                </div>
            `);
        });

        list.innerHTML = cards.join('');
        if (empty) empty.style.display = cards.length ? 'none' : 'block';
    }

    async function loadMissions() {
        if (!window.MahalAuth || typeof window.MahalAuth.validateSessionOrRedirect !== 'function') {
            showError('Auth da biblioteca não carregado.');
            return;
        }

        const ok = await window.MahalAuth.validateSessionOrRedirect();
        if (!ok) return;

        try {
            const response = await fetch(`${API_BASE}/api/missoes`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.status === 401) {
                window.MahalAuth.clearClientAuth();
                window.location.replace('/login');
                return;
            }

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                showError(payload.erro || 'Erro ao carregar missões.');
                return;
            }

            const data = payload.data || {};
            const me = data.me || {};
            const ranking = data.ranking || [];
            const missoes = data.missoes || [];
            const minhaExp = Number(data.minhaExp || 0);
            const meuNivel = data.meuNivel || 'Desconhecido';

            const nivelEl = document.getElementById('meuNivel');
            const expEl = document.getElementById('minhaExp');

            if (nivelEl) nivelEl.textContent = meuNivel;
            if (expEl) expEl.textContent = formatNumber(minhaExp);

            renderRanking(me.id, ranking);
            renderExplorar(missoes, minhaExp);
            renderMinhas(missoes);

            showApp();

            applyFilter('explorar');
            applyFilter('minhas');
        } catch (error) {
            console.error(error);
            showError('Erro de conexão ao carregar missões.');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        ['explorar', 'minhas'].forEach((tab) => {
            const busca = document.getElementById(`busca-${tab}`);
            const status = document.getElementById(`status-${tab}`);

            if (busca) busca.addEventListener('input', () => applyFilter(tab));
            if (status) status.addEventListener('change', () => applyFilter(tab));
        });

        loadMissions();
    });
})();