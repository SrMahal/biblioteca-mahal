(function () {
    'use strict';

    const API_BASE = String(window.MAHAL_API_BASE || '').replace(/\/$/, '');
    const MISSION_ID = Number(window.__MISSION_ID__ || 0);

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

    function formatDate(value) {
        try {
            return new Date(value).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return String(value || '');
        }
    }

    function showError(text) {
        const loading = document.getElementById('missionShowLoading');
        const error = document.getElementById('missionShowError');
        const app = document.getElementById('missionShowApp');

        if (loading) loading.style.display = 'none';
        if (app) app.style.display = 'none';

        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        const loading = document.getElementById('missionShowLoading');
        const error = document.getElementById('missionShowError');
        const app = document.getElementById('missionShowApp');

        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        if (app) app.style.display = 'block';
    }

    async function apiFetch(path, options = {}) {
        const response = await fetch(`${API_BASE}${path}`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            if (window.MahalAuth) {
                window.MahalAuth.clearClientAuth();
            }
            window.location.replace('/login');
            throw new Error('Não autenticado.');
        }

        return { response, data };
    }

    function renderMessages(messages, meId, privateMode = false) {
        if (!Array.isArray(messages) || messages.length === 0) {
            return privateMode
                ? `<p style="color: #666; font-style: italic; font-size: 0.9rem;">Seu canal direto com a equipe. Mande os links da sua entrega aqui.</p>`
                : `<p style="color: #666; font-style: italic; font-size: 0.9rem;">Ninguém tirou dúvidas ainda.</p>`;
        }

        return messages.map((msg) => {
            if (privateMode) {
                const isAdmin = Number(msg.is_admin || 0) === 1;

                return `
                    <div class="msg-box ${isAdmin ? 'admin' : 'minha'}">
                        <div class="msg-autor ${isAdmin ? 'admin' : 'eu'}">
                            ${isAdmin ? '👑 Suporte Mahal' : 'Você'}
                            <span class="msg-time">${formatDate(msg.criado_em)}</span>
                        </div>
                        <p class="msg-texto">${escapeHtml(msg.mensagem)}</p>
                    </div>
                `;
            }

            const isMe = Number(msg.autor_id || 0) === Number(meId);

            return `
                <div class="msg-box ${isMe ? 'minha' : ''}">
                    <div class="msg-autor ${isMe ? 'eu' : ''}">
                        ${escapeHtml(msg.nome)}
                        <span class="msg-time">${formatDate(msg.criado_em)}</span>
                    </div>
                    <p class="msg-texto">${escapeHtml(msg.mensagem)}</p>
                </div>
            `;
        }).join('');
    }

    function buildActionBox(data) {
        const missao = data.missao || {};
        const meuStatus = data.meuStatus || null;
        const minhaExp = Number(data.minhaExp || 0);

        const isRotativaOcupada = String(missao.tipo || 'fixa') === 'rotativa' && !!missao.executor_id && !meuStatus;
        const bloqueadaNivel = minhaExp < Number(missao.exp_necessaria || 0) && !meuStatus;

        if (isRotativaOcupada) {
            return `<p class="mission-action-status is-danger"><i class="fa-solid fa-lock"></i> Esta missão única já foi assumida por outro membro da matilha.</p>`;
        }

        if (bloqueadaNivel) {
            return `<p class="mission-action-status is-danger"><i class="fa-solid fa-lock"></i> Você precisa atingir o nível <strong>${escapeHtml(missao.nivel_minimo_nome)}</strong> para pegar esta missão.</p>`;
        }

        if (!meuStatus) {
            return `
                <p style="color: #aaa; margin-bottom: 15px;">Para concluir os objetivos e ganhar o XP, você precisa entrar nela.</p>
                <button id="btnMissionAccept" class="btn-mahal" style="font-size: 1.05rem; padding: 12px 30px;">Pegar Esta Missão</button>
            `;
        }

        if (meuStatus === 'pendente') {
            return `
                <p class="mission-action-status is-progress"><i class="fa-solid fa-person-running"></i> Missão em Andamento</p>
                <div class="mission-action-row">
                    <button id="btnMissionComplete" class="btn-mahal is-success">
                        <i class="fa-solid fa-check"></i> Concluir e Receber XP
                    </button>
                    <button id="btnMissionAbandon" class="btn-mahal is-danger">
                        <i class="fa-solid fa-xmark"></i> Abandonar
                    </button>
                </div>
            `;
        }

        if (meuStatus === 'concluida') {
            return `<h3 class="mission-action-status is-success"><i class="fa-solid fa-check-double"></i> Missão Concluída! XP Adquirido.</h3>`;
        }

        return `<h3 class="mission-action-status is-waiting"><i class="fa-solid fa-clock"></i> Missão em Análise</h3>`;
    }

    function renderDetails(data) {
        const panel = document.getElementById('missionDetailsPanel');
        const chats = document.getElementById('missionChatsWrapper');

        if (!panel || !chats) return;

        const missao = data.missao || {};
        const me = data.me || {};
        const meuStatus = data.meuStatus || null;

        panel.innerHTML = `
            <div class="detalhes-panel">
                <div class="detalhes-header">
                    <h1>
                        ${escapeHtml(missao.titulo)}
                        <span class="mission-type-badge ${String(missao.tipo || 'fixa') === 'rotativa' ? 'is-rotativa' : 'is-fixa'}">
                            ${String(missao.tipo || 'fixa') === 'rotativa' ? '🔥 Única' : '⭐ Fixa'}
                        </span>
                    </h1>

                    <div class="mission-meta-row">
                        <span class="badge">+${formatNumber(missao.exp_recompensa)} EXP</span>
                        <span style="color: #888;">Nível Mínimo: ${escapeHtml(missao.nivel_minimo_nome)}</span>
                    </div>
                </div>

                <p class="mission-description">${escapeHtml(missao.descricao)}</p>

                <div class="mission-action-box">
                    ${buildActionBox(data)}
                </div>
            </div>
        `;

        chats.innerHTML = `
            <div class="chat-panel">
                <h2 style="color: #fff; margin-top: 0; margin-bottom: 20px; font-size: 1.3rem;">
                    <i class="fa-solid fa-users"></i> Fórum da Comunidade
                </h2>

                <div class="chat-box-area">
                    ${renderMessages(data.comentarios || [], me.id, false)}
                </div>

                <form id="missionCommunityForm">
                    <textarea id="missionCommunityMessage" class="chat-input" placeholder="Tire dúvidas com a comunidade..." required></textarea>
                    <div style="text-align: right;">
                        <button type="submit" class="btn-mahal">Enviar no Fórum</button>
                    </div>
                </form>
            </div>

            ${meuStatus
                ? `
                        <div class="chat-panel is-private">
                            <h2 style="color: #ff6b00; margin-top: 0; margin-bottom: 10px; font-size: 1.3rem;">
                                <i class="fa-solid fa-user-shield"></i> Chat Privado (Equipe)
                            </h2>
                            <p class="mission-note">Use este canal para enviar os links de entrega e conversar com a administração.</p>

                            <div class="chat-box-area">
                                ${renderMessages(data.chatPrivado || [], me.id, true)}
                            </div>

                            <form id="missionPrivateForm">
                                <textarea id="missionPrivateMessage" class="chat-input" placeholder="Envie sua entrega ou mensagem privada..." required></textarea>
                                <div style="text-align: right;">
                                    <button type="submit" class="btn-mahal">Enviar para Equipe</button>
                                </div>
                            </form>
                        </div>
                    `
                : `
                        <div class="chat-panel chat-panel-empty">
                            <i class="fa-solid fa-lock"></i>
                            <p>O chat privado será liberado assim que você aceitar esta missão.</p>
                        </div>
                    `
            }
        `;

        bindActions();
    }

    async function loadMission() {
        if (!API_BASE) {
            showError('BACKEND_PUBLIC_URL não configurada na biblioteca.');
            return;
        }

        if (!MISSION_ID) {
            showError('Missão inválida.');
            return;
        }

        if (!window.MahalAuth || typeof window.MahalAuth.validateSessionOrRedirect !== 'function') {
            showError('Auth da biblioteca não carregado.');
            return;
        }

        const ok = await window.MahalAuth.validateSessionOrRedirect();
        if (!ok) return;

        try {
            const { response, data } = await apiFetch(`/api/library/missions/${MISSION_ID}`, {
                method: 'GET'
            });

            if (!response.ok) {
                showError(data.erro || 'Erro ao carregar missão.');
                return;
            }

            renderDetails(data.data || {});
            showApp();
        } catch (error) {
            console.error(error);
            showError('Erro de conexão ao carregar missão.');
        }
    }

    function bindActions() {
        const btnAccept = document.getElementById('btnMissionAccept');
        const btnComplete = document.getElementById('btnMissionComplete');
        const btnAbandon = document.getElementById('btnMissionAbandon');
        const communityForm = document.getElementById('missionCommunityForm');
        const privateForm = document.getElementById('missionPrivateForm');

        if (btnAccept) {
            btnAccept.addEventListener('click', async () => {
                try {
                    const { response, data } = await apiFetch(`/api/library/missions/${MISSION_ID}/accept`, {
                        method: 'POST',
                        body: JSON.stringify({})
                    });

                    if (!response.ok) {
                        alert(data.erro || 'Erro ao aceitar missão.');
                        return;
                    }

                    await loadMission();
                } catch (error) {
                    console.error(error);
                    alert('Erro de conexão.');
                }
            });
        }

        if (btnComplete) {
            btnComplete.addEventListener('click', async () => {
                if (!window.confirm('Tem certeza que concluiu os requisitos? Você receberá o XP imediatamente.')) {
                    return;
                }

                try {
                    const { response, data } = await apiFetch(`/api/library/missions/${MISSION_ID}/complete`, {
                        method: 'POST',
                        body: JSON.stringify({})
                    });

                    if (!response.ok) {
                        alert(data.erro || 'Erro ao concluir missão.');
                        return;
                    }

                    await loadMission();
                } catch (error) {
                    console.error(error);
                    alert('Erro de conexão.');
                }
            });
        }

        if (btnAbandon) {
            btnAbandon.addEventListener('click', async () => {
                if (!window.confirm('Tem certeza que deseja abandonar? Outro membro poderá pegá-la.')) {
                    return;
                }

                try {
                    const { response, data } = await apiFetch(`/api/library/missions/${MISSION_ID}/abandon`, {
                        method: 'POST',
                        body: JSON.stringify({})
                    });

                    if (!response.ok) {
                        alert(data.erro || 'Erro ao abandonar missão.');
                        return;
                    }

                    window.location.href = '/missoes';
                } catch (error) {
                    console.error(error);
                    alert('Erro de conexão.');
                }
            });
        }

        if (communityForm) {
            communityForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const textarea = document.getElementById('missionCommunityMessage');
                const mensagem = (textarea?.value || '').trim();

                if (!mensagem) return;

                try {
                    const { response, data } = await apiFetch(`/api/library/missions/${MISSION_ID}/comments`, {
                        method: 'POST',
                        body: JSON.stringify({ mensagem })
                    });

                    if (!response.ok) {
                        alert(data.erro || 'Erro ao enviar comentário.');
                        return;
                    }

                    if (textarea) textarea.value = '';
                    await loadMission();
                } catch (error) {
                    console.error(error);
                    alert('Erro de conexão.');
                }
            });
        }

        if (privateForm) {
            privateForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const textarea = document.getElementById('missionPrivateMessage');
                const mensagem = (textarea?.value || '').trim();

                if (!mensagem) return;

                try {
                    const { response, data } = await apiFetch(`/api/library/missions/${MISSION_ID}/private-comments`, {
                        method: 'POST',
                        body: JSON.stringify({ mensagem })
                    });

                    if (!response.ok) {
                        alert(data.erro || 'Erro ao enviar mensagem privada.');
                        return;
                    }

                    if (textarea) textarea.value = '';
                    await loadMission();
                } catch (error) {
                    console.error(error);
                    alert('Erro de conexão.');
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadMission();
    });
})();