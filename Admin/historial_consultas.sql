-- Tabla para el historial de cambios de consultas
CREATE TABLE IF NOT EXISTS historial_consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consulta_id INT NOT NULL,
    campo_modificado VARCHAR(50) NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    modificado_por INT,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario TEXT,
    FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE CASCADE,
    FOREIGN KEY (modificado_por) REFERENCES admins(id) ON DELETE SET NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_historial_consulta_id ON historial_consultas(consulta_id);
CREATE INDEX idx_historial_fecha ON historial_consultas(fecha_modificacion);