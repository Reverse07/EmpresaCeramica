-- ==========================================================
-- EmpresaCeramica - Script de Inicialización de Base de Datos
-- Responsable: RibauAlexander (Integrante 3: Docker & Despliegue)
-- ==========================================================

-- 1. Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 2. Tabla de productos de cerámica
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inserción de categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
('vajilla', 'Piezas funcionales para servicio y mesa'),
('decoración', 'Piezas ornamentales y diseño de interiores')
ON CONFLICT (nombre) DO NOTHING;

-- 4. Inserción de catálogo inicial de productos
INSERT INTO productos (nombre, categoria_id, precio, stock, descripcion) VALUES
('Taza de cerámica esmaltada', 1, 18.50, 45, 'Taza artesanal con esmalte reactivo de alta temperatura'),
('Plato hondo artesanal', 1, 24.90, 30, 'Plato hondo de gres torneado a mano'),
('Macetero mediano', 2, 35.00, 20, 'Macetero con orificio de drenaje y textura rústica'),
('Jarrón alto', 2, 62.00, 15, 'Jarrón ornamental de terracota para decoración');
