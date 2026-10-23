'use strict';

const { crearApp } = require('./app');

const PUERTO = Number(process.env.PORT) || 3000;

crearApp().listen(PUERTO, '0.0.0.0', () => {
  console.log(`Ludier escuchando en el puerto ${PUERTO}`);
});
