const MEDIA_BASE = String(window.BACKEND_PUBLIC_URL || 'https://api.mahal.pro').replace(/\/$/, '');

function normalizeAssetUrl(url, userId = '') {
    if (!url) return '';

    const value = String(url).trim();
    if (!value) return '';

    if (value.startsWith('data:') || value.startsWith('blob:')) {
        return value;
    }

    if (value.startsWith('//')) {
        return `${window.location.protocol}${value}`;
    }

    // caminho relativo de uploads vindo do backend
    if (value.startsWith('/uploads/')) {
        return `${MEDIA_BASE}${value}`;
    }

    // qualquer URL antiga do IP/backend vira api.mahal.pro
    try {
        const parsed = new URL(value, window.location.origin);

        if (
            parsed.hostname === '72.60.241.78' ||
            parsed.origin === 'http://72.60.241.78:8880' ||
            parsed.origin === 'https://72.60.241.78:8880'
        ) {
            return `${MEDIA_BASE}${parsed.pathname}${parsed.search}`;
        }

        return parsed.toString();
    } catch (_) {
        const isBareFile = !value.includes('/') && /\.[a-z0-9]+$/i.test(value);

        if (isBareFile && userId) {
            return `${MEDIA_BASE}/uploads/${userId}/${value}`;
        }

        return value;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const ok = await window.MahalAuth.validateSessionOrRedirect('/api/auth/me');
        if (!ok) return;

        const response = await fetch('/api/profile', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            console.error('Erro: API não retornou JSON. Provável erro PHP.');
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro ao buscar perfil:', data);
            return;
        }

        preencherDados(data);
        localStorage.setItem('mahal_user', JSON.stringify(data));

        const telInput = document.getElementById('telefone');
        if (telInput) {
            telInput.addEventListener('input', mascaraTelefone);
        }

    } catch (error) {
        console.error('Erro ao buscar dados.', error);
    }
});

function mascaraTelefone(e) {
    let v = e.target.value.replace(/\D/g, '');

    if (!v.startsWith('55')) {
        if (v.length > 0) v = '55' + v;
    }

    if (v.length > 13) v = v.substring(0, 13);

    if (v.length > 12) {
        v = v.replace(/^(\d\d)(\d\d)(\d{5})(\d{4}).*/, '+$1 ($2) $3-$4');
    } else if (v.length > 8) {
        v = v.replace(/^(\d\d)(\d\d)(\d{4})(\d{0,4}).*/, '+$1 ($2) $3-$4');
    } else if (v.length > 4) {
        v = v.replace(/^(\d\d)(\d\d)(.*)/, '+$1 ($2) $3');
    } else {
        v = v.replace(/^(\d\d)(.*)/, '+$1 $2');
    }

    e.target.value = v;
}

document.getElementById('foto_upload')?.addEventListener('change', function (e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validarImagemCliente(file)) {
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = document.getElementById('profile-img-preview');
        if (img) img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

const bannerUpload = document.getElementById('banner_upload');
if (bannerUpload) {
    bannerUpload.addEventListener('change', function (e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validarImagemCliente(file)) {
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.getElementById('banner-preview');
            if (img) {
                img.src = event.target.result;
                img.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    });
}

function validarImagemCliente(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const maxBytes = 5 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
        alert('Envie apenas JPG, PNG ou WEBP.');
        return false;
    }

    if (file.size > maxBytes) {
        alert('A imagem deve ter no máximo 5 MB.');
        return false;
    }

    return true;
}

function preencherDados(user) {
    const userId = user.id || '';

    document.getElementById('userId').value = userId;

    document.getElementById('nome').value = user.nome || '';
    document.getElementById('nick').value = user.nick || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('telefone').value = user.telefone || '';
    document.getElementById('data_nascimento').value = user.data_nascimento || '';

    document.getElementById('descricao').value = user.descricao || '';
    document.getElementById('instagram').value = user.instagram || '';
    document.getElementById('github').value = user.github || '';
    document.getElementById('linkedin').value = user.linkedin || '';
    document.getElementById('site_pessoal').value = user.site_pessoal || '';

    document.getElementById('profile-name-display').innerText = user.nome || '';
    document.getElementById('profile-email-display').innerText = user.email || '';
    document.getElementById('profile-nick-display').innerText = user.nick ? '@' + user.nick : '';

    if (user.foto_perfil) {
        document.getElementById('profile-img-preview').src = normalizeAssetUrl(user.foto_perfil, userId);
    }

    if (user.banner) {
        const bannerImg = document.getElementById('banner-preview');
        if (bannerImg) {
            bannerImg.src = normalizeAssetUrl(user.banner, userId);
            bannerImg.style.display = 'block';
        }
    }

    const roleName = user.role_nome || 'Usuário';
    document.getElementById('profile-role').innerText = roleName;
}

document.getElementById('formPerfil')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(document.getElementById('formPerfil'));

    const senha = document.getElementById('novaSenha').value;
    const confirma = document.getElementById('confirmaSenha').value;

    if (senha) {
        if (senha !== confirma) {
            alert('As senhas não conferem!');
            return;
        }
    } else {
        formData.delete('password');
    }

    const fileInput = document.getElementById('foto_upload');
    if (fileInput?.files.length > 0) {
        const file = fileInput.files[0];
        if (!validarImagemCliente(file)) return;
        formData.append('foto_perfil', file);
    }

    const bannerInput = document.getElementById('banner_upload');
    if (bannerInput?.files.length > 0) {
        const file = bannerInput.files[0];
        if (!validarImagemCliente(file)) return;
        formData.append('banner', file);
    }

    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
            ? await response.json()
            : null;

        if (response.ok) {
            alert('Perfil atualizado com sucesso! 🚀');

            const userId = document.getElementById('userId')?.value || '';

            if (data?.foto) {
                document.getElementById('profile-img-preview').src = normalizeAssetUrl(data.foto, userId);
            }

            if (data?.banner) {
                const b = document.getElementById('banner-preview');
                if (b) {
                    b.src = normalizeAssetUrl(data.banner, userId);
                    b.style.display = 'block';
                }
            }

            const userResponse = await fetch('/api/profile', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                localStorage.setItem('mahal_user', JSON.stringify(userData));

                const userName = document.getElementById('user-name');
                if (userName) userName.innerText = userData.nome || '';

                document.getElementById('profile-name-display').innerText = userData.nome || '';
            }

            document.getElementById('novaSenha').value = '';
            document.getElementById('confirmaSenha').value = '';

        } else {
            alert('Erro ao salvar: ' + (data?.erro || data?.message || 'Falha ao atualizar perfil.'));
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor.');
    }
});