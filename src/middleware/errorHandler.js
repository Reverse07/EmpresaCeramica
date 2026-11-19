'use strict';

/**
 * Middleware de manejo centralizado de errores.
 * Captura cualquier error no controlado y devuelve una respuesta JSON uniforme.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const estado = err.status || err.statusCode || 500;
  const mensaje = estado < 500 ? err.message : 'Error interno del servidor';

  if (estado >= 500) {
    console.error('[ERROR]', err.stack || err.message);
  }

  res.status(estado).json({
    error: mensaje,
    codigo: estado,
  });
}

module.exports = { errorHandler };
