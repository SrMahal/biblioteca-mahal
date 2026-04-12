<?php

namespace App\Controllers\Concerns;

trait LibraryBackendAccess
{
    private function ensureLocalSessionStarted(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
    }

    private function backendBaseUrl(): string
    {
        return rtrim((string)($_ENV['BACKEND_API_URL'] ?? ''), '/');
    }

    private function backendTimeout(): int
    {
        $timeout = (int)($_ENV['BACKEND_TIMEOUT'] ?? 20);
        return $timeout > 0 ? $timeout : 20;
    }

    private function projectRootPath(): string
    {
        return dirname(__DIR__, 4);
    }

    private function caBundlePath(): ?string
    {
        $path = $this->projectRootPath() . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'cacert.pem';
        return is_file($path) ? $path : null;
    }

    private function backendCookieHeader(): ?string
    {
        $this->ensureLocalSessionStarted();

        $cookies = $_SESSION['backend_cookies'] ?? null;
        if (is_array($cookies) && $cookies !== []) {
            return implode('; ', array_values($cookies));
        }

        $legacyCookie = trim((string)($_SESSION['backend_cookie'] ?? ''));
        return $legacyCookie !== '' ? $legacyCookie : null;
    }

    private function syncBackendCookies(array $responseHeaders): void
    {
        $this->ensureLocalSessionStarted();

        $cookies = $_SESSION['backend_cookies'] ?? [];
        if (!is_array($cookies)) {
            $cookies = [];
        }

        foreach ($responseHeaders as $line) {
            if (stripos($line, 'Set-Cookie:') !== 0) {
                continue;
            }

            $cookiePart = trim(substr($line, strlen('Set-Cookie:')));
            if ($cookiePart === '') {
                continue;
            }

            $cookiePair = explode(';', $cookiePart, 2)[0] ?? '';
            $cookiePair = trim($cookiePair);

            if ($cookiePair === '' || !str_contains($cookiePair, '=')) {
                continue;
            }

            [$name, $value] = explode('=', $cookiePair, 2);
            $name = trim($name);
            $value = trim($value);

            if ($name === '') {
                continue;
            }

            $expired =
                $value === ''
                || stripos($cookiePart, 'expires=Thu, 01 Jan 1970') !== false
                || stripos($cookiePart, 'Max-Age=0') !== false;

            if ($expired) {
                unset($cookies[$name]);
                continue;
            }

            $cookies[$name] = $name . '=' . $value;
        }

        if ($cookies === []) {
            unset($_SESSION['backend_cookies'], $_SESSION['backend_cookie']);
            return;
        }

        $_SESSION['backend_cookies'] = $cookies;
        $_SESSION['backend_cookie'] = implode('; ', array_values($cookies));
    }

    private function buildBaseHeaders(?string $contentType = null): array
    {
        $headers = [
            'Accept: application/json',
        ];

        $cookieHeader = $this->backendCookieHeader();
        if ($cookieHeader !== null) {
            $headers[] = 'Cookie: ' . $cookieHeader;
        }

        if (!empty($_SERVER['HTTP_USER_AGENT'])) {
            $headers[] = 'User-Agent: ' . (string)$_SERVER['HTTP_USER_AGENT'];
        }

        if (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $headers[] = 'Accept-Language: ' . (string)$_SERVER['HTTP_ACCEPT_LANGUAGE'];
        }

        if ($contentType !== null && $contentType !== '') {
            $headers[] = 'Content-Type: ' . $contentType;
        }

        return $headers;
    }

    private function decodeJsonBody(string $body): ?array
    {
        if ($body === '') {
            return null;
        }

        $decoded = json_decode($body, true);
        return is_array($decoded) ? $decoded : null;
    }

    private function executeBackendRequest(
        string $method,
        string $path,
        array $headers,
        $body = null
    ): array {
        $this->ensureLocalSessionStarted();

        $baseUrl = $this->backendBaseUrl();
        if ($baseUrl === '') {
            return [
                'status' => 0,
                'body' => '',
                'json' => null,
                'headers' => [],
                'content_type' => 'application/json; charset=utf-8',
            ];
        }

        $url = $baseUrl . $path;
        $ch = curl_init($url);

        $options = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_TIMEOUT => $this->backendTimeout(),
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_ENCODING => '',
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ];

        $caBundle = $this->caBundlePath();
        if ($caBundle !== null) {
            $options[CURLOPT_CAINFO] = $caBundle;
        }

        if ($body !== null && !in_array(strtoupper($method), ['GET', 'HEAD'], true)) {
            $options[CURLOPT_POSTFIELDS] = $body;
        }

        if (!empty($_SERVER['HTTP_USER_AGENT'])) {
            $options[CURLOPT_USERAGENT] = (string)$_SERVER['HTTP_USER_AGENT'];
        }

        curl_setopt_array($ch, $options);

        session_write_close();
        $raw = curl_exec($ch);

        $curlError = $raw === false ? curl_error($ch) : '';
        $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $headerSize = (int)curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        $ch = null;

        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if ($raw === false) {
            return [
                'status' => 0,
                'body' => $curlError,
                'json' => null,
                'headers' => [],
                'content_type' => 'application/json; charset=utf-8',
            ];
        }

        $headerText = substr($raw, 0, $headerSize);
        $responseBody = (string)substr($raw, $headerSize);
        $responseHeaders = array_values(array_filter(array_map('trim', explode("\r\n", $headerText))));

        $contentType = 'application/json; charset=utf-8';
        foreach ($responseHeaders as $line) {
            if (stripos($line, 'Content-Type:') === 0) {
                $contentType = trim(substr($line, strlen('Content-Type:')));
                break;
            }
        }

        $this->syncBackendCookies($responseHeaders);

        $json = $this->decodeJsonBody($responseBody);

        return [
            'status' => $status,
            'body' => $responseBody,
            'json' => $json,
            'headers' => $responseHeaders,
            'content_type' => $contentType,
        ];
    }

    private function backendRequest(string $method, string $path, ?array $payload = null): array
    {
        $headers = $this->buildBaseHeaders($payload !== null ? 'application/json' : null);

        $body = null;
        if ($payload !== null) {
            $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
            $body = $encoded !== false ? $encoded : '{}';
        }

        return $this->executeBackendRequest($method, $path, $headers, $body);
    }

    private function backendMultipartRequest(
        string $method,
        string $path,
        array $payload = [],
        array $files = []
    ): array {
        $multipart = $payload;

        foreach ($files as $field => $file) {
            $tmpName = (string)($file['tmp_name'] ?? '');
            $fileName = (string)($file['name'] ?? '');
            $error = (int)($file['error'] ?? 1);

            if ($tmpName === '' || $fileName === '' || $error !== 0) {
                continue;
            }

            $isUsableFile = is_uploaded_file($tmpName) || is_file($tmpName);
            if (!$isUsableFile) {
                continue;
            }

            $multipart[$field] = new \CURLFile(
                $tmpName,
                (string)($file['type'] ?? 'application/octet-stream'),
                $fileName
            );
        }

        $headers = $this->buildBaseHeaders();

        return $this->executeBackendRequest($method, $path, $headers, $multipart);
    }

    private function clearLocalSession(): void
    {
        $this->ensureLocalSessionStarted();

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

    private function respondBackend(array $response): void
    {
        $status = (int)($response['status'] ?? 0);
        if ($status <= 0) {
            $status = 502;
        }

        $contentType = (string)($response['content_type'] ?? 'application/json; charset=utf-8');

        http_response_code($status);
        header('Content-Type: ' . $contentType);

        if (!empty($response['body'])) {
            echo $response['body'];
        } else {
            echo json_encode(['erro' => 'Falha na comunicação com o backend.'], JSON_UNESCAPED_UNICODE);
        }

        exit;
    }
}