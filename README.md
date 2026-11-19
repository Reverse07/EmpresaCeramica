# EmpresaCeramica

Aplicación web para la gestión de una empresa de cerámica. Proyecto Final del curso **Herramientas de Desarrollo** (UTP, 2026 – Ciclo 2 Agosto).

## Equipo

| Integrante | Usuario GitHub | GitHub Action a cargo |
| --- | --- | --- |
| [Integrante 1] | [@Reverse07](https://github.com/Reverse07) | `ci-integrante-1.yml` – pruebas |
| [Integrante 2] | [@usuario] | `calidad-integrante-2.yml` – lint y auditoría |
| [Integrante 3] | [@RibauAlexander](https://github.com/RibauAlexander) | `docker-integrante-3.yml` – imagen y Compose |

## Endpoints disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Estado del servicio |
| GET | `/api/productos` | Catálogo completo (acepta `?categoria=`) |
| GET | `/api/productos/:id` | Producto por ID |
| GET | `/api/categorias` | Lista de categorías únicas |

Documentación detallada en [`docs/api.md`](docs/api.md).

## Ejecutar con Docker

```bash
# Producción
docker compose up --build -d
curl http://localhost:3000/health
curl http://localhost:3000/api/productos
docker compose down

# Desarrollo (con recarga de código y depurador en puerto 9229)
docker compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
```

Para cambiar el puerto o las credenciales, copia `.env.example` a `.env`.  
Atajos disponibles: `make help`.

## Ejecutar sin Docker

Requiere Node.js 20 o superior (ver `.nvmrc`).

```bash
npm install
npm start        # servidor en http://localhost:3000
npm test         # pruebas
npm run lint     # revisión de estilo
```

## Estructura

```
.github/workflows/        3 GitHub Actions (uno por integrante)
docs/                     documentación de la API
src/
  app.js                  factory de la aplicación Express
  server.js               punto de entrada
  data/                   datos en memoria (se reemplazará con PostgreSQL)
  middleware/             logger y manejador de errores
  routes/                 rutas de productos y categorías
test/                     pruebas automáticas
Dockerfile                imagen multi-etapa de producción
docker-compose.yml        aplicación + PostgreSQL
docker-compose.override.yml  override de desarrollo local
Makefile                  atajos Docker
CONTRIBUTING.md           ruta de versionamiento (ramas, commits, PRs)
```

## Herramientas del equipo

- **Control de versiones:** GitHub (ver `CONTRIBUTING.md`)
- **Colaboración:** Discord
- **Gestión de actividades:** Trello
- **Gestión de proyectos:** GitHub Projects
