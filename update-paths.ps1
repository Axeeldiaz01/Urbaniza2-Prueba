# Script para actualizar rutas de assets en archivos HTML

$publicPath = "public"
$htmlFiles = Get-ChildItem -Path $publicPath -Filter "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Actualizando: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Actualizar rutas de imágenes
    $content = $content -replace 'src="img/', 'src="assets/img/'
    $content = $content -replace 'href="img/', 'href="assets/img/'
    
    # Actualizar rutas de CSS
    $content = $content -replace 'href="css/', 'href="assets/css/'
    
    # Actualizar rutas de JS
    $content = $content -replace 'src="js/', 'src="assets/js/'
    
    # Guardar cambios
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

# Actualizar también archivos JS que contengan rutas de imágenes
$jsFiles = Get-ChildItem -Path "$publicPath\assets\js" -Filter "*.js"

foreach ($file in $jsFiles) {
    Write-Host "Actualizando JS: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Actualizar rutas de imágenes en archivos JS
    $content = $content -replace 'src="img/', 'src="assets/img/'
    $content = $content -replace '"img/', '"assets/img/'
    
    # Guardar cambios
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

Write-Host "¡Actualización de rutas completada!"
Write-Host "Archivos actualizados:"
Write-Host "- $($htmlFiles.Count) archivos HTML"
Write-Host "- $($jsFiles.Count) archivos JavaScript"