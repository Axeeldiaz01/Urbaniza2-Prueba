<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir métodos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (!$input || !isset($input['terreno_id']) || !isset($input['nombre']) || !isset($input['email']) || !isset($input['telefono'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit();
}

// Sanitizar datos
$terreno_id = filter_var($input['terreno_id'], FILTER_SANITIZE_STRING);
$nombre = filter_var($input['nombre'], FILTER_SANITIZE_STRING);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$telefono = filter_var($input['telefono'], FILTER_SANITIZE_STRING);
$mensaje = isset($input['mensaje']) ? filter_var($input['mensaje'], FILTER_SANITIZE_STRING) : '';
$tipo_pago = isset($input['tipo_pago']) ? filter_var($input['tipo_pago'], FILTER_SANITIZE_STRING) : 'contado';

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit();
}

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'urbaniza2peru';
$username = 'root';
$password = '';

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verificar si el terreno existe
    $stmt = $pdo->prepare("SELECT * FROM terrenos WHERE id = ?");
    $stmt->execute([$terreno_id]);
    $terreno = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$terreno) {
        http_response_code(404);
        echo json_encode(['error' => 'Terreno no encontrado']);
        exit();
    }
    
    // Insertar solicitud de compra
    $stmt = $pdo->prepare("
        INSERT INTO solicitudes_compra 
        (terreno_id, nombre_cliente, email_cliente, telefono_cliente, mensaje, tipo_pago, fecha_solicitud, estado) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), 'pendiente')
    ");
    
    $stmt->execute([
        $terreno_id,
        $nombre,
        $email,
        $telefono,
        $mensaje,
        $tipo_pago
    ]);
    
    $solicitud_id = $pdo->lastInsertId();
    
    // Preparar email de notificación (opcional)
    $asunto = "Nueva solicitud de compra - Terreno: " . $terreno['nombre'];
    $mensaje_email = "
        Nueva solicitud de compra recibida:
        
        Terreno: {$terreno['nombre']}
        Área: {$terreno['area']} m²
        Precio: S/ {$terreno['precio']}
        
        Datos del cliente:
        Nombre: $nombre
        Email: $email
        Teléfono: $telefono
        Tipo de pago: $tipo_pago
        
        Mensaje: $mensaje
        
        Fecha: " . date('Y-m-d H:i:s') . "
        ID de solicitud: $solicitud_id
    ";
    
    // Aquí puedes agregar el envío de email si tienes configurado un servidor de correo
    // mail('ventas@urbaniza2peru.com', $asunto, $mensaje_email);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Solicitud de compra enviada correctamente',
        'solicitud_id' => $solicitud_id,
        'terreno' => [
            'nombre' => $terreno['nombre'],
            'precio' => $terreno['precio']
        ]
    ]);
    
} catch (PDOException $e) {
    // Error de base de datos
    http_response_code(500);
    echo json_encode([
        'error' => 'Error interno del servidor',
        'details' => $e->getMessage()
    ]);
} catch (Exception $e) {
    // Error general
    http_response_code(500);
    echo json_encode([
        'error' => 'Error inesperado',
        'details' => $e->getMessage()
    ]);
}
?>