-- Base de datos para Urbaniza2 Panel Administrativo
CREATE DATABASE IF NOT EXISTS urbaniza2_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE urbaniza2_admin;

-- Tabla de administradores
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Tabla de terrenos
CREATE TABLE terrenos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(12,2) NOT NULL,
    area DECIMAL(8,2) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) DEFAULT 'Lima',
    coordenadas VARCHAR(100),
    estado ENUM('disponible', 'reservado', 'vendido') DEFAULT 'disponible',
    destacado BOOLEAN DEFAULT FALSE,
    imagen_principal VARCHAR(255),
    imagenes_adicionales JSON,
    caracteristicas JSON,
    documentos_regla BOOLEAN DEFAULT TRUE,
    facilidades_pago BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- Tabla de clientes/consultas
CREATE TABLE consultas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    terreno_id INT,
    mensaje TEXT,
    tipo_consulta ENUM('informacion', 'visita', 'financiamiento', 'compra') DEFAULT 'informacion',
    estado ENUM('pendiente', 'contactado', 'interesado', 'no_interesado', 'vendido') DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    notas_admin TEXT,
    fecha_contacto TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    atendido_por INT,
    FOREIGN KEY (terreno_id) REFERENCES terrenos(id),
    FOREIGN KEY (atendido_por) REFERENCES admins(id)
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    terreno_id INT NOT NULL,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    cliente_dni VARCHAR(20),
    precio_venta DECIMAL(12,2) NOT NULL,
    cuota_inicial DECIMAL(12,2),
    financiamiento BOOLEAN DEFAULT FALSE,
    plazo_meses INT,
    tasa_interes DECIMAL(5,2),
    cuota_mensual DECIMAL(10,2),
    fecha_venta DATE NOT NULL,
    estado_pago ENUM('pendiente', 'pagado', 'financiado') DEFAULT 'pendiente',
    notas TEXT,
    documentos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vendido_por INT,
    FOREIGN KEY (terreno_id) REFERENCES terrenos(id),
    FOREIGN KEY (vendido_por) REFERENCES admins(id)
);

-- Tabla de configuraciones del sistema
CREATE TABLE configuraciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion VARCHAR(255),
    tipo ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES admins(id)
);

-- Insertar administrador por defecto
INSERT INTO admins (name, username, email, password, role) VALUES 
('Administrador Principal', 'admin', 'admin@urbaniza2.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');
-- Contraseña por defecto: password

-- Insertar terrenos de ejemplo basados en el sitio web
INSERT INTO terrenos (titulo, descripcion, precio, area, ubicacion, distrito, provincia, destacado, estado) VALUES 
('Terreno en Chorrillos', 'Excelente terreno en zona residencial de Chorrillos, con todos los servicios básicos y fácil acceso a transporte público.', 120000.00, 200.00, 'Chorrillos, Lima', 'Chorrillos', 'Lima', TRUE, 'disponible'),
('Terreno en Chancay', 'Terreno ideal para inversión en Chancay, zona en crecimiento con gran potencial de valorización.', 95000.00, 180.00, 'Chancay, Lima', 'Chancay', 'Lima', TRUE, 'disponible'),
('Terreno en Végueta', 'Amplio terreno en Végueta, perfecto para construcción de vivienda familiar o proyecto inmobiliario.', 85000.00, 220.00, 'Végueta, Lima', 'Végueta', 'Lima', TRUE, 'disponible');

-- Insertar configuraciones básicas
INSERT INTO configuraciones (clave, valor, descripcion, tipo) VALUES 
('empresa_nombre', 'Urbaniza2 Inmobiliaria', 'Nombre de la empresa', 'text'),
('empresa_telefono', '+51 999 999 999', 'Teléfono principal', 'text'),
('empresa_email', 'info@urbaniza2peru.com', 'Email principal', 'text'),
('tasa_interes_default', '12.5', 'Tasa de interés por defecto para financiamiento', 'number'),
('cuota_inicial_minima', '30', 'Porcentaje mínimo de cuota inicial', 'number'),
('plazo_maximo_anos', '10', 'Plazo máximo de financiamiento en años', 'number');

-- Crear índices para optimizar consultas
CREATE INDEX idx_terrenos_estado ON terrenos(estado);
CREATE INDEX idx_terrenos_destacado ON terrenos(destacado);
CREATE INDEX idx_terrenos_precio ON terrenos(precio);
CREATE INDEX idx_consultas_estado ON consultas(estado);
CREATE INDEX idx_consultas_fecha ON consultas(created_at);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);