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
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Recibir consulta desde el sitio web
        $input = json_decode(file_get_contents('php://input'), true);
        
        $nombre = $input['nombre'] ?? '';
        $email = $input['email'] ?? '';
        $telefono = $input['telefono'] ?? '';
        $mensaje = $input['mensaje'] ?? '';
        $tipo_consulta = $input['tipo_consulta'] ?? 'informacion';
        $presupuesto = $input['presupuesto'] ?? '';
        $ubicacion_interes = $input['ubicacion_interes'] ?? '';
        
        if (empty($nombre) || empty($email) || empty($mensaje)) {
            echo json_encode([
                'success' => false,
                'message' => 'Todos los campos son obligatorios'
            ]);
            exit;
        }
        
        // Validar email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'success' => false,
                'message' => 'Email no válido'
            ]);
            exit;
        }
        
        // Insertar consulta
        $stmt = $pdo->prepare("INSERT INTO consultas (nombre, email, telefono, mensaje, tipo_consulta, estado, fecha_consulta) VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())");
        $result = $stmt->execute([$nombre, $email, $telefono, $mensaje, $tipo_consulta]);
        
        // Si hay información adicional, guardarla en las notas
        if (!empty($presupuesto) || !empty($ubicacion_interes)) {
            $notas_adicionales = [];
            if (!empty($presupuesto)) {
                $notas_adicionales[] = "Presupuesto: " . $presupuesto;
            }
            if (!empty($ubicacion_interes)) {
                $notas_adicionales[] = "Ubicación de interés: " . $ubicacion_interes;
            }
            
            $consulta_id = $pdo->lastInsertId();
            $notas = implode("\n", $notas_adicionales);
            $stmt_notas = $pdo->prepare("UPDATE consultas SET notas_admin = ? WHERE id = ?");
            $stmt_notas->execute([$notas, $consulta_id]);
        }
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Consulta enviada exitosamente. Te contactaremos pronto.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Error al enviar la consulta'
            ]);
        }
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>