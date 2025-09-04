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

/**
 * Función para enviar email de respuesta automática
 */
function enviarEmailRespuesta($consulta, $tipo_respuesta = 'confirmacion') {
    $to = $consulta['email'];
    $nombre = $consulta['nombre'];
    
    // Configurar el asunto y mensaje según el tipo
    switch ($tipo_respuesta) {
        case 'confirmacion':
            $subject = 'Confirmación de Consulta - Urbaniza2 Perú';
            $mensaje = generarMensajeConfirmacion($consulta);
            break;
            
        case 'contactado':
            $subject = 'Hemos recibido tu consulta - Urbaniza2 Perú';
            $mensaje = generarMensajeContactado($consulta);
            break;
            
        case 'seguimiento':
            $subject = 'Seguimiento de tu consulta - Urbaniza2 Perú';
            $mensaje = generarMensajeSeguimiento($consulta);
            break;
            
        default:
            return false;
    }
    
    // Configurar headers para HTML
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Urbaniza2 Perú <noreply@urbaniza2peru.com>',
        'Reply-To: info@urbaniza2peru.com',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Enviar email
    return mail($to, $subject, $mensaje, implode("\r\n", $headers));
}

/**
 * Generar mensaje de confirmación
 */
function generarMensajeConfirmacion($consulta) {
    $terreno_info = '';
    $terreno_info = "<p><strong>Tipo:</strong> Consulta General</p>";
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
            .btn { display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>¡Gracias por tu consulta!</h1>
            </div>
            <div class='content'>
                <p>Estimado/a <strong>{$consulta['nombre']}</strong>,</p>
                
                <p>Hemos recibido tu consulta y queremos confirmarte que la hemos registrado exitosamente en nuestro sistema.</p>
                
                <h3>Detalles de tu consulta:</h3>
                <p><strong>Tipo de consulta:</strong> {$consulta['tipo_consulta']}</p>
                <p><strong>Fecha:</strong> " . date('d/m/Y H:i', strtotime($consulta['fecha_consulta'])) . "</p>
                {$terreno_info}
                
                <p><strong>Tu mensaje:</strong></p>
                <div style='background: white; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0;'>
                    " . nl2br(htmlspecialchars($consulta['mensaje'])) . "
                </div>
                
                <p>Nuestro equipo revisará tu consulta y se pondrá en contacto contigo en un plazo máximo de 24 horas.</p>
                
                <p>Si tienes alguna pregunta urgente, no dudes en contactarnos:</p>
                <ul>
                    <li><strong>Teléfono:</strong> +51 999 888 777</li>
                    <li><strong>Email:</strong> info@urbaniza2peru.com</li>
                    <li><strong>WhatsApp:</strong> +51 999 888 777</li>
                </ul>
                
                <div style='text-align: center; margin: 20px 0;'>
                    <a href='https://urbaniza2peru.com' class='btn'>Visitar nuestro sitio web</a>
                </div>
            </div>
            <div class='footer'>
                <p>&copy; 2024 Urbaniza2 Perú. Todos los derechos reservados.</p>
                <p>Este es un email automático, por favor no responder a esta dirección.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

/**
 * Generar mensaje cuando se marca como contactado
 */
function generarMensajeContactado($consulta) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>¡Estamos procesando tu consulta!</h1>
            </div>
            <div class='content'>
                <p>Estimado/a <strong>{$consulta['nombre']}</strong>,</p>
                
                <p>Te informamos que hemos comenzado a procesar tu consulta y uno de nuestros especialistas se pondrá en contacto contigo muy pronto.</p>
                
                <p>Mientras tanto, te invitamos a:</p>
                <ul>
                    <li>Explorar nuestros terrenos disponibles en nuestra web</li>
                    <li>Seguirnos en nuestras redes sociales para estar al día con nuestras ofertas</li>
                    <li>Contactarnos directamente si tienes alguna pregunta adicional</li>
                </ul>
                
                <p>¡Gracias por confiar en Urbaniza2 Perú!</p>
            </div>
            <div class='footer'>
                <p>&copy; 2024 Urbaniza2 Perú. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

/**
 * Generar mensaje de seguimiento
 */
function generarMensajeSeguimiento($consulta) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Seguimiento de tu consulta</h1>
            </div>
            <div class='content'>
                <p>Estimado/a <strong>{$consulta['nombre']}</strong>,</p>
                
                <p>Queremos manterte informado sobre el estado de tu consulta.</p>
                
                <p>Nuestro equipo continúa trabajando en brindarte la mejor atención y respuesta a tus necesidades.</p>
                
                <p>Si deseas obtener más información o tienes alguna pregunta adicional, no dudes en contactarnos.</p>
                
                <p>¡Estamos aquí para ayudarte a encontrar el terreno perfecto!</p>
            </div>
            <div class='footer'>
                <p>&copy; 2024 Urbaniza2 Perú. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $consulta_id = $data['consulta_id'] ?? null;
        $tipo_respuesta = $data['tipo_respuesta'] ?? 'confirmacion';
        
        if (!$consulta_id) {
            throw new Exception('ID de consulta requerido');
        }
        
        // Obtener datos de la consulta
        $stmt = $pdo->prepare("
             SELECT c.* 
             FROM consultas c 
            WHERE c.id = ?
        ");
        $stmt->execute([$consulta_id]);
        $consulta = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$consulta) {
            throw new Exception('Consulta no encontrada');
        }
        
        // Enviar email
        $resultado = enviarEmailRespuesta($consulta, $tipo_respuesta);
        
        if ($resultado) {
            // Registrar en el historial
            $stmt = $pdo->prepare("
                INSERT INTO historial_consultas 
                (consulta_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por, comentario) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $consulta_id,
                'Email Enviado',
                null,
                "Email de {$tipo_respuesta} enviado a {$consulta['email']}",
                $_SESSION['admin_id'],
                "Email automático enviado desde el panel de administración"
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Email enviado exitosamente'
            ]);
        } else {
            throw new Exception('Error al enviar el email');
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>