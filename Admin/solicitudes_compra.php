<?php
session_start();
include 'config/database.php';
checkAdminSession();

// Procesar acciones
if ($_POST) {
    if (isset($_POST['action'])) {
        $id = $_POST['id'];
        $action = $_POST['action'];
        
        if ($action === 'aprobar') {
            $stmt = $pdo->prepare("UPDATE solicitudes_compra SET estado = 'aprobada' WHERE id = ?");
            $stmt->execute([$id]);
            $mensaje = "Solicitud aprobada exitosamente.";
        } elseif ($action === 'rechazar') {
            $stmt = $pdo->prepare("UPDATE solicitudes_compra SET estado = 'rechazada' WHERE id = ?");
            $stmt->execute([$id]);
            $mensaje = "Solicitud rechazada.";
        } elseif ($action === 'completar') {
            $stmt = $pdo->prepare("UPDATE solicitudes_compra SET estado = 'completada' WHERE id = ?");
            $stmt->execute([$id]);
            $mensaje = "Solicitud marcada como completada.";
        }
    }
}

// Obtener filtros
$filtro_estado = $_GET['estado'] ?? '';
$filtro_fecha = $_GET['fecha'] ?? '';

// Construir consulta
$where_conditions = [];
$params = [];

if ($filtro_estado) {
    $where_conditions[] = "s.estado = ?";
    $params[] = $filtro_estado;
}

if ($filtro_fecha) {
    $where_conditions[] = "DATE(s.fecha_solicitud) = ?";
    $params[] = $filtro_fecha;
}

$where_clause = $where_conditions ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Obtener solicitudes de compra
$sql = "
    SELECT s.*, t.nombre as terreno_nombre, t.precio as terreno_precio, t.ubicacion as terreno_ubicacion
    FROM solicitudes_compra s
    LEFT JOIN terrenos t ON s.terreno_id = t.id
    " . $where_clause . "
    ORDER BY s.fecha_solicitud DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$solicitudes = $stmt->fetchAll();

// Obtener estadísticas
$stats = [];
$stmt = $pdo->query("SELECT estado, COUNT(*) as total FROM solicitudes_compra GROUP BY estado");
while ($row = $stmt->fetch()) {
    $stats[$row['estado']] = $row['total'];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitudes de Compra - Urbaniza2 Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .sidebar {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .sidebar .nav-link {
            color: rgba(255,255,255,0.8);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            margin: 0.2rem 0;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            color: white;
            background-color: rgba(255,255,255,0.1);
        }
        .card {
            border: none;
            border-radius: 1rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
        }
        .badge-pendiente { background-color: #ffc107; }
        .badge-aprobada { background-color: #198754; }
        .badge-rechazada { background-color: #dc3545; }
        .badge-completada { background-color: #0d6efd; }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar p-0">
                <div class="p-3">
                    <h4 class="text-white mb-4">
                        <i class="fas fa-building"></i> Urbaniza2
                    </h4>
                    <nav class="nav flex-column">
                        <a class="nav-link" href="dashboard.php">
                            <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                        </a>
                        <a class="nav-link" href="terrenos.php">
                            <i class="fas fa-map me-2"></i> Terrenos
                        </a>
                        <a class="nav-link" href="consultas.php">
                            <i class="fas fa-comments me-2"></i> Consultas
                        </a>
                        <a class="nav-link active" href="solicitudes_compra.php">
                            <i class="fas fa-shopping-cart me-2"></i> Solicitudes de Compra
                        </a>
                        <a class="nav-link" href="logout.php">
                            <i class="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                        </a>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2><i class="fas fa-shopping-cart me-2"></i> Solicitudes de Compra</h2>
                </div>

                <?php if (isset($mensaje)): ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <?= htmlspecialchars($mensaje) ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php endif; ?>

                <!-- Estadísticas -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title text-warning">
                                    <i class="fas fa-clock"></i> Pendientes
                                </h5>
                                <h3><?= $stats['pendiente'] ?? 0 ?></h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title text-success">
                                    <i class="fas fa-check"></i> Aprobadas
                                </h5>
                                <h3><?= $stats['aprobada'] ?? 0 ?></h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title text-danger">
                                    <i class="fas fa-times"></i> Rechazadas
                                </h5>
                                <h3><?= $stats['rechazada'] ?? 0 ?></h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title text-primary">
                                    <i class="fas fa-flag-checkered"></i> Completadas
                                </h5>
                                <h3><?= $stats['completada'] ?? 0 ?></h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filtros -->
                <div class="card mb-4">
                    <div class="card-body">
                        <form method="GET" class="row g-3">
                            <div class="col-md-4">
                                <label for="estado" class="form-label">Estado</label>
                                <select class="form-select" name="estado" id="estado">
                                    <option value="">Todos los estados</option>
                                    <option value="pendiente" <?= $filtro_estado === 'pendiente' ? 'selected' : '' ?>>Pendiente</option>
                                    <option value="aprobada" <?= $filtro_estado === 'aprobada' ? 'selected' : '' ?>>Aprobada</option>
                                    <option value="rechazada" <?= $filtro_estado === 'rechazada' ? 'selected' : '' ?>>Rechazada</option>
                                    <option value="completada" <?= $filtro_estado === 'completada' ? 'selected' : '' ?>>Completada</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="fecha" class="form-label">Fecha</label>
                                <input type="date" class="form-control" name="fecha" id="fecha" value="<?= htmlspecialchars($filtro_fecha) ?>">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">&nbsp;</label>
                                <div>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-search"></i> Filtrar
                                    </button>
                                    <a href="solicitudes_compra.php" class="btn btn-secondary">
                                        <i class="fas fa-times"></i> Limpiar
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Lista de Solicitudes -->
                <div class="card">
                    <div class="card-body">
                        <?php if (empty($solicitudes)): ?>
                            <div class="text-center py-5">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <h5 class="text-muted">No hay solicitudes de compra</h5>
                                <p class="text-muted">Las solicitudes aparecerán aquí cuando los clientes envíen formularios de compra.</p>
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Cliente</th>
                                            <th>Terreno</th>
                                            <th>Tipo de Pago</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($solicitudes as $solicitud): ?>
                                            <tr>
                                                <td><?= $solicitud['id'] ?></td>
                                                <td>
                                                    <strong><?= htmlspecialchars($solicitud['nombre_cliente']) ?></strong><br>
                                                    <small class="text-muted">
                                                        <i class="fas fa-envelope"></i> <?= htmlspecialchars($solicitud['email_cliente']) ?><br>
                                                        <i class="fas fa-phone"></i> <?= htmlspecialchars($solicitud['telefono_cliente']) ?>
                                                    </small>
                                                </td>
                                                <td>
                                                    <strong><?= htmlspecialchars($solicitud['terreno_nombre']) ?></strong><br>
                                                    <small class="text-muted">
                                                        <i class="fas fa-map-marker-alt"></i> <?= htmlspecialchars($solicitud['terreno_ubicacion']) ?><br>
                                                        <i class="fas fa-dollar-sign"></i> S/ <?= number_format($solicitud['terreno_precio'], 2) ?>
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge bg-info"><?= ucfirst($solicitud['tipo_pago']) ?></span>
                                                </td>
                                                <td>
                                                    <?= date('d/m/Y H:i', strtotime($solicitud['fecha_solicitud'])) ?>
                                                </td>
                                                <td>
                                                    <span class="badge badge-<?= $solicitud['estado'] ?>">
                                                        <?= ucfirst($solicitud['estado']) ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="btn-group" role="group">
                                                        <?php if ($solicitud['estado'] === 'pendiente'): ?>
                                                            <form method="POST" style="display: inline;">
                                                                <input type="hidden" name="id" value="<?= $solicitud['id'] ?>">
                                                                <input type="hidden" name="action" value="aprobar">
                                                                <button type="submit" class="btn btn-sm btn-success" title="Aprobar">
                                                                    <i class="fas fa-check"></i>
                                                                </button>
                                                            </form>
                                                            <form method="POST" style="display: inline;">
                                                                <input type="hidden" name="id" value="<?= $solicitud['id'] ?>">
                                                                <input type="hidden" name="action" value="rechazar">
                                                                <button type="submit" class="btn btn-sm btn-danger" title="Rechazar">
                                                                    <i class="fas fa-times"></i>
                                                                </button>
                                                            </form>
                                                        <?php elseif ($solicitud['estado'] === 'aprobada'): ?>
                                                            <form method="POST" style="display: inline;">
                                                                <input type="hidden" name="id" value="<?= $solicitud['id'] ?>">
                                                                <input type="hidden" name="action" value="completar">
                                                                <button type="submit" class="btn btn-sm btn-primary" title="Marcar como completada">
                                                                    <i class="fas fa-flag-checkered"></i>
                                                                </button>
                                                            </form>
                                                        <?php endif; ?>
                                                        <button type="button" class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#detalleModal<?= $solicitud['id'] ?>" title="Ver detalles">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                    </div>

                                                    <!-- Modal de Detalles -->
                                                    <div class="modal fade" id="detalleModal<?= $solicitud['id'] ?>" tabindex="-1">
                                                        <div class="modal-dialog">
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title">Detalles de la Solicitud #<?= $solicitud['id'] ?></h5>
                                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                                </div>
                                                                <div class="modal-body">
                                                                    <div class="row">
                                                                        <div class="col-md-6">
                                                                            <h6>Información del Cliente</h6>
                                                                            <p><strong>Nombre:</strong> <?= htmlspecialchars($solicitud['nombre_cliente']) ?></p>
                                                                            <p><strong>Email:</strong> <?= htmlspecialchars($solicitud['email_cliente']) ?></p>
                                                                            <p><strong>Teléfono:</strong> <?= htmlspecialchars($solicitud['telefono_cliente']) ?></p>
                                                                        </div>
                                                                        <div class="col-md-6">
                                                                            <h6>Información del Terreno</h6>
                                                                            <p><strong>Nombre:</strong> <?= htmlspecialchars($solicitud['terreno_nombre']) ?></p>
                                                                            <p><strong>Ubicación:</strong> <?= htmlspecialchars($solicitud['terreno_ubicacion']) ?></p>
                                                                            <p><strong>Precio:</strong> S/ <?= number_format($solicitud['terreno_precio'], 2) ?></p>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-12">
                                                                            <h6>Detalles de la Solicitud</h6>
                                                                            <p><strong>Tipo de Pago:</strong> <?= ucfirst($solicitud['tipo_pago']) ?></p>
                                                                            <p><strong>Fecha:</strong> <?= date('d/m/Y H:i:s', strtotime($solicitud['fecha_solicitud'])) ?></p>
                                                                            <p><strong>Estado:</strong> <span class="badge badge-<?= $solicitud['estado'] ?>"><?= ucfirst($solicitud['estado']) ?></span></p>
                                                                            <?php if ($solicitud['mensaje']): ?>
                                                                                <p><strong>Mensaje:</strong></p>
                                                                                <p class="border p-2 bg-light"><?= nl2br(htmlspecialchars($solicitud['mensaje'])) ?></p>
                                                                            <?php endif; ?>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>