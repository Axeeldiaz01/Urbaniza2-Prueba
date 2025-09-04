<?php
// Configuración de la base de datos
$host = 'localhost';
$dbname = 'urbaniza2_admin';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Función para sanitizar datos
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Función para verificar sesión de admin
function checkAdminSession() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header('Location: index.php');
        exit();
    }
}

// Función para formatear precio
function formatPrice($price) {
    return 'S/ ' . number_format($price, 2);
}

// Función para formatear fecha
function formatDate($date) {
    return date('d/m/Y H:i', strtotime($date));
}
?>