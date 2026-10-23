'use strict';

const express = require('express');

// Catálogo de ejemplo en memoria. Se reemplazará por la base de datos
// (servicio "db" de docker-compose.yml) en los siguientes avances.
const productos = [
  { id: 1, nombre: 'Taza de cerámica esmaltada', categoria: 'vajilla', precio: 18.5 },
  { id: 2, nombre: 'Plato hondo artesanal', categoria: 'vajilla', precio: 24.9 },
  { id: 3, nombre: 'Macetero mediano', categoria: 'decoración', precio: 35.0 },
  { id: 4, nombre: 'Jarrón alto', categoria: 'decoración', precio: 62.0 },
];

function crearApp() {
  const app = express();
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ servicio: 'EmpresaCeramica', version: '0.2.0' });
  });

  // Usado por el HEALTHCHECK del Dockerfile y por el smoke test del workflow de Docker.
  app.get('/health', (_req, res) => {
    res.json({ estado: 'ok' });
  });

  app.get('/api/productos', (req, res) => {
    const { categoria } = req.query;
    const lista = categoria ? productos.filter((p) => p.categoria === categoria) : productos;
    res.json(lista);
  });

  app.get('/api/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    }
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.json(producto);
  });

  // Manejo de rutas no existentes
  app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  return app;
}

module.exports = { crearApp, productos };
