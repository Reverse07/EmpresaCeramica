'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { productos } = require('../src/app');

test('cada producto tiene id, nombre, categoria y precio', () => {
  for (const p of productos) {
    assert.ok(typeof p.id === 'number', `id debe ser número: ${p.id}`);
    assert.ok(typeof p.nombre === 'string' && p.nombre.length > 0, `nombre inválido: ${p.nombre}`);
    assert.ok(typeof p.categoria === 'string' && p.categoria.length > 0, `categoria inválida: ${p.categoria}`);
    assert.ok(typeof p.precio === 'number' && p.precio > 0, `precio inválido: ${p.precio}`);
  }
});

test('los ids de productos son únicos', () => {
  const ids = productos.map((p) => p.id);
  const unicos = new Set(ids);
  assert.equal(unicos.size, ids.length, 'hay ids duplicados');
});

test('todos los precios son mayores a cero', () => {
  assert.ok(productos.every((p) => p.precio > 0));
});
