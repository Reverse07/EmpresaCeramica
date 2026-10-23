'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { crearApp, productos } = require('../src/app');

let servidor;
let base;

test.before(async () => {
  await new Promise((resolve) => {
    servidor = crearApp().listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${servidor.address().port}`;
});

test.after(() => {
  servidor.close();
});

test('GET /health responde ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { estado: 'ok' });
});

test('GET /api/productos devuelve el catálogo completo', async () => {
  const res = await fetch(`${base}/api/productos`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).length, productos.length);
});

test('GET /api/productos?categoria=vajilla filtra por categoría', async () => {
  const res = await fetch(`${base}/api/productos?categoria=vajilla`);
  const lista = await res.json();
  assert.ok(lista.length > 0);
  assert.ok(lista.every((p) => p.categoria === 'vajilla'));
});

test('GET /api/productos/:id devuelve 404 si no existe', async () => {
  const res = await fetch(`${base}/api/productos/999`);
  assert.equal(res.status, 404);
});
