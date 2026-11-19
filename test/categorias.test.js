'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { crearApp } = require('../src/app');

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

test('GET /api/categorias devuelve un objeto con array de categorías', async () => {
  const res = await fetch(`${base}/api/categorias`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.categorias));
  assert.ok(body.categorias.length > 0);
});

test('GET /api/categorias devuelve categorías únicas y ordenadas', async () => {
  const res = await fetch(`${base}/api/categorias`);
  const { categorias } = await res.json();
  const unicas = [...new Set(categorias)];
  assert.deepEqual(categorias, unicas);
  assert.deepEqual(categorias, [...categorias].sort());
});
