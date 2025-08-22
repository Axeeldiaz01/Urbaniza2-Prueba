<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

include 'config/database.php';

// Obtener parámetros de filtrado
$search = $_GET['search'] ?? '';
$estado = $_GET['estado'] ?? '';
$tipo = $_GET['tipo'] ?? '';
$export_format = $_GET['export'] ?? 'excel';

// Construir consulta SQL con filtros
$sql = "SELECT c.*, 
                a.nombre as admin_nombre
         FROM consultas c 
         LEFT JOIN admins a ON c.atendido_por = a.id 
        WHERE 1=1";

$params = [];

if (!empty($search)) {
    $sql .= " AND (c.nombre LIKE ? OR c.email LIKE ? OR c.mensaje LIKE ?)";
    $searchParam = "%$search%";
    $params[] = $searchParam;
    $params[] = $searchParam;
    $params[] = $searchParam;
}

if (!empty($estado)) {
    $sql .= " AND c.estado = ?";
    $params[] = $estado;
}

if (!empty($tipo)) {
    $sql .= " AND c.tipo_consulta = ?";
    $params[] = $tipo;
}

$sql .= " ORDER BY c.fecha_consulta DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$consultas = $stmt->fetchAll();

// Función para formatear fecha
function formatDate($date) {
    return date('d/m/Y H:i', strtotime($date));
}

// Función para formatear precio
function formatPrice($price) {
    return 'S/ ' . number_format($price, 0, '.', ',');
}

if ($export_format === 'excel') {
    // Exportar a Excel (CSV)
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="consultas_' . date('Y-m-d_H-i-s') . '.csv"');
    
    $output = fopen('php://output', 'w');
    
    // BOM para UTF-8
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Encabezados
    fputcsv($output, [
        'ID',
        'Nombre',
        'Email',
        'Teléfono',
        'Terreno',
        'Tipo Consulta',
        'Estado',
        'Prioridad',
        'Mensaje',
        'Notas Admin',
        'Fecha Consulta',
        'Atendido Por'
    ]);
    
    // Datos
    foreach ($consultas as $consulta) {
        fputcsv($output, [
            $consulta['id'],
            $consulta['nombre'],
            $consulta['email'],
            $consulta['telefono'] ?: 'No especificado',
            'Consulta General',
            ucfirst($consulta['tipo_consulta']),
            ucfirst($consulta['estado']),
            ucfirst($consulta['prioridad']),
            $consulta['mensaje'],
            $consulta['notas_admin'] ?: '',
            formatDate($consulta['fecha_consulta']),
            $consulta['admin_nombre'] ?: 'No asignado'
        ]);
    }
    
    fclose($output);
    
} elseif ($export_format === 'pdf') {
    // Exportar a PDF (HTML simple)
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="consultas_' . date('Y-m-d_H-i-s') . '.pdf"');
    
    // Crear HTML para PDF
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Consultas</title>
        <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .fecha { text-align: right; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Urbaniza2 Perú</h1>
            <h2>Reporte de Consultas</h2>
        </div>
        <div class="fecha">
            Generado el: ' . date('d/m/Y H:i:s') . '
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Contacto</th>
                    <th>Terreno</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>';
    
    foreach ($consultas as $consulta) {
        $html .= '
                <tr>
                    <td>' . $consulta['id'] . '</td>
                    <td>' . htmlspecialchars($consulta['nombre']) . '</td>
                    <td>' . htmlspecialchars($consulta['email']) . '<br>' . ($consulta['telefono'] ?: 'Sin teléfono') . '</td>
                    <td>Consulta General</td>
                    <td>' . ucfirst($consulta['tipo_consulta']) . '</td>
                    <td>' . ucfirst($consulta['estado']) . '</td>
                    <td>' . formatDate($consulta['fecha_consulta']) . '</td>
                </tr>';
    }
    
    $html .= '
            </tbody>
        </table>
        <div style="margin-top: 30px; font-size: 10px; color: #666;">
            <p>Total de consultas: ' . count($consultas) . '</p>
            <p>Este reporte fue generado automáticamente por el sistema de gestión de Urbaniza2 Perú.</p>
        </div>
    </body>
    </html>';
    
    // Para una implementación más robusta, se podría usar una librería como TCPDF o DOMPDF
    // Por ahora, enviamos HTML que el navegador puede convertir a PDF
    echo $html;
}
?>