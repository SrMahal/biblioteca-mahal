<?php

// public/index.php

// 0) Autoload primeiro (sem output!)
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Controllers\HomeController;
use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Controllers\PasswordResetController;
use App\Controllers\CheckoutController;

use App\Controllers\CursoControllers\CursosController;
use App\Controllers\LibraryApiController;

// 1) Detecta HTTPS real (Cloudflare Tunnel / Proxy)
$isHttps =
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
    || (($_SERVER['HTTP_CF_VISITOR'] ?? '') && str_contains($_SERVER['HTTP_CF_VISITOR'], 'https'));

// 2) Configura cookie da sessão ANTES do session_start()
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',          // mantém host atual (biblioteca.mahal.pro)
    'secure' => $isHttps,    // importante no tunnel
    'httponly' => true,
    'samesite' => 'Lax',
]);

// 3) Inicia sessão (PHPSESSID)
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// 4) Headers (CORS) - ok manter
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Se for OPTIONS, responde e sai
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 5) Carrega .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->safeLoad();

function libraryCaBundlePath(): ?string
{
    $path = dirname(__DIR__, 2) . '/php/cacert.pem';
    return is_file($path) ? $path : null;
}

function proxyLibraryApi(string $requestPath): void
{
    $backendBaseUrl = rtrim((string)($_ENV['BACKEND_API_URL'] ?? ''), '/');

    if ($backendBaseUrl === '') {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['erro' => 'BACKEND_API_URL não configurado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $targetUrl = $backendBaseUrl . $requestPath;
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $rawBody = file_get_contents('php://input');

    $headers = [
        'Accept: ' . (string)($_SERVER['HTTP_ACCEPT'] ?? 'application/json'),
    ];

    if (!empty($_SESSION['backend_cookie'])) {
        $headers[] = 'Cookie: ' . $_SESSION['backend_cookie'];
    }

    if (!empty($_SERVER['HTTP_USER_AGENT'])) {
        $headers[] = 'User-Agent: ' . $_SERVER['HTTP_USER_AGENT'];
    }

    if (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $headers[] = 'Accept-Language: ' . $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    }

    if (!empty($_SERVER['CONTENT_TYPE'])) {
        $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
    }

    $ch = curl_init($targetUrl);

    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => (int)($_ENV['BACKEND_TIMEOUT'] ?? 20),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ];

    $caBundle = libraryCaBundlePath();
    if ($caBundle !== null) {
        $options[CURLOPT_CAINFO] = $caBundle;
    }

    if (!in_array($method, ['GET', 'HEAD'], true) && $rawBody !== false && $rawBody !== '') {
        $options[CURLOPT_POSTFIELDS] = $rawBody;
    }

    curl_setopt_array($ch, $options);

    session_write_close();
    $rawResponse = curl_exec($ch);

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if ($rawResponse === false) {
        $error = curl_error($ch);
        curl_close($ch);

        http_response_code(502);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'erro' => 'Falha ao comunicar com o backend.',
            'detalhe' => $error,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $headerSize = (int)curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headerText = substr($rawResponse, 0, $headerSize);
    $body = substr($rawResponse, $headerSize);

    curl_close($ch);

    $responseHeaders = array_filter(array_map('trim', explode("\r\n", $headerText)));
    $contentType = 'application/json; charset=utf-8';

    foreach ($responseHeaders as $line) {
        if (stripos($line, 'Set-Cookie:') === 0) {
            $cookiePart = trim(substr($line, strlen('Set-Cookie:')));
            $cookiePair = explode(';', $cookiePart, 2)[0] ?? '';
            $cookiePair = trim($cookiePair);

            if ($cookiePair !== '' && str_contains($cookiePair, '=')) {
                [$cookieName, $cookieValue] = explode('=', $cookiePair, 2);
                $cookieName = trim($cookieName);
                $cookieValue = trim($cookieValue);

                if ($cookieName !== '' && $cookieValue !== '') {
                    $_SESSION['backend_cookies'][$cookieName] = $cookieName . '=' . $cookieValue;
                    $_SESSION['backend_cookie'] = implode('; ', array_values($_SESSION['backend_cookies']));
                }
            }
        }

        if (stripos($line, 'Content-Type:') === 0) {
            $contentType = trim(substr($line, strlen('Content-Type:')));
        }
    }

    http_response_code($status);
    header('Content-Type: ' . $contentType);
    echo $body;
    exit;
}


// 6) Normaliza URL
$request = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($request, PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/');
if ($path === '') $path = '/';

// Serve arquivos estáticos do public
$staticFile = __DIR__ . $path;

if (is_file($staticFile)) {
    return false;
}


// =============================================================
// BLOCO 1: ROTAS DA API (JSON)
// =============================================================
if (strpos($path, '/api/') === 0) {
    header("Content-Type: application/json; charset=utf-8");

    // Login
    if ($path === '/api/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new AuthController())->login();
        exit;
    }

    // Validação de sessão no backend
    if ($path === '/api/auth/me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        (new AuthController())->me();
        exit;
    }

    // Logout real no backend
    if ($path === '/api/logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new AuthController())->logout();
        exit;
    }

    // Registro
    if ($path === '/api/register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new AuthController())->register();
        exit;
    }

    // Reset
    if ($path === '/api/password/forgot' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new PasswordResetController())->request();
        exit;
    }

    if ($path === '/api/password/reset' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new PasswordResetController())->reset();
        exit;
    }

    if ($path === '/api/profile' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        (new UserController())->profile();
        exit;
    }

    if ($path === '/api/profile' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new UserController())->updateProfile();
        exit;
    }


    // Checkout
    if ($path === '/api/checkout/create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new CheckoutController())->create();
        exit;
    }

    // Cupom validar
    if ($path === '/api/cupom/validar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new CheckoutController())->validateCoupon();
        exit;
    }

    if ($path === '/api/users' || preg_match('#^/api/users/(\d+)$#', $path)) {
        http_response_code(403);
        echo json_encode(['erro' => 'Sem acesso.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (strpos($path, '/api/library/') === 0) {
        $requestPath = $path;
        if (!empty($_SERVER['QUERY_STRING'])) {
            $requestPath .= '?' . $_SERVER['QUERY_STRING'];
        }

        proxyLibraryApi($requestPath);
    }


    if ($path === '/api/missoes' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        (new LibraryApiController())->missoes();
        exit;
    }

    if (preg_match('#^/api/missoes/(\d+)$#', $path, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
        (new LibraryApiController())->missaoShow((int)$m[1]);
        exit;
    }

    http_response_code(404);
    echo json_encode(["erro" => "Endpoint da API não encontrado"]);
    exit;
}

// =============================================================
// BLOCO 2: ROTAS HTML
// =============================================================
$controller = new HomeController();

switch (true) {
    case ($path === '/'):
        $controller->home();
        break;

    case ($path === '/home'):
        $controller->home();
        break;

    case ($path === '/cursos'):
        (new CursosController())->index();
        break;

    case ($path === '/curso'):
        (new CursosController())->show();
        break;

    case ($path === '/curso/arquivo'):
        (new CursosController())->file();
        break;

    case ($path === '/curso/raw'):
        (new CursosController())->raw();
        break;

    case ($path === '/missoes'):
        $controller->missoes();
        break;

    case (preg_match('#^/missoes/(\d+)$#', $path, $m) === 1):
        require __DIR__ . '/../src/Views/pages/missoes/show.php';
        break;


    case ($path === '/game-biblio'):
        require __DIR__ . '/../src/Views/pages/biblioteca3d.php';
        break;

    case ($path === '/comprar'):
        require __DIR__ . '/../src/Views/pages/checkout/checkout_biblioteca.php';
        break;

    case ($path === '/comprar-evento'):
        require __DIR__ . '/../src/Views/pages/checkout/checkout_evento.php';
        break;

    case (preg_match('#^/af/([A-Za-z0-9_-]{2,50})$#', $path, $m) === 1):
        header("Location: /comprar?af=" . urlencode($m[1]));
        exit;

    case (preg_match('#^/ticket-founder/a/([A-Za-z0-9_-]{2,50})$#', $path, $m) === 1):
        $_GET['af'] = $m[1];
        require __DIR__ . '/../src/Views/pages/checkout/checkout_evento_afiliado.php';
        break;

    case ($path === '/comprar-evento-afiliado'):
        require __DIR__ . '/../src/Views/pages/checkout/checkout_evento_afiliado.php';
        break;

    case ($path === '/checkout-sucesso'):
        require __DIR__ . '/../src/Views/pages/checkout/retorno/checkout_sucesso.php';
        break;

    case ($path === '/checkout-pendente'):
        require __DIR__ . '/../src/Views/pages/checkout/retorno/checkout_pendente.php';
        break;

    case ($path === '/checkout-falha'):
        require __DIR__ . '/../src/Views/pages/checkout/retorno/checkout_falha.php';
        break;

    case ($path === '/teste'):
        $controller->teste();
        break;

    case ($path === '/login'):
        require __DIR__ . '/../src/Views/pages/login.php';
        break;

    case ($path === '/reset'):
        require __DIR__ . '/../src/Views/pages/reset_request.php';
        break;

    case ($path === '/nova-senha'):
        require __DIR__ . '/../src/Views/pages/reset_password.php';
        break;

    case ($path === '/perfil'):
        $controller->perfil();
        break;

    default:
        http_response_code(404);
        require __DIR__ . '/../src/Views/pages/404.php';
        break;
}
