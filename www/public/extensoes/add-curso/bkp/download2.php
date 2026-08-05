<?php

declare(strict_types=1);

ini_set('display_errors', '1');
error_reporting(E_ALL);

$documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';

if ($documentRoot === '' || !is_dir($documentRoot)) {
    http_response_code(500);
    exit('DOCUMENT_ROOT inválido.');
}

$projectRoot = realpath($documentRoot . '/../');

if ($projectRoot === false) {
    http_response_code(500);
    exit('Não foi possível resolver a raiz do projeto.');
}

$envCursosDir = trim((string) (getenv('APP_COURSES_DIR') ?: ''));
$cursosDir = $envCursosDir !== '' ? $envCursosDir : ($projectRoot . DIRECTORY_SEPARATOR . 'cursos');

$envTmpBase = trim((string) (getenv('APP_COURSES_DIR') ?: ''));
$tmpBaseDir = $envTmpBase !== '' ? dirname($envTmpBase) : ($projectRoot . DIRECTORY_SEPARATOR . 'storage');
$tmpDir = $tmpBaseDir . DIRECTORY_SEPARATOR . 'tmp-downloads';

if (!is_dir($cursosDir) && !mkdir($cursosDir, 0777, true) && !is_dir($cursosDir)) {
    http_response_code(500);
    exit('Não foi possível criar a pasta de cursos.');
}

if (!is_dir($tmpDir) && !mkdir($tmpDir, 0777, true) && !is_dir($tmpDir)) {
    http_response_code(500);
    exit('Não foi possível criar a pasta temporária.');
}

/**
 * Catálogo mockado inicial.
 * Depois a gente pode trocar por JSON/API.
 */
$catalogo = [
    [
        'id' => 'curso-php',
        'titulo' => 'Curso de PHP',
        'categoria' => 'Programação',
        'descricao' => 'Curso exemplo para testar o instalador local.',
        'download_url' => 'http://biblioteca.mahal.pro/teste.zip',
        'pasta_destino' => 'Curso de PHP'
    ],
    [
        'id' => 'curso-linux',
        'titulo' => 'Curso de Linux',
        'categoria' => 'Infraestrutura',
        'descricao' => 'Curso exemplo para testar o instalador local.',
        'download_url' => 'https://SEU-LINK-AQUI/curso-linux.zip',
        'pasta_destino' => 'Curso de Linux'
    ],
    [
        'id' => 'logica-programação',
        'titulo' => 'Lógica de programação I',
        'categoria' => 'Segurança',
        'descricao' => 'Lógica de programação I Os primeiros programas com Javascript e HTML.',
        'download_url' => 'http://biblioteca.mahal.pro/logica- programacao.zip',
        'pasta_destino' => 'Curso de Cyber Security'
    ],
    [
        'id' => 'N8N',
        'titulo' => 'Fluxos e automações',
        'categoria' => 'Segurança',
        'descricao' => 'Curso exemplo para testar o instalador local.',
        'download_url' => 'https://SEU-LINK-AQUI/curso-cyber.zip',
        'pasta_destino' => 'Curso de Cyber Security'
    ],
];

function findCourseById(array $catalogo, string $id): ?array
{
    foreach ($catalogo as $curso) {
        if (($curso['id'] ?? '') === $id) {
            return $curso;
        }
    }
    return null;
}

function downloadFile(string $url, string $destino): void
{
    $fp = fopen($destino, 'wb');
    if ($fp === false) {
        throw new RuntimeException('Não foi possível criar o arquivo temporário.');
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_FILE => $fp,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_FAILONERROR => true,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_CONNECTTIMEOUT => 20,
        CURLOPT_USERAGENT => 'BibliotecaMahalDownloader/1.0',
    ]);

    $ok = curl_exec($ch);

    if ($ok === false) {
        $erro = curl_error($ch);
        curl_close($ch);
        fclose($fp);
        @unlink($destino);
        throw new RuntimeException('Erro no download: ' . $erro);
    }

    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    fclose($fp);

    if ($status < 200 || $status >= 300) {
        @unlink($destino);
        throw new RuntimeException('Falha no download. HTTP ' . $status);
    }
}

function extractZipSecure(string $zipPath, string $destino): void
{
    $zip = new ZipArchive();

    if ($zip->open($zipPath) !== true) {
        throw new RuntimeException('Não foi possível abrir o arquivo ZIP.');
    }

    if (!is_dir($destino) && !mkdir($destino, 0777, true) && !is_dir($destino)) {
        $zip->close();
        throw new RuntimeException('Não foi possível criar a pasta de extração.');
    }

    $destinoRealBase = realpath($destino);
    if ($destinoRealBase === false) {
        $zip->close();
        throw new RuntimeException('Falha ao resolver a pasta de extração.');
    }

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex($i);
        if ($stat === false) {
            continue;
        }

        $entryName = $stat['name'];

        if (str_contains($entryName, '../') || str_contains($entryName, '..\\')) {
            $zip->close();
            throw new RuntimeException('ZIP inválido: caminho inseguro detectado.');
        }

        $targetPath = $destino . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $entryName);
        $targetDir = dirname($targetPath);

        if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true) && !is_dir($targetDir)) {
            $zip->close();
            throw new RuntimeException('Não foi possível criar subpastas do ZIP.');
        }

        if (str_ends_with($entryName, '/')) {
            if (!is_dir($targetPath) && !mkdir($targetPath, 0777, true) && !is_dir($targetPath)) {
                $zip->close();
                throw new RuntimeException('Não foi possível criar diretório do ZIP.');
            }
            continue;
        }

        $contents = $zip->getFromIndex($i);
        if ($contents === false) {
            $zip->close();
            throw new RuntimeException('Falha ao extrair arquivo do ZIP.');
        }

        if (file_put_contents($targetPath, $contents) === false) {
            $zip->close();
            throw new RuntimeException('Falha ao salvar arquivo extraído.');
        }
    }

    $zip->close();
}

function rrmdir(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }

    $items = scandir($dir);
    if ($items === false) {
        return;
    }

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $path = $dir . DIRECTORY_SEPARATOR . $item;

        if (is_dir($path)) {
            rrmdir($path);
        } else {
            @unlink($path);
        }
    }

    @rmdir($dir);
}

function moveExtractedContent(string $extractDir, string $destinoFinal): void
{
    $items = array_values(array_filter(scandir($extractDir) ?: [], fn($i) => $i !== '.' && $i !== '..'));

    if (!is_dir($destinoFinal) && !mkdir($destinoFinal, 0777, true) && !is_dir($destinoFinal)) {
        throw new RuntimeException('Não foi possível criar a pasta final do curso.');
    }

    if (count($items) === 1) {
        $single = $extractDir . DIRECTORY_SEPARATOR . $items[0];

        if (is_dir($single)) {
            $internalItems = array_values(array_filter(scandir($single) ?: [], fn($i) => $i !== '.' && $i !== '..'));

            foreach ($internalItems as $item) {
                rename(
                    $single . DIRECTORY_SEPARATOR . $item,
                    $destinoFinal . DIRECTORY_SEPARATOR . $item
                );
            }

            return;
        }
    }

    foreach ($items as $item) {
        rename(
            $extractDir . DIRECTORY_SEPARATOR . $item,
            $destinoFinal . DIRECTORY_SEPARATOR . $item
        );
    }
}

$statusMsg = null;
$statusType = 'success';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cursoId = trim((string)($_POST['curso_id'] ?? ''));

    try {
        if ($cursoId === '') {
            throw new RuntimeException('Curso não informado.');
        }

        $curso = findCourseById($catalogo, $cursoId);

        if ($curso === null) {
            throw new RuntimeException('Curso não encontrado no catálogo.');
        }

        $downloadUrl = (string) $curso['download_url'];
        $pastaDestino = trim((string) $curso['pasta_destino']);

        if ($downloadUrl === '' || !str_ends_with(strtolower($downloadUrl), '.zip')) {
            throw new RuntimeException('Por enquanto, o download precisa ser um arquivo .zip válido.');
        }

        $zipPath = $tmpDir . DIRECTORY_SEPARATOR . $cursoId . '.zip';
        $extractDir = $tmpDir . DIRECTORY_SEPARATOR . $cursoId . '-extract';
        $destinoFinal = $cursosDir . DIRECTORY_SEPARATOR . $pastaDestino;

        @unlink($zipPath);
        rrmdir($extractDir);
        rrmdir($destinoFinal);

        downloadFile($downloadUrl, $zipPath);
        extractZipSecure($zipPath, $extractDir);
        moveExtractedContent($extractDir, $destinoFinal);

        @unlink($zipPath);
        rrmdir($extractDir);

        $statusMsg = 'Curso instalado com sucesso em: ' . $destinoFinal;
        $statusType = 'success';
    } catch (Throwable $e) {
        $statusMsg = $e->getMessage();
        $statusType = 'error';
    }
}

function isInstalled(string $cursosDir, string $folderName): bool
{
    return is_dir($cursosDir . DIRECTORY_SEPARATOR . $folderName);
}
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adicionar Cursos</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #090b12;
            color: #fff;
        }

        .wrap {
            max-width: 1100px;
            margin: 0 auto;
            padding: 32px;
        }

        h1 {
            margin: 0 0 12px;
            font-size: 42px;
        }

        .path-info {
            margin: 0 0 24px;
            color: #b8b8b8;
            font-size: 14px;
        }

        .path-info code {
            color: #fff;
            background: rgba(255, 255, 255, .08);
            padding: 4px 8px;
            border-radius: 8px;
        }

        .status {
            margin-bottom: 20px;
            padding: 14px 16px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, .08);
        }

        .status.success {
            background: rgba(18, 90, 40, 0.35);
        }

        .status.error {
            background: rgba(120, 20, 20, 0.35);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .card {
            background: linear-gradient(180deg, rgba(20, 20, 24, .96), rgba(8, 8, 12, .98));
            border: 1px solid rgba(255, 255, 255, .08);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, .35);
        }

        .categoria {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .titulo {
            font-size: 28px;
            margin: 0 0 10px;
        }

        .descricao {
            color: #cfcfcf;
            min-height: 48px;
            margin-bottom: 16px;
        }

        .badge {
            display: inline-block;
            margin-bottom: 16px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: bold;
            background: rgba(255, 255, 255, .08);
        }

        .badge.instalado {
            background: rgba(18, 90, 40, 0.45);
        }

        button {
            background: #2f80ed;
            color: #fff;
            border: 0;
            border-radius: 10px;
            padding: 12px 18px;
            font-weight: bold;
            cursor: pointer;
        }

        button:hover {
            filter: brightness(1.05);
        }

        button[disabled] {
            opacity: .6;
            cursor: not-allowed;
        }

        .progress-area {

            margin-top: 20px;

        }

        .progress-bar {

            width: 100%;

            height: 10px;

            background: #222;

            border-radius: 50px;

            overflow: hidden;

        }

        .progress-fill {

            width: 0%;

            height: 100%;

            background: linear-gradient(90deg, #ff7b00, #ffb100);

            transition: width .2s;

        }

        .progress-percent {

            margin-top: 8px;

            font-weight: bold;

        }

        .progress-message {

            color: #aaa;

            font-size: 13px;

            margin-top: 6px;

        }

        .progress-info {

            color: #777;

            font-size: 12px;

            margin-top: 5px;

        }

        .progress-speed {

            color: #ff9c3d;

            font-size: 12px;

            margin-top: 4px;

        }

        .download-btn {

            margin-top: 18px;

            width: 100%;

        }
    </style>
</head>

<body>
    <div class="wrap">
        <h1>Lista de Cursos</h1>
        <p class="path-info">
            Os cursos serão instalados em:
            <code><?= htmlspecialchars($cursosDir) ?></code>
        </p>

        <?php if ($statusMsg !== null): ?>
            <div class="status <?= $statusType === 'success' ? 'success' : 'error' ?>">
                <?= htmlspecialchars($statusMsg) ?>
            </div>
        <?php endif; ?>

        <div class="grid">
            <?php foreach ($catalogo as $curso): ?>
                <?php $instalado = isInstalled($cursosDir, (string)$curso['pasta_destino']); ?>

                <div class="card" id="card-<?= $curso['id'] ?>">

                    <div class="categoria">
                        <?= htmlspecialchars($curso['categoria']) ?>
                    </div>

                    <h2 class="titulo">
                        <?= htmlspecialchars($curso['titulo']) ?>
                    </h2>

                    <div class="descricao">
                        <?= htmlspecialchars($curso['descricao']) ?>
                    </div>

                    <div class="badge <?= $instalado ? 'instalado' : '' ?>" id="badge-<?= $curso['id'] ?>">
                        <?= $instalado ? 'Instalado' : 'Disponível' ?>
                    </div>

                    <div class="progress-area">

                        <div class="progress-bar">

                            <div
                                class="progress-fill"
                                id="fill-<?= $curso['id'] ?>">
                            </div>

                        </div>

                        <div
                            class="progress-percent"
                            id="percent-<?= $curso['id'] ?>">
                            0%
                        </div>

                        <div
                            class="progress-message"
                            id="message-<?= $curso['id'] ?>">
                            Aguardando...
                        </div>

                        <div
                            class="progress-info"
                            id="info-<?= $curso['id'] ?>">
                            0 MB / 0 MB
                        </div>

                        <div
                            class="progress-speed"
                            id="speed-<?= $curso['id'] ?>">
                            -
                        </div>

                    </div>

                    <button

                        class="download-btn"

                        data-id="<?= $curso['id'] ?>">

                        <?= $instalado ? 'Reinstalar' : 'Baixar' ?>

                    </button>

                </div>
            <?php endforeach; ?>
        </div>
    </div>
    
</body>

</html>