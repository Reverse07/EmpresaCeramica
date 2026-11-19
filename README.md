# Ludier · EmpresaCeramica

Tienda web para un taller de cerámica artesanal. Proyecto del curso **Herramientas de Desarrollo**, Universidad Tecnológica del Perú. El Avance 3 se presenta el **20 de noviembre de 2026 a las 10:00 a. m. (Lima)**.

| GitHub | Responsabilidad en CI | Workflow |
| --- | --- | --- |
| [@Reverse07](https://github.com/Reverse07) | Pruebas HTTP y unitarias con Node 20 y 22 | `ci-integrante-1.yml` |
| [@JhonEscriba3](https://github.com/JhonEscriba3) | ESLint y auditoría de dependencias | `calidad-integrante-2.yml` |
| [@RibauAlexander](https://github.com/RibauAlexander) | Imagen, Compose y pruebas de humo | `docker-integrante-3.yml` |

## Instalación y prueba en Windows

Desde la raíz del repositorio, en PowerShell con Node.js 20 o 22:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run lint
npm.cmd audit --omit=dev --audit-level=high
$env:ADMIN_TOKEN = [guid]::NewGuid().ToString('N')
npm.cmd start
```

Abre `http://localhost:3000/` para la tienda y `http://localhost:3000/admin` para el panel. Ingresa en el panel el `ADMIN_TOKEN` de la sesión. El carrito se guarda en el navegador. Express conserva el catálogo y los pedidos en memoria y los reinicios descartan los cambios. Compose incluye PostgreSQL con esquema y catálogo inicial independiente de la API.

| Ruta | Uso |
| --- | --- |
| `GET /` | Tienda, catálogo, filtros y carrito |
| `GET /health` | Estado HTTP de Express |
| `GET /api/productos` y `GET /api/productos/:id` | Catálogo, filtro opcional `?categoria=vajilla` y ficha |
| `POST /api/pedidos` | Registro de pedidos en la instalación local |
| `GET /admin` | Interfaz de gestión local |
| `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`, `GET /api/pedidos` y `PATCH /api/pedidos/:id` | API de gestión con cabecera `x-admin-token` o `Authorization: Bearer …` |

## Despliegue y entrega

- [Guía de Docker, Compose, Kubernetes y Render](docs/despliegue-docker.md)
- [Flujo Git y GitHub](CONTRIBUTING.md)
- [Plan de calidad y GitHub Actions](docs/calidad.md)
- [Informe de Avance del Proyecto Final 3](docs/informe-avance-3.md)

Las [capturas históricas](docs/capturas/) corresponden a la interfaz incorporada desde `develop`. El informe contiene las evidencias verificadas y los pasos para adjuntar las del despliegue.
