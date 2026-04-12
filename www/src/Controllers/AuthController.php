<?php

namespace App\Controllers;

use App\Controllers\Concerns\LibraryBackendAccess;

class AuthController
{
    use LibraryBackendAccess;

    public function login(): void
    {
        $payload = json_decode(file_get_contents('php://input'), true);
        $response = $this->backendRequest(
            'POST',
            '/api/library/auth/login',
            is_array($payload) ? $payload : []
        );

        if ((int)$response['status'] === 200 && !empty($response['json']['usuario'])) {
            $u = $response['json']['usuario'];

            $_SESSION['user_id'] = (int)($u['id'] ?? 0);
            $_SESSION['role_id'] = (int)($u['role_id'] ?? 0);
            $_SESSION['user_nome'] = (string)($u['nome'] ?? '');
            $_SESSION['user_email'] = (string)($u['email'] ?? '');
            $_SESSION['uuid'] = (string)($u['uuid'] ?? '');
        }

        $this->respondBackend($response);
    }

    public function me(): void
    {
        if (empty($_SESSION['backend_cookie'])) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['authenticated' => false], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $response = $this->backendRequest('GET', '/api/library/auth/me');

        if (in_array((int)$response['status'], [401, 403], true)) {
            $this->clearLocalSession();
        }

        if ((int)$response['status'] === 200 && !empty($response['json']['usuario'])) {
            $u = $response['json']['usuario'];

            $_SESSION['user_id'] = (int)($u['id'] ?? 0);
            $_SESSION['role_id'] = (int)($u['role_id'] ?? 0);
            $_SESSION['user_nome'] = (string)($u['nome'] ?? '');
            $_SESSION['user_email'] = (string)($u['email'] ?? '');
            $_SESSION['uuid'] = (string)($u['uuid'] ?? '');
        }

        $this->respondBackend($response);
    }

    public function logout(): void
    {
        if (!empty($_SESSION['backend_cookie'])) {
            $this->backendRequest('POST', '/api/library/auth/logout');
        }

        $this->clearLocalSession();

        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['message' => 'Logout realizado com sucesso'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function register(): void
    {
        $payload = json_decode(file_get_contents('php://input'), true);
        $response = $this->backendRequest(
            'POST',
            '/api/library/auth/register',
            is_array($payload) ? $payload : []
        );

        $this->respondBackend($response);
    }
}