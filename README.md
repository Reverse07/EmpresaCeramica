# Ludier — Cerámica Artesanal

Aplicación web y plataforma de comercio para **Ludier**, taller peruano de cerámica artesanal contemporánea con sede en Barranco, Lima. Proyecto Final del curso **Herramientas de Desarrollo** (UTP, 2026 – Ciclo 2 Agosto).

---

## Equipo

| Integrante | Usuario GitHub | GitHub Action a cargo |
| --- | --- | --- |
| [Integrante 1] | [@Reverse07](https://github.com/Reverse07) | `ci-integrante-1.yml` – pruebas |
| [Integrante 2] | [@usuario] | `calidad-integrante-2.yml` – lint y auditoría |
| [Integrante 3] | [@usuario] | `docker-integrante-3.yml` – imagen y Compose |

---

## Rutas de la Interfaz

- **Tienda Pública (`/`)**:
  - Portada con identidad de marca de taller artesanal.
  - Catálogo interactivo de piezas en gres y terracota con buscador y filtro por categoría (`vajilla`, `decoración`).
  - Ilustraciones vectoriales propias en SVG de cada pieza (tazas, platos, maceteros, jarrones, cuencos, teteras, etc.) con esmaltes artesanales distintivos. Precios en Soles peruanos (`S/`).
  - Vista modal de detalle técnico de la pieza (dimensiones, acabado, cocción a 1240 °C).
  - Carrito de compras con persistencia automática en `localStorage`.
  - Formulario de checkout y despacho para envío de pedidos (nombre, teléfono/WhatsApp, dirección, notas) con confirmación inmediata y código de orden (`PED-XXXX`).

- **Panel de Administración (`/admin`)**:
  - Protegido mediante token de administrador (`ADMIN_TOKEN`).
  - **Gestión de Productos**: Listado con vista previa, creación de nuevos productos (modal con selector de esmaltes y tipos de pieza), edición completa y eliminación.
  - **Gestión de Pedidos**: Panel con métricas de órdenes, desglose de datos del cliente, productos solicitados, total y cambio de estado en tiempo real (`pendiente`, `en preparación`, `entregado`).

- **Verificación de Salud (`/health`)**:
  - Endpoint utilizado por el `HEALTHCHECK` del Dockerfile y los flujos de CI (`{"estado":"ok"}`).

---

## Capturas de la Interfaz

Las capturas generadas se encuentran almacenadas en el directorio `docs/capturas/`:

1. **Tienda pública (`docs/capturas/tienda.png`)**: Portada, identidad de marca, buscador, filtros y grilla de piezas cerámicas.
2. **Detalle y carrito (`docs/capturas/detalle-carrito.png`)**: Modal de especificaciones de la pieza y cajón lateral del carrito de compras.
3. **Panel de administración (`docs/capturas/panel-admin.png`)**: Tablero de control administrativo con inventario de productos y pedidos recibidos.

---

## Variables de Entorno

Copia el archivo `.env.example` a `.env` para personalizar la configuración local:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `PORT` / `APP_PORT` | Puerto en el que escucha la aplicación | `3000` |
| `ADMIN_TOKEN` | Token de acceso para el panel y endpoints administrativos | `ludier-dev-token-2026` |
| `POSTGRES_USER` | Usuario de base de datos PostgreSQL | `ceramica` |
| `POSTGRES_PASSWORD` | Contraseña de base de datos | `cambia_esta_clave` |
| `POSTGRES_DB` | Nombre de la base de datos | `ceramica` |

---

## Ejecutar sin Docker

Requiere **Node.js 20** o superior.

```bash
npm install
npm start        # Inicia el servidor en http://localhost:3000
npm test         # Ejecuta la suite de pruebas automatizadas con node:test
npm run lint     # Validación de estilo de código con ESLint 9
npm audit --omit=dev --audit-level=high  # Auditoría de seguridad
```

Una vez iniciado el servidor:
- Accede a la tienda en: [http://localhost:3000/](http://localhost:3000/)
- Accede al panel administrativo en: [http://localhost:3000/admin](http://localhost:3000/admin) (Token por defecto: `ludier-dev-token-2026`)

---

## Ejecutar con Docker y Docker Compose

```bash
# Construir y levantar servicios
docker compose up --build -d

# Comprobar estado de salud
curl http://localhost:3000/health

# Probar la API de productos
curl http://localhost:3000/api/productos

# Detener los contenedores
docker compose down
```

---

## Endpoints de la API REST

### Públicos
- `GET /health` – Estado del servicio (`{"estado":"ok"}`).
- `GET /api/productos` – Catálogo completo (soporta filtro `?categoria=vajilla` o `?categoria=decoración`).
- `GET /api/productos/:id` – Detalle de un producto específico (404 si no existe).
- `POST /api/pedidos` – Registrar un pedido de compra (valida cliente y productos, responde 201).

### Administrativos (Requieren cabecera `x-admin-token` o `Authorization: Bearer <token>`)
- `POST /api/productos` – Crear un nuevo producto cerámico (201).
- `PUT /api/productos/:id` – Actualizar datos de un producto (200).
- `DELETE /api/productos/:id` – Eliminar un producto del catálogo (200).
- `GET /api/pedidos` – Listar todos los pedidos recibidos (200).
- `PATCH /api/pedidos/:id` – Actualizar estado del pedido (`pendiente`, `en preparación`, `entregado`) (200).

---

## Estructura del Proyecto

```
.github/workflows/       # 3 GitHub Actions para pruebas, lint/auditoría y Docker
docs/capturas/           # Capturas de pantalla de la interfaz de Ludier
src/
  ├── public/            # Archivos estáticos de la interfaz (HTML, CSS, JS)
  │    ├── css/          # style.css y admin.css
  │    ├── js/           # svg-catalog.js, store.js y admin.js
  │    ├── index.html    # Tienda pública (ruta /)
  │    └── admin.html    # Panel de administración (ruta /admin)
  ├── app.js             # Lógica de Express, endpoints y catálogo en memoria
  └── server.js          # Punto de entrada y arranque del servidor HTTP
test/
  └── app.test.js        # Pruebas automatizadas con node:test (25 pruebas)
Dockerfile               # Construcción de imagen ligera multi-stage (Node 20 Alpine)
docker-compose.yml       # Orquestación de la app y base de datos PostgreSQL
CONTRIBUTING.md          # Guía de ramas, commits convencionales y Pull Requests
README.md                # Documentación general del proyecto
```

---

## Licencia

Distribuido bajo la licencia [MIT](LICENSE).
