# EmpresaCeramica

Aplicación web para la gestión de una empresa de cerámica. Proyecto Final del curso **Herramientas de Desarrollo** (UTP, 2026 – Ciclo 2 Agosto).

## Equipo

| Integrante | Usuario GitHub | GitHub Action a cargo |
| --- | --- | --- |
| [Integrante 1] | [@Reverse07](https://github.com/Reverse07) | `ci-integrante-1.yml` – pruebas |
| [Integrante 2] | [@usuario] | `calidad-integrante-2.yml` – lint y auditoría |
| Alexander Ribau | [@RibauAlexander](https://github.com/RibauAlexander) | `docker-integrante-3.yml` – imagen y Compose |

## Ejecutar con Docker

```bash
docker compose up --build -d
curl http://localhost:3000/health
curl http://localhost:3000/api/productos
docker compose down
```

Para cambiar el puerto o las credenciales de la base, copia `.env.example` a `.env`. Para una explicación detallada de arquitectura, scripts de npm y comandos, consulta la [Guía de Despliegue con Docker](docs/despliegue-docker.md).

## Ejecutar sin Docker

Requiere Node.js 20 o superior.

```bash
npm install
npm start        # servidor en http://localhost:3000
npm test         # pruebas
npm run lint     # revisión de estilo
```

## Estructura

```
.github/workflows/   3 GitHub Actions (uno por integrante)
docs/                documentación del proyecto y guía de despliegue
docker/init-db/      script SQL de inicialización de la base de datos
src/                 código de la aplicación
test/                pruebas automáticas
Dockerfile           imagen de la aplicación
docker-compose.yml   aplicación + PostgreSQL
CONTRIBUTING.md      ruta de versionamiento (ramas, commits, Pull Requests)
```

## Herramientas del equipo

- **Control de versiones:** GitHub (ver `CONTRIBUTING.md`)
- **Colaboración:** Discord
- **Gestión de actividades:** Trello
- **Gestión de proyectos:** GitHub Projects
