<?php

namespace App\Controllers;

use App\Controllers\Concerns\LibraryBackendAccess;

class LibraryApiController
{
    use LibraryBackendAccess;

    public function cursos(): void
    {
        $response = $this->backendRequest('GET', '/api/library/courses');

        if (in_array((int)($response['status'] ?? 0), [401, 403], true)) {
            $this->clearLocalSession();
        }

        $this->respondBackend($response);
    }

    public function missoes(): void
    {
        $response = $this->backendRequest('GET', '/api/library/missions');

        if (in_array((int)($response['status'] ?? 0), [401, 403], true)) {
            $this->clearLocalSession();
        }

        $this->respondBackend($response);
    }

    public function missaoShow(int $missaoId): void
    {
        $response = $this->backendRequest('GET', '/api/library/missions/' . $missaoId);

        if (in_array((int)($response['status'] ?? 0), [401, 403], true)) {
            $this->clearLocalSession();
        }

        $this->respondBackend($response);
    }
}