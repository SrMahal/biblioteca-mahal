<?php

namespace App\Controllers;

use App\Controllers\Concerns\LibraryBackendAccess;

class PasswordResetController
{
    use LibraryBackendAccess;

    private function resetBaseUrl(): string
    {
        $env = trim((string)($_ENV['RESET_PASSWORD_PUBLIC_URL'] ?? ''));
        if ($env !== '') {
            return rtrim($env, '/');
        }

        return 'https://plataforma.mahal.pro';
    }

    public function request(): void
    {
        $payload = json_decode(file_get_contents('php://input'), true);
        $payload = is_array($payload) ? $payload : [];
        $payload['reset_base_url'] = $this->resetBaseUrl();

        $response = $this->backendRequest('POST', '/api/library/password/forgot', $payload);
        $this->respondBackend($response);
    }

    public function reset(): void
    {
        $payload = json_decode(file_get_contents('php://input'), true);
        $response = $this->backendRequest(
            'POST',
            '/api/library/password/reset',
            is_array($payload) ? $payload : []
        );

        $this->respondBackend($response);
    }
}