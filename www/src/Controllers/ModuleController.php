<?php
namespace App\Controllers;

class ModuleController
{
    public function show(string $moduleSlug): void
    {
        $titulo = 'Módulo';
        $page = 'cursos';
        $viewPath = __DIR__ . '/../Views/pages/biblioteca/module_public.php';
        $extraCss = [
            '/assets/css/biblioteca/content_public.css',
        ];
        $extraJs = [
            '/assets/js/biblioteca/common.js',
            '/assets/js/biblioteca/module_public.js',
        ];

        require __DIR__ . '/../Views/layouts/main.php';
    }
}