<?php

namespace App\Controllers\CursoControllers;

class CursosController
{
    private string $basePath;

    public function __construct()
    {
        $envCoursesDir = getenv('APP_COURSES_DIR') ?: '';
        $resolvedEnvPath = $envCoursesDir !== '' ? realpath($envCoursesDir) : false;
        $fallbackPath = realpath(__DIR__ . '/../../../cursos') ?: '';

        $this->basePath = $resolvedEnvPath ?: $fallbackPath;
    }

    public function index(): void
    {
        $courses = $this->listCourses();
        $coursesLabel = $this->getCoursesLocationLabel();

        $titulo = 'Cursos';
        $page = 'cursos';
        $extraCss = ['/assets/css/pages/cursos-local.css'];
        $viewPath = __DIR__ . '/../../Views/pages/bibliotecaCursos/index.php';

        require __DIR__ . '/../../Views/layouts/main.php';
    }

    public function show(): void
    {
        $relativePath = trim((string)($_GET['path'] ?? ''), '/');

        if ($relativePath === '') {
            http_response_code(400);
            echo 'Curso não informado.';
            return;
        }

        $fullPath = realpath($this->basePath . DIRECTORY_SEPARATOR . $relativePath);

        if (!$fullPath || !$this->isInsideBase($fullPath) || !is_dir($fullPath)) {
            http_response_code(404);
            echo 'Curso não encontrado.';
            return;
        }

        $tree = $this->buildTree($fullPath, $fullPath);
        $courseName = basename($fullPath);
        $coursePath = $relativePath;

        $titulo = $courseName;
        $page = 'cursos';
        $extraCss = ['/assets/css/pages/cursos-local.css'];
        $viewPath = __DIR__ . '/../../Views/pages/bibliotecaCursos/show.php';

        require __DIR__ . '/../../Views/layouts/main.php';
    }

    public function file(): void
    {
        $coursePath = trim((string)($_GET['path'] ?? ''), '/');
        $file = trim((string)($_GET['file'] ?? ''), '/');

        $baseCoursePath = realpath($this->basePath . DIRECTORY_SEPARATOR . $coursePath);

        if (!$baseCoursePath || !$this->isInsideBase($baseCoursePath) || !is_dir($baseCoursePath)) {
            http_response_code(404);
            echo 'Curso inválido.';
            return;
        }

        $fullFilePath = realpath($baseCoursePath . DIRECTORY_SEPARATOR . $file);

        if (!$fullFilePath || !$this->isInsidePath($fullFilePath, $baseCoursePath) || !is_file($fullFilePath)) {
            http_response_code(404);
            echo 'Arquivo não encontrado.';
            return;
        }

        $fileName = basename($fullFilePath);
        $ext = strtolower(pathinfo($fullFilePath, PATHINFO_EXTENSION));
        $streamUrl = '/curso/raw?path=' . urlencode($coursePath) . '&file=' . urlencode($file);

        $titulo = $fileName;
        $page = 'cursos';
        $extraCss = ['/assets/css/pages/cursos-local.css'];
        $viewPath = __DIR__ . '/../../Views/pages/bibliotecaCursos/file.php';

        require __DIR__ . '/../../Views/layouts/main.php';
    }

    public function raw(): void
    {
        $coursePath = trim((string)($_GET['path'] ?? ''), '/');
        $file = trim((string)($_GET['file'] ?? ''), '/');

        $baseCoursePath = realpath($this->basePath . DIRECTORY_SEPARATOR . $coursePath);

        if (!$baseCoursePath || !$this->isInsideBase($baseCoursePath) || !is_dir($baseCoursePath)) {
            http_response_code(404);
            exit('Curso inválido');
        }

        $fullFilePath = realpath($baseCoursePath . DIRECTORY_SEPARATOR . $file);

        if (!$fullFilePath || !$this->isInsidePath($fullFilePath, $baseCoursePath) || !is_file($fullFilePath)) {
            http_response_code(404);
            exit('Arquivo não encontrado');
        }

        $ext = strtolower(pathinfo($fullFilePath, PATHINFO_EXTENSION));

        $mimeMap = [
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            'mov' => 'video/quicktime',
            'pdf' => 'application/pdf',
        ];

        $mime = $mimeMap[$ext] ?? mime_content_type($fullFilePath) ?? 'application/octet-stream';
        $size = filesize($fullFilePath);

        header('Content-Type: ' . $mime);
        header('Content-Disposition: inline; filename="' . basename($fullFilePath) . '"');
        header('Accept-Ranges: bytes');
        header('Cache-Control: public, max-age=3600');

        $start = 0;
        $end = $size - 1;
        $length = $size;

        header('Content-Type: ' . $mime);
        header('Accept-Ranges: bytes');
        header('Cache-Control: public, max-age=3600');

        if (isset($_SERVER['HTTP_RANGE']) && preg_match('/bytes=(\d+)-(\d*)/', $_SERVER['HTTP_RANGE'], $matches)) {
            $start = (int)$matches[1];
            $end = ($matches[2] !== '') ? (int)$matches[2] : $end;

            if ($start > $end || $start >= $size) {
                header("Content-Range: bytes */{$size}");
                http_response_code(416);
                exit;
            }

            if ($end >= $size) {
                $end = $size - 1;
            }

            $length = $end - $start + 1;

            http_response_code(206);
            header("Content-Range: bytes {$start}-{$end}/{$size}");
            header("Content-Length: {$length}");
        } else {
            header("Content-Length: {$size}");
        }

        $fp = fopen($fullFilePath, 'rb');

        if ($start > 0) {
            fseek($fp, $start);
        }

        set_time_limit(0);

        $bufferSize = 1024 * 1024;
        $remaining = $length;

        while (!feof($fp) && $remaining > 0) {
            if (connection_aborted()) {
                break;
            }

            $read = ($remaining > $bufferSize) ? $bufferSize : $remaining;
            $buffer = fread($fp, $read);

            if ($buffer === false) {
                break;
            }

            echo $buffer;
            $remaining -= strlen($buffer);

            flush();
        }

        fclose($fp);
        exit;
    }

    private function listCourses(): array
    {
        $result = [];

        if ($this->basePath === '' || !is_dir($this->basePath)) {
            return $result;
        }

        $items = scandir($this->basePath);

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') continue;

            $itemPath = $this->basePath . DIRECTORY_SEPARATOR . $item;

            if (!is_dir($itemPath)) continue;

            $result[] = [
                'name' => $item,
                'path' => $item,
            ];
        }

        usort($result, fn($a, $b) => strnatcasecmp($a['name'], $b['name']));
        return $result;
    }

    private function getCoursesLocationLabel(): string
    {
        $envCoursesDir = getenv('APP_COURSES_DIR') ?: '';

        if ($envCoursesDir !== '') {
            return $envCoursesDir;
        }

        return 'cursos/';
    }

    private function buildTree(string $dir, string $root): array
    {
        $items = scandir($dir);
        $tree = [];

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') continue;

            $fullPath = $dir . DIRECTORY_SEPARATOR . $item;

            if (is_dir($fullPath)) {
                $tree[] = [
                    'type' => 'folder',
                    'name' => $item,
                    'children' => $this->buildTree($fullPath, $root),
                ];
                continue;
            }

            $relative = ltrim(str_replace($root, '', $fullPath), DIRECTORY_SEPARATOR);
            $relative = str_replace(DIRECTORY_SEPARATOR, '/', $relative);

            $tree[] = [
                'type' => 'file',
                'name' => $item,
                'extension' => strtolower(pathinfo($item, PATHINFO_EXTENSION)),
                'relative_path' => $relative,
            ];
        }

        usort($tree, function ($a, $b) {
            if ($a['type'] === $b['type']) {
                return strnatcasecmp($a['name'], $b['name']);
            }
            return $a['type'] === 'folder' ? -1 : 1;
        });

        return $tree;
    }

    private function isInsideBase(string $path): bool
    {
        return $this->basePath !== '' && str_starts_with($path, $this->basePath);
    }

    private function isInsidePath(string $path, string $base): bool
    {
        return str_starts_with($path, $base);
    }
}