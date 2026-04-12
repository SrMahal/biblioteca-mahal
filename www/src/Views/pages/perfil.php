<div class="landing-grid" style="grid-template-columns: 1fr 2fr; gap: 30px;">
    
    <div class="card" style="text-align: center; height: fit-content; padding: 0; overflow: hidden; position: relative;">
        
        <div style="width: 100%; height: 120px; background: #333; position: relative;">
            <img id="banner-preview" src="" 
                 style="width: 100%; height: 100%; object-fit: cover; display: none;"
                 onerror="this.style.display='none'">
            
            <label for="banner_upload" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; border: 1px solid #555;">
                ✏️ Banner
            </label>
            <input type="file" id="banner_upload" accept="image/*" style="display: none;">
        </div>

        <div style="position: relative; width: 100px; height: 100px; margin: -50px auto 10px;">
            <img id="profile-img-preview" src="/assets/img/default-user.png" 
                 style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--bg-card); background: #333;"
                 onerror="this.src='https://ui-avatars.com/api/?name=User&background=333&color=ff6600'">
            
            <label for="foto_upload" style="position: absolute; bottom: 0; right: 0; background: var(--orange); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid var(--bg-card);">
                📷
            </label>
            <input type="file" id="foto_upload" accept="image/*" style="display: none;">
        </div>

        <div style="padding: 0 20px 20px;">
            <h2 id="profile-name-display" style="margin-bottom: 5px; font-size: 1.2rem;">Carregando...</h2>
            <p id="profile-nick-display" style="color: var(--orange); margin-bottom: 5px; font-size: 0.9rem;">@...</p>
            <p id="profile-email-display" style="color: var(--text-secondary); margin-bottom: 15px; font-size: 0.8rem;">...</p>
            
            <span id="profile-role" style="background: var(--orange); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem;">Usuário</span>
        </div>
    </div>

    <div class="card">
        <h2>Meus Dados</h2>
        <form id="formPerfil">
            <input type="hidden" id="userId">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Nome Completo</label>
                    <input type="text" id="nome" name="nome" required>
                </div>
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Nick (Apelido)</label>
                    <input type="text" id="nick" name="nick" placeholder="Ex: dev_mario">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">E-mail</label>
                    <input type="email" id="email" readonly style="background: #1a1a1e; cursor: not-allowed; opacity: 0.7;">
                </div>
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Telefone (+55)</label>
                    <input type="text" id="telefone" name="telefone" placeholder="+55 (13) 99999-9999" maxlength="19">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Data de Nascimento</label>
                    <input type="date" id="data_nascimento" name="data_nascimento">
                </div>
                <div></div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Sobre Mim</label>
                <textarea id="descricao" name="descricao" rows="4" style="width: 100%; background: #121214; border: 1px solid #333; color: white; border-radius: 4px; padding: 10px; resize: vertical;" placeholder="Conte um pouco sobre sua experiência..."></textarea>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">
            
            <h3 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 20px;">Redes Sociais</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Instagram</label>
                    <input type="text" id="instagram" name="instagram" placeholder="@usuario">
                </div>
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">GitHub</label>
                    <input type="text" id="github" name="github" placeholder="github.com/usuario">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">LinkedIn</label>
                    <input type="text" id="linkedin" name="linkedin">
                </div>
                <div>
                    <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Site Pessoal</label>
                    <input type="text" id="site_pessoal" name="site_pessoal">
                </div>
            </div>

            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">

            <h3 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 20px;">Segurança</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <input type="password" id="novaSenha" name="password" placeholder="Nova Senha" autocomplete="new-password">
                </div>
                <div>
                    <input type="password" id="confirmaSenha" placeholder="Confirmar Senha" autocomplete="new-password">
                </div>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 25px;">Salvar Alterações</button>
        </form>
    </div>
</div>

<?php
$perfilJsVersion = is_file(__DIR__ . '/../../../public/assets/js/perfil.js')
    ? (string)filemtime(__DIR__ . '/../../../public/assets/js/perfil.js')
    : (string)time();
?>
<script src="/assets/js/perfil.js?v=<?= $perfilJsVersion ?>"></script>