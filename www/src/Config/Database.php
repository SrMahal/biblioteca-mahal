<?php
namespace App\Config;

use PDO;
use PDOException;
use Dotenv\Dotenv;

class Database
{
    private static $instance = null;

    public static function getConnection()
    {
        if (self::$instance === null) {
            $dotenvPath = realpath(__DIR__ . '/../../../../');

            if (!isset($_ENV['DB_HOST']) && $dotenvPath && file_exists($dotenvPath . '/.env')) {
                $dotenv = Dotenv::createImmutable($dotenvPath);
                $dotenv->safeLoad();
            }

            $host = $_ENV['DB_HOST'] ?? 'mysql';
            $port = (int)($_ENV['DB_PORT'] ?? 3306);
            $db   = $_ENV['DB_DATABASE'] ?? $_ENV['MYSQL_DATABASE'] ?? null;
            $user = $_ENV['DB_USERNAME'] ?? 'root';
            $pass = $_ENV['DB_PASSWORD'] ?? $_ENV['MYSQL_ROOT_PASSWORD'] ?? null;

            if (!$db || !$pass) {
                die("<h3>Erro de Configuração (Biblioteca)</h3><p>Variáveis de banco não encontradas.</p>");
            }

            try {
                self::$instance = new PDO(
                    "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4",
                    $user,
                    $pass,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
            } catch (PDOException $e) {
                die("<h3>Erro de Conexão</h3><p>Falha ao conectar no banco da Biblioteca.</p>");
            }
        }

        return self::$instance;
    }
}