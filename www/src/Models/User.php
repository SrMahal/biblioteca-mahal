<?php
namespace App\Models;

use App\Config\Database;
use PDO;

class User {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    // LISTAR TODOS
    public function findAll() {
        $sql = "SELECT 
                    u.id,
                    u.uuid,
                    u.nome,
                    u.email,
                    u.status,
                    GROUP_CONCAT(DISTINCT r.nome ORDER BY r.id SEPARATOR ', ') as role_nome
                FROM usuarios u
                LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
                LEFT JOIN roles r ON ur.role_id = r.id
                GROUP BY u.id, u.uuid, u.nome, u.email, u.status
                ORDER BY u.id DESC";

        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // BUSCAR POR ID (CORRIGIDO: evita duplicidade quando o usuário tem múltiplas roles)
    public function findById($id) {
        $sql = "SELECT 
                    u.id,
                    u.uuid,
                    u.nome,
                    u.email,
                    u.status,
                    u.telefone,
                    u.nick,
                    u.data_nascimento,
                    MAX(r.id) as role_id,
                    GROUP_CONCAT(DISTINCT r.nome ORDER BY r.id SEPARATOR ', ') as role_nome
                FROM usuarios u
                LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
                LEFT JOIN roles r ON ur.role_id = r.id
                WHERE u.id = :id
                GROUP BY u.id, u.uuid, u.nome, u.email, u.status, u.telefone, u.nick, u.data_nascimento
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // BUSCAR POR UUID (preparo para migrar rotas públicas de id -> uuid)
    public function findByUuid(string $uuid) {
        $sql = "SELECT 
                    u.id,
                    u.uuid,
                    u.nome,
                    u.email,
                    u.status,
                    u.telefone,
                    u.nick,
                    u.data_nascimento,
                    MAX(r.id) as role_id,
                    GROUP_CONCAT(DISTINCT r.nome ORDER BY r.id SEPARATOR ', ') as role_nome
                FROM usuarios u
                LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
                LEFT JOIN roles r ON ur.role_id = r.id
                WHERE u.uuid = :uuid
                GROUP BY u.id, u.uuid, u.nome, u.email, u.status, u.telefone, u.nick, u.data_nascimento
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // BUSCAR POR EMAIL
    public function findByEmail($email) {
        $sql = "SELECT 
                    u.*,
                    MAX(r.id) as role_id,
                    GROUP_CONCAT(DISTINCT r.nome ORDER BY r.id SEPARATOR ', ') as role_nome
                FROM usuarios u
                LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
                LEFT JOIN roles r ON ur.role_id = r.id
                WHERE u.email = :email
                GROUP BY u.id
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', trim((string)$email), PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // CRIAR
    public function create($data) {
        $this->conn->beginTransaction();

        try {
            $sql = "INSERT INTO usuarios (uuid, nome, email, senha, status)
                    VALUES (:uuid, :nome, :email, :senha, 'ativo')";
            $stmt = $this->conn->prepare($sql);

            $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
            $senhaHash = password_hash((string)$data['password'], PASSWORD_DEFAULT);

            $nome = trim((string)$data['nome']);
            $email = mb_strtolower(trim((string)$data['email']));

            $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
            $stmt->bindValue(':nome', $nome, PDO::PARAM_STR);
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $stmt->bindValue(':senha', $senhaHash, PDO::PARAM_STR);
            $stmt->execute();

            $usuarioId = (int)$this->conn->lastInsertId();

            $roleId = isset($data['role_id']) ? (int)$data['role_id'] : 2;
            $sqlRole = "INSERT INTO usuario_roles (usuario_id, role_id) VALUES (:uid, :rid)";
            $stmtRole = $this->conn->prepare($sqlRole);
            $stmtRole->bindValue(':uid', $usuarioId, PDO::PARAM_INT);
            $stmtRole->bindValue(':rid', $roleId, PDO::PARAM_INT);
            $stmtRole->execute();

            $this->conn->commit();
            return $usuarioId;

        } catch (\Throwable $e) {
            $this->conn->rollBack();
            error_log('[USER_CREATE] ' . $e->getMessage());
            return false;
        }
    }

    // ATUALIZAR (Apenas tabela USUARIOS)
    public function update($id, $data) {
        $fields = [];
        $params = [
            ':id' => (int)$id
        ];

        if (isset($data['nome']) && trim((string)$data['nome']) !== '') {
            $fields[] = "nome = :nome";
            $params[':nome'] = trim((string)$data['nome']);
        }

        if (isset($data['nick']) && trim((string)$data['nick']) !== '') {
            $fields[] = "nick = :nick";
            $params[':nick'] = trim((string)$data['nick']);
        }

        if (isset($data['telefone']) && trim((string)$data['telefone']) !== '') {
            $fields[] = "telefone = :telefone";
            $params[':telefone'] = trim((string)$data['telefone']);
        }

        if (isset($data['data_nascimento']) && trim((string)$data['data_nascimento']) !== '') {
            $fields[] = "data_nascimento = :data_nascimento";
            $params[':data_nascimento'] = trim((string)$data['data_nascimento']);
        }

        // Se vier senha preenchida, sempre re-hash antes de salvar
        if (isset($data['password']) && trim((string)$data['password']) !== '') {
            $fields[] = "senha = :senha";
            $params[':senha'] = password_hash((string)$data['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) {
            return true;
        }

        $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        foreach ($params as $key => $value) {
            if ($key === ':id') {
                $stmt->bindValue($key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key, $value, PDO::PARAM_STR);
            }
        }

        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM usuarios WHERE id = :id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}