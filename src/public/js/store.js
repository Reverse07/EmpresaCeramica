(function () {
  'use strict';

  // Clave de almacenamiento local para el carrito
  const CART_STORAGE_KEY = 'ludier_carrito';

  // Estado global de la aplicación cliente
  const state = {
    productos: [],
    categoriaActual: 'todas',
    filtroBusqueda: '',
    carrito: [],
    productoSeleccionado: null,
  };

  // Referencias al DOM
  const elements = {
    productsGrid: document.getElementById('products-grid'),
    catalogCount: document.getElementById('catalog-count'),
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    categoryFilters: document.getElementById('category-filters'),
    cartToggleBtn: document.getElementById('cart-toggle-btn'),
    cartCounter: document.getElementById('cart-counter'),
    cartDrawerOverlay: document.getElementById('cart-drawer-overlay'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartCloseBtn: document.getElementById('cart-close-btn'),
    cartItemsList: document.getElementById('cart-items-list'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartTotal: document.getElementById('cart-total'),
    cartCheckoutBtn: document.getElementById('cart-checkout-btn'),
    productModalOverlay: document.getElementById('product-modal-overlay'),
    productModalCard: document.getElementById('product-modal-card'),
    productModalClose: document.getElementById('product-modal-close'),
    checkoutModalOverlay: document.getElementById('checkout-modal-overlay'),
    checkoutModalClose: document.getElementById('checkout-modal-close'),
    checkoutForm: document.getElementById('checkout-form'),
    checkoutSubmitBtn: document.getElementById('checkout-submit-btn'),
    checkoutMiniSummary: document.getElementById('checkout-mini-summary'),
    checkoutFormView: document.getElementById('checkout-form-view'),
    checkoutSuccessView: document.getElementById('checkout-success-view'),
    orderCodeBadge: document.getElementById('order-code-badge'),
    orderSuccessDetails: document.getElementById('order-success-details'),
    finishOrderBtn: document.getElementById('finish-order-btn'),
    toastContainer: document.getElementById('toast-container'),
  };

  // Formateador de moneda en Soles
  function formatoSoles(monto) {
    return 'S/ ' + Number(monto).toFixed(2);
  }

  // Notificaciones flotantes
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

  // Carga del carrito desde localStorage
  function cargarCarrito() {
    try {
      const guardado = localStorage.getItem(CART_STORAGE_KEY);
      if (guardado) {
        state.carrito = JSON.parse(guardado);
      }
    } catch {
      state.carrito = [];
    }
    actualizarVistaCarrito();
  }

  // Guardado del carrito en localStorage
  function guardarCarrito() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.carrito));
    } catch {
      // Ignorar fallas de cuota
    }
    actualizarVistaCarrito();
  }

  // Añadir ítem al carrito
  function agregarAlCarrito(producto, cantidad) {
    const cant = Math.max(1, parseInt(cantidad, 10) || 1);
    const existente = state.carrito.find(function (item) {
      return item.id === producto.id;
    });

    if (existente) {
      existente.cantidad += cant;
    } else {
      state.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        tipoSvg: producto.tipoSvg,
        colorEsmalte: producto.colorEsmalte,
        cantidad: cant,
      });
    }

    guardarCarrito();
    mostrarToast('«' + producto.nombre + '» añadida al carrito', 'success');

    // Animación del contador
    if (elements.cartCounter) {
      elements.cartCounter.classList.remove('bump');
      void elements.cartCounter.offsetWidth;
      elements.cartCounter.classList.add('bump');
    }
  }

  // Cambiar cantidad en el carrito
  function modificarCantidadCarrito(id, delta) {
    const item = state.carrito.find(function (it) {
      return it.id === id;
    });
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      guardarCarrito();
    }
  }

  // Eliminar producto del carrito
  function eliminarDelCarrito(id) {
    state.carrito = state.carrito.filter(function (it) {
      return it.id !== id;
    });
    guardarCarrito();
    mostrarToast('Pieza removida del carrito');
  }

  // Vaciar carrito
  function vaciarCarrito() {
    state.carrito = [];
    guardarCarrito();
  }

  // Actualizar la interfaz del carrito
  function actualizarVistaCarrito() {
    const totalItems = state.carrito.reduce(function (sum, item) {
      return sum + item.cantidad;
    }, 0);

    const totalDinero = state.carrito.reduce(function (sum, item) {
      return sum + item.precio * item.cantidad;
    }, 0);

    if (elements.cartCounter) {
      elements.cartCounter.textContent = totalItems;
    }

    if (elements.cartSubtotal) {
      elements.cartSubtotal.textContent = formatoSoles(totalDinero);
    }

    if (elements.cartTotal) {
      elements.cartTotal.textContent = formatoSoles(totalDinero);
    }

    if (elements.cartCheckoutBtn) {
      elements.cartCheckoutBtn.disabled = state.carrito.length === 0;
      elements.cartCheckoutBtn.style.opacity = state.carrito.length === 0 ? '0.5' : '1';
    }

    if (!elements.cartItemsList) return;

    if (state.carrito.length === 0) {
      elements.cartItemsList.innerHTML = [
        '<div class="cart-empty-box">',
        '  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">',
        '    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>',
        '    <line x1="3" y1="6" x2="21" y2="6"/>',
        '    <path d="M16 10a4 4 0 0 1-8 0"/>',
        '  </svg>',
        '  <p>Tu carrito está vacío.</p>',
        '  <span style="font-size: 0.85rem;">Explora nuestras piezas artesanales y llena tu mesa de calidez.</span>',
        '</div>',
      ].join('');
      return;
    }

    let html = '';
    state.carrito.forEach(function (item) {
      const svgThumb = window.LudierSVGs
        ? window.LudierSVGs.obtenerSvgCeramica(item.tipoSvg, item.colorEsmalte, item.nombre)
        : '';
      const subtotalItem = item.precio * item.cantidad;

      html += [
        '<div class="cart-item">',
        '  <div class="cart-item-thumb">' + svgThumb + '</div>',
        '  <div class="cart-item-info">',
        '    <h4 class="cart-item-title">' + item.nombre + '</h4>',
        '    <div class="cart-item-price">' + formatoSoles(item.precio) + ' c/u</div>',
        '    <div class="cart-item-row">',
        '      <div class="quantity-control">',
        '        <button type="button" aria-label="Restar una unidad" data-action="decrement" data-id="' + item.id + '">-</button>',
        '        <input type="text" readonly value="' + item.cantidad + '" aria-label="Cantidad">',
        '        <button type="button" aria-label="Sumar una unidad" data-action="increment" data-id="' + item.id + '">+</button>',
        '      </div>',
        '      <span style="font-weight: 700; color: var(--c-dark); font-size: 0.95rem;">' + formatoSoles(subtotalItem) + '</span>',
        '      <button type="button" class="cart-item-remove" data-action="remove" data-id="' + item.id + '">Quitar</button>',
        '    </div>',
        '  </div>',
        '</div>',
      ].join('');
    });

    elements.cartItemsList.innerHTML = html;
  }

  // Carga de catálogo desde la API
  async function cargarCatalogo() {
    try {
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos');
      const datos = await res.json();
      state.productos = datos;
      renderizarCatalogo();
    } catch {
      if (elements.productsGrid) {
        elements.productsGrid.innerHTML = [
          '<div class="empty-state">',
          '  <h3>No fue posible cargar el catálogo</h3>',
          '  <p>Ocurrió un problema de comunicación con el taller. Por favor reintenta en un momento.</p>',
          '  <button class="btn btn-secondary" id="retry-btn">Reintentar</button>',
          '</div>',
        ].join('');
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', cargarCatalogo);
        }
      }
    }
  }

  // Filtrado y renderizado del catálogo
  function renderizarCatalogo() {
    if (!elements.productsGrid) return;

    const filtroTexto = state.filtroBusqueda.trim().toLowerCase();
    const categoria = state.categoriaActual;

    const productosFiltrados = state.productos.filter(function (prod) {
      const cumpleCategoria = categoria === 'todas' || prod.categoria.toLowerCase() === categoria;
      const textoCompleto = (prod.nombre + ' ' + (prod.descripcion || '')).toLowerCase();
      const cumpleTexto = !filtroTexto || textoCompleto.includes(filtroTexto);
      return cumpleCategoria && cumpleTexto;
    });

    if (elements.catalogCount) {
      elements.catalogCount.textContent = 'Mostrando ' + productosFiltrados.length + ' de ' + state.productos.length + ' piezas artesanales';
    }

    if (productosFiltrados.length === 0) {
      elements.productsGrid.innerHTML = [
        '<div class="empty-state">',
        '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">',
        '    <circle cx="11" cy="11" r="8"/>',
        '    <line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        '  </svg>',
        '  <h3>No encontramos piezas con ese criterio</h3>',
        '  <p>Prueba con otros términos de búsqueda o selecciona otra categoría de nuestro taller.</p>',
        '  <button class="btn btn-secondary" id="reset-filter-btn">Restablecer filtros</button>',
        '</div>',
      ].join('');

      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          state.filtroBusqueda = '';
          state.categoriaActual = 'todas';
          if (elements.searchInput) elements.searchInput.value = '';
          if (elements.searchClear) elements.searchClear.classList.remove('active');
          actualizarBotonesCategorias();
          renderizarCatalogo();
        });
      }
      return;
    }

    let html = '';
    productosFiltrados.forEach(function (prod) {
      const svgIlustracion = window.LudierSVGs
        ? window.LudierSVGs.obtenerSvgCeramica(prod.tipoSvg, prod.colorEsmalte, prod.nombre)
        : '';

      html += [
        '<article class="product-card" data-id="' + prod.id + '">',
        '  <div class="product-visual-wrap" data-action="view-detail" data-id="' + prod.id + '" title="Ver detalle de ' + prod.nombre + '">',
        '    <span class="card-category-badge">' + prod.categoria + '</span>',
        '    ' + svgIlustracion,
        '  </div>',
        '  <div class="product-info">',
        '    <h3 class="product-title" data-action="view-detail" data-id="' + prod.id + '">' + prod.nombre + '</h3>',
        '    <p class="product-dimensions">' + (prod.dimensiones || 'Pieza artesanal modelada a mano') + '</p>',
        '    <div class="product-price-row">',
        '      <div class="product-price"><span class="currency">S/</span>' + Number(prod.precio).toFixed(2) + '</div>',
        '      <div class="card-actions">',
        '        <button class="btn btn-secondary btn-sm" data-action="view-detail" data-id="' + prod.id + '">Detalle</button>',
        '        <button class="btn btn-primary btn-sm" data-action="add-cart" data-id="' + prod.id + '">Añadir</button>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</article>',
      ].join('');
    });

    elements.productsGrid.innerHTML = html;
  }

  // Actualizar estado visual de los botones de categoría
  function actualizarBotonesCategorias() {
    if (!elements.categoryFilters) return;
    const botones = elements.categoryFilters.querySelectorAll('.filter-btn');
    botones.forEach(function (btn) {
      if (btn.getAttribute('data-category') === state.categoriaActual) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Modal de detalle de producto
  function abrirDetalleProducto(id) {
    const prod = state.productos.find(function (p) {
      return p.id === id;
    });
    if (!prod) return;

    state.productoSeleccionado = prod;

    const svgDetalle = window.LudierSVGs
      ? window.LudierSVGs.obtenerSvgCeramica(prod.tipoSvg, prod.colorEsmalte, prod.nombre)
      : '';

    const contenidoModal = [
      '<div class="modal-product-layout">',
      '  <div class="modal-product-visual">',
      '    ' + svgDetalle,
      '    <span style="font-size: 0.8rem; color: var(--c-muted); margin-top: 1rem;">Ilustración vectorial original de la pieza</span>',
      '  </div>',
      '  <div class="modal-product-details">',
      '    <span class="modal-product-category">' + prod.categoria + '</span>',
      '    <h2 class="modal-product-title">' + prod.nombre + '</h2>',
      '    <div class="modal-product-price">' + formatoSoles(prod.precio) + '</div>',
      '    <p style="color: var(--c-charcoal); font-size: 0.95rem;">' + (prod.descripcion || 'Pieza de cerámica contemporánea elaborada a mano.') + '</p>',
      '    <div class="modal-specs-list">',
      '      <div><strong>Dimensiones:</strong> ' + (prod.dimensiones || 'Según molde artesanal') + '</div>',
      '      <div><strong>Acabado:</strong> ' + (prod.acabado || 'Gres esmaltado a alta temperatura') + '</div>',
      '      <div><strong>Procedencia:</strong> Taller Ludier, Barranco (Lima, Perú)</div>',
      '      <div><strong>Cuidado:</strong> Apto para microondas y lavavajillas</div>',
      '    </div>',
      '    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">',
      '      <div class="quantity-control">',
      '        <button type="button" id="modal-qty-dec">-</button>',
      '        <input type="text" id="modal-qty-input" value="1" readonly>',
      '        <button type="button" id="modal-qty-inc">+</button>',
      '      </div>',
      '      <button class="btn btn-primary" id="modal-add-cart-btn" style="flex: 1;">Añadir al Carrito</button>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('');

    if (elements.productModalCard) {
      // Dejar el botón de cerrar y actualizar contenido
      const closeBtnHtml = '<button class="modal-close-btn" id="product-modal-close" aria-label="Cerrar modal">&times;</button>';
      elements.productModalCard.innerHTML = closeBtnHtml + contenidoModal;

      // Eventos del modal recién renderizado
      const modalClose = document.getElementById('product-modal-close');
      if (modalClose) {
        modalClose.addEventListener('click', cerrarModalDetalle);
      }

      const qtyInput = document.getElementById('modal-qty-input');
      const qtyDec = document.getElementById('modal-qty-dec');
      const qtyInc = document.getElementById('modal-qty-inc');
      const addBtn = document.getElementById('modal-add-cart-btn');

      if (qtyDec && qtyInput) {
        qtyDec.addEventListener('click', function () {
          const val = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
          qtyInput.value = val;
        });
      }
      if (qtyInc && qtyInput) {
        qtyInc.addEventListener('click', function () {
          const val = (parseInt(qtyInput.value, 10) || 1) + 1;
          qtyInput.value = val;
        });
      }
      if (addBtn && qtyInput) {
        addBtn.addEventListener('click', function () {
          const cantidad = parseInt(qtyInput.value, 10) || 1;
          agregarAlCarrito(prod, cantidad);
          cerrarModalDetalle();
        });
      }
    }

    if (elements.productModalOverlay) {
      elements.productModalOverlay.classList.add('active');
    }
  }

  function cerrarModalDetalle() {
    if (elements.productModalOverlay) {
      elements.productModalOverlay.classList.remove('active');
    }
    state.productoSeleccionado = null;
  }

  // Cajón del Carrito
  function abrirCarrito() {
    actualizarVistaCarrito();
    if (elements.cartDrawer) elements.cartDrawer.classList.add('active');
    if (elements.cartDrawerOverlay) elements.cartDrawerOverlay.classList.add('active');
  }

  function cerrarCarrito() {
    if (elements.cartDrawer) elements.cartDrawer.classList.remove('active');
    if (elements.cartDrawerOverlay) elements.cartDrawerOverlay.classList.remove('active');
  }

  // Modal de Checkout / Formulario de Pedido
  function abrirCheckout() {
    if (state.carrito.length === 0) {
      mostrarToast('Tu carrito está vacío', 'error');
      return;
    }
    cerrarCarrito();

    // Renderizar resumen pequeño en checkout
    if (elements.checkoutMiniSummary) {
      const totalDinero = state.carrito.reduce(function (sum, item) {
        return sum + item.precio * item.cantidad;
      }, 0);

      const itemsHtml = state.carrito
        .map(function (it) {
          return it.cantidad + 'x ' + it.nombre + ' (' + formatoSoles(it.precio * it.cantidad) + ')';
        })
        .join('<br>');

      elements.checkoutMiniSummary.innerHTML = [
        '<div style="font-weight: 600; margin-bottom: 0.35rem;">Resumen de tu pedido:</div>',
        '<div style="color: var(--c-charcoal); line-height: 1.4;">' + itemsHtml + '</div>',
        '<div style="margin-top: 0.5rem; font-weight: 700; color: var(--c-clay-dark); font-size: 1.05rem;">Total a pagar: ' + formatoSoles(totalDinero) + '</div>',
      ].join('');
    }

    // Asegurar vista de formulario
    if (elements.checkoutFormView) elements.checkoutFormView.style.display = 'block';
    if (elements.checkoutSuccessView) elements.checkoutSuccessView.style.display = 'none';

    if (elements.checkoutModalOverlay) {
      elements.checkoutModalOverlay.classList.add('active');
    }
  }

  function cerrarCheckout() {
    if (elements.checkoutModalOverlay) {
      elements.checkoutModalOverlay.classList.remove('active');
    }
  }

  // Envío del pedido a la API
  async function procesarPedido(evento) {
    evento.preventDefault();

    if (!elements.checkoutForm) return;

    const nombre = (document.getElementById('checkout-nombre') || {}).value || '';
    const telefono = (document.getElementById('checkout-telefono') || {}).value || '';
    const direccion = (document.getElementById('checkout-direccion') || {}).value || '';
    const notas = (document.getElementById('checkout-notas') || {}).value || '';

    if (!nombre.trim() || nombre.trim().length < 2) {
      mostrarToast('Por favor ingresa tu nombre completo', 'error');
      return;
    }
    if (!telefono.trim() || telefono.trim().length < 6) {
      mostrarToast('Por favor ingresa un teléfono o WhatsApp de contacto válido', 'error');
      return;
    }
    if (!direccion.trim() || direccion.trim().length < 5) {
      mostrarToast('Por favor ingresa tu dirección completa de entrega', 'error');
      return;
    }

    const payload = {
      cliente: {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        notas: notas.trim(),
      },
      items: state.carrito.map(function (item) {
        return {
          productoId: item.id,
          cantidad: item.cantidad,
        };
      }),
    };

    if (elements.checkoutSubmitBtn) {
      elements.checkoutSubmitBtn.disabled = true;
      elements.checkoutSubmitBtn.textContent = 'Enviando pedido al taller...';
    }

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No fue posible registrar el pedido');
      }

      // Éxito: vaciar carrito y mostrar confirmación
      vaciarCarrito();
      elements.checkoutForm.reset();

      if (elements.orderCodeBadge) {
        elements.orderCodeBadge.textContent = data.pedido.id;
      }

      if (elements.orderSuccessDetails) {
        elements.orderSuccessDetails.innerHTML = [
          '<p><strong>Cliente:</strong> ' + data.pedido.cliente.nombre + '</p>',
          '<p><strong>Dirección:</strong> ' + data.pedido.cliente.direccion + '</p>',
          '<p><strong>Teléfono:</strong> ' + data.pedido.cliente.telefono + '</p>',
          '<p><strong>Monto total:</strong> ' + formatoSoles(data.pedido.total) + '</p>',
        ].join('');
      }

      if (elements.checkoutFormView) elements.checkoutFormView.style.display = 'none';
      if (elements.checkoutSuccessView) elements.checkoutSuccessView.style.display = 'flex';

      mostrarToast('¡Pedido registrado con éxito!', 'success');
    } catch (err) {
      mostrarToast(err.message || 'Error al enviar pedido', 'error');
    } finally {
      if (elements.checkoutSubmitBtn) {
        elements.checkoutSubmitBtn.disabled = false;
        elements.checkoutSubmitBtn.textContent = 'Confirmar Pedido';
      }
    }
  }

  // Inicialización de escuchadores de eventos
  function inicializarEventos() {
    // Filtro por buscador
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', function (e) {
        state.filtroBusqueda = e.target.value;
        if (elements.searchClear) {
          if (state.filtroBusqueda.length > 0) {
            elements.searchClear.classList.add('active');
          } else {
            elements.searchClear.classList.remove('active');
          }
        }
        renderizarCatalogo();
      });
    }

    if (elements.searchClear) {
      elements.searchClear.addEventListener('click', function () {
        state.filtroBusqueda = '';
        if (elements.searchInput) elements.searchInput.value = '';
        elements.searchClear.classList.remove('active');
        renderizarCatalogo();
      });
    }

    // Filtro por categorías
    if (elements.categoryFilters) {
      elements.categoryFilters.addEventListener('click', function (e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        state.categoriaActual = btn.getAttribute('data-category');
        actualizarBotonesCategorias();
        renderizarCatalogo();
      });
    }

    // Clicks en la grilla de productos
    if (elements.productsGrid) {
      elements.productsGrid.addEventListener('click', function (e) {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) return;

        const action = actionEl.getAttribute('data-action');
        const id = Number(actionEl.getAttribute('data-id'));

        if (action === 'view-detail') {
          abrirDetalleProducto(id);
        } else if (action === 'add-cart') {
          const prod = state.productos.find(function (p) {
            return p.id === id;
          });
          if (prod) {
            agregarAlCarrito(prod, 1);
          }
        }
      });
    }

    // Acciones en la lista del carrito
    if (elements.cartItemsList) {
      elements.cartItemsList.addEventListener('click', function (e) {
        const btn = e.target.closest('button');
        if (!btn) return;

        const action = btn.getAttribute('data-action');
        const id = Number(btn.getAttribute('data-id'));

        if (action === 'increment') {
          modificarCantidadCarrito(id, 1);
        } else if (action === 'decrement') {
          modificarCantidadCarrito(id, -1);
        } else if (action === 'remove') {
          eliminarDelCarrito(id);
        }
      });
    }

    // Apertura y cierre del carrito
    if (elements.cartToggleBtn) {
      elements.cartToggleBtn.addEventListener('click', abrirCarrito);
    }
    if (elements.cartCloseBtn) {
      elements.cartCloseBtn.addEventListener('click', cerrarCarrito);
    }
    if (elements.cartDrawerOverlay) {
      elements.cartDrawerOverlay.addEventListener('click', cerrarCarrito);
    }

    // Checkout
    if (elements.cartCheckoutBtn) {
      elements.cartCheckoutBtn.addEventListener('click', abrirCheckout);
    }
    if (elements.checkoutModalClose) {
      elements.checkoutModalClose.addEventListener('click', cerrarCheckout);
    }
    if (elements.checkoutModalOverlay) {
      elements.checkoutModalOverlay.addEventListener('click', function (e) {
        if (e.target === elements.checkoutModalOverlay) {
          cerrarCheckout();
        }
      });
    }
    if (elements.checkoutForm) {
      elements.checkoutForm.addEventListener('submit', procesarPedido);
    }
    if (elements.finishOrderBtn) {
      elements.finishOrderBtn.addEventListener('click', cerrarCheckout);
    }

    // Cierre de modal de detalle
    if (elements.productModalOverlay) {
      elements.productModalOverlay.addEventListener('click', function (e) {
        if (e.target === elements.productModalOverlay) {
          cerrarModalDetalle();
        }
      });
    }

    // Tecla Escape para cerrar modales
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        cerrarModalDetalle();
        cerrarCarrito();
        cerrarCheckout();
      }
    });
  }

  // Inicio de la aplicación
  cargarCarrito();
  cargarCatalogo();
  inicializarEventos();

  // Soporte para capturas o demostración visual
  if (window.location.search.includes('demo=detalle-carrito')) {
    setTimeout(function () {
      abrirDetalleProducto(1);
      abrirCarrito();
    }, 500);
  }
})();
