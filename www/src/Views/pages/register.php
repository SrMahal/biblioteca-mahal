<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crie sua Conta - Studio Mahal</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    
    <div class="center-screen">
        <div class="card" style="width: 100%; max-width: 450px; text-align: center;">
            <h1 style="color: var(--orange); margin-bottom: 10px;">Junte-se ao Studio</h1>
            <h3 style="margin-bottom: 30px; font-weight: normal; color: var(--text-secondary);">Crie sua conta gratuita</h3>
            
            <form id="registerForm">
                <div style="text-align: left;">
                    <label style="color: var(--text-secondary);">Nome Completo</label>
                    <input type="text" id="nome" required placeholder="Seu nome">
                </div>

                <div style="text-align: left;">
                    <label style="color: var(--text-secondary);">E-mail</label>
                    <input type="email" id="email" required placeholder="seu@email.com">
                </div>
                
                <div style="text-align: left;">
                    <label style="color: var(--text-secondary);">Senha</label>
                    <input type="password" id="password" required placeholder="Mínimo 6 caracteres">
                </div>

                <div style="text-align: left;">
                    <label style="color: var(--text-secondary);">Confirmar Senha</label>
                    <input type="password" id="confirmPassword" required placeholder="Repita a senha">
                </div>

                <button type="submit" class="btn-primary" style="margin-top: 10px;">Criar Conta</button>
            </form>

            <p id="feedback-msg" style="display: none; margin-top: 15px; font-size: 0.9rem;"></p>

            <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 20px;">
                <p style="color: var(--text-secondary);">Já tem uma conta?</p>
                <a href="/login" style="color: var(--orange); text-decoration: none; font-weight: bold;">Fazer Login</a>
            </div>
        </div>
    </div>

    <script src="/assets/js/register.js"></script>
</body>
</html>