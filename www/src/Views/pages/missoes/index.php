<div class="missions-page">
    <div id="missionsLoading" class="missions-state-card">
        Carregando missões...
    </div>

    <div id="missionsError" class="missions-state-card missions-state-error" style="display:none;"></div>

    <div id="missionsApp" class="missoes-wrapper" style="display:none;">
        <div class="missoes-panel">
            <div class="panel-header missions-header">
                <div>
                    <h2>Missões</h2>
                    <p class="missions-subtitle">Escolha uma missão, acompanhe seu progresso e evolua na matilha.</p>
                </div>
                <div class="missions-profile-meta">
                    <span>Nível: <strong id="meuNivel">-</strong></span>
                    <span>XP: <strong id="minhaExp">0</strong></span>
                </div>
            </div>

            <div class="tabs-mahal">
                <button type="button" class="tab-btn active" data-tab="explorar">Explorar Missões</button>
                <button type="button" class="tab-btn" data-tab="minhas">Minhas Missões</button>
            </div>

            <div id="tab-explorar" class="tab-content active">
                <div class="filtros-mahal">
                    <input type="text" id="busca-explorar" class="mahal-input filter-input" placeholder="🔍 Buscar missão...">
                    <select id="status-explorar" class="mahal-input filter-select">
                        <option value="todas">Todas as Missões</option>
                        <option value="livre">Livres para mim</option>
                        <option value="ocupada">Ocupadas (Outros)</option>
                        <option value="bloqueada">Bloqueadas (Nível)</option>
                    </select>
                </div>

                <div id="missionsExplorarList"></div>
                <div id="missionsExplorarEmpty" class="empty-state" style="display:none;">
                    Nenhuma missão livre para explorar no momento.
                </div>
            </div>

            <div id="tab-minhas" class="tab-content">
                <div class="filtros-mahal">
                    <input type="text" id="busca-minhas" class="mahal-input filter-input" placeholder="🔍 Buscar minhas missões...">
                    <select id="status-minhas" class="mahal-input filter-select">
                        <option value="todas">Todos os Status</option>
                        <option value="pendente">Em Progresso</option>
                        <option value="em_analise">Em Análise</option>
                        <option value="concluida">Finalizadas</option>
                    </select>
                </div>

                <div id="missionsMinhasList"></div>
                <div id="missionsMinhasEmpty" class="empty-state" style="display:none;">
                    Você ainda não pegou nenhuma missão.
                </div>
            </div>
        </div>

        <div class="ranking-panel">
            <div class="panel-header">
                <h2>Ranking Global</h2>
                <i class="fa-solid fa-trophy ranking-icon"></i>
            </div>

            <div id="rankingList" class="ranking-list"></div>
            <div id="rankingEmpty" class="empty-state" style="display:none;">
                Nenhum usuário no ranking.
            </div>
        </div>
    </div>
</div>