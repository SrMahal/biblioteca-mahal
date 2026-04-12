<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset de senha - Studio Mahal</title>
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  <div class="center-screen">
    <div class="card" style="width: 100%; max-width: 420px; text-align: center;">
      <h1 style="color: var(--orange); margin-bottom: 10px;">STUDIO MAHAL</h1>
      <h3 style="margin-bottom: 18px; font-weight: normal;">Reset de Senha</h3>

      <p style="margin: 10px 0 20px; color: var(--text-secondary); font-size: .95rem;">
        Digite seu e-mail para receber o link de redefinição.
      </p>

      <form id="resetRequestForm">
        <div style="text-align: left;">
          <label for="email" style="color: var(--text-secondary);">E-mail</label>
          <input type="email" id="email" required placeholder="mahal@mahal.pro">
        </div>

        <button type="submit">Enviar link de reset</button>
      </form>

      <p id="msg" style="display:none; margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary);"></p>
      <p id="error-msg" style="color: #ff4444; display: none; margin-top: 15px; font-size: 0.9rem;"></p>

      <div style="margin-top: 16px;">
        <a href="/login" style="color: var(--text-secondary); text-decoration: none; font-size: .9rem;">
          Voltar para o login
        </a>
      </div>
    </div>

    <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.8rem;">&copy; Studio Mahal 2026</p>
  </div>
  
  <script src="/assets/js/reset_request.js"></script>
</body>
</html>
