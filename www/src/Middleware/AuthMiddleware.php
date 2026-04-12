<?php
namespace App\Middleware;

use App\Config\Database;

class AuthMiddleware
{
    private static function ensureSession(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
    }

    private static function isApiRequest(): bool
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        return str_starts_with($path, '/api/');
    }

    private static function respondUnauthorized(string $message = 'Não autenticado.'): void
    {
        http_response_code(401);

        if (self::isApiRequest()) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['erro' => $message], JSON_UNESCAPED_UNICODE);
        } else {
            header('Location: /login');
        }

        exit;
    }

    private static function respondForbidden(string $message = 'Sem permissão.'): void
    {
        http_response_code(403);

        if (self::isApiRequest()) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['erro' => $message], JSON_UNESCAPED_UNICODE);
        } else {
            echo $message;
        }

        exit;
    }

    private static function destroySession(): void
    {
        self::ensureSession();

        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'] ?? '/',
                $params['domain'] ?? '',
                (bool)($params['secure'] ?? false),
                (bool)($params['httponly'] ?? true)
            );
        }

        session_destroy();
    }

    private static function getClientFingerprint(): string
    {
        $userAgent = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
        $acceptLanguage = (string)($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '');

        return hash('sha256', $userAgent . '|' . $acceptLanguage);
    }

    public static function requireLogin(): void
    {
        self::ensureSession();

        if (empty($_SESSION['user_id']) || !is_numeric($_SESSION['user_id'])) {
            self::respondUnauthorized();
        }

        $now = time();
        $idleTimeout = (int)($_ENV['SESSION_IDLE_TIMEOUT'] ?? 1800); // 30 min
        $regenInterval = (int)($_ENV['SESSION_REGENERATE_INTERVAL'] ?? 900); // 15 min
        $currentFingerprint = self::getClientFingerprint();

        if (empty($_SESSION['fingerprint'])) {
            $_SESSION['fingerprint'] = $currentFingerprint;
        } elseif (!hash_equals((string)$_SESSION['fingerprint'], $currentFingerprint)) {
            self::destroySession();
            self::respondUnauthorized('Sessão inválida.');
        }

        if (!empty($_SESSION['last_activity']) && ($now - (int)$_SESSION['last_activity']) > $idleTimeout) {
            self::destroySession();
            self::respondUnauthorized('Sessão expirada.');
        }

        $_SESSION['last_activity'] = $now;

        if (empty($_SESSION['last_regenerated'])) {
            $_SESSION['last_regenerated'] = $now;
        } elseif (($now - (int)$_SESSION['last_regenerated']) > $regenInterval) {
            session_regenerate_id(true);
            $_SESSION['last_regenerated'] = $now;
        }
    }

    public static function currentUserId(): int
    {
        self::requireLogin();
        return (int)$_SESSION['user_id'];
    }

    public static function isAdmin(): bool
    {
        self::ensureSession();
        return (int)($_SESSION['role_id'] ?? 0) === 1;
    }

    public static function requireSameUserOrAdmin(int $userId): void
    {
        self::requireLogin();

        if (self::isAdmin()) {
            return;
        }

        if ((int)$_SESSION['user_id'] !== $userId) {
            self::respondForbidden();
        }
    }

    public static function requireInstructorForCourseId(int $courseId): void
    {
        self::requireLogin();

        if (self::isAdmin()) {
            return;
        }

        $userId = (int)$_SESSION['user_id'];

        $pdo = Database::getConnection();
        $st = $pdo->prepare("
            SELECT 1
            FROM bm_course_instructors
            WHERE course_id = ? AND user_id = ?
            LIMIT 1
        ");
        $st->execute([$courseId, $userId]);

        if (!$st->fetchColumn()) {
            self::respondForbidden();
        }
    }

    public static function requireInstructorForTrackSlug(string $trackSlug): array
    {
        self::requireLogin();

        $pdo = Database::getConnection();

        $st = $pdo->prepare("
            SELECT
              t.id,
              t.course_id,
              t.slug,
              t.title,
              t.description,
              t.cover_url,
              t.status,
              t.owner_user_id,
              c.slug AS course_slug,
              c.title AS course_title
            FROM bm_tracks t
            JOIN bm_courses c ON c.id = t.course_id
            WHERE t.slug = ?
            LIMIT 1
        ");
        $st->execute([$trackSlug]);
        $track = $st->fetch(\PDO::FETCH_ASSOC);

        if (!$track) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['erro' => 'Trilha não encontrada.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        self::requireInstructorForCourseId((int)$track['course_id']);

        return $track;
    }

    public static function requireInstructorForModuleSlug(string $moduleSlug): array
    {
        self::requireLogin();

        $pdo = Database::getConnection();
        $st = $pdo->prepare("SELECT id FROM bm_modules WHERE slug = ? LIMIT 1");
        $st->execute([$moduleSlug]);
        $module = $st->fetch(\PDO::FETCH_ASSOC);

        if (!$module) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['erro' => 'Módulo não encontrado.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if (self::isAdmin()) {
            return $module;
        }

        $userId = (int)$_SESSION['user_id'];
        $st2 = $pdo->prepare("
            SELECT 1
            FROM bm_course_modules cm
            JOIN bm_course_instructors ci ON ci.course_id = cm.course_id
            WHERE cm.module_id = ? AND ci.user_id = ?
            LIMIT 1
        ");
        $st2->execute([(int)$module['id'], $userId]);

        if (!$st2->fetchColumn()) {
            self::respondForbidden();
        }

        return $module;
    }
}