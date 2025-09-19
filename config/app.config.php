<?php
/**
 * Configuración centralizada de la aplicación Urbaniza2
 * Este archivo contiene todas las configuraciones principales del sistema
 */

// Configuración de URLs
define('BASE_URL', 'http://localhost:3000');
define('ADMIN_URL', 'http://localhost:8080');
define('API_URL', 'http://localhost:8080/api');

// Configuración de rutas de assets
define('ASSETS_CSS', 'assets/css/');
define('ASSETS_JS', 'assets/js/');
define('ASSETS_IMG', 'assets/img/');
define('UPLOADS_PATH', 'uploads/');

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'urbaniza2_admin');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración de WhatsApp
define('WHATSAPP_NUMBER', '+51987654321');
define('WHATSAPP_MESSAGE', 'Hola, estoy interesado en sus terrenos');

// Configuración de email
define('EMAIL_FROM', 'info@urbaniza2.com');
define('EMAIL_SUBJECT', 'Consulta desde Urbaniza2');

// Configuración de la aplicación
define('APP_NAME', 'Urbaniza2');
define('APP_VERSION', '1.0.0');
define('APP_DESCRIPTION', 'Sistema de gestión inmobiliaria');

// Configuración de sesiones
define('SESSION_TIMEOUT', 3600); // 1 hora
define('SESSION_NAME', 'urbaniza2_admin');

// Configuración de archivos
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif']);

// Configuración de paginación
define('ITEMS_PER_PAGE', 10);

?>