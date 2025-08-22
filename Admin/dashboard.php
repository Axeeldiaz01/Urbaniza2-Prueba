<?php
session_start();
include 'config/database.php';
checkAdminSession();

// Obtener estadísticas
$stats = [];

// Total de terrenos
$stmt = $pdo->query("SELECT COUNT(*) as total FROM terrenos");
$stats['total_terrenos'] = $stmt->fetch()['total'];

// Terrenos disponibles
$stmt = $pdo->query("SELECT COUNT(*) as total FROM terrenos WHERE estado = 'disponible'");
$stats['terrenos_disponibles'] = $stmt->fetch()['total'];

// Terrenos vendidos
$stmt = $pdo->query("SELECT COUNT(*) as total FROM terrenos WHERE estado = 'vendido'");
$stats['terrenos_vendidos'] = $stmt->fetch()['total'];

// Consultas pendientes
$stmt = $pdo->query("SELECT COUNT(*) as total FROM consultas WHERE estado = 'pendiente'");
$stats['consultas_pendientes'] = $stmt->fetch()['total'];

// Ventas del mes
$stmt = $pdo->query("SELECT COUNT(*) as total, SUM(precio_venta) as monto FROM ventas WHERE MONTH(fecha_venta) = MONTH(CURRENT_DATE()) AND YEAR(fecha_venta) = YEAR(CURRENT_DATE())");
$ventas_mes = $stmt->fetch();
$stats['ventas_mes'] = $ventas_mes['total'] ?? 0;
$stats['monto_ventas_mes'] = $ventas_mes['monto'] ?? 0;

// Últimas consultas
$stmt = $pdo->query("SELECT * FROM consultas ORDER BY fecha_consulta DESC LIMIT 5");
$ultimas_consultas = $stmt->fetchAll();

// Terrenos más consultados (sin relación con consultas por ahora)
$stmt = $pdo->query("SELECT nombre as titulo, precio, ubicacion FROM terrenos ORDER BY id DESC LIMIT 5");
$terrenos_populares = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Urbaniza2 Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .sidebar {
            background: linear-gradient(135deg, #2c3e50, #3498db);
            min-height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        .sidebar .nav-link {
            color: rgba(255, 255, 255, 0.8);
            padding: 12px 20px;
            border-radius: 8px;
            margin: 2px 10px;
            transition: all 0.3s ease;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            transform: translateX(5px);
        }
        .main-content {
            margin-left: 250px;
            padding: 20px;
        }
        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            border-left: 4px solid;
            transition: transform 0.3s ease;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .stat-card.primary { border-left-color: #3498db; }
        .stat-card.success { border-left-color: #27ae60; }
        .stat-card.warning { border-left-color: #f39c12; }
        .stat-card.danger { border-left-color: #e74c3c; }
        .stat-card.info { border-left-color: #9b59b6; }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-icon {
            font-size: 3rem;
            opacity: 0.3;
            position: absolute;
            right: 20px;
            top: 20px;
        }
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        .table th {
            border-top: none;
            font-weight: 600;
            color: #2c3e50;
        }
        .badge {
            font-size: 0.75rem;
            padding: 6px 12px;
        }
        .navbar {
            background: white !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <nav class="sidebar">
        <div class="p-4">
            <h4 class="text-white mb-4">
                <i class="fas fa-building"></i> Urbaniza2
            </h4>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link active" href="dashboard.php">
                    <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="terrenos.php">
                    <i class="fas fa-map-marked-alt me-2"></i> Terrenos
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="consultas.php">
                    <i class="fas fa-comments me-2"></i> Consultas
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="solicitudes_compra.php">
                    <i class="fas fa-shopping-cart me-2"></i> Solicitudes de Compra
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="ventas.php">
                    <i class="fas fa-handshake me-2"></i> Ventas
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="clientes.php">
                    <i class="fas fa-users me-2"></i> Clientes
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="reportes.php">
                    <i class="fas fa-chart-bar me-2"></i> Reportes
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="configuracion.php">
                    <i class="fas fa-cog me-2"></i> Configuración
                </a>
            </li>
            <li class="nav-item mt-4">
                <a class="nav-link" href="logout.php">
                    <i class="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                </a>
            </li>
        </ul>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Top Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white mb-4">
            <div class="container-fluid">
                <h5 class="mb-0">Dashboard</h5>
                <div class="navbar-nav ms-auto">
                    <span class="navbar-text">
                        <i class="fas fa-user-circle me-2"></i>
                        Bienvenido, <?= htmlspecialchars($_SESSION['admin_name']) ?>
                    </span>
                </div>
            </div>
        </nav>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-2">
                <div class="stat-card primary position-relative">
                    <div class="stat-number text-primary"><?= $stats['total_terrenos'] ?></div>
                    <div class="stat-label">Total Terrenos</div>
                    <i class="fas fa-map-marked-alt stat-icon text-primary"></i>
                </div>
            </div>
            <div class="col-md-2">
                <div class="stat-card success position-relative">
                    <div class="stat-number text-success"><?= $stats['terrenos_disponibles'] ?></div>
                    <div class="stat-label">Disponibles</div>
                    <i class="fas fa-check-circle stat-icon text-success"></i>
                </div>
            </div>
            <div class="col-md-2">
                <div class="stat-card info position-relative">
                    <div class="stat-number text-info"><?= $stats['terrenos_vendidos'] ?></div>
                    <div class="stat-label">Vendidos</div>
                    <i class="fas fa-handshake stat-icon text-info"></i>
                </div>
            </div>
            <div class="col-md-2">
                <div class="stat-card warning position-relative">
                    <div class="stat-number text-warning"><?= $stats['consultas_pendientes'] ?></div>
                    <div class="stat-label">Consultas Pendientes</div>
                    <i class="fas fa-clock stat-icon text-warning"></i>
                </div>
            </div>
            <div class="col-md-2">
                <div class="stat-card danger position-relative">
                    <div class="stat-number text-danger"><?= $stats['ventas_mes'] ?></div>
                    <div class="stat-label">Ventas Este Mes</div>
                    <i class="fas fa-chart-line stat-icon text-danger"></i>
                </div>
            </div>
            <div class="col-md-2">
                <div class="stat-card primary position-relative">
                    <div class="stat-number text-primary"><?= formatPrice($stats['monto_ventas_mes']) ?></div>
                    <div class="stat-label">Ingresos del Mes</div>
                    <i class="fas fa-dollar-sign stat-icon text-primary"></i>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Últimas Consultas -->
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-transparent">
                        <h5 class="mb-0">
                            <i class="fas fa-comments text-primary me-2"></i>
                            Últimas Consultas
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Terreno</th>
                                        <th>Tipo</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($ultimas_consultas as $consulta): ?>
                                    <tr>
                                        <td>
                                            <strong><?= htmlspecialchars($consulta['nombre']) ?></strong><br>
                                            <small class="text-muted"><?= htmlspecialchars($consulta['email']) ?></small>
                                        </td>
                                        <td>Consulta General</td>
                                        <td>
                                            <span class="badge bg-info">
                                                General
                                            </span>
                                        </td>
                                        <td>
                                            <?php
                                            $badge_class = match($consulta['estado']) {
                                'pendiente' => 'bg-warning',
                                'respondida' => 'bg-success',
                                'cerrada' => 'bg-secondary',
                                'contactado' => 'bg-info',
                                'interesado' => 'bg-success',
                                'no_interesado' => 'bg-secondary',
                                'vendido' => 'bg-primary',
                                default => 'bg-secondary'
                            };
                                            ?>
                                            <span class="badge <?= $badge_class ?>">
                                                <?= ucfirst($consulta['estado']) ?>
                                            </span>
                                        </td>
                                        <td><?= formatDate($consulta['fecha_consulta']) ?></td>
                                        <td>
                                            <a href="consultas.php?id=<?= $consulta['id'] ?>" class="btn btn-sm btn-outline-primary">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-center">
                            <a href="consultas.php" class="btn btn-primary">Ver Todas las Consultas</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Terrenos Más Populares -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-transparent">
                        <h5 class="mb-0">
                            <i class="fas fa-star text-warning me-2"></i>
                            Terrenos Más Consultados
                        </h5>
                    </div>
                    <div class="card-body">
                        <?php foreach ($terrenos_populares as $terreno): ?>
                        <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                            <div>
                                <strong><?= htmlspecialchars($terreno['titulo']) ?></strong><br>
                                <small class="text-muted"><?= htmlspecialchars($terreno['ubicacion']) ?></small><br>
                                <span class="text-primary fw-bold"><?= formatPrice($terreno['precio']) ?></span>
                            </div>
                            <div class="text-center">
                                <span class="badge bg-primary rounded-pill">0</span><br>
                                <small class="text-muted">consultas</small>
                            </div>
                        </div>
                        <?php endforeach; ?>
                        <div class="text-center">
                            <a href="terrenos.php" class="btn btn-outline-primary btn-sm">Ver Todos</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</body>
</html>