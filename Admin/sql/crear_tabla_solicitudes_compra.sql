-- Crear tabla para solicitudes de compra
CREATE TABLE IF NOT EXISTS solicitudes_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    terreno_id INT NOT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL,
    mensaje TEXT,
    tipo_pago ENUM('contado', 'financiado', 'credito') DEFAULT 'contado',
    fecha_solicitud DATETIME NOT NULL,
    estado ENUM('pendiente', 'en_proceso', 'aprobada', 'rechazada', 'completada') DEFAULT 'pendiente',
    notas_admin TEXT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_terreno_id ON solicitudes_compra(terreno_id);
CREATE INDEX idx_email_cliente ON solicitudes_compra(email_cliente);
CREATE INDEX idx_fecha_solicitud ON solicitudes_compra(fecha_solicitud);
CREATE INDEX idx_estado ON solicitudes_compra(estado);

-- Insertar algunos datos de ejemplo (opcional)
-- INSERT INTO solicitudes_compra (terreno_id, nombre_cliente, email_cliente, telefono_cliente, mensaje, tipo_pago, fecha_solicitud, estado) 
-- VALUES 
-- (1, 'Juan Pérez', 'juan@email.com', '987654321', 'Interesado en comprar este terreno', 'contado', NOW(), 'pendiente'),
-- (2, 'María García', 'maria@email.com', '987654322', 'Me gustaría más información sobre financiamiento', 'financiado', NOW(), 'pendiente');