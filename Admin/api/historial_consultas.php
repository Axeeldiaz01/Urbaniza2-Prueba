<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';
session_start();

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Obtener historial de una consulta específica
        $consulta_id = $_GET['consulta_id'] ?? null;
        
        if (!$consulta_id) {
            throw new Exception('ID de consulta requerido');
        }
        
        $stmt = $pdo->prepare("
            SELECT h.*, a.nombre as admin_nombre 
            FROM historial_consultas h 
            LEFT JOIN admins a ON h.modificado_por = a.id 
            WHERE h.consulta_id = ? 
            ORDER BY h.fecha_modificacion DESC
        ");
        $stmt->execute([$consulta_id]);
        $historial = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'historial' => $historial
        ]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Registrar un cambio en el historial
        $data = json_decode(file_get_contents('php://input'), true);
        
        $consulta_id = $data['consulta_id'] ?? null;
        $campo_modificado = $data['campo_modificado'] ?? null;
        $valor_anterior = $data['valor_anterior'] ?? null;
        $valor_nuevo = $data['valor_nuevo'] ?? null;
        $comentario = $data['comentario'] ?? null;
        
        if (!$consulta_id || !$campo_modificado) {
            throw new Exception('Datos incompletos para registrar el cambio');
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO historial_consultas 
            (consulta_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por, comentario) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $consulta_id,
            $campo_modificado,
            $valor_anterior,
            $valor_nuevo,
            $_SESSION['admin_id'],
            $comentario
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Cambio registrado en el historial'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>