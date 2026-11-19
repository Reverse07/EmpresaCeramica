'use strict';

const { Router } = require('express');
const { productos } = require('../data/productos');

const router = Router();

/**
 * GET /api/categorias
 * Devuelve la lista de categorías únicas disponibles en el catálogo.
 */
router.get('/', (_req, res) => {
  const categorias = [...new Set(productos.map((p) => p.categoria))].sort();
  res.json({ categorias });
});

module.exports = router;
