<?php
namespace App\Models;

use App\Config\Database;
use PDO;

class UserProfile {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function findByUserId($usuarioId) {
        $sql = "SELECT * FROM dados_usuario WHERE usuario_id = :uid LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':uid', (int)$usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    public function save($usuarioId, $data) {
        // Busca dados atuais para não zerar campos que não vieram no request
        $current = $this->findByUserId($usuarioId);

        // Mantém valores antigos quando o campo não for enviado
        $desc   = array_key_exists('descricao', $data)    ? $data['descricao']    : ($current['descricao'] ?? null);
        $site   = array_key_exists('site_pessoal', $data) ? $data['site_pessoal'] : ($current['site_pessoal'] ?? null);
        $insta  = array_key_exists('instagram', $data)    ? $data['instagram']    : ($current['instagram'] ?? null);
        $git    = array_key_exists('github', $data)       ? $data['github']       : ($current['github'] ?? null);
        $link   = array_key_exists('linkedin', $data)     ? $data['linkedin']     : ($current['linkedin'] ?? null);
        $foto   = array_key_exists('foto_perfil', $data)  ? $data['foto_perfil']  : ($current['foto_perfil'] ?? null);
        $banner = array_key_exists('banner', $data)       ? $data['banner']       : ($current['banner'] ?? null);

        $sql = "INSERT INTO dados_usuario (
                    usuario_id, descricao, site_pessoal, instagram, github, linkedin, foto_perfil, banner
                ) VALUES (
                    :uid, :desc, :site, :insta, :git, :link, :foto, :banner
                ) ON DUPLICATE KEY UPDATE
                    descricao = VALUES(descricao),
                    site_pessoal = VALUES(site_pessoal),
                    instagram = VALUES(instagram),
                    github = VALUES(github),
                    linkedin = VALUES(linkedin),
                    foto_perfil = VALUES(foto_perfil),
                    banner = VALUES(banner)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':uid', (int)$usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(':desc', $desc, PDO::PARAM_STR);
        $stmt->bindValue(':site', $site, PDO::PARAM_STR);
        $stmt->bindValue(':insta', $insta, PDO::PARAM_STR);
        $stmt->bindValue(':git', $git, PDO::PARAM_STR);
        $stmt->bindValue(':link', $link, PDO::PARAM_STR);
        $stmt->bindValue(':foto', $foto, PDO::PARAM_STR);
        $stmt->bindValue(':banner', $banner, PDO::PARAM_STR);

        return $stmt->execute();
    }
}