'use strict';

const { Router } = require('express');
const { productos } = require('../data/productos');

const router = Router();

/**
 * GET /api/productos
 * Devuelve el catálogo completo o filtrado por ?categoria=
 */
router.get('/', (req, res) => {
  const { categoria } = req.query;
  const lista = categoria
    ? productos.filter((p) => p.categoria === categoria)
    : productos;
  res.json(lista);
});

/**
 * GET /api/productos/:id
 * Devuelve un producto por su ID numérico.
 */
router.get('/:id', (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  return res.json(producto);
});

module.exports = router;
