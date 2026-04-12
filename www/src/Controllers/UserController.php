<?php

namespace App\Controllers;

use App\Controllers\Concerns\LibraryBackendAccess;

class UserController
{
    use LibraryBackendAccess;

    public function profile(): void
    {
        if (empty($_SESSION['backend_cookie'])) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['erro' => 'Sem acesso.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $response = $this->backendRequest('GET', '/api/library/profile');

        if (in_array((int)$response['status'], [401, 403], true)) {
            $this->clearLocalSession();
        }

        $this->respondBackend($response);
    }

    public function updateProfile(): void
    {
        if (empty($_SESSION['backend_cookie'])) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['erro' => 'Sem acesso.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $contentType = (string)($_SERVER['CONTENT_TYPE'] ?? '');
        $isMultipart = stripos($contentType, 'multipart/form-data') !== false;

        $payload = [];
        $files = [];

        if ($isMultipart) {
            $payload = $_POST;

            if (
                isset($_FILES['foto_perfil']) &&
                (int)($_FILES['foto_perfil']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE &&
                !empty($_FILES['foto_perfil']['tmp_name'])
            ) {
                $files['foto_perfil'] = $_FILES['foto_perfil'];
            }

            if (
                isset($_FILES['banner']) &&
                (int)($_FILES['banner']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE &&
                !empty($_FILES['banner']['tmp_name'])
            ) {
                $files['banner'] = $_FILES['banner'];
            }

            $response = $this->backendMultipartRequest('POST', '/api/library/profile', $payload, $files);
        } else {
            $json = json_decode(file_get_contents('php://input'), true);
            $response = $this->backendRequest('POST', '/api/library/profile', is_array($json) ? $json : []);
        }

        if (in_array((int)$response['status'], [401, 403], true)) {
            $this->clearLocalSession();
        }

        $this->respondBackend($response);
    }
}