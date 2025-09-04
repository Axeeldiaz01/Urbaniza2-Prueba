<?php
session_start();
include '../config/database.php';
checkAdminSession();

// Procesar acciones
if ($_POST) {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'update_estado':
                // Obtener valores actuales antes de la actualización
                $stmt = $pdo->prepare("SELECT estado, prioridad, notas_admin FROM consultas WHERE id = ?");
                $stmt->execute([intval($_POST['id'])]);
                $valores_anteriores = $stmt->fetch();
                
                // Actualizar la consulta
                $stmt = $pdo->prepare("UPDATE consultas SET estado = ?, prioridad = ?, notas_admin = ?, atendido_por = ?, fecha_contacto = NOW() WHERE id = ?");
                $stmt->execute([
                    sanitize($_POST['estado']),
                    sanitize($_POST['prioridad']),
                    sanitize($_POST['notas_admin']),
                    $_SESSION['admin_id'],
                    intval($_POST['id'])
                ]);
                
                // Registrar cambios en el historial
                $consulta_id = intval($_POST['id']);
                
                // Registrar cambio de estado si es diferente
                if ($valores_anteriores['estado'] !== $_POST['estado']) {
                    $stmt = $pdo->prepare("
                        INSERT INTO historial_consultas 
                        (consulta_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por, comentario) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $consulta_id,
                        'Estado',
                        $valores_anteriores['estado'],
                        $_POST['estado'],
                        $_SESSION['admin_id'],
                        'Estado actualizado desde el panel de administración'
                    ]);
                }
                
                // Registrar cambio de prioridad si es diferente
                if ($valores_anteriores['prioridad'] !== $_POST['prioridad']) {
                    $stmt = $pdo->prepare("
                        INSERT INTO historial_consultas 
                        (consulta_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por, comentario) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $consulta_id,
                        'Prioridad',
                        $valores_anteriores['prioridad'],
                        $_POST['prioridad'],
                        $_SESSION['admin_id'],
                        'Prioridad actualizada desde el panel de administración'
                    ]);
                }
                
                // Registrar cambio de notas si es diferente
                if ($valores_anteriores['notas_admin'] !== $_POST['notas_admin']) {
                    $stmt = $pdo->prepare("
                        INSERT INTO historial_consultas 
                        (consulta_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por, comentario) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $consulta_id,
                        'Notas del Administrador',
                        $valores_anteriores['notas_admin'],
                        $_POST['notas_admin'],
                        $_SESSION['admin_id'],
                        'Notas actualizadas desde el panel de administración'
                    ]);
                }
                
                $success = "Consulta actualizada exitosamente";
                break;
                
            case 'delete':
                $stmt = $pdo->prepare("DELETE FROM consultas WHERE id = ?");
                $stmt->execute([intval($_POST['id'])]);
                $success = "Consulta eliminada exitosamente";
                break;
        }
    }
}

// Obtener consultas con filtros
$where = "1=1";
$params = [];

if (isset($_GET['estado']) && $_GET['estado'] !== '') {
    $where .= " AND c.estado = ?";
    $params[] = $_GET['estado'];
}

if (isset($_GET['tipo']) && $_GET['tipo'] !== '') {
    $where .= " AND c.tipo_consulta = ?";
    $params[] = $_GET['tipo'];
}

if (isset($_GET['search']) && $_GET['search'] !== '') {
    $where .= " AND (c.nombre LIKE ? OR c.email LIKE ? OR c.mensaje LIKE ?)";
    $search = '%' . $_GET['search'] . '%';
    $params[] = $search;
    $params[] = $search;
    $params[] = $search;
}

$stmt = $pdo->prepare("
    SELECT c.* 
    FROM consultas c 
    WHERE $where 
    ORDER BY c.fecha_consulta DESC
");
$stmt->execute($params);
$consultas = $stmt->fetchAll();

// Obtener consulta para ver detalles
$consulta_detalle = null;
if (isset($_GET['id'])) {
    $stmt = $pdo->prepare("
        SELECT c.* 
        FROM consultas c 
        WHERE c.id = ?
    ");
    $stmt->execute([intval($_GET['id'])]);
    $consulta_detalle = $stmt->fetch();
}

// Obtener terrenos para el select
$stmt = $pdo->query("SELECT id, nombre FROM terrenos WHERE estado = 'disponible' ORDER BY nombre");
$terrenos_disponibles = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Consultas - Urbaniza2 Admin</title>
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
        }
        .sidebar .nav-link {
            color: rgba(255, 255, 255, 0.8);
            padding: 12px 20px;
            border-radius: 8px;
            margin: 2px 10px;
            transition: all 0.3s ease;
        }
        .sidebar .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            transform: translateX(5px);
        }
        .sidebar .nav-link.active {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        .main-content {
            margin-left: 250px;
            padding: 20px;
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
        .btn-action {
            padding: 5px 10px;
            margin: 2px;
        }
        .priority-alta { border-left: 4px solid #dc3545; }
            .priority-media { border-left: 4px solid #ffc107; }
            .priority-baja { border-left: 4px solid #28a745; }
            
            /* Animaciones para notificaciones */
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            /* Estilos para las tarjetas de estadísticas */
             .card.bg-primary:hover,
             .card.bg-warning:hover,
             .card.bg-info:hover,
             .card.bg-success:hover,
             .card.bg-dark:hover,
             .card.bg-secondary:hover {
                 transform: translateY(-2px);
                 box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                 transition: all 0.3s ease;
             }
             
             /* Estilos para la línea de tiempo del historial */
             .timeline {
                 position: relative;
                 padding-left: 30px;
             }
             
             .timeline::before {
                 content: '';
                 position: absolute;
                 left: 15px;
                 top: 0;
                 bottom: 0;
                 width: 2px;
                 background: #dee2e6;
             }
             
             .timeline-item {
                 position: relative;
                 margin-bottom: 20px;
                 padding-bottom: 20px;
             }
             
             .timeline-item:last-child {
                 margin-bottom: 0;
                 padding-bottom: 0;
             }
             
             .timeline-marker {
                 position: absolute;
                 left: -22px;
                 top: 5px;
                 width: 14px;
                 height: 14px;
                 background: #6c757d;
                 border-radius: 50%;
                 display: flex;
                 align-items: center;
                 justify-content: center;
             }
             
             .timeline-item.latest .timeline-marker {
                 background: #0d6efd;
             }
             
             .timeline-marker i {
                 font-size: 6px;
                 color: white;
             }
             
             .timeline-content {
                 background: #f8f9fa;
                 border-radius: 8px;
                 padding: 15px;
                 border-left: 3px solid #dee2e6;
             }
             
             .timeline-item.latest .timeline-content {
                 border-left-color: #0d6efd;
             }
             
             .timeline-header h6 {
                 color: #495057;
                 font-weight: 600;
                 text-transform: capitalize;
             }
             
             .timeline-body p {
                 margin-bottom: 8px;
                 font-size: 14px;
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
                <a class="nav-link" href="dashboard.php">
                    <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="terrenos.php">
                    <i class="fas fa-map-marked-alt me-2"></i> Terrenos
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="consultas.php">
                    <i class="fas fa-comments me-2"></i> Consultas
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
                <h5 class="mb-0">Gestión de Consultas</h5>
                <div class="navbar-nav ms-auto">
                    <span class="navbar-text">
                        <i class="fas fa-comments me-2"></i>
                        Total: <?= count($consultas) ?> consultas
                    </span>
                </div>
            </div>
        </nav>

        <!-- Dashboard de Estadísticas -->
        <div class="row mb-4">
            <?php
            // Calcular estadísticas
            $total_consultas = count($consultas);
            $consultas_pendientes = count(array_filter($consultas, fn($c) => $c['estado'] === 'pendiente'));
            $consultas_contactadas = count(array_filter($consultas, fn($c) => $c['estado'] === 'contactado'));
            $consultas_interesadas = count(array_filter($consultas, fn($c) => $c['estado'] === 'interesado'));
            $consultas_vendidas = count(array_filter($consultas, fn($c) => $c['estado'] === 'vendido'));
            
            // Consultas de hoy
            $hoy = date('Y-m-d');
            $consultas_hoy = count(array_filter($consultas, fn($c) => date('Y-m-d', strtotime($c['fecha_consulta'])) === $hoy));
            ?>
            
            <div class="col-md-2">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4><?= $total_consultas ?></h4>
                                <p class="mb-0">Total</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-comments fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-2">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4><?= $consultas_pendientes ?></h4>
                                <p class="mb-0">Pendientes</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clock fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-2">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4><?= $consultas_contactadas ?></h4>
                                <p class="mb-0">Contactadas</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-phone fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-2">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4><?= $consultas_interesadas ?></h4>
                                <p class="mb-0">Interesadas</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-heart fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-2">
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4><?= $consultas_vendidas ?></h4>
                                <p class="mb-0">Vendidas</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-handshake fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-2">
                <div class="card bg-secondary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4><?= $consultas_hoy ?></h4>
                                <p class="mb-0">Hoy</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-calendar-day fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php if (isset($success)): ?>
            <div class="alert alert-success alert-dismissible fade show">
                <i class="fas fa-check-circle me-2"></i><?= $success ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <!-- Filtros -->
        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Buscar</label>
                        <input type="text" class="form-control" name="search" 
                               value="<?= htmlspecialchars($_GET['search'] ?? '') ?>" 
                               placeholder="Nombre, email o mensaje...">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Estado</label>
                        <select class="form-select" name="estado">
                            <option value="">Todos</option>
                            <option value="pendiente" <?= ($_GET['estado'] ?? '') === 'pendiente' ? 'selected' : '' ?>>Pendiente</option>
                            <option value="contactado" <?= ($_GET['estado'] ?? '') === 'contactado' ? 'selected' : '' ?>>Contactado</option>
                            <option value="interesado" <?= ($_GET['estado'] ?? '') === 'interesado' ? 'selected' : '' ?>>Interesado</option>
                            <option value="no_interesado" <?= ($_GET['estado'] ?? '') === 'no_interesado' ? 'selected' : '' ?>>No Interesado</option>
                            <option value="vendido" <?= ($_GET['estado'] ?? '') === 'vendido' ? 'selected' : '' ?>>Vendido</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Tipo</label>
                        <select class="form-select" name="tipo">
                            <option value="">Todos</option>
                            <option value="informacion" <?= ($_GET['tipo'] ?? '') === 'informacion' ? 'selected' : '' ?>>Información</option>
                            <option value="visita" <?= ($_GET['tipo'] ?? '') === 'visita' ? 'selected' : '' ?>>Visita</option>
                            <option value="financiamiento" <?= ($_GET['tipo'] ?? '') === 'financiamiento' ? 'selected' : '' ?>>Financiamiento</option>
                            <option value="compra" <?= ($_GET['tipo'] ?? '') === 'compra' ? 'selected' : '' ?>>Compra</option>
                        </select>
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary me-2">
                            <i class="fas fa-search"></i> Filtrar
                        </button>
                        <a href="consultas.php" class="btn btn-outline-secondary">
                            <i class="fas fa-times"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Lista de Consultas -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Lista de Consultas</h5>
                <div class="btn-group">
                    <button type="button" class="btn btn-success btn-sm" onclick="exportarConsultas('excel')">
                        <i class="fas fa-file-excel"></i> Exportar Excel
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="exportarConsultas('pdf')">
                        <i class="fas fa-file-pdf"></i> Exportar PDF
                    </button>
                </div>
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
                                <th>Prioridad</th>
                                <th>Fecha</th>
                                <th>Atendido por</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($consultas as $consulta): ?>
                            <tr>
                                <td>
                                    <strong><?= htmlspecialchars($consulta['nombre']) ?></strong><br>
                                    <small class="text-muted">
                                        <i class="fas fa-envelope me-1"></i><?= htmlspecialchars($consulta['email']) ?>
                                    </small>
                                    <?php if ($consulta['telefono']): ?>
                                        <br><small class="text-muted">
                                            <i class="fas fa-phone me-1"></i><?= htmlspecialchars($consulta['telefono']) ?>
                                        </small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <strong>Consulta General</strong>
                                </td>
                                <td>
                                    <span class="badge bg-info">
                                        General
                                    </span>
                                </td>
                                <td>
                                    <?php
                                    $badge_class = match($consulta['estado']) {
                                        'pendiente' => 'bg-warning',
                                        'contactado' => 'bg-info',
                                        'interesado' => 'bg-success',
                                        'no_interesado' => 'bg-secondary',
                                        'vendido' => 'bg-primary',
                                        'respondida' => 'bg-info',
                                        'cerrada' => 'bg-secondary',
                                        default => 'bg-secondary'
                                    };
                                    ?>
                                    <span class="badge <?= $badge_class ?>">
                                        <?= ucfirst(str_replace('_', ' ', $consulta['estado'])) ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="text-muted">
                                        <i class="fas fa-flag"></i> Normal
                                    </span>
                                </td>
                                <td><?= formatDate($consulta['fecha_consulta']) ?></td>
                                <td>
                                     <span class="text-muted">Sin asignar</span>
                                 </td>
                                <td>
                                    <a href="?id=<?= $consulta['id'] ?>" class="btn btn-sm btn-outline-primary btn-action" 
                                       data-bs-toggle="modal" data-bs-target="#consultaModal">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <button class="btn btn-sm btn-outline-danger btn-action" 
                                            onclick="confirmarEliminar(<?= $consulta['id'] ?>, '<?= htmlspecialchars($consulta['nombre']) ?>')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Ver/Editar Consulta -->
    <?php if ($consulta_detalle): ?>
    <div class="modal fade" id="consultaModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalle de Consulta</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Pestañas del modal -->
                    <ul class="nav nav-tabs mb-3" id="consultaTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="detalle-tab" data-bs-toggle="tab" data-bs-target="#detalle" type="button" role="tab">
                                <i class="fas fa-info-circle me-1"></i>Detalle
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="historial-tab" data-bs-toggle="tab" data-bs-target="#historial" type="button" role="tab">
                                <i class="fas fa-history me-1"></i>Historial
                            </button>
                        </li>
                    </ul>
                    
                    <div class="tab-content" id="consultaTabContent">
                        <!-- Pestaña de Detalle -->
                        <div class="tab-pane fade show active" id="detalle" role="tabpanel">
                            <div class="row mb-4">
                        <div class="col-md-6">
                            <h6 class="text-muted">INFORMACIÓN DEL CLIENTE</h6>
                            <p><strong>Nombre:</strong> <?= htmlspecialchars($consulta_detalle['nombre']) ?></p>
                            <p><strong>Email:</strong> <?= htmlspecialchars($consulta_detalle['email']) ?></p>
                            <?php if ($consulta_detalle['telefono']): ?>
                                <p><strong>Teléfono:</strong> <?= htmlspecialchars($consulta_detalle['telefono']) ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-muted">INFORMACIÓN DE LA CONSULTA</h6>
                            <p><strong>Tipo:</strong> <?= ucfirst($consulta_detalle['tipo_consulta']) ?></p>
                            <p><strong>Fecha:</strong> <?= formatDate($consulta_detalle['fecha_consulta']) ?></p>
                            <p><strong>Categoría:</strong> Consulta General</p>
                        </div>
                    </div>
                    
                    <?php if ($consulta_detalle['mensaje']): ?>
                    <div class="mb-4">
                        <h6 class="text-muted">MENSAJE</h6>
                        <div class="bg-light p-3 rounded">
                            <?= nl2br(htmlspecialchars($consulta_detalle['mensaje'])) ?>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <form method="POST">
                        <input type="hidden" name="action" value="update_estado">
                        <input type="hidden" name="id" value="<?= $consulta_detalle['id'] ?>">
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Estado</label>
                                <select class="form-select" name="estado" required>
                                    <option value="pendiente" <?= $consulta_detalle['estado'] === 'pendiente' ? 'selected' : '' ?>>Pendiente</option>
                                    <option value="contactado" <?= $consulta_detalle['estado'] === 'contactado' ? 'selected' : '' ?>>Contactado</option>
                                    <option value="interesado" <?= $consulta_detalle['estado'] === 'interesado' ? 'selected' : '' ?>>Interesado</option>
                                    <option value="no_interesado" <?= $consulta_detalle['estado'] === 'no_interesado' ? 'selected' : '' ?>>No Interesado</option>
                                    <option value="vendido" <?= $consulta_detalle['estado'] === 'vendido' ? 'selected' : '' ?>>Vendido</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Prioridad</label>
                                <select class="form-select" name="prioridad">
                                    <option value="baja" <?= $consulta_detalle['prioridad'] === 'baja' ? 'selected' : '' ?>>Baja</option>
                                    <option value="media" <?= $consulta_detalle['prioridad'] === 'media' ? 'selected' : '' ?>>Media</option>
                                    <option value="alta" <?= $consulta_detalle['prioridad'] === 'alta' ? 'selected' : '' ?>>Alta</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Notas del Administrador</label>
                            <textarea class="form-control" name="notas_admin" rows="4" 
                                      placeholder="Agregar notas sobre el seguimiento de esta consulta..."><?= htmlspecialchars($consulta_detalle['notas_admin'] ?? '') ?></textarea>
                        </div>
                        
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-outline-info btn-sm" onclick="enviarEmail(<?= $consulta_detalle['id'] ?>, 'confirmacion')">
                                        <i class="fas fa-envelope me-1"></i>Email Confirmación
                                    </button>
                                    <button type="button" class="btn btn-outline-success btn-sm" onclick="enviarEmail(<?= $consulta_detalle['id'] ?>, 'contactado')">
                                        <i class="fas fa-paper-plane me-1"></i>Email Contactado
                                    </button>
                                    <button type="button" class="btn btn-outline-warning btn-sm" onclick="enviarEmail(<?= $consulta_detalle['id'] ?>, 'seguimiento')">
                                        <i class="fas fa-clock me-1"></i>Email Seguimiento
                                    </button>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="submit" class="btn btn-primary">Actualizar</button>
                                </div>
                            </div>
                        </form>
                        </div>
                        
                        <!-- Pestaña de Historial -->
                        <div class="tab-pane fade" id="historial" role="tabpanel">
                            <div id="historialContent">
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                    <p class="mt-2 text-muted">Cargando historial...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Form para eliminar -->
    <form id="deleteForm" method="POST" style="display: none;">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="id" id="deleteId">
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function confirmarEliminar(id, nombre) {
            if (confirm(`¿Está seguro de eliminar la consulta de "${nombre}"?`)) {
                document.getElementById('deleteId').value = id;
                document.getElementById('deleteForm').submit();
            }
        }

        // Función para exportar consultas
        function exportarConsultas(formato) {
            const params = new URLSearchParams(window.location.search);
            params.set('export', formato);
            
            const url = 'export_consultas.php?' + params.toString();
            window.open(url, '_blank');
        }
        
        // Función para cargar historial de consulta
        function cargarHistorial(consultaId) {
            const historialContent = document.getElementById('historialContent');
            
            fetch(`api/historial_consultas.php?consulta_id=${consultaId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        mostrarHistorial(data.historial);
                    } else {
                        historialContent.innerHTML = `
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                No se pudo cargar el historial: ${data.error}
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    historialContent.innerHTML = `
                        <div class="alert alert-danger">
                            <i class="fas fa-times-circle me-2"></i>
                            Error al cargar el historial
                        </div>
                    `;
                });
        }
        
        // Función para mostrar el historial
        function mostrarHistorial(historial) {
            const historialContent = document.getElementById('historialContent');
            
            if (historial.length === 0) {
                historialContent.innerHTML = `
                    <div class="text-center py-4">
                        <i class="fas fa-history fa-3x text-muted mb-3"></i>
                        <p class="text-muted">No hay cambios registrados para esta consulta</p>
                    </div>
                `;
                return;
            }
            
            let historialHtml = '<div class="timeline">';
            
            historial.forEach((item, index) => {
                const fecha = new Date(item.fecha_modificacion).toLocaleString('es-PE');
                const adminNombre = item.admin_nombre || 'Sistema';
                
                historialHtml += `
                    <div class="timeline-item ${index === 0 ? 'latest' : ''}">
                        <div class="timeline-marker">
                            <i class="fas fa-circle"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h6 class="mb-1">${item.campo_modificado}</h6>
                                <small class="text-muted">
                                    <i class="fas fa-user me-1"></i>${adminNombre} • 
                                    <i class="fas fa-clock me-1"></i>${fecha}
                                </small>
                            </div>
                            <div class="timeline-body">
                                ${item.valor_anterior ? `<p class="mb-1"><strong>Anterior:</strong> <span class="text-danger">${item.valor_anterior}</span></p>` : ''}
                                ${item.valor_nuevo ? `<p class="mb-1"><strong>Nuevo:</strong> <span class="text-success">${item.valor_nuevo}</span></p>` : ''}
                                ${item.comentario ? `<p class="mb-0"><strong>Comentario:</strong> ${item.comentario}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            historialHtml += '</div>';
            historialContent.innerHTML = historialHtml;
        }
        
        // Event listener para la pestaña de historial
         document.addEventListener('DOMContentLoaded', function() {
             const historialTab = document.getElementById('historial-tab');
             if (historialTab) {
                 historialTab.addEventListener('click', function() {
                     const consultaId = <?= $consulta_detalle ? $consulta_detalle['id'] : 'null' ?>;
                     if (consultaId) {
                         cargarHistorial(consultaId);
                     }
                 });
             }
         });
         
         // Función para enviar emails automáticos
         function enviarEmail(consultaId, tipoRespuesta) {
             if (!confirm(`¿Estás seguro de enviar un email de ${tipoRespuesta} al cliente?`)) {
                 return;
             }
             
             // Mostrar loading en el botón
             const botones = document.querySelectorAll('.btn-group button');
             botones.forEach(btn => {
                 btn.disabled = true;
                 if (btn.textContent.includes(tipoRespuesta)) {
                     btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Enviando...';
                 }
             });
             
             fetch('api/email_respuestas.php', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({
                     consulta_id: consultaId,
                     tipo_respuesta: tipoRespuesta
                 })
             })
             .then(response => response.json())
             .then(data => {
                 if (data.success) {
                     mostrarToast('Email enviado exitosamente', 'success');
                     // Recargar historial si está visible
                     const historialTab = document.getElementById('historial-tab');
                     if (historialTab && historialTab.classList.contains('active')) {
                         cargarHistorial(consultaId);
                     }
                 } else {
                     mostrarToast('Error al enviar email: ' + data.error, 'error');
                 }
             })
             .catch(error => {
                 console.error('Error:', error);
                 mostrarToast('Error al enviar email', 'error');
             })
             .finally(() => {
                 // Restaurar botones
                 botones.forEach(btn => {
                     btn.disabled = false;
                 });
                 
                 // Restaurar textos originales
                 document.querySelector('.btn-outline-info').innerHTML = '<i class="fas fa-envelope me-1"></i>Email Confirmación';
                 document.querySelector('.btn-outline-success').innerHTML = '<i class="fas fa-paper-plane me-1"></i>Email Contactado';
                 document.querySelector('.btn-outline-warning').innerHTML = '<i class="fas fa-clock me-1"></i>Email Seguimiento';
             });
         }
        
        // Sistema de notificaciones en tiempo real
        let notificacionesInterval;
        let ultimaVerificacion = Math.floor(Date.now() / 1000);
        
        function verificarNotificaciones() {
            fetch('api/notificaciones.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Actualizar badge de notificaciones
                        actualizarBadgeNotificaciones(data.total_pendientes);
                        
                        // Mostrar notificaciones de nuevas consultas
                        if (data.nuevas_consultas.length > 0) {
                            mostrarNotificacionNuevaConsulta(data.nuevas_consultas);
                        }
                        
                        // Alertar sobre consultas de alta prioridad sin atender
                        if (data.alta_prioridad_sin_atender.length > 0) {
                            mostrarAlertaAltaPrioridad(data.alta_prioridad_sin_atender);
                        }
                        
                        ultimaVerificacion = data.timestamp;
                    }
                })
                .catch(error => console.error('Error al verificar notificaciones:', error));
        }
        
        function actualizarBadgeNotificaciones(total) {
            let badge = document.getElementById('badge-notificaciones');
            if (!badge) {
                // Crear badge si no existe
                badge = document.createElement('span');
                badge.id = 'badge-notificaciones';
                badge.className = 'badge bg-danger';
                badge.style.cssText = 'position: absolute; top: -8px; right: -8px; font-size: 10px;';
                
                const consultasLink = document.querySelector('a[href="consultas.php"]');
                if (consultasLink) {
                    consultasLink.style.position = 'relative';
                    consultasLink.appendChild(badge);
                }
            }
            
            if (total > 0) {
                badge.textContent = total;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        }
        
        function mostrarNotificacionNuevaConsulta(consultas) {
            consultas.forEach(consulta => {
                mostrarToast(
                    'Nueva Consulta',
                    `${consulta.nombre} ha enviado una consulta general`,
                    'info'
                );
            });
        }
        
        function mostrarAlertaAltaPrioridad(consultas) {
            const count = consultas.length;
            mostrarToast(
                'Atención Requerida',
                `Tienes ${count} consulta${count > 1 ? 's' : ''} de alta prioridad sin atender`,
                'warning'
            );
        }
        
        function mostrarToast(titulo, mensaje, tipo = 'info') {
            // Crear contenedor de toasts si no existe
            let toastContainer = document.getElementById('toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                toastContainer.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    max-width: 350px;
                `;
                document.body.appendChild(toastContainer);
            }
            
            // Crear toast
            const toast = document.createElement('div');
            const bgColor = tipo === 'info' ? '#17a2b8' : tipo === 'warning' ? '#ffc107' : '#28a745';
            toast.style.cssText = `
                background: ${bgColor};
                color: white;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease;
            `;
            
            toast.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <strong>${titulo}</strong><br>
                        <small>${mensaje}</small>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">
                        ×
                    </button>
                </div>
            `;
            
            toastContainer.appendChild(toast);
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        }
        
        // Iniciar verificación de notificaciones
        document.addEventListener('DOMContentLoaded', function() {
            verificarNotificaciones();
            notificacionesInterval = setInterval(verificarNotificaciones, 30000); // Cada 30 segundos
        });
        
        // Limpiar interval al salir de la página
        window.addEventListener('beforeunload', function() {
            if (notificacionesInterval) {
                clearInterval(notificacionesInterval);
            }
        });

        <?php if ($consulta_detalle): ?>
        // Mostrar modal si hay consulta para ver
        document.addEventListener('DOMContentLoaded', function() {
            new bootstrap.Modal(document.getElementById('consultaModal')).show();
        });
        <?php endif; ?>
    </script>
</body>
</html>