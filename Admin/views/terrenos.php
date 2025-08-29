<?php
session_start();
include '../config/database.php';
checkAdminSession();

// Función para manejar la carga de imágenes
function handleImageUpload($file) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    
    // Usar rutas absolutas
    $adminUploadDir = __DIR__ . '/uploads/';
    $publicUploadDir = dirname(__DIR__, 2) . '/public/uploads/';
    
    // Crear directorios si no existen
    if (!is_dir($adminUploadDir)) {
        mkdir($adminUploadDir, 0755, true);
    }
    if (!is_dir($publicUploadDir)) {
        mkdir($publicUploadDir, 0755, true);
    }
    
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Tipo de archivo no permitido. Solo se permiten JPG, PNG y GIF.');
    }
    
    if ($file['size'] > $maxSize) {
        throw new Exception('El archivo es demasiado grande. Tamaño máximo: 5MB.');
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'terreno_' . time() . '_' . rand(1000, 9999) . '.' . $extension;
    $adminUploadPath = $adminUploadDir . $filename;
    $publicUploadPath = $publicUploadDir . $filename;
    
    // Subir archivo a Admin/uploads
    if (move_uploaded_file($file['tmp_name'], $adminUploadPath)) {
        // Copiar también a public/uploads para que sea accesible desde el sitio web
        if (copy($adminUploadPath, $publicUploadPath)) {
            return $filename;
        } else {
            // Si falla la copia, eliminar el archivo de admin y lanzar error
            unlink($adminUploadPath);
            throw new Exception('Error al sincronizar la imagen con el sitio web.');
        }
    }
    
    throw new Exception('Error al subir el archivo.');
}

// Procesar acciones
if ($_POST) {
    if (isset($_POST['action'])) {
        try {
            switch ($_POST['action']) {
                case 'add':
                    $imagen = null;
                    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                        $imagen = handleImageUpload($_FILES['imagen']);
                    }
                    
                    $stmt = $pdo->prepare("INSERT INTO terrenos (nombre, descripcion, precio, area, ubicacion, estado, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([
                        sanitize($_POST['nombre']),
                        sanitize($_POST['descripcion']),
                        floatval($_POST['precio']),
                        floatval($_POST['area']),
                        sanitize($_POST['ubicacion']),
                        sanitize($_POST['estado']),
                        $imagen
                    ]);
                    $success = "Terreno agregado exitosamente";
                    break;
                    
                case 'edit':
                    $imagen = null;
                    $updateImage = false;
                    
                    // Verificar si se solicita eliminar la imagen
                    if (isset($_POST['eliminar_imagen']) && $_POST['eliminar_imagen'] === '1') {
                        // Eliminar imagen actual
                        $stmt = $pdo->prepare("SELECT imagen FROM terrenos WHERE id = ?");
                        $stmt->execute([intval($_POST['id'])]);
                        $oldImage = $stmt->fetchColumn();
                        if ($oldImage) {
                            $adminOldPath = __DIR__ . '/uploads/' . $oldImage;
                            $publicOldPath = dirname(__DIR__, 2) . '/public/uploads/' . $oldImage;
                            if (file_exists($adminOldPath)) {
                                unlink($adminOldPath);
                            }
                            if (file_exists($publicOldPath)) {
                                unlink($publicOldPath);
                            }
                        }
                        $imagen = null;
                        $updateImage = true;
                    } elseif (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                        $imagen = handleImageUpload($_FILES['imagen']);
                        
                        // Eliminar imagen anterior si existe
                        $stmt = $pdo->prepare("SELECT imagen FROM terrenos WHERE id = ?");
                        $stmt->execute([intval($_POST['id'])]);
                        $oldImage = $stmt->fetchColumn();
                        if ($oldImage) {
                            $adminOldPath = __DIR__ . '/uploads/' . $oldImage;
                            $publicOldPath = dirname(__DIR__, 2) . '/public/uploads/' . $oldImage;
                            if (file_exists($adminOldPath)) {
                                unlink($adminOldPath);
                            }
                            if (file_exists($publicOldPath)) {
                                unlink($publicOldPath);
                            }
                        }
                        $updateImage = true;
                    }
                    
                    if ($updateImage) {
                        $stmt = $pdo->prepare("UPDATE terrenos SET nombre=?, descripcion=?, precio=?, area=?, ubicacion=?, estado=?, imagen=? WHERE id=?");
                        $stmt->execute([
                            sanitize($_POST['nombre']),
                            sanitize($_POST['descripcion']),
                            floatval($_POST['precio']),
                            floatval($_POST['area']),
                            sanitize($_POST['ubicacion']),
                            sanitize($_POST['estado']),
                            $imagen,
                            intval($_POST['id'])
                        ]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE terrenos SET nombre=?, descripcion=?, precio=?, area=?, ubicacion=?, estado=? WHERE id=?");
                        $stmt->execute([
                            sanitize($_POST['nombre']),
                            sanitize($_POST['descripcion']),
                            floatval($_POST['precio']),
                            floatval($_POST['area']),
                            sanitize($_POST['ubicacion']),
                            sanitize($_POST['estado']),
                            intval($_POST['id'])
                        ]);
                    }
                    $success = "Terreno actualizado exitosamente";
                    break;
                
            case 'delete':
                    $stmt = $pdo->prepare("DELETE FROM terrenos WHERE id = ?");
                    $stmt->execute([intval($_POST['id'])]);
                    $success = "Terreno eliminado exitosamente";
                    break;
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
    }
}

// Obtener terrenos con filtros
$where = "1=1";
$params = [];

if (isset($_GET['estado']) && $_GET['estado'] !== '') {
    $where .= " AND estado = ?";
    $params[] = $_GET['estado'];
}

if (isset($_GET['search']) && $_GET['search'] !== '') {
    $where .= " AND (titulo LIKE ? OR ubicacion LIKE ? OR distrito LIKE ?)";
    $search = '%' . $_GET['search'] . '%';
    $params[] = $search;
    $params[] = $search;
    $params[] = $search;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM terrenos WHERE $where ORDER BY id DESC");
    $stmt->execute($params);
    $terrenos = $stmt->fetchAll();
} catch(PDOException $e) {
    // Si hay error con la base de datos, mostrar mensaje y array vacío
    $error = "Error de base de datos: " . $e->getMessage();
    $terrenos = [];
}

// Obtener terreno para editar
$terreno_edit = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM terrenos WHERE id = ?");
    $stmt->execute([intval($_GET['edit'])]);
    $terreno_edit = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Terrenos - Urbaniza2 Admin</title>
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
                <a class="nav-link active" href="terrenos.php">
                    <i class="fas fa-map-marked-alt me-2"></i> Terrenos
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="consultas.php">
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
                <h5 class="mb-0">Gestión de Terrenos</h5>
                <div class="navbar-nav ms-auto">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#terrenoModal">
                        <i class="fas fa-plus me-2"></i> Nuevo Terreno
                    </button>
                </div>
            </div>
        </nav>

        <?php if (isset($success)): ?>
            <div class="alert alert-success alert-dismissible fade show">
                <i class="fas fa-check-circle me-2"></i><?= $success ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="alert alert-danger alert-dismissible fade show">
                <i class="fas fa-exclamation-triangle me-2"></i><?= $error ?>
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
                               placeholder="Título, ubicación o distrito...">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Estado</label>
                        <select class="form-select" name="estado">
                            <option value="">Todos</option>
                            <option value="disponible" <?= ($_GET['estado'] ?? '') === 'disponible' ? 'selected' : '' ?>>Disponible</option>
                            <option value="reservado" <?= ($_GET['estado'] ?? '') === 'reservado' ? 'selected' : '' ?>>Reservado</option>
                            <option value="vendido" <?= ($_GET['estado'] ?? '') === 'vendido' ? 'selected' : '' ?>>Vendido</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary me-2">
                            <i class="fas fa-search"></i> Filtrar
                        </button>
                        <a href="terrenos.php" class="btn btn-outline-secondary">
                            <i class="fas fa-times"></i> Limpiar
                        </a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Lista de Terrenos -->
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Ubicación</th>
                                <th>Precio</th>
                                <th>Área</th>
                                <th>Estado</th>
                                <th>Destacado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($terrenos)): ?>
                            <tr>
                                <td colspan="9" class="text-center py-4">
                                    <i class="fas fa-info-circle text-muted me-2"></i>
                                    <?php if (isset($error)): ?>
                                        No se pueden cargar los terrenos debido a un error en la base de datos.
                                    <?php else: ?>
                                        No hay terrenos registrados aún.
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php else: ?>
                            <?php foreach ($terrenos as $terreno): ?>
            <tr>
                <td>
                    <?php if ($terreno['imagen']): ?>
                        <img src="uploads/<?= htmlspecialchars($terreno['imagen']) ?>" alt="<?= htmlspecialchars($terreno['nombre']) ?>" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <?php else: ?>
                        <div style="width: 60px; height: 60px; background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-image text-muted"></i>
                        </div>
                    <?php endif; ?>
                </td>
                <td>
                    <strong><?= htmlspecialchars($terreno['nombre']) ?></strong>
                    <?php if ($terreno['descripcion']): ?>
                        <br><small class="text-muted"><?= htmlspecialchars(substr($terreno['descripcion'], 0, 50)) ?>...</small>
                    <?php endif; ?>
                </td>
                                <td>
                                    <?= htmlspecialchars($terreno['ubicacion']) ?>
                                </td>
                                <td class="fw-bold text-primary"><?= formatPrice($terreno['precio']) ?></td>
                                <td><?= number_format($terreno['area'], 0) ?> m²</td>
                                <td>
                                    <?php
                                    $badge_class = match($terreno['estado']) {
                                        'disponible' => 'bg-success',
                                        'reservado' => 'bg-warning',
                                        'vendido' => 'bg-danger',
                                        default => 'bg-secondary'
                                    };
                                    ?>
                                    <span class="badge <?= $badge_class ?>">
                                        <?= ucfirst($terreno['estado']) ?>
                                    </span>
                                </td>
                                <td>
                                    <i class="far fa-star text-muted"></i>
                                </td>
                                <td><?= formatDate($terreno['fecha_creacion']) ?></td>
                                <td>
                                    <a href="?edit=<?= $terreno['id'] ?>" class="btn btn-sm btn-outline-primary btn-action">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <button class="btn btn-sm btn-outline-danger btn-action" 
                                            onclick="confirmarEliminar(<?= $terreno['id'] ?>, '<?= htmlspecialchars($terreno['nombre']) ?>')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Agregar/Editar Terreno -->
    <div class="modal fade" id="terrenoModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <?= $terreno_edit ? 'Editar Terreno' : 'Nuevo Terreno' ?>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="action" value="<?= $terreno_edit ? 'edit' : 'add' ?>">
                        <?php if ($terreno_edit): ?>
                            <input type="hidden" name="id" value="<?= $terreno_edit['id'] ?>">
                        <?php endif; ?>
                        
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Título *</label>
                                <input type="text" class="form-control" name="nombre" 
                                       value="<?= htmlspecialchars($terreno_edit['nombre'] ?? '') ?>" required>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Descripción</label>
                                <textarea class="form-control" name="descripcion" rows="3"><?= htmlspecialchars($terreno_edit['descripcion'] ?? '') ?></textarea>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Precio (S/) *</label>
                                <input type="number" class="form-control" name="precio" step="0.01" 
                                       value="<?= $terreno_edit['precio'] ?? '' ?>" required>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Área (m²) *</label>
                                <input type="number" class="form-control" name="area" step="0.01" 
                                       value="<?= $terreno_edit['area'] ?? '' ?>" required>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Ubicación *</label>
                                <input type="text" class="form-control" name="ubicacion" 
                                       value="<?= htmlspecialchars($terreno_edit['ubicacion'] ?? '') ?>" required>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Estado</label>
                                <select class="form-select" name="estado">
                                    <option value="disponible" <?= ($terreno_edit['estado'] ?? 'disponible') === 'disponible' ? 'selected' : '' ?>>Disponible</option>
                                    <option value="reservado" <?= ($terreno_edit['estado'] ?? '') === 'reservado' ? 'selected' : '' ?>>Reservado</option>
                                    <option value="vendido" <?= ($terreno_edit['estado'] ?? '') === 'vendido' ? 'selected' : '' ?>>Vendido</option>
                                </select>
                            </div>
                            
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Imagen del Terreno</label>
                                <input type="file" class="form-control" name="imagen" accept="image/*" id="imagen-input">
                                <input type="hidden" name="eliminar_imagen" id="eliminar-imagen" value="0">
                                <?php if ($terreno_edit && $terreno_edit['imagen']): ?>
                                    <div class="mt-2" id="imagen-actual">
                                        <small class="text-muted">Imagen actual: <?= htmlspecialchars($terreno_edit['imagen']) ?></small>
                                        <br>
                                        <div class="d-flex align-items-center mt-2">
                                            <img src="uploads/<?= htmlspecialchars($terreno_edit['imagen']) ?>" alt="Imagen actual" style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 8px;">
                                            <button type="button" class="btn btn-danger btn-sm ms-3" onclick="eliminarImagen()">
                                                <i class="fas fa-trash"></i> Eliminar imagen
                                            </button>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                <small class="form-text text-muted">Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB</small>
                            </div>
                            

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <?= $terreno_edit ? 'Actualizar' : 'Guardar' ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Form para eliminar -->
    <form id="deleteForm" method="POST" style="display: none;">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="id" id="deleteId">
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function confirmarEliminar(id, titulo) {
            if (confirm(`¿Está seguro de eliminar el terreno "${titulo}"?`)) {
                document.getElementById('deleteId').value = id;
                document.getElementById('deleteForm').submit();
            }
        }

        function eliminarImagen() {
            if (confirm('¿Está seguro de eliminar la imagen actual?')) {
                // Marcar para eliminar imagen
                document.getElementById('eliminar-imagen').value = '1';
                // Ocultar la imagen actual
                document.getElementById('imagen-actual').style.display = 'none';
                // Limpiar el input de archivo
                document.getElementById('imagen-input').value = '';
                // Mostrar mensaje de confirmación
                const imagenActual = document.getElementById('imagen-actual');
                imagenActual.innerHTML = '<div class="alert alert-warning mt-2"><i class="fas fa-exclamation-triangle me-2"></i>La imagen será eliminada al guardar los cambios.</div>';
                imagenActual.style.display = 'block';
            }
        }

        // Resetear el estado de eliminación si se selecciona una nueva imagen
        document.getElementById('imagen-input').addEventListener('change', function() {
            if (this.files.length > 0) {
                document.getElementById('eliminar-imagen').value = '0';
                const imagenActual = document.getElementById('imagen-actual');
                if (imagenActual) {
                    imagenActual.innerHTML = '<div class="alert alert-info mt-2"><i class="fas fa-info-circle me-2"></i>Se reemplazará la imagen actual con la nueva imagen seleccionada.</div>';
                }
            }
        });

        <?php if ($terreno_edit): ?>
        // Mostrar modal si hay terreno para editar
        document.addEventListener('DOMContentLoaded', function() {
            new bootstrap.Modal(document.getElementById('terrenoModal')).show();
        });
        <?php endif; ?>
    </script>
</body>
</html>