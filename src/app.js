'use strict';

const path = require('node:path');
const express = require('express');

const DEFAULT_ADMIN_TOKEN = 'ludier-dev-token-2026';

// Catálogo artesanal de Ludier en memoria.
const productos = [
  {
    id: 1,
    nombre: 'Taza de cerámica esmaltada',
    categoria: 'vajilla',
    precio: 18.5,
    descripcion: 'Taza artesanal con acabado satinado en terracota cruda y esmalte blanco nieve. Ideal para café de especialidad.',
    dimensiones: 'Alto 9.5 cm x Diámetro 8.5 cm (320 ml)',
    acabado: 'Terracota mate y esmalte blanco nieve',
    tipoSvg: 'taza',
    colorEsmalte: '#e8e2d5',
  },
  {
    id: 2,
    nombre: 'Plato hondo artesanal',
    categoria: 'vajilla',
    precio: 24.9,
    descripcion: 'Plato hondo modelado a mano con borde orgánico ondulado y esmalte reactivo verde oliva.',
    dimensiones: 'Diámetro 21 cm x Alto 4.5 cm',
    acabado: 'Verde oliva reactivo sobre gres tostado',
    tipoSvg: 'plato',
    colorEsmalte: '#5b6b4b',
  },
  {
    id: 3,
    nombre: 'Macetero mediano',
    categoria: 'decoración',
    precio: 35.0,
    descripcion: 'Macetero cilíndrico de gres estriado con orificio de drenaje y plato de arcilla a juego.',
    dimensiones: 'Diámetro 14 cm x Alto 15 cm',
    acabado: 'Barro rojo natural texturado',
    tipoSvg: 'macetero',
    colorEsmalte: '#c4704f',
  },
  {
    id: 4,
    nombre: 'Jarrón alto',
    categoria: 'decoración',
    precio: 62.0,
    descripcion: 'Jarrón de líneas escultóricas con doble esmaltado en degradé arena y terracota quemada.',
    dimensiones: 'Alto 28 cm x Diámetro 12 cm',
    acabado: 'Bicolor arena y arcilla tostada',
    tipoSvg: 'jarron',
    colorEsmalte: '#d98a5f',
  },
  {
    id: 5,
    nombre: 'Cuenco rústico de pasta de gres',
    categoria: 'vajilla',
    precio: 22.0,
    descripcion: 'Cuenco multiuso modelado a torno con esmalte azul cobalto profundo y base sin esmaltar.',
    dimensiones: 'Diámetro 16 cm x Alto 7 cm',
    acabado: 'Azul cobalto y gres crudo',
    tipoSvg: 'cuenco',
    colorEsmalte: '#334e68',
  },
  {
    id: 6,
    nombre: 'Tetera ceremonial con asa de cerámica',
    categoria: 'vajilla',
    precio: 85.0,
    descripcion: 'Tetera artesanal con filtro cerámico interno incorporado y tapa de encaje milimétrico.',
    dimensiones: 'Capacidad 650 ml (Alto 14 cm)',
    acabado: 'Negro humo mate satinado',
    tipoSvg: 'tetera',
    colorEsmalte: '#3b3835',
  },
  {
    id: 7,
    nombre: 'Florero cilíndrico minimalista',
    categoria: 'decoración',
    precio: 45.0,
    descripcion: 'Florero esbelto diseñado para tallos secos o flores silvestres de estación.',
    dimensiones: 'Alto 22 cm x Diámetro 7 cm',
    acabado: 'Crema tostada con salpicado de hierro',
    tipoSvg: 'florero',
    colorEsmalte: '#e2dad0',
  },
  {
    id: 8,
    nombre: 'Jarra para agua artesanal',
    categoria: 'vajilla',
    precio: 55.0,
    descripcion: 'Jarra de servicio con asa ergonómica generosa y pico antigoteo modelado con precisión.',
    dimensiones: 'Capacidad 1.2 L (Alto 20 cm)',
    acabado: 'Esmalte salvia con base terracota',
    tipoSvg: 'jarra',
    colorEsmalte: '#7a8d79',
  },
  {
    id: 9,
    nombre: 'Macetero colgante acanalado',
    categoria: 'decoración',
    precio: 39.0,
    descripcion: 'Maceta con textura de estrías verticales y orificios para suspensión con soga de algodón orgánico.',
    dimensiones: 'Diámetro 13 cm x Alto 11 cm',
    acabado: 'Blanco yeso mate',
    tipoSvg: 'macetero',
    colorEsmalte: '#ede8de',
  },
  {
    id: 10,
    nombre: 'Sahumador y portaincienso ritual',
    categoria: 'decoración',
    precio: 28.5,
    descripcion: 'Pieza ceremonial para sahumar palo santo o resinas naturales, con base aislante térmica.',
    dimensiones: 'Diámetro 11 cm x Alto 6 cm',
    acabado: 'Arcilla negra bruñida',
    tipoSvg: 'sahumador',
    colorEsmalte: '#423d38',
  },
  {
    id: 11,
    nombre: 'Juego de pocillos para salsas (dupla)',
    categoria: 'vajilla',
    precio: 26.0,
    descripcion: 'Dos cuencos pequeños ideales para salsas, ajíes peruanos o frutos secos.',
    dimensiones: 'Diámetro 9 cm x Alto 4 cm c/u',
    acabado: 'Ocre mostaza y verde oliva',
    tipoSvg: 'cuenco',
    colorEsmalte: '#c98a3b',
  },
  {
    id: 12,
    nombre: 'Plato trinche bajo con engobe',
    categoria: 'vajilla',
    precio: 32.0,
    descripcion: 'Plato llano amplio con técnica de engobe ancestral y sellado vidriado de alta dureza.',
    dimensiones: 'Diámetro 26 cm x Alto 2.5 cm',
    acabado: 'Engobe natural y vidriado transparente',
    tipoSvg: 'plato',
    colorEsmalte: '#d5bba2',
  },
];

let siguientePedidoId = 1002;
const pedidos = [
  {
    id: 'PED-1001',
    cliente: {
      nombre: 'Mariana Flores',
      telefono: '987654321',
      direccion: 'Av. Larco 450, Dpto 302, Miraflores, Lima',
      notas: 'Timbre número 302 al llegar, gracias.',
    },
    items: [
      {
        productoId: 1,
        nombre: 'Taza de cerámica esmaltada',
        cantidad: 2,
        precioUnitario: 18.5,
        subtotal: 37.0,
      },
      {
        productoId: 3,
        nombre: 'Macetero mediano',
        cantidad: 1,
        precioUnitario: 35.0,
        subtotal: 35.0,
      },
    ],
    total: 72.0,
    estado: 'pendiente',
    creadoEn: '2026-10-22T15:30:00.000Z',
  },
];

function verificarAdmin(req, res, next) {
  const tokenConfigurado = process.env.ADMIN_TOKEN || DEFAULT_ADMIN_TOKEN;
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-admin-token'];

  let tokenRecibido = customHeader;
  if (!tokenRecibido && authHeader && authHeader.startsWith('Bearer ')) {
    tokenRecibido = authHeader.slice(7).trim();
  }

  if (!tokenRecibido || tokenRecibido !== tokenConfigurado) {
    return res.status(401).json({ error: 'Token de administrador inválido o ausente' });
  }

  next();
}

function crearApp() {
  const app = express();
  app.use(express.json());

  // Servir archivos estáticos del frontend
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));

  // Healthcheck: Usado por Dockerfile y GitHub Actions
  app.get('/health', (_req, res) => {
    res.json({ estado: 'ok' });
  });

  // Ruta hacia el panel de administración
  app.get('/admin', (_req, res) => {
    res.sendFile(path.join(publicDir, 'admin.html'));
  });

  // --- API PRODUCTOS ---

  // Listar productos (con filtro opcional ?categoria=)
  app.get('/api/productos', (req, res) => {
    const { categoria } = req.query;
    const lista = categoria ? productos.filter((p) => p.categoria === categoria) : productos;
    res.json(lista);
  });

  // Obtener producto por ID
  app.get('/api/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.json(producto);
  });

  // Crear producto (solo admin)
  app.post('/api/productos', verificarAdmin, (req, res) => {
    const { nombre, categoria, precio, descripcion, dimensiones, acabado, tipoSvg, colorEsmalte } = req.body || {};

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
    }
    if (!categoria || typeof categoria !== 'string' || categoria.trim().length === 0) {
      return res.status(400).json({ error: 'La categoría del producto es obligatoria' });
    }
    const precioNum = Number(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
    const nuevoProducto = {
      id: nuevoId,
      nombre: nombre.trim(),
      categoria: categoria.trim().toLowerCase(),
      precio: Number(precioNum.toFixed(2)),
      descripcion: (descripcion || '').trim(),
      dimensiones: (dimensiones || 'Dimensiones estándar de taller').trim(),
      acabado: (acabado || 'Esmalte artesanal').trim(),
      tipoSvg: (tipoSvg || 'taza').trim().toLowerCase(),
      colorEsmalte: (colorEsmalte || '#c4704f').trim(),
    };

    productos.push(nuevoProducto);
    return res.status(201).json(nuevoProducto);
  });

  // Editar producto (solo admin)
  app.put('/api/productos/:id', verificarAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const { nombre, categoria, precio, descripcion, dimensiones, acabado, tipoSvg, colorEsmalte } = req.body || {};

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim().length === 0)) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }
    if (categoria !== undefined && (typeof categoria !== 'string' || categoria.trim().length === 0)) {
      return res.status(400).json({ error: 'La categoría no puede estar vacía' });
    }
    if (precio !== undefined) {
      const precioNum = Number(precio);
      if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ error: 'El precio debe ser un número positivo' });
      }
    }

    const actual = productos[index];
    const productoActualizado = {
      ...actual,
      ...(nombre !== undefined ? { nombre: nombre.trim() } : {}),
      ...(categoria !== undefined ? { categoria: categoria.trim().toLowerCase() } : {}),
      ...(precio !== undefined ? { precio: Number(Number(precio).toFixed(2)) } : {}),
      ...(descripcion !== undefined ? { descripcion: descripcion.trim() } : {}),
      ...(dimensiones !== undefined ? { dimensiones: dimensiones.trim() } : {}),
      ...(acabado !== undefined ? { acabado: acabado.trim() } : {}),
      ...(tipoSvg !== undefined ? { tipoSvg: tipoSvg.trim().toLowerCase() } : {}),
      ...(colorEsmalte !== undefined ? { colorEsmalte: colorEsmalte.trim() } : {}),
    };

    productos[index] = productoActualizado;
    return res.json(productoActualizado);
  });

  // Eliminar producto (solo admin)
  app.delete('/api/productos/:id', verificarAdmin, (req, res) => {
    const id = Number(req.params.id);
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const eliminado = productos.splice(index, 1)[0];
    return res.json({ mensaje: 'Producto eliminado correctamente', producto: eliminado });
  });

  // --- API PEDIDOS ---

  // Crear pedido (público)
  app.post('/api/pedidos', (req, res) => {
    const { cliente, items } = req.body || {};

    if (!cliente || typeof cliente !== 'object') {
      return res.status(400).json({ error: 'Los datos del cliente son requeridos' });
    }
    const { nombre, telefono, direccion, notas } = cliente;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre completo del cliente es obligatorio (mínimo 2 caracteres)' });
    }
    if (!telefono || typeof telefono !== 'string' || telefono.trim().length < 6) {
      return res.status(400).json({ error: 'El teléfono de contacto es obligatorio (mínimo 6 dígitos)' });
    }
    if (!direccion || typeof direccion !== 'string' || direccion.trim().length < 5) {
      return res.status(400).json({ error: 'La dirección de entrega es obligatoria (mínimo 5 caracteres)' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe contener al menos un producto' });
    }

    const itemsDetallados = [];
    let total = 0;

    for (const item of items) {
      const prodId = Number(item.productoId || item.id);
      const cantidad = parseInt(item.cantidad, 10);

      if (isNaN(prodId) || isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: 'Los ítems deben contener un productoId válido y una cantidad mayor a cero' });
      }

      const prod = productos.find((p) => p.id === prodId);
      if (!prod) {
        return res.status(400).json({ error: `El producto con ID ${prodId} no existe en el catálogo` });
      }

      const subtotal = Number((prod.precio * cantidad).toFixed(2));
      total += subtotal;

      itemsDetallados.push({
        productoId: prod.id,
        nombre: prod.nombre,
        cantidad,
        precioUnitario: prod.precio,
        subtotal,
      });
    }

    const nuevoPedido = {
      id: `PED-${String(siguientePedidoId++).padStart(4, '0')}`,
      cliente: {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        notas: (notas || '').trim(),
      },
      items: itemsDetallados,
      total: Number(total.toFixed(2)),
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
    };

    pedidos.unshift(nuevoPedido);
    return res.status(201).json({
      mensaje: 'Pedido registrado con éxito',
      pedido: nuevoPedido,
    });
  });

  // Listar pedidos (solo admin)
  app.get('/api/pedidos', verificarAdmin, (_req, res) => {
    res.json(pedidos);
  });

  // Actualizar estado de pedido (solo admin)
  app.patch('/api/pedidos/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { estado } = req.body || {};

    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const estadosValidos = ['pendiente', 'en preparación', 'entregado'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      });
    }

    pedido.estado = estado;
    return res.json({
      mensaje: 'Estado del pedido actualizado con éxito',
      pedido,
    });
  });

  return app;
}

module.exports = { crearApp, productos, pedidos, DEFAULT_ADMIN_TOKEN };
