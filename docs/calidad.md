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
npm install
npm test
npm run lint
```

## CI

El workflow `.github/workflows/ci-integrante-1.yml` ejecuta automáticamente las pruebas y el linter en cada push a ramas `feature/*`.
