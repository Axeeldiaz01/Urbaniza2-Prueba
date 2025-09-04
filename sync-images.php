<?php
/**
 * Script para sincronizar imágenes entre Admin/uploads y public/uploads
 * Ejecutar después de agregar nuevos terrenos desde el dashboard
 */

$adminUploads = __DIR__ . '/Admin/uploads';
$publicUploads = __DIR__ . '/public/uploads';

// Crear directorio public/uploads si no existe
if (!is_dir($publicUploads)) {
    mkdir($publicUploads, 0755, true);
    echo "Directorio public/uploads creado.\n";
}

// Obtener archivos de Admin/uploads
$adminFiles = glob($adminUploads . '/*');

if (empty($adminFiles)) {
    echo "No hay archivos en Admin/uploads para sincronizar.\n";
    exit;
}

$syncedCount = 0;
$skippedCount = 0;

foreach ($adminFiles as $adminFile) {
    $filename = basename($adminFile);
    $publicFile = $publicUploads . '/' . $filename;
    
    // Solo copiar si el archivo no existe en public/uploads
    if (!file_exists($publicFile)) {
        if (copy($adminFile, $publicFile)) {
            echo "✓ Sincronizado: $filename\n";
            $syncedCount++;
        } else {
            echo "✗ Error al sincronizar: $filename\n";
        }
    } else {
        $skippedCount++;
    }
}

echo "\n=== RESUMEN ===\n";
echo "Archivos sincronizados: $syncedCount\n";
echo "Archivos omitidos (ya existían): $skippedCount\n";
echo "Total de archivos en Admin/uploads: " . count($adminFiles) . "\n";

// Verificar archivos en public/uploads
$publicFiles = glob($publicUploads . '/*');
echo "Total de archivos en public/uploads: " . count($publicFiles) . "\n";

echo "\n¡Sincronización completada!\n";
?>