# Script para detener el servidor de Urbaniza2

Write-Host "=== Deteniendo Servidor de Urbaniza2 ===" -ForegroundColor Red
Write-Host ""

# Buscar procesos de PHP que esten ejecutando el servidor
$phpProcesses = Get-Process -Name "php" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*localhost:3000*" }

if ($phpProcesses) {
    foreach ($process in $phpProcesses) {
        Write-Host "Deteniendo proceso PHP (ID: $($process.Id))..." -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
        Write-Host "Proceso detenido." -ForegroundColor Green
    }
} else {
    Write-Host "No se encontraron servidores PHP ejecutandose en el puerto 3000." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Servidor Detenido ===" -ForegroundColor Green