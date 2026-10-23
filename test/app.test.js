'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { crearApp, productos, DEFAULT_ADMIN_TOKEN } = require('../src/app');

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
  const lista = await res.json();
  assert.equal(lista.length, productos.length);
  assert.ok(lista.length >= 10, 'El catálogo debe contener al menos 10 productos');
});

test('GET /api/productos?categoria=vajilla filtra por categoría', async () => {
  const res = await fetch(`${base}/api/productos?categoria=vajilla`);
  const lista = await res.json();
  assert.ok(lista.length > 0);
  assert.ok(lista.every((p) => p.categoria === 'vajilla'));
});

test('GET /api/productos/:id devuelve el producto cuando existe', async () => {
  const res = await fetch(`${base}/api/productos/1`);
  assert.equal(res.status, 200);
  const prod = await res.json();
  assert.equal(prod.id, 1);
  assert.equal(prod.nombre, 'Taza de cerámica esmaltada');
});

test('GET /api/productos/:id devuelve 404 si no existe', async () => {
  const res = await fetch(`${base}/api/productos/99999`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.error, 'Producto no encontrado');
});

// --- Pruebas de administración de productos ---

test('POST /api/productos rechaza peticiones sin token admin (401)', async () => {
  const res = await fetch(`${base}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'Prueba', categoria: 'vajilla', precio: 20 }),
  });
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.ok(data.error.includes('Token de administrador'));
});

test('POST /api/productos rechaza token admin incorrecto (401)', async () => {
  const res = await fetch(`${base}/api/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'token-invalido-xyz',
    },
    body: JSON.stringify({ nombre: 'Prueba', categoria: 'vajilla', precio: 20 }),
  });
  assert.equal(res.status, 401);
});

test('POST /api/productos valida datos obligatorios (400)', async () => {
  const sinNombre = await fetch(`${base}/api/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ categoria: 'vajilla', precio: 25.0 }),
  });
  assert.equal(sinNombre.status, 400);

  const precioInvalido = await fetch(`${base}/api/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ nombre: 'Taza test', categoria: 'vajilla', precio: -5 }),
  });
  assert.equal(precioInvalido.status, 400);
});

let idProductoCreado;

test('POST /api/productos crea un producto correctamente con token admin (201)', async () => {
  const nuevo = {
    nombre: 'Cuenco artesanal de prueba',
    categoria: 'vajilla',
    precio: 38.5,
    descripcion: 'Edición limitada de taller para pruebas unitarias.',
    dimensiones: '15 cm x 6 cm',
    acabado: 'Terracota mate',
    tipoSvg: 'cuenco',
    colorEsmalte: '#c4704f',
  };

  const res = await fetch(`${base}/api/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEFAULT_ADMIN_TOKEN}`,
    },
    body: JSON.stringify(nuevo),
  });

  assert.equal(res.status, 201);
  const creado = await res.json();
  assert.ok(creado.id);
  assert.equal(creado.nombre, nuevo.nombre);
  assert.equal(creado.precio, 38.5);
  idProductoCreado = creado.id;
});

test('PUT /api/productos/:id rechaza sin token admin (401)', async () => {
  const res = await fetch(`${base}/api/productos/${idProductoCreado}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ precio: 42.0 }),
  });
  assert.equal(res.status, 401);
});

test('PUT /api/productos/:id devuelve 404 si el producto no existe', async () => {
  const res = await fetch(`${base}/api/productos/88888`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ nombre: 'No existe' }),
  });
  assert.equal(res.status, 404);
});

test('PUT /api/productos/:id actualiza un producto existente (200)', async () => {
  const res = await fetch(`${base}/api/productos/${idProductoCreado}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({
      nombre: 'Cuenco artesanal modificado',
      precio: 45.0,
    }),
  });

  assert.equal(res.status, 200);
  const modificado = await res.json();
  assert.equal(modificado.id, idProductoCreado);
  assert.equal(modificado.nombre, 'Cuenco artesanal modificado');
  assert.equal(modificado.precio, 45.0);
});

test('DELETE /api/productos/:id rechaza sin token admin (401)', async () => {
  const res = await fetch(`${base}/api/productos/${idProductoCreado}`, {
    method: 'DELETE',
  });
  assert.equal(res.status, 401);
});

test('DELETE /api/productos/:id devuelve 404 si el producto no existe', async () => {
  const res = await fetch(`${base}/api/productos/88888`, {
    method: 'DELETE',
    headers: { 'x-admin-token': DEFAULT_ADMIN_TOKEN },
  });
  assert.equal(res.status, 404);
});

test('DELETE /api/productos/:id elimina el producto correctamente (200)', async () => {
  const res = await fetch(`${base}/api/productos/${idProductoCreado}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': DEFAULT_ADMIN_TOKEN },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.mensaje, 'Producto eliminado correctamente');

  // Verificar que ya no existe
  const check = await fetch(`${base}/api/productos/${idProductoCreado}`);
  assert.equal(check.status, 404);
});

// --- Pruebas de pedidos ---

test('POST /api/pedidos valida datos requeridos de cliente y productos (400)', async () => {
  // Sin cliente
  const res1 = await fetch(`${base}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productoId: 1, cantidad: 1 }] }),
  });
  assert.equal(res1.status, 400);

  // Cliente incompleto (teléfono faltante)
  const res2 = await fetch(`${base}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente: { nombre: 'Juan Pérez', direccion: 'Calle Real 123' },
      items: [{ productoId: 1, cantidad: 1 }],
    }),
  });
  assert.equal(res2.status, 400);

  // Items vacíos
  const res3 = await fetch(`${base}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente: { nombre: 'Juan', telefono: '999888777', direccion: 'Calle Real 123' },
      items: [],
    }),
  });
  assert.equal(res3.status, 400);

  // Producto inexistente en items
  const res4 = await fetch(`${base}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente: { nombre: 'Juan', telefono: '999888777', direccion: 'Calle Real 123' },
      items: [{ productoId: 99999, cantidad: 1 }],
    }),
  });
  assert.equal(res4.status, 400);
});

let idPedidoCreado;

test('POST /api/pedidos crea un pedido válido correctamente (201)', async () => {
  const nuevoPedido = {
    cliente: {
      nombre: 'Lucía Alarcón',
      telefono: '912345678',
      direccion: 'Jr. Batalla de Junín 210, Barranco, Lima',
      notas: 'Llamar antes de entregar',
    },
    items: [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 },
    ],
  };

  const res = await fetch(`${base}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoPedido),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.ok(body.pedido);
  assert.ok(body.pedido.id.startsWith('PED-'));
  assert.equal(body.pedido.cliente.nombre, 'Lucía Alarcón');
  assert.equal(body.pedido.estado, 'pendiente');
  assert.equal(body.pedido.items.length, 2);
  // Total: 18.5 * 2 + 24.9 * 1 = 37.0 + 24.9 = 61.9
  assert.equal(body.pedido.total, 61.9);
  idPedidoCreado = body.pedido.id;
});

test('GET /api/pedidos rechaza sin token admin (401)', async () => {
  const res = await fetch(`${base}/api/pedidos`);
  assert.equal(res.status, 401);
});

test('GET /api/pedidos lista los pedidos con token admin (200)', async () => {
  const res = await fetch(`${base}/api/pedidos`, {
    headers: { 'x-admin-token': DEFAULT_ADMIN_TOKEN },
  });
  assert.equal(res.status, 200);
  const lista = await res.json();
  assert.ok(Array.isArray(lista));
  assert.ok(lista.length >= 2);
  assert.ok(lista.some((p) => p.id === idPedidoCreado));
});

test('PATCH /api/pedidos/:id rechaza sin token admin (401)', async () => {
  const res = await fetch(`${base}/api/pedidos/${idPedidoCreado}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: 'en preparación' }),
  });
  assert.equal(res.status, 401);
});

test('PATCH /api/pedidos/:id devuelve 404 si el pedido no existe', async () => {
  const res = await fetch(`${base}/api/pedidos/PED-99999`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ estado: 'en preparación' }),
  });
  assert.equal(res.status, 404);
});

test('PATCH /api/pedidos/:id rechaza estado inválido (400)', async () => {
  const res = await fetch(`${base}/api/pedidos/${idPedidoCreado}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ estado: 'estado_inexistente' }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error.includes('Estado inválido'));
});

test('PATCH /api/pedidos/:id actualiza el estado a "en preparación" y "entregado" (200)', async () => {
  // 1. A en preparación
  const res1 = await fetch(`${base}/api/pedidos/${idPedidoCreado}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ estado: 'en preparación' }),
  });
  assert.equal(res1.status, 200);
  const data1 = await res1.json();
  assert.equal(data1.pedido.estado, 'en preparación');

  // 2. A entregado
  const res2 = await fetch(`${base}/api/pedidos/${idPedidoCreado}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': DEFAULT_ADMIN_TOKEN,
    },
    body: JSON.stringify({ estado: 'entregado' }),
  });
  assert.equal(res2.status, 200);
  const data2 = await res2.json();
  assert.equal(data2.pedido.estado, 'entregado');
});

// --- Pruebas de rutas frontend ---

test('GET / sirve la tienda pública en HTML', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  const contentType = res.headers.get('content-type') || '';
  assert.ok(contentType.includes('text/html'), 'Debe responder con text/html');
});

test('GET /admin sirve el panel de administración en HTML', async () => {
  const res = await fetch(`${base}/admin`);
  assert.equal(res.status, 200);
  const contentType = res.headers.get('content-type') || '';
  assert.ok(contentType.includes('text/html'), 'Debe responder con text/html');
});

