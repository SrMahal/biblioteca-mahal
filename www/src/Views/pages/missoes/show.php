<div class="missions-page">
    <script>
        window.__MISSION_ID__ = <?= (int)($missaoId ?? 0) ?>;
    </script>

    <div id="missionShowLoading" class="missions-state-card">
        Carregando missão...
    </div>

    <div id="missionShowError" class="missions-state-card missions-state-error" style="display:none;"></div>

    <div id="missionShowApp" style="display:none;">
        <a href="/missoes" class="missions-back-link">&larr; Voltar para Missões</a>

        <div id="missionDetailsPanel"></div>

        <div id="missionChatsWrapper" class="chats-wrapper"></div>
    </div>
</div>