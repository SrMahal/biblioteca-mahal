<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

header('Content-Type: application/json');

$id = trim($_GET['curso_id'] ?? '');

if ($id === '') {
    echo json_encode([
        "success" => false,
        "message" => "Curso não informado."
    ]);
    exit;
}

$curso = cursoPorId($id);

if (!$curso) {
    echo json_encode([
        "success" => false,
        "message" => "Curso inexistente."
    ]);
    exit;
}

$dados = lerProgresso($id);

if (!$dados) {

    $dados = [

        "status" => "idle",

        "percent" => 0,

        "downloaded" => 0,

        "total" => 0,

        "speed" => 0,

        "remaining" => 0,

        "message" => "Aguardando..."

    ];

}

echo json_encode([
    "success" => true,
    "progress" => $dados
]);