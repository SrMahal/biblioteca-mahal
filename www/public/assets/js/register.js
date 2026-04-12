document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const feedback = document.getElementById('feedback-msg');

    // Validação Visual de Senha
    if (password !== confirmPassword) {
        mostrarErro("As senhas não coincidem.");
        return;
    }

    if (password.length < 6) {
        mostrarErro("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // Limpa msg anterior
    feedback.style.display = 'none';

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Sucesso
            feedback.style.color = '#00ff00';
            feedback.innerText = "Conta criada com sucesso! Redirecionando...";
            feedback.style.display = 'block';

            // Aguarda 2 segundos e manda pro login
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } else {
            // Erro da API (ex: Email duplicado)
            mostrarErro(data.erro || "Erro ao criar conta.");
        }

    } catch (error) {
        console.error(error);
        mostrarErro("Erro de conexão com o servidor.");
    }

    function mostrarErro(msg) {
        feedback.style.color = '#ff4444';
        feedback.innerText = msg;
        feedback.style.display = 'block';
    }
});