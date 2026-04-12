<?php
namespace App\Controllers;

class HomeController
{
    private function view($viewName, $data = [])
    {
        extract($data);

        $viewPath = __DIR__ . "/../Views/pages/{$viewName}.php";
        $page = explode('/', $viewName)[0];
        $currentView = $viewName;

        require __DIR__ . '/../Views/layouts/main.php';
    }

    public function index()
    {
        require __DIR__ . '/../Views/pages/landing.php';
    }

    public function home()
    {
        $this->view('home', [
            'titulo' => 'Início',
            'extraCss' => [
                '/assets/css/pages/home.css',
            ],
            'extraJs' => [
                'https://unpkg.com/three@0.160.0/build/three.min.js',
                '/assets/js/pages/home-3d.js',
            ],
        ]);
    }

    public function cursos()
    {
        $this->view('cursos', [
            'titulo' => 'Cursos',
            'extraCss' => [
                '/assets/css/biblioteca/content_public.css',
            ],
            'extraJs' => [
                '/assets/js/biblioteca/common.js',
                '/assets/js/biblioteca/courses_index.js',
            ],
        ]);
    }

    public function missoes()
    {
        $this->view('missoes/index', [
            'titulo' => 'Missões',
            'extraCss' => [
                '/assets/css/missoes/missoes.css',
            ],
            'extraJs' => [
                '/assets/js/missoes/missoes_index.js',
            ],
        ]);
    }

    public function missaoShow(int $missaoId)
    {
        $this->view('missoes/show', [
            'titulo' => 'Detalhes da Missão',
            'missaoId' => $missaoId,
            'extraCss' => [
                '/assets/css/missoes/missoes.css',
            ],
            'extraJs' => [
                '/assets/js/missoes/missoes_show.js',
            ],
        ]);
    }

    public function teste()
    {
        $this->view('teste', ['titulo' => 'Teste']);
    }

    public function perfil()
    {
        $this->view('perfil', ['titulo' => 'Minha Conta']);
    }
}