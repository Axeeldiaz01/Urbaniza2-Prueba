<?php
// Script de instalación automática para Urbaniza2 Admin
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalación - Urbaniza2 Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .install-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            margin: 50px auto;
            max-width: 800px;
        }
        .install-header {
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 2rem;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        .step {
            padding: 1.5rem;
            border-bottom: 1px solid #e9ecef;
        }
        .step:last-child {
            border-bottom: none;
        }
        .step-number {
            background: #3498db;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
        }
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin: 10px 0;
        }
        .alert {
            border-radius: 10px;
            border: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="install-container">
            <div class="install-header">
                <h1><i class="fas fa-building"></i> Urbaniza2 Admin</h1>
                <p class="mb-0">Guía de Instalación del Sistema Administrativo</p>
            </div>
            
            <div class="p-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Bienvenido al instalador de Urbaniza2 Admin</strong><br>
                    Sigue estos pasos para configurar correctamente el sistema administrativo.
                </div>

                <!-- Paso 1 -->
                <div class="step">
                    <h5><span class="step-number">1</span>Verificar XAMPP</h5>
                    <p>Asegúrate de que XAMPP esté instalado y funcionando:</p>
                    <ul>
                        <li>Apache debe estar ejecutándose</li>
                        <li>MySQL debe estar ejecutándose</li>
                        <li>Puedes acceder a phpMyAdmin en: <code>http://localhost/phpmyadmin</code></li>
                    </ul>
                    
                    <?php
                    // Verificar conexión a MySQL
                    $mysql_status = false;
                    try {
                        $pdo = new PDO("mysql:host=localhost", "root", "");
                        $mysql_status = true;
                    } catch(PDOException $e) {
                        $mysql_status = false;
                    }
                    ?>
                    
                    <div class="alert <?= $mysql_status ? 'alert-success' : 'alert-danger' ?>">
                        <i class="fas <?= $mysql_status ? 'fa-check-circle' : 'fa-times-circle' ?> me-2"></i>
                        <?= $mysql_status ? 'MySQL está funcionando correctamente' : 'No se puede conectar a MySQL. Verifica que XAMPP esté ejecutándose.' ?>
                    </div>
                </div>

                <!-- Paso 2 -->
                <div class="step">
                    <h5><span class="step-number">2</span>Crear Base de Datos</h5>
                    <p>Ejecuta el siguiente script SQL en phpMyAdmin:</p>
                    
                    <?php if ($mysql_status): ?>
                        <form method="POST" class="mb-3">
                            <button type="submit" name="create_db" class="btn btn-primary">
                                <i class="fas fa-database me-2"></i>Crear Base de Datos Automáticamente
                            </button>
                        </form>
                        
                        <?php
                        if (isset($_POST['create_db'])) {
                            try {
                                $pdo = new PDO("mysql:host=localhost", "root", "");
                                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                                
                                // Leer y ejecutar el script SQL
                                $sql = file_get_contents('database/urbaniza2_admin.sql');
                                $pdo->exec($sql);
                                
                                echo '<div class="alert alert-success">
                                        <i class="fas fa-check-circle me-2"></i>
                                        ¡Base de datos creada exitosamente!
                                      </div>';
                            } catch(PDOException $e) {
                                echo '<div class="alert alert-danger">
                                        <i class="fas fa-times-circle me-2"></i>
                                        Error al crear la base de datos: ' . $e->getMessage() . '
                                      </div>';
                            }
                        }
                        ?>
                    <?php endif; ?>
                    
                    <p><strong>O manualmente:</strong></p>
                    <ol>
                        <li>Ve a phpMyAdmin: <a href="http://localhost/phpmyadmin" target="_blank">http://localhost/phpmyadmin</a></li>
                        <li>Haz clic en "Importar"</li>
                        <li>Selecciona el archivo: <code>database/urbaniza2_admin.sql</code></li>
                        <li>Haz clic en "Continuar"</li>
                    </ol>
                </div>

                <!-- Paso 3 -->
                <div class="step">
                    <h5><span class="step-number">3</span>Verificar Configuración</h5>
                    <p>Verifica que la configuración de la base de datos sea correcta:</p>
                    <div class="code-block">
                        $host = 'localhost';<br>
                        $dbname = 'urbaniza2_admin';<br>
                        $username = 'root';<br>
                        $password = '';
                    </div>
                    
                    <?php
                    // Verificar conexión a la base de datos específica
                    $db_status = false;
                    if ($mysql_status) {
                        try {
                            $pdo = new PDO("mysql:host=localhost;dbname=urbaniza2_admin", "root", "");
                            $db_status = true;
                        } catch(PDOException $e) {
                            $db_status = false;
                        }
                    }
                    ?>
                    
                    <div class="alert <?= $db_status ? 'alert-success' : 'alert-warning' ?>">
                        <i class="fas <?= $db_status ? 'fa-check-circle' : 'fa-exclamation-triangle' ?> me-2"></i>
                        <?= $db_status ? 'Conexión a la base de datos exitosa' : 'No se puede conectar a la base de datos urbaniza2_admin' ?>
                    </div>
                </div>

                <!-- Paso 4 -->
                <div class="step">
                    <h5><span class="step-number">4</span>Credenciales de Acceso</h5>
                    <p>Una vez completada la instalación, puedes acceder al sistema con:</p>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="alert alert-info">
                                <strong>Usuario:</strong> admin<br>
                                <strong>Contraseña:</strong> password
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>Importante:</strong> Cambia estas credenciales después del primer acceso.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Paso 5 -->
                <div class="step">
                    <h5><span class="step-number">5</span>Acceder al Sistema</h5>
                    <p>Si todo está configurado correctamente, puedes acceder al panel administrativo:</p>
                    
                    <?php if ($db_status): ?>
                        <a href="index.php" class="btn btn-success btn-lg">
                            <i class="fas fa-sign-in-alt me-2"></i>Acceder al Panel Administrativo
                        </a>
                    <?php else: ?>
                        <button class="btn btn-secondary btn-lg" disabled>
                            <i class="fas fa-times me-2"></i>Completa los pasos anteriores primero
                        </button>
                    <?php endif; ?>
                </div>

                <!-- Información adicional -->
                <div class="step">
                    <h5><i class="fas fa-info-circle text-primary me-2"></i>Información Adicional</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Datos de Ejemplo Incluidos:</h6>
                            <ul>
                                <li>3 terrenos destacados</li>
                                <li>Usuario administrador</li>
                                <li>Configuraciones básicas</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6>Funcionalidades:</h6>
                            <ul>
                                <li>Gestión de terrenos</li>
                                <li>Seguimiento de consultas</li>
                                <li>Dashboard con estadísticas</li>
                                <li>Sistema de usuarios</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>