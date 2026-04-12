<?php
function h($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
$token = $_GET['token'] ?? '';
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Senha - Studio Mahal</title>
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  <div class="center-screen">
    <div class="card" style="width:100%; max-width:420px; text-align:center;">
      <h1 style="color: var(--orange); margin-bottom:10px;">STUDIO MAHAL</h1>
      <h3 style="margin-bottom:18px; font-weight:normal;">Definir nova senha</h3>

      <form id="resetForm">
        <input type="hidden" id="token" value="<?=h($token)?>">

        <div style="text-align:left;">
          <label for="password" style="color: var(--text-secondary);">Nova senha</label>
          <input type="password" id="password" required placeholder="******" minlength="6">
        </div>

        <div style="text-align:left;">
          <label for="password2" style="color: var(--text-secondary);">Confirmar senha</label>
          <input type="password" id="password2" required placeholder="******" minlength="6">
        </div>

        <button type="submit">Salvar senha</button>
      </form>

      <p id="msg" style="display:none; margin-top:15px; color: var(--text-secondary); font-size:.9rem;"></p>
      <p id="error-msg" style="display:none; margin-top:15px; color:#ff4444; font-size:.9rem;"></p>

      <div style="margin-top: 16px;">
        <a href="/login" style="color: var(--text-secondary); text-decoration:none; font-size:.9rem;">Ir para login</a>
      </div>
    </div>
  </div>

  <script src="/assets/js/nova_senha.js"></script>
</body>
</html>
