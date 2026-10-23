(function () {
  'use strict';

  const TOKEN_STORAGE_KEY = 'ludier_admin_token';

  const state = {
    token: '',
    productos: [],
    pedidos: [],
    tabActual: 'productos',
    filtroEstadoPedido: 'todos',
    productoEnEdicion: null,
  };

  const elements = {
    authContainer: document.getElementById('admin-auth-view'),
    appContainer: document.getElementById('admin-app-view'),
    tokenInput: document.getElementById('admin-token-input'),
    loginBtn: document.getElementById('admin-login-btn'),
    logoutBtn: document.getElementById('admin-logout-btn'),
    sessionTokenSpan: document.getElementById('session-token-display'),
    tabBtns: document.querySelectorAll('.admin-tab-btn'),
    tabProductos: document.getElementById('tab-productos-view'),
    tabPedidos: document.getElementById('tab-pedidos-view'),
    btnNuevoProducto: document.getElementById('btn-nuevo-producto'),
    productsTableBody: document.getElementById('products-table-body'),
    productsBadgeCount: document.getElementById('products-badge-count'),
    ordersTableBody: document.getElementById('orders-table-body'),
    ordersBadgeCount: document.getElementById('orders-badge-count'),
    statTotalOrders: document.getElementById('stat-total-orders'),
    statPendingOrders: document.getElementById('stat-pending-orders'),
    statPrepOrders: document.getElementById('stat-prep-orders'),
    statDoneOrders: document.getElementById('stat-done-orders'),
    orderFilterBtns: document.querySelectorAll('.order-filter-btn'),
    productModalOverlay: document.getElementById('admin-product-modal-overlay'),
    productModalClose: document.getElementById('admin-product-modal-close'),
    productModalTitle: document.getElementById('admin-product-modal-title'),
    productForm: document.getElementById('admin-product-form'),
    formProductId: document.getElementById('form-product-id'),
    formNombre: document.getElementById('form-nombre'),
    formCategoria: document.getElementById('form-categoria'),
    formPrecio: document.getElementById('form-precio'),
    formTipoSvg: document.getElementById('form-tipo-svg'),
    formColorEsmalte: document.getElementById('form-color-esmalte'),
    formColorHex: document.getElementById('form-color-hex'),
    formDimensiones: document.getElementById('form-dimensiones'),
    formAcabado: document.getElementById('form-acabado'),
    formDescripcion: document.getElementById('form-descripcion'),
    formSubmitBtn: document.getElementById('admin-form-submit-btn'),
    toastContainer: document.getElementById('toast-container'),
  };

  function formatoSoles(monto) {
    return 'S/ ' + Number(monto).toFixed(2);
  }

  function formatoFecha(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso || 'Fecha no disponible';
    }
  }

  function mostrarToast(mensaje, tipo) {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (tipo ? ' toast-' + tipo : '');
    toast.textContent = mensaje;
    elements.toastContainer.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 3200);
  }

  function headersAdmin() {
    return {
      'Content-Type': 'application/json',
      'x-admin-token': state.token,
    };
  }

  // Comprobar token almacenado o ingresado
  async function verificarYConectar(tokenCandidato) {
    if (!tokenCandidato || !tokenCandidato.trim()) {
      mostrarToast('Por favor introduce un token', 'error');
      return;
    }

    try {
      const res = await fetch('/api/pedidos', {
        headers: { 'x-admin-token': tokenCandidato.trim() },
      });

      if (!res.ok) {
        throw new Error('Token inválido. Verifica el valor de ADMIN_TOKEN en .env');
      }

      const pedidos = await res.json();
      state.token = tokenCandidato.trim();
      state.pedidos = pedidos;

      try {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, state.token);
      } catch {
        // Ignorar
      }

      mostrarToast('Autenticación correcta como Administrador', 'success');
      activarVistaAdmin();
      cargarTodo();
    } catch (err) {
      mostrarToast(err.message || 'Error de autenticación', 'error');
    }
  }

  function activarVistaAdmin() {
    if (elements.authContainer) elements.authContainer.style.display = 'none';
    if (elements.appContainer) elements.appContainer.style.display = 'block';
    if (elements.sessionTokenSpan) {
      elements.sessionTokenSpan.textContent = 'Token activo (' + state.token.substring(0, 8) + '•••)';
    }
  }

  function cerrarSesion() {
    state.token = '';
    try {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignorar
    }
    if (elements.authContainer) elements.authContainer.style.display = 'block';
    if (elements.appContainer) elements.appContainer.style.display = 'none';
    if (elements.tokenInput) elements.tokenInput.value = '';
    mostrarToast('Sesión cerrada correctamente');
  }

  async function cargarTodo() {
    await Promise.all([cargarProductos(), cargarPedidos()]);
  }

  async function cargarProductos() {
    try {
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos');
      state.productos = await res.json();
      renderizarProductos();
    } catch (err) {
      mostrarToast(err.message || 'Error al cargar productos', 'error');
    }
  }

  async function cargarPedidos() {
    try {
      const res = await fetch('/api/pedidos', {
        headers: headersAdmin(),
      });
      if (res.status === 401) {
        cerrarSesion();
        return;
      }
      if (!res.ok) throw new Error('Error al obtener pedidos');
      state.pedidos = await res.json();
      renderizarPedidos();
    } catch (err) {
      mostrarToast(err.message || 'Error al cargar pedidos', 'error');
    }
  }

  function renderizarProductos() {
    if (elements.productsBadgeCount) {
      elements.productsBadgeCount.textContent = state.productos.length;
    }
    if (!elements.productsTableBody) return;

    if (state.productos.length === 0) {
      elements.productsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No hay productos registrados en el catálogo.</td></tr>';
      return;
    }

    let html = '';
    state.productos.forEach(function (p) {
      const svgThumb = window.LudierSVGs
        ? window.LudierSVGs.obtenerSvgCeramica(p.tipoSvg, p.colorEsmalte, p.nombre)
        : '';

      html += [
        '<tr>',
        '  <td><div class="table-thumb">' + svgThumb + '</div></td>',
        '  <td style="font-weight: 600; color: var(--c-dark);">#' + p.id + '</td>',
        '  <td>',
        '    <div style="font-weight: 600; color: var(--c-dark);">' + p.nombre + '</div>',
        '    <div style="font-size: 0.8rem; color: var(--c-muted); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + (p.descripcion || '') + '</div>',
        '  </td>',
        '  <td><span class="card-category-badge" style="position:static;">' + p.categoria + '</span></td>',
        '  <td style="font-weight: 700; color: var(--c-clay-dark);">' + formatoSoles(p.precio) + '</td>',
        '  <td style="font-size: 0.82rem; color: var(--c-muted);">' + (p.dimensiones || '-') + '<br><em>' + (p.acabado || '-') + '</em></td>',
        '  <td>',
        '    <div class="table-actions">',
        '      <button class="btn btn-secondary btn-sm" data-action="edit-product" data-id="' + p.id + '">Editar</button>',
        '      <button class="btn btn-secondary btn-sm" style="color: var(--c-error-text); border-color: #fca5a5;" data-action="delete-product" data-id="' + p.id + '">Eliminar</button>',
        '    </div>',
        '  </td>',
        '</tr>',
      ].join('');
    });

    elements.productsTableBody.innerHTML = html;
  }

  function renderizarPedidos() {
    if (elements.ordersBadgeCount) {
      elements.ordersBadgeCount.textContent = state.pedidos.length;
    }

    // Actualizar métricas
    const total = state.pedidos.length;
    const pendientes = state.pedidos.filter(function (p) { return p.estado === 'pendiente'; }).length;
    const preparacion = state.pedidos.filter(function (p) { return p.estado === 'en preparación'; }).length;
    const entregados = state.pedidos.filter(function (p) { return p.estado === 'entregado'; }).length;

    if (elements.statTotalOrders) elements.statTotalOrders.textContent = total;
    if (elements.statPendingOrders) elements.statPendingOrders.textContent = pendientes;
    if (elements.statPrepOrders) elements.statPrepOrders.textContent = preparacion;
    if (elements.statDoneOrders) elements.statDoneOrders.textContent = entregados;

    if (!elements.ordersTableBody) return;

    const pedidosFiltrados = state.pedidos.filter(function (p) {
      if (state.filtroEstadoPedido === 'todos') return true;
      return p.estado === state.filtroEstadoPedido;
    });

    if (pedidosFiltrados.length === 0) {
      elements.ordersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--c-muted);">No hay pedidos en este estado.</td></tr>';
      return;
    }

    let html = '';
    pedidosFiltrados.forEach(function (ped) {
      const badgeClase = ped.estado === 'pendiente'
        ? 'badge-pendiente'
        : ped.estado === 'en preparación'
          ? 'badge-en-preparacion'
          : 'badge-entregado';

      const itemsList = ped.items.map(function (it) {
        return '<li><strong>' + it.cantidad + 'x</strong> ' + it.nombre + ' <span style="color:var(--c-muted);">(' + formatoSoles(it.subtotal || it.precioUnitario * it.cantidad) + ')</span></li>';
      }).join('');

      html += [
        '<tr>',
        '  <td>',
        '    <strong style="color: var(--c-dark); font-size: 0.95rem;">' + ped.id + '</strong><br>',
        '    <span style="font-size: 0.78rem; color: var(--c-muted);">' + formatoFecha(ped.creadoEn) + '</span>',
        '  </td>',
        '  <td>',
        '    <div class="customer-info-cell">',
        '      <span class="customer-name">' + ped.cliente.nombre + '</span>',
        '      <span class="customer-meta">📞 ' + ped.cliente.telefono + '</span>',
        '      <span class="customer-meta">📍 ' + ped.cliente.direccion + '</span>',
        (ped.cliente.notas ? '      <span class="customer-meta" style="font-style: italic;">📝 ' + ped.cliente.notas + '</span>' : ''),
        '    </div>',
        '  </td>',
        '  <td>',
        '    <ul class="order-items-list">' + itemsList + '</ul>',
        '  </td>',
        '  <td style="font-weight: 700; font-size: 1.1rem; color: var(--c-clay-dark);">' + formatoSoles(ped.total) + '</td>',
        '  <td>',
        '    <span class="badge-status ' + badgeClase + '">' + ped.estado + '</span>',
        '  </td>',
        '  <td>',
        '    <select class="status-select" data-action="change-order-status" data-id="' + ped.id + '">',
        '      <option value="pendiente"' + (ped.estado === 'pendiente' ? ' selected' : '') + '>Pendiente</option>',
        '      <option value="en preparación"' + (ped.estado === 'en preparación' ? ' selected' : '') + '>En preparación</option>',
        '      <option value="entregado"' + (ped.estado === 'entregado' ? ' selected' : '') + '>Entregado</option>',
        '    </select>',
        '  </td>',
        '</tr>',
      ].join('');
    });

    elements.ordersTableBody.innerHTML = html;
  }

  async function actualizarEstadoPedido(id, nuevoEstado) {
    try {
      const res = await fetch('/api/pedidos/' + id, {
        method: 'PATCH',
        headers: headersAdmin(),
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar pedido');
      }

      mostrarToast('Pedido ' + id + ' actualizado a «' + nuevoEstado + '»', 'success');
      await cargarPedidos();
    } catch (err) {
      mostrarToast(err.message || 'No fue posible actualizar el estado', 'error');
    }
  }

  function abrirModalProducto(producto) {
    state.productoEnEdicion = producto || null;

    if (elements.productForm) {
      elements.productForm.reset();
    }

    if (producto) {
      if (elements.productModalTitle) elements.productModalTitle.textContent = 'Editar Producto #' + producto.id;
      if (elements.formSubmitBtn) elements.formSubmitBtn.textContent = 'Guardar Cambios';
      if (elements.formProductId) elements.formProductId.value = producto.id;
      if (elements.formNombre) elements.formNombre.value = producto.nombre || '';
      if (elements.formCategoria) elements.formCategoria.value = producto.categoria || 'vajilla';
      if (elements.formPrecio) elements.formPrecio.value = producto.precio || '';
      if (elements.formTipoSvg) elements.formTipoSvg.value = producto.tipoSvg || 'taza';
      if (elements.formColorHex) elements.formColorHex.value = producto.colorEsmalte || '#c4704f';
      if (elements.formColorEsmalte) elements.formColorEsmalte.value = producto.colorEsmalte || '#c4704f';
      if (elements.formDimensiones) elements.formDimensiones.value = producto.dimensiones || '';
      if (elements.formAcabado) elements.formAcabado.value = producto.acabado || '';
      if (elements.formDescripcion) elements.formDescripcion.value = producto.descripcion || '';
    } else {
      if (elements.productModalTitle) elements.productModalTitle.textContent = 'Nuevo Producto Cerámico';
      if (elements.formSubmitBtn) elements.formSubmitBtn.textContent = 'Crear Producto';
      if (elements.formProductId) elements.formProductId.value = '';
      if (elements.formCategoria) elements.formCategoria.value = 'vajilla';
      if (elements.formTipoSvg) elements.formTipoSvg.value = 'taza';
      if (elements.formColorHex) elements.formColorHex.value = '#c4704f';
      if (elements.formColorEsmalte) elements.formColorEsmalte.value = '#c4704f';
    }

    if (elements.productModalOverlay) {
      elements.productModalOverlay.classList.add('active');
    }
  }

  function cerrarModalProducto() {
    if (elements.productModalOverlay) {
      elements.productModalOverlay.classList.remove('active');
    }
    state.productoEnEdicion = null;
  }

  async function guardarProducto(e) {
    e.preventDefault();

    const id = elements.formProductId ? elements.formProductId.value : '';
    const nombre = (elements.formNombre ? elements.formNombre.value : '').trim();
    const categoria = (elements.formCategoria ? elements.formCategoria.value : '').trim();
    const precio = parseFloat(elements.formPrecio ? elements.formPrecio.value : '0');
    const tipoSvg = elements.formTipoSvg ? elements.formTipoSvg.value : 'taza';
    const colorEsmalte = (elements.formColorHex ? elements.formColorHex.value : '#c4704f').trim();
    const dimensiones = (elements.formDimensiones ? elements.formDimensiones.value : '').trim();
    const acabado = (elements.formAcabado ? elements.formAcabado.value : '').trim();
    const descripcion = (elements.formDescripcion ? elements.formDescripcion.value : '').trim();

    if (!nombre) {
      mostrarToast('El nombre de la pieza es requerido', 'error');
      return;
    }
    if (!categoria) {
      mostrarToast('La categoría es requerida', 'error');
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      mostrarToast('Ingresa un precio válido en Soles', 'error');
      return;
    }

    const payload = {
      nombre: nombre,
      categoria: categoria,
      precio: precio,
      tipoSvg: tipoSvg,
      colorEsmalte: colorEsmalte,
      dimensiones: dimensiones,
      acabado: acabado,
      descripcion: descripcion,
    };

    try {
      let res;
      if (id) {
        // PUT /api/productos/:id
        res = await fetch('/api/productos/' + id, {
          method: 'PUT',
          headers: headersAdmin(),
          body: JSON.stringify(payload),
        });
      } else {
        // POST /api/productos
        res = await fetch('/api/productos', {
          method: 'POST',
          headers: headersAdmin(),
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el producto');
      }

      mostrarToast(id ? 'Producto actualizado correctamente' : 'Producto creado con éxito', 'success');
      cerrarModalProducto();
      await cargarProductos();
    } catch (err) {
      mostrarToast(err.message || 'No fue posible guardar', 'error');
    }
  }

  async function eliminarProducto(id) {
    const prod = state.productos.find(function (p) { return p.id === id; });
    const nombre = prod ? prod.nombre : ('#' + id);

    if (!window.confirm('¿Estás seguro de eliminar «' + nombre + '» del catálogo?')) {
      return;
    }

    try {
      const res = await fetch('/api/productos/' + id, {
        method: 'DELETE',
        headers: headersAdmin(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar el producto');
      }

      mostrarToast('Producto eliminado del catálogo', 'success');
      await cargarProductos();
    } catch (err) {
      mostrarToast(err.message || 'No fue posible eliminar', 'error');
    }
  }

  function inicializarEventos() {
    // Autenticación
    if (elements.loginBtn && elements.tokenInput) {
      elements.loginBtn.addEventListener('click', function () {
        verificarYConectar(elements.tokenInput.value);
      });
      elements.tokenInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          verificarYConectar(elements.tokenInput.value);
        }
      });
    }

    if (elements.logoutBtn) {
      elements.logoutBtn.addEventListener('click', cerrarSesion);
    }

    // Pestañas
    elements.tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        elements.tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.tabActual = btn.getAttribute('data-tab');

        if (state.tabActual === 'productos') {
          if (elements.tabProductos) elements.tabProductos.style.display = 'block';
          if (elements.tabPedidos) elements.tabPedidos.style.display = 'none';
        } else {
          if (elements.tabProductos) elements.tabProductos.style.display = 'none';
          if (elements.tabPedidos) elements.tabPedidos.style.display = 'block';
        }
      });
    });

    // Filtros de pedidos
    elements.orderFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        elements.orderFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.filtroEstadoPedido = btn.getAttribute('data-status');
        renderizarPedidos();
      });
    });

    // Acciones de tabla de productos
    if (elements.productsTableBody) {
      elements.productsTableBody.addEventListener('click', function (e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const id = Number(btn.getAttribute('data-id'));

        if (action === 'edit-product') {
          const prod = state.productos.find(function (p) { return p.id === id; });
          abrirModalProducto(prod);
        } else if (action === 'delete-product') {
          eliminarProducto(id);
        }
      });
    }

    // Cambio de estado en tabla de pedidos
    if (elements.ordersTableBody) {
      elements.ordersTableBody.addEventListener('change', function (e) {
        const sel = e.target.closest('select');
        if (!sel) return;
        const id = sel.getAttribute('data-id');
        const nuevoEstado = sel.value;
        actualizarEstadoPedido(id, nuevoEstado);
      });
    }

    // Modal nuevo / editar producto
    if (elements.btnNuevoProducto) {
      elements.btnNuevoProducto.addEventListener('click', function () {
        abrirModalProducto(null);
      });
    }
    if (elements.productModalClose) {
      elements.productModalClose.addEventListener('click', cerrarModalProducto);
    }
    if (elements.productModalOverlay) {
      elements.productModalOverlay.addEventListener('click', function (e) {
        if (e.target === elements.productModalOverlay) {
          cerrarModalProducto();
        }
      });
    }
    if (elements.productForm) {
      elements.productForm.addEventListener('submit', guardarProducto);
    }

    // Sincronización de color picker
    if (elements.formColorEsmalte && elements.formColorHex) {
      elements.formColorEsmalte.addEventListener('input', function (e) {
        elements.formColorHex.value = e.target.value;
      });
      elements.formColorHex.addEventListener('input', function (e) {
        elements.formColorEsmalte.value = e.target.value;
      });
    }

    // Paleta de presets de colores
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(function (preset) {
      preset.addEventListener('click', function () {
        const c = preset.getAttribute('data-color');
        if (elements.formColorEsmalte) elements.formColorEsmalte.value = c;
        if (elements.formColorHex) elements.formColorHex.value = c;
      });
    });

    // Tecla escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        cerrarModalProducto();
      }
    });
  }

  // Inicializar verificación de token almacenado
  let tokenGuardado = '';
  try {
    tokenGuardado = sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  } catch {
    tokenGuardado = '';
  }

  inicializarEventos();

  if (tokenGuardado) {
    verificarYConectar(tokenGuardado);
  } else if (window.location.search.includes('demo=admin')) {
    setTimeout(function () {
      verificarYConectar('ludier-dev-token-2026');
    }, 400);
  }
})();
