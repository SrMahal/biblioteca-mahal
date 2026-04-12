<?php
namespace App\Support;

class DebugLog
{
    public static function write(string $channel, array $data = []): void
    {
        $baseDir = dirname(__DIR__, 2) . '/storage/logs';
        $file = $baseDir . '/debug.log';

        if (!is_dir($baseDir)) {
            @mkdir($baseDir, 0777, true);
        }

        $line = sprintf(
            "[%s] [%s] %s%s",
            date('Y-m-d H:i:s'),
            $channel,
            json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            PHP_EOL
        );

        @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    }
}