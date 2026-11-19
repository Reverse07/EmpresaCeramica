# Informe de Avance del Proyecto Final 3

**Universidad Tecnológica del Perú**  
**Curso** Herramientas de Desarrollo  
**Proyecto** Ludier · EmpresaCeramica  
**Presentación** 20 de noviembre de 2026, 10:00 a. m. (hora de Lima)  
**Equipo** Reverse07, JhonEscriba3 y RibauAlexander (usuarios de GitHub)

## 1. Objetivo y alcance

Integrar la tienda de cerámica y verificar que la entrega pueda ejecutarse con Node.js, Docker Compose y Kubernetes de Docker Desktop. Preparar el catálogo para exposición pública en Render y documentar el flujo de trabajo colaborativo y de integración continua.

## 2. Arquitectura

El navegador carga la tienda HTML, CSS y JavaScript desde Express y consulta la API del mismo origen. La tienda ofrece catálogo, filtros, detalle y carrito. En local, el servidor recibe pedidos y permite gestionar productos y estados con un token de administración definido en el entorno. El carrito persiste en el navegador. Los pedidos y cambios del catálogo de Express se guardan en memoria. Compose levanta PostgreSQL de forma independiente con un volumen y un script de inicialización. Kubernetes ejecuta una réplica de Express y la expone mediante un Service ClusterIP.

## 3. Evidencias de Git y GitHub

| Evidencia | Estado al 19/11/2026 |
| --- | --- |
| Commits y ramas | `main` en `a0f758a` y `develop` en `7728e6c` en las referencias locales consultadas. GitHub confirmó `main`, `develop` y las ramas de interfaz, calidad y Docker. [Repositorio](https://github.com/Reverse07/EmpresaCeramica) |
| Merge y Pull Requests | El [PR #1 de interfaz](https://github.com/Reverse07/EmpresaCeramica/pull/1) se fusionó en `develop`. Los [PR #6 de calidad](https://github.com/Reverse07/EmpresaCeramica/pull/6) y [#9 de Docker](https://github.com/Reverse07/EmpresaCeramica/pull/9) seguían abiertos al consultar GitHub. |
| Issues | Se verificaron seis abiertos para tienda, administración, validación, pruebas, PostgreSQL y despliegue. [Issues](https://github.com/Reverse07/EmpresaCeramica/issues) |
| GitHub Projects | Tablero público «EmpresaCeramica - Ludier», abierto y con tres elementos al consultar. [Tablero del equipo](https://github.com/users/Reverse07/projects/1) |
| Tags y releases | La API de GitHub devolvió cero tags y cero releases. Tras aprobar la entrega, crear un tag anotado sobre el commit integrado y publicar el release asociado. |
| README y guías | README base presente en GitHub. Esta entrega local actualiza el [README](../README.md), remite al [flujo Git](../CONTRIBUTING.md) e incluye [instrucciones de despliegue](despliegue-docker.md). |

## 4. Integración continua por integrante

Los tres workflows se ejecutan al hacer push a `main` o `develop`, al abrir o actualizar PR dirigidos a esas ramas y manualmente cuando el workflow está disponible en la rama por defecto. Las siguientes ejecuciones exitosas corresponden al historial de `develop`. Los cambios de esta entrega requieren nuevas ejecuciones después de subir la rama.

| Integrante | Validación | Ejecución exitosa en GitHub |
| --- | --- | --- |
| Reverse07 | Pruebas unitarias y HTTP en Node 20 y 22 | [CI de pruebas](https://github.com/Reverse07/EmpresaCeramica/actions/runs/39964936943) |
| JhonEscriba3 | ESLint y auditoría de dependencias de producción | [Control de calidad](https://github.com/Reverse07/EmpresaCeramica/actions/runs/39964936966) |
| RibauAlexander | Construcción, Compose y prueba de humo | [Docker y Compose](https://github.com/Reverse07/EmpresaCeramica/actions/runs/39964937078) |

## 5. Verificación técnica

| Entorno | Resultado observado |
| --- | --- |
| Node.js | 30 pruebas superadas en Windows con Node 22 y en contenedor con Node 20. ESLint sin errores. La auditoría de producción informó cero vulnerabilidades en la consulta. |
| Docker Compose | Imagen construida y servicios Express y PostgreSQL saludables. La tienda respondió HTTP 200, `/health` respondió con `estado: ok` y la consulta SQL encontró cuatro productos iniciales. |
| Kubernetes | Nodo `docker-desktop` listo en v1.32.2. Deployment disponible, Pod `1/1 Running` con cero reinicios y Service ClusterIP en el puerto 80 con un endpoint en el puerto 3000. Por `port-forward`, la tienda respondió HTTP 200, `/health` informó `ok` y el catálogo devolvió 12 productos. |
| Render | Blueprint preparado. En Docker local con `PORT=10000` y `PUBLIC_CATALOG_ONLY=true`, la tienda y `/health` respondieron correctamente. El panel y la API de pedidos devolvieron HTTP 404. La publicación y la URL HTTPS están pendientes de autorización. |

## 6. Demostración y cierre

1. **Reverse07** muestra el catálogo, los filtros y el carrito. En local, registra un pedido de prueba con datos ficticios y lo revisa desde el panel.
2. **JhonEscriba3** presenta las pruebas, el linter, los tres workflows y las evidencias del tablero, issues y PR.
3. **RibauAlexander** muestra Compose, consulta el esquema inicial, enseña el Pod y el Service, y abre el servicio con `port-forward`. Tras publicar en Render, comprueba la tienda HTTPS y `/health`.

Antes de entregar, adjuntar la URL pública confirmada, la ejecución de CI del commit presentado, el enlace al release y capturas de Compose, Kubernetes y Render. Las imágenes en `docs/capturas/` son evidencias históricas de la interfaz.
