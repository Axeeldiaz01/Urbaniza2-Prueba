# Script para iniciar ambos servidores de Urbaniza2

Write-Host "=== Iniciando Servidores de Urbaniza2 ===" -ForegroundColor Green
Write-Host ""

# Verificar si XAMPP está instalado
if (Test-Path "C:\xampp\php\php.exe") {
    Write-Host "✓ XAMPP encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ XAMPP no encontrado. Instala XAMPP primero." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Iniciando servidores..." -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor del sitio web público
Write-Host "🌐 Sitio Web Público: http://localhost:3000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; C:\xampp\php\php.exe -S localhost:3000 -t public"

Start-Sleep -Seconds 2

# Iniciar servidor del panel administrativo
Write-Host "🔧 Panel Administrativo: http://localhost:8080" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; C:\xampp\php\php.exe -S localhost:8080 -t Admin"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== Servidores Iniciados ===" -ForegroundColor Green
Write-Host "Sitio Web: http://localhost:3000" -ForegroundColor White
Write-Host "Admin Panel: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C en cada ventana para detener los servidores" -ForegroundColor Yellow
Write-Host ""

# Abrir navegadores automáticamente
Write-Host "Abriendo navegadores..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 2
Start-Process "http://localhost:8080"

Write-Host "¡Listo! Los servidores están ejecutándose." -ForegroundColor Green