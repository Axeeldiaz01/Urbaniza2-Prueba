<?php
/**
 * NOTA: Este script NO es necesario para la estructura actual del proyecto.
 * 
 * Urbaniza2 es un sitio web 100% estático sin panel administrativo.
 * Las imágenes se gestionan directamente en la carpeta img/
 * 
 * Script original para sincronizar imágenes entre Admin/uploads y public/uploads
 * (Solo útil si se implementa un panel administrativo en el futuro)
 */

// SCRIPT DESHABILITADO - No es necesario para sitio estático
exit("Este script no es necesario para la estructura actual del proyecto estático.\n");

/*
 * Código original comentado:
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