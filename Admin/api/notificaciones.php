<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

include '../config/database.php';

try {
    // Obtener consultas nuevas (últimos 5 minutos)
    $stmt = $pdo->prepare("
         SELECT c.* 
         FROM consultas c 
        WHERE c.fecha_consulta >= DATE_SUB(NOW(), INTERVAL 5 MINUTE) 
         AND c.estado = 'pendiente'
         ORDER BY c.fecha_consulta DESC
    ");
    $stmt->execute();
    $nuevas_consultas = $stmt->fetchAll();
    
    // Obtener total de consultas pendientes
    $stmt_pendientes = $pdo->prepare("SELECT COUNT(*) as total FROM consultas WHERE estado = 'pendiente'");
    $stmt_pendientes->execute();
    $total_pendientes = $stmt_pendientes->fetch()['total'];
    
    // Obtener consultas de alta prioridad sin atender
    $stmt_alta_prioridad = $pdo->prepare("
         SELECT c.* 
         FROM consultas c 
        WHERE c.prioridad = 'alta' 
        AND c.estado = 'pendiente'
        AND c.fecha_consulta <= DATE_SUB(NOW(), INTERVAL 1 HOUR)
         ORDER BY c.fecha_consulta ASC
    ");
    $stmt_alta_prioridad->execute();
    $alta_prioridad_sin_atender = $stmt_alta_prioridad->fetchAll();
    
    echo json_encode([
        'success' => true,
        'nuevas_consultas' => $nuevas_consultas,
        'total_pendientes' => $total_pendientes,
        'alta_prioridad_sin_atender' => $alta_prioridad_sin_atender,
        'timestamp' => time()
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener notificaciones: ' . $e->getMessage()
    ]);
}
?>