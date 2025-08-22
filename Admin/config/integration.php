<?php
// Configuración para la integración con el sitio web principal

// URLs del sitio web principal
define('MAIN_WEBSITE_URL', 'https://www.urbaniza2peru.com');
define('ADMIN_PANEL_URL', 'http://localhost:8080'); // Cambiar por tu dominio en producción

// Configuración de API
define('API_BASE_URL', ADMIN_PANEL_URL . '/api');

// Configuración de seguridad
define('API_SECRET_KEY', 'urbaniza2_secret_2025'); // Cambiar por una clave segura

// Configuración de CORS
$allowed_origins = [
    'https://www.urbaniza2peru.com',
    'http://localhost:3000', // Para desarrollo local del sitio web
    'http://127.0.0.1:3000'
];

// Función para validar origen
function validateOrigin($origin) {
    global $allowed_origins;
    return in_array($origin, $allowed_origins);
}

// Función para generar token de API
function generateApiToken($data) {
    return hash_hmac('sha256', json_encode($data), API_SECRET_KEY);
}

// Función para validar token de API
function validateApiToken($token, $data) {
    return hash_equals($token, generateApiToken($data));
}

// Configuración de email para notificaciones
define('NOTIFICATION_EMAIL', 'admin@urbaniza2peru.com');
define('SMTP_HOST', 'smtp.gmail.com'); // Configurar según tu proveedor
define('SMTP_PORT', 587);
define('SMTP_USERNAME', ''); // Tu email
define('SMTP_PASSWORD', ''); // Tu contraseña de aplicación

// Configuración de WhatsApp (opcional)
define('WHATSAPP_NUMBER', '+51999999999'); // Tu número de WhatsApp
define('WHATSAPP_API_URL', 'https://api.whatsapp.com/send');
?>