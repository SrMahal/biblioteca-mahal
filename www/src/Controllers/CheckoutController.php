<?php
namespace App\Controllers;

use App\Config\Database;

class CheckoutController
{
    private \PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::getConnection();
    }

    private function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    private function appUrl(): string
    {
        $app = $_ENV['APP_URL'] ?? getenv('APP_URL');
        if ($app) return rtrim($app, '/');

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

        $scheme = $isHttps ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        return $scheme . '://' . $host;
    }

    private function mpPost(string $url, string $token, array $payload): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
            CURLOPT_TIMEOUT => 25,
        ]);

        $body = curl_exec($ch);
        $err  = curl_error($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [$code, (string)$body, (string)$err];
    }

    private function makeCodigoTransacao(string $slug): string
    {
        return strtoupper($slug) . '|' . bin2hex(random_bytes(6)) . '|' . date('YmdHis');
    }

    private function ensureUserRole(int $userId, int $roleId = 2): void
    {
        $st = $this->pdo->prepare("
            SELECT role_id
            FROM usuario_roles
            WHERE usuario_id = ?
            LIMIT 1
        ");
        $st->execute([$userId]);

        $existingRole = $st->fetchColumn();

        // Se já existir QUALQUER role para esse usuário, não insere nada.
        if ($existingRole !== false) {
            return;
        }

        $ins = $this->pdo->prepare("
            INSERT INTO usuario_roles (usuario_id, role_id)
            VALUES (?, ?)
        ");
        $ins->execute([$userId, $roleId]);
    }

    // resolve afiliado por codigo_convite (cupom) e puxa desconto_percentual
    private function resolveAffiliateByCodigo(string $codigo): ?array
    {
        $codigo = trim($codigo);
        if ($codigo === '' || mb_strlen($codigo) > 64) return null;

        $codigoUp = mb_strtoupper($codigo);

        $st = $this->pdo->prepare("
            SELECT a.usuario_id AS afiliado_id, a.desconto_percentual, a.comissao_padrao, u.codigo_convite
            FROM usuarios u
            INNER JOIN afiliados a ON a.usuario_id = u.id
            WHERE UPPER(u.codigo_convite) = ?
            LIMIT 1
        ");
        $st->execute([$codigoUp]);
        $row = $st->fetch(\PDO::FETCH_ASSOC);
        if (!$row) return null;

        $pct = (float)($row['desconto_percentual'] ?? 0);
        $pct = max(0.0, min(95.0, $pct)); // trava

        return [
            "afiliado_id" => (int)$row["afiliado_id"],
            "codigo" => (string)$row["codigo_convite"],
            "desconto_percentual" => $pct,
            "comissao_padrao" => (float)($row['comissao_padrao'] ?? 10.0), // <-- Adiciona isso
        ];
    }

    private function resolveAffiliateById(int $userId): ?array
    {
        if ($userId <= 0) return null;

        $st = $this->pdo->prepare("
            SELECT a.usuario_id AS afiliado_id, a.desconto_percentual, a.comissao_padrao, u.codigo_convite
            FROM afiliados a
            INNER JOIN usuarios u ON u.id = a.usuario_id
            WHERE a.usuario_id = ?
            LIMIT 1
        ");
        $st->execute([$userId]);
        $row = $st->fetch(\PDO::FETCH_ASSOC);
        if (!$row) return null;

        $pct = (float)($row['desconto_percentual'] ?? 0);
        $pct = max(0.0, min(95.0, $pct)); // trava

        return [
            "afiliado_id" => (int)$row["afiliado_id"],
            "codigo" => (string)($row["codigo_convite"] ?? ''),
            "desconto_percentual" => $pct,
            "comissao_padrao" => (float)($row['comissao_padrao'] ?? 10.0),
        ];
    }

    private function applyDiscount(float $valor, float $pct): float
    {
        $pct = max(0.0, min(95.0, $pct));
        $novo = $valor * (1 - ($pct / 100));
        // 2 casas sem formato pt-br (pra MP)
        return (float) number_format($novo, 2, '.', '');
    }

    /**
     * POST /api/cupom/validar
     * body: { "codigo":"SIMPATIA", "slug":"ticket-founder"|"biblioteca-mahal" }
     */
    public function validateCoupon(): void
    {
        $data  = json_decode(file_get_contents("php://input"), true) ?: [];
        $codigo = trim((string)($data['codigo'] ?? ''));
        $slug   = trim((string)($data['slug'] ?? ''));

        if ($codigo === '' || mb_strlen($codigo) > 64) {
            $this->json(["ok" => false, "message" => "Cupom inválido."], 422);
        }
        if ($slug === '') {
            $this->json(["ok" => false, "message" => "Produto inválido."], 422);
        }

        $stP = $this->pdo->prepare("SELECT id, nome, slug, preco_base FROM produtos WHERE slug = ? LIMIT 1");
        $stP->execute([$slug]);
        $produto = $stP->fetch(\PDO::FETCH_ASSOC);

        if (!$produto) {
            $this->json(["ok" => false, "message" => "Produto não encontrado."], 404);
        }

        // resolve cupom
        $af = null;
        if (ctype_digit($codigo)) {
            $af = $this->resolveAffiliateById((int)$codigo);
        } else {
            $af = $this->resolveAffiliateByCodigo($codigo);
        }

        if (!$af || (float)$af['desconto_percentual'] <= 0) {
            $this->json(["ok" => false, "message" => "Cupom não encontrado ou sem desconto."], 200);
        }

        $precoOriginal = (float)$produto['preco_base'];
        $pct = (float)$af['desconto_percentual'];
        $precoFinal = $this->applyDiscount($precoOriginal, $pct);

        $this->json([
            "ok" => true,
            "codigo" => (string)$af["codigo"],
            "afiliado_id" => (int)$af["afiliado_id"],
            "desconto_percentual" => $pct,
            "preco_original" => $precoOriginal,
            "preco_final" => $precoFinal,
            "produto" => [
                "slug" => (string)$produto["slug"],
                "nome" => (string)$produto["nome"],
            ],
        ], 200);
    }

    /**
     * POST /api/checkout/create
     * body: { "nome":"...", "email":"...", "slug":"biblioteca-mahal"|"ticket-founder", "afiliado_codigo":"SIMPATIA" }
     */
    public function create(): void
    {
        $data  = json_decode(file_get_contents("php://input"), true) ?: [];
        $nome  = trim((string)($data['nome'] ?? ''));
        $email = trim((string)($data['email'] ?? ''));
        $slug  = trim((string)($data['slug'] ?? ''));
        $afiliadoCodigo = trim((string)($data['afiliado_codigo'] ?? ''));

        if ($nome === '' || mb_strlen($nome) < 2) {
            $this->json(["message" => "Nome inválido."], 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->json(["message" => "E-mail inválido."], 422);
        }
        if ($slug === '') {
            $this->json(["message" => "Produto inválido."], 422);
        }

        // Produto por slug
        $st = $this->pdo->prepare("SELECT id, nome, slug, preco_base FROM produtos WHERE slug = ? LIMIT 1");
        $st->execute([$slug]);
        $produto = $st->fetch(\PDO::FETCH_ASSOC);

        if (!$produto) {
            $this->json(["message" => "Produto não encontrado."], 404);
        }

        $MP_ACCESS_TOKEN = $_ENV['MP_ACCESS_TOKEN'] ?? getenv('MP_ACCESS_TOKEN') ?? '';
        if (!$MP_ACCESS_TOKEN) {
            $this->json(["message" => "MP_ACCESS_TOKEN não configurado."], 500);
        }

        // -----------------------------
        // AFILIADO / CUPOM
        // -----------------------------
        $afiliadoId = null;
        $descontoPct = 0.0;
        $comissaoPct = 0.0;
        $afCodigoUsado = null;

        try {
            // prioridade: cupom/codigo recebido
            if ($afiliadoCodigo !== '') {
                $af = ctype_digit($afiliadoCodigo)
                    ? $this->resolveAffiliateById((int)$afiliadoCodigo)
                    : $this->resolveAffiliateByCodigo($afiliadoCodigo);

                if ($af) {
                    $afiliadoId = (int)$af['afiliado_id'];
                    $descontoPct = (float)$af['desconto_percentual'];
                    $comissaoPct = (float)$af['comissao_padrao'];
                    $afCodigoUsado = (string)$af['codigo'];
                    setcookie('mahal_aff_id', (string)$afiliadoId, time() + 60 * 60 * 24 * 30, '/');
                }
            }
            // fallback: cookie
            elseif (!empty($_COOKIE['mahal_aff_id']) && ctype_digit((string)$_COOKIE['mahal_aff_id'])) {
                $af = $this->resolveAffiliateById((int)$_COOKIE['mahal_aff_id']);
                if ($af) {
                    $afiliadoId = (int)$af['afiliado_id'];
                    $descontoPct = (float)$af['desconto_percentual'];
                    $comissaoPct = (float)$af['comissao_padrao'];
                    $afCodigoUsado = (string)$af['codigo'];
                }
            }
        } catch (\Throwable $e) {
            error_log("[CHECKOUT] afiliado resolve error: " . $e->getMessage());
        }

        // 1) Criar/buscar usuário por email (LEAD)
        $stu = $this->pdo->prepare("SELECT id, status, nome FROM usuarios WHERE email = ? LIMIT 1");
        $stu->execute([$email]);
        $user = $stu->fetch(\PDO::FETCH_ASSOC);

        if ($user) {
            $userId = (int)$user['id'];

            if (!empty($nome) && (empty($user['nome']) || $user['nome'] === 'Novo usuário')) {
                $upn = $this->pdo->prepare("UPDATE usuarios SET nome = ? WHERE id = ? LIMIT 1");
                $upn->execute([$nome, $userId]);
            }

            $this->ensureUserRole($userId, 2);
        } else {
            $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
            $tmpPass = password_hash(bin2hex(random_bytes(10)), PASSWORD_DEFAULT);

            $insU = $this->pdo->prepare("INSERT INTO usuarios (uuid, nome, email, senha, status, convidado_por) VALUES (?, ?, ?, ?, 'inativo', ?)");
            $insU->execute([$uuid, $nome, $email, $tmpPass, $afiliadoId]);
            $userId = (int)$this->pdo->lastInsertId();

            $this->ensureUserRole($userId, 2);
        }

        // 2) Criar venda pendente já linkada ao usuário (com desconto)
        $codigo        = $this->makeCodigoTransacao((string)$produto['slug']);
        $valorOriginal = (float)$produto['preco_base'];
        $valorFinal    = $this->applyDiscount($valorOriginal, $descontoPct);
        $valorAfiliado = $valorFinal * ($comissaoPct / 100);
        $planoId       = 1;

        try {
            $insV = $this->pdo->prepare("
                INSERT INTO vendas
                  (codigo_transacao, afiliado_id, usuario_id, plano_id, produto_id, valor_total, valor_original, desconto_percentual, comissao_afiliado, valor_afiliado, status)
                VALUES
                  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
            ");
            $insV->execute([
                $codigo,
                $afiliadoId,
                $userId,
                $planoId,
                (int)$produto['id'],
                $valorFinal,
                $valorOriginal,
                $descontoPct,
                $comissaoPct,
                $valorAfiliado
            ]);
        } catch (\Throwable $e) {
            error_log("[CHECKOUT] ERRO INSERT vendas: " . $e->getMessage());
            $this->json(["message" => "Erro ao criar venda (DB)."], 500);
        }

        $vendaId = (int)$this->pdo->lastInsertId();

        // 3) Criar preference MP
        $BASE = $this->appUrl();
        $WEBHOOK_URL = $BASE . "/mp_webhook.php";

        // retorno do usuário no pay
        $RETURN_BASE = 'https://pay.mahal.pro';

        $RETURN_SUCCESS = $RETURN_BASE . "/checkout-sucesso";
        $RETURN_PENDING = $RETURN_BASE . "/checkout-pendente";
        $RETURN_FAILURE = $RETURN_BASE . "/checkout-falha";

        $payload = [
            'items' => [[
                'id' => (string)$produto['id'],
                'title' => (string)$produto['nome'],
                'description' => 'Biblioteca Mahal • Checkout',
                'quantity' => 1,
                'currency_id' => 'BRL',
                'unit_price' => $valorFinal,
            ]],
            'payer' => ['email' => $email],
            'external_reference' => $codigo,
            'metadata' => [
                'venda_id' => $vendaId,
                'user_id' => $userId,
                'buyer_email' => $email,
                'buyer_name' => $nome,
                'produto_id' => (int)$produto['id'],
                'produto_slug' => (string)$produto['slug'],
                'plano_id' => 1,
                'afiliado_id' => $afiliadoId,
                'afiliado_codigo' => $afCodigoUsado,
                'desconto_percentual' => $descontoPct,
                'valor_original' => $valorOriginal,
                'valor_final' => $valorFinal,
            ],
            'notification_url' => $WEBHOOK_URL,
            'back_urls' => [
                'success' => $RETURN_SUCCESS,
                'pending' => $RETURN_PENDING,
                'failure' => $RETURN_FAILURE,
            ],
            'auto_return' => 'approved',
        ];

        [$codeHttp, $body, $err] = $this->mpPost('https://api.mercadopago.com/checkout/preferences', $MP_ACCESS_TOKEN, $payload);

        if ($err) {
            error_log("[CHECKOUT] MP cURL error: " . $err);
            $this->json(["message" => "Erro cURL Mercado Pago."], 500);
        }

        if ($codeHttp < 200 || $codeHttp >= 300) {
            error_log("[CHECKOUT] MP HTTP={$codeHttp} body=" . substr((string)$body, 0, 400));
            $this->json(["message" => "Erro Mercado Pago ($codeHttp)"], 500);
        }

        $json = json_decode($body, true);
        $initPoint = (string)($json['init_point'] ?? '');

        if (!$initPoint) {
            $this->json(["message" => "Preference criada, mas init_point não retornou."], 500);
        }

        $this->json([
            "message" => "Preference criada",
            "venda_id" => $vendaId,
            "codigo_transacao" => $codigo,
            "init_point" => $initPoint,
            "afiliado" => [
                "id" => $afiliadoId,
                "codigo" => $afCodigoUsado,
                "desconto_percentual" => $descontoPct,
            ],
            "preco" => [
                "original" => $valorOriginal,
                "final" => $valorFinal,
            ]
        ], 200);
    }
}
