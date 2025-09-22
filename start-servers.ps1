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
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; C:\xampp\php\php.exe -S localhost:3000"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== Servidor Iniciado ===" -ForegroundColor Green
Write-Host "Sitio Web: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C en la ventana del servidor para detenerlo" -ForegroundColor Yellow
Write-Host ""

# Abrir navegador automaticamente
Write-Host "Abriendo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host "Listo! El servidor esta ejecutandose." -ForegroundColor Green