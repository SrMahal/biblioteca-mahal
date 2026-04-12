<?php
declare(strict_types=1);

$backUrl = '/';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 | Página não encontrada</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />

    <style>
        :root {
            --bg: #0b0b0f;
            --panel: rgba(255, 255, 255, .04);
            --stroke: rgba(255, 255, 255, .10);
            --text: rgba(255, 255, 255, .92);
            --muted: rgba(229, 231, 235, .72);
            --orange: #ff6a00;
            --orange2: #ff7b00;
            --shadow: 0 18px 60px rgba(0, 0, 0, .45);
            --radius: 18px;
        }

        * {
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            color: var(--text);
            background:
                radial-gradient(1200px 700px at 15% 10%, rgba(255, 117, 25, .14), transparent 60%),
                radial-gradient(900px 600px at 85% 20%, rgba(106, 92, 255, .12), transparent 55%),
                radial-gradient(900px 600px at 55% 90%, rgba(0, 255, 180, .06), transparent 60%),
                linear-gradient(180deg, #0b0b0f 0%, #0f1016 60%, #0b0b0f 100%);
            background-attachment: fixed;
        }

        .error-container {
            width: 100%;
            max-width: 520px;
            padding: 40px 28px;
            text-align: center;
            border-radius: 22px;
            background: linear-gradient(180deg, rgba(255, 255, 255, .05), rgba(255, 255, 255, .02));
            border: 1px solid var(--stroke);
            box-shadow: var(--shadow);
            backdrop-filter: blur(10px);
        }

        .kicker {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, .04);
            border: 1px solid rgba(255, 255, 255, .10);
            color: rgba(229, 231, 235, .82);
            font-weight: 600;
            font-size: .9rem;
            margin-bottom: 18px;
        }

        .kicker .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: var(--orange2);
            box-shadow: 0 0 18px rgba(255, 123, 0, .28);
        }

        h1 {
            margin: 0;
            font-size: clamp(4rem, 10vw, 6rem);
            line-height: 1;
            color: var(--orange2);
            letter-spacing: -2px;
        }

        h2 {
            margin: 14px 0 12px;
            font-size: clamp(1.3rem, 3vw, 1.8rem);
            line-height: 1.2;
        }

        p {
            margin: 0 auto 28px;
            max-width: 38ch;
            color: var(--muted);
            line-height: 1.7;
            font-size: .98rem;
        }

        .actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            min-width: 180px;
            padding: 12px 18px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 700;
            transition: transform .15s ease, opacity .2s ease, background .2s ease;
            border: 1px solid rgba(255, 255, 255, .12);
        }

        .btn:hover {
            opacity: .95;
        }

        .btn:active {
            transform: scale(.98);
        }

        .btn-primary {
            background: linear-gradient(180deg, var(--orange2), var(--orange));
            color: #0b0b0f;
            box-shadow: 0 14px 40px rgba(255, 117, 25, .18);
        }

        .btn-ghost {
            background: rgba(255, 255, 255, .05);
            color: var(--text);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <span class="kicker"><span class="dot"></span> Biblioteca Mahal</span>

        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>O conteúdo que você tentou acessar não existe, foi movido ou a URL foi digitada incorretamente.</p>

        <div class="actions">
            <a href="<?= $backUrl ?>" class="btn btn-primary">Voltar ao início</a>
            <a href="/login" class="btn btn-ghost">Ir para o login</a>
        </div>
    </div>
</body>
</html>