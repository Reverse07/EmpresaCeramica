'use strict';

/**
 * Middleware de logging simple para registrar cada petición HTTP.
 * Muestra método, URL, código de estado y tiempo de respuesta.
 */
function logger(req, res, next) {
  const inicio = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const ms = Date.now() - inicio;
    const estado = res.statusCode;
    const nivel = estado >= 500 ? 'ERROR' : estado >= 400 ? 'WARN' : 'INFO';
    console.log(`[${nivel}] ${method} ${url} → ${estado} (${ms}ms)`);
  });

  next();
}

module.exports = { logger };
