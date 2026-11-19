'use strict';

/**
 * Catálogo de productos en memoria.
 * Será reemplazado por consultas a PostgreSQL en el siguiente avance.
 */
const productos = [
  { id: 1, nombre: 'Taza de cerámica esmaltada',  categoria: 'vajilla',     precio: 18.5  },
  { id: 2, nombre: 'Plato hondo artesanal',        categoria: 'vajilla',     precio: 24.9  },
  { id: 3, nombre: 'Macetero mediano',             categoria: 'decoración',  precio: 35.0  },
  { id: 4, nombre: 'Jarrón alto',                  categoria: 'decoración',  precio: 62.0  },
  { id: 5, nombre: 'Cuenco pequeño',               categoria: 'vajilla',     precio: 12.0  },
  { id: 6, nombre: 'Plato de postre',              categoria: 'vajilla',     precio: 19.9  },
  { id: 7, nombre: 'Florero de piso',              categoria: 'decoración',  precio: 89.0  },
  { id: 8, nombre: 'Set de tazas x4',             categoria: 'vajilla',     precio: 65.0  },
];

module.exports = { productos };
