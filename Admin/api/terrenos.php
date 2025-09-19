<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include '../config/database.php';

try {
    $action = $_GET['action'] ?? 'list';
    
    switch ($action) {
        case 'list':
            // Obtener todos los terrenos disponibles
            $stmt = $pdo->query("SELECT id, nombre, ubicacion, area, precio, descripcion, estado, imagen FROM terrenos WHERE estado = 'disponible' ORDER BY id DESC");
            $terrenos = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $terrenos
            ]);
            break;
            
        case 'featured':
            // Obtener terrenos destacados (últimos 6)
            $stmt = $pdo->query("SELECT id, nombre, ubicacion, area, precio, descripcion, estado, imagen FROM terrenos WHERE estado = 'disponible' ORDER BY id DESC LIMIT 6");
            $terrenos = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $terrenos
            ]);
            break;
            
        case 'detail':
            // Obtener detalle de un terreno específico
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM terrenos WHERE id = ? AND estado = 'disponible'");
            $stmt->execute([$id]);
            $terreno = $stmt->fetch();
            
            if ($terreno) {
                echo json_encode([
                    'success' => true,
                    'data' => $terreno
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Terreno no encontrado'
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Acción no válida'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>