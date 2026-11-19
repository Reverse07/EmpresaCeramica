# Plan de Calidad - EmpresaCeramica

## Objetivo

Garantizar que el servicio REST de EmpresaCeramica cumpla con los criterios mínimos de calidad antes de cada merge a `develop`.

## Estrategia de pruebas

| Nivel | Archivo | Descripción |
|-------|---------|-------------|
| Integración | `test/app.test.js` | Pruebas HTTP contra el servidor levantado en puerto dinámico |
| Unitario | `test/productos.test.js` | Validación de integridad del catálogo en memoria |

## Criterios de aceptación

- Todas las pruebas deben pasar (`npm test`).
- El linter no debe reportar errores (`npm run lint`).
- La ruta `/health` debe responder `{ estado: "ok" }` con HTTP 200.
- Cada producto debe tener `id`, `nombre`, `categoria` y `precio` válidos.

## Ejecución local

```bash
npm ci
npm test
npm run lint
```

## CI

El workflow `.github/workflows/ci-integrante-1.yml` ejecuta las pruebas con Node 20 y 22. El workflow `calidad-integrante-2.yml` ejecuta ESLint y la auditoría de producción. Ambos se disparan en pushes a `main` o `develop`, PR dirigidos a esas ramas y de forma manual.
