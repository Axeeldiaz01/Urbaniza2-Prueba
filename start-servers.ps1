# Script para iniciar el servidor de Urbaniza2 (Sitio Estatico)

Write-Host "=== Iniciando Servidor de Urbaniza2 ===" -ForegroundColor Green
Write-Host ""

# Verificar si XAMPP esta instalado
if (Test-Path "C:\xampp\php\php.exe") {
    Write-Host "XAMPP encontrado" -ForegroundColor Green
} else {
    Write-Host "XAMPP no encontrado. Instala XAMPP primero." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Iniciando servidor del sitio web..." -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor del sitio web estatico desde la raiz
Write-Host "Sitio Web: http://localhost:3000" -ForegroundColor Cyan

# Iniciar servidor en segundo plano sin ventana adicional
$serverProcess = Start-Process "C:\xampp\php\php.exe" -ArgumentList "-S", "localhost:3000" -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== Servidor Iniciado ===" -ForegroundColor Green
Write-Host "Sitio Web: http://localhost:3000" -ForegroundColor White
Write-Host "Proceso ID: $($serverProcess.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Para detener el servidor, ejecuta: Stop-Process -Id $($serverProcess.Id)" -ForegroundColor Yellow
Write-Host ""

# Abrir navegador automaticamente
Write-Host "Abriendo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host "Listo! El servidor esta ejecutandose." -ForegroundColor Green