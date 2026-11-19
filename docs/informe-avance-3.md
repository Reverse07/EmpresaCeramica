# Informe de Avance del Proyecto Final 3

**Universidad Tecnológica del Perú**  
**Curso** Herramientas de Desarrollo  
**Proyecto** Ludier · EmpresaCeramica  
**Presentación** 20 de noviembre de 2026, 10:00 a. m. (hora de Lima)  
**Equipo** Reverse07, JhonEscriba3 y RibauAlexander (usuarios de GitHub)

## 1. Objetivo y alcance

EmpresaCeramica es un proyecto académico de la Universidad Tecnológica del Perú. Ludier es la tienda ficticia de cerámica artesanal que el equipo usa para demostrar la aplicación. El avance integra la tienda, verifica su ejecución con Node.js, Docker Compose y Kubernetes de Docker Desktop, y publica el catálogo en Render.

## 2. Arquitectura

El navegador carga la tienda HTML, CSS y JavaScript desde Express y consulta la API del mismo origen. La tienda ofrece catálogo, filtros, detalle y carrito. El carrito persiste en el navegador. En local, el servidor recibe pedidos y permite gestionar productos y estados con un token de administración. En Render se publica en modo catálogo, con pedidos y administración deshabilitados. Kubernetes ejecuta una réplica de Express y la expone mediante un Service ClusterIP.

**Persistencia.** PostgreSQL funciona en Docker Compose y conserva en un volumen su esquema y catálogo inicial de cuatro filas. La integración de PostgreSQL con la API Express sigue pendiente. Express sirve 12 productos desde memoria y los cambios de catálogo y pedidos se pierden al reiniciar el proceso. Por eso, la tienda pública puede funcionar sin aprovisionar PostgreSQL.

## 3. Evidencias de Git y GitHub

| Evidencia | Estado al 19/11/2026 |
| --- | --- |
| Commits y ramas | El despliegue público se verificó con el commit `849080b`, que introdujo la configuración de Render en el PR #10 desde `feature/avance3-despliegue`. [Commit](https://github.com/Reverse07/EmpresaCeramica/commit/849080ba7cc1edd96fd59fd10cc225948a5e8bc5) |
| Merge y Pull Requests | El PR #1 de interfaz se fusionó en `develop`. El PR #10 está abierto y apunta a `develop`. Los PR #6 y #9 contienen los aportes de calidad y Docker. [PR #1](https://github.com/Reverse07/EmpresaCeramica/pull/1) · [PR #6](https://github.com/Reverse07/EmpresaCeramica/pull/6) · [PR #9](https://github.com/Reverse07/EmpresaCeramica/pull/9) · [PR #10](https://github.com/Reverse07/EmpresaCeramica/pull/10) |
| Issues | Se verificaron seis abiertos para tienda, administración, validación, pruebas, PostgreSQL y despliegue. [Issues](https://github.com/Reverse07/EmpresaCeramica/issues) |
| GitHub Projects | Tablero público «EmpresaCeramica - Ludier», abierto y con tres elementos al consultar. [Tablero del equipo](https://github.com/users/Reverse07/projects/1) |
| Tags y releases | La API de GitHub devolvió cero tags y cero releases. Tras aprobar la entrega, crear un tag anotado sobre el commit integrado y publicar el release asociado. |
| README y guías | README base presente en GitHub. Esta entrega local actualiza el [README](../README.md), remite al [flujo Git](../CONTRIBUTING.md) e incluye [instrucciones de despliegue](despliegue-docker.md). |

## 4. Integración continua por integrante

El PR #10 registró **cinco jobs exitosos en tres workflows** para el commit `849080b`. Cada enlace apunta al resultado de un job de ese PR. [Checks del PR #10](https://github.com/Reverse07/EmpresaCeramica/pull/10/checks)

| Integrante | Workflow | Jobs exitosos |
| --- | --- | --- |
| Reverse07 | `ci-integrante-1.yml` | [Pruebas con Node 20](https://github.com/Reverse07/EmpresaCeramica/actions/runs/44472740568/job/135385883959) · [Pruebas con Node 22](https://github.com/Reverse07/EmpresaCeramica/actions/runs/44472740568/job/135385884241) |
| JhonEscriba3 | `calidad-integrante-2.yml` | [ESLint](https://github.com/Reverse07/EmpresaCeramica/actions/runs/44472740573/job/135385884018) · [Auditoría de dependencias](https://github.com/Reverse07/EmpresaCeramica/actions/runs/44472740573/job/135385883772) |
| RibauAlexander | `docker-integrante-3.yml` | [Construir imagen y probar Compose](https://github.com/Reverse07/EmpresaCeramica/actions/runs/44472740528/job/135385883806) |

## 5. Verificación técnica

| Entorno | Resultado observado |
| --- | --- |
| Node.js | 30 pruebas superadas en Windows con Node 22 y en contenedor con Node 20. ESLint sin errores. La auditoría de producción informó cero vulnerabilidades en la consulta. |
| Docker Compose | Imagen construida y servicios Express y PostgreSQL saludables. La tienda respondió HTTP 200, `/health` respondió con `estado: ok` y la consulta SQL encontró cuatro productos iniciales. |
| Kubernetes | Nodo `docker-desktop` listo en v1.32.2. Deployment disponible, Pod `1/1 Running` con cero reinicios y Service ClusterIP en el puerto 80 con un endpoint en el puerto 3000. Por `port-forward`, la tienda respondió HTTP 200, `/health` informó `ok` y el catálogo devolvió 12 productos. |
| Render | Servicio público **Live**, plan **Free**, según el panel reportado por el equipo. Rama `feature/avance3-despliegue`, commit `849080b`. PowerShell confirmó HTTP 200 en la portada, `/health` con `{"estado":"ok"}` y `/api/productos` con 12 productos. [Tienda HTTPS](https://empresa-ceramica-ludier.onrender.com/) |

## 6. Evidencias para adjuntar

| Evidencia | Enlace o comprobación | Espacio para captura real |
| --- | --- | --- |
| Render | [Tienda HTTPS](https://empresa-ceramica-ludier.onrender.com/) · [Salud](https://empresa-ceramica-ludier.onrender.com/health) · [Catálogo JSON](https://empresa-ceramica-ludier.onrender.com/api/productos) | **Pendiente.** Panel Render con estado Live, plan, rama y commit. |
| GitHub Actions | [Checks del PR #10](https://github.com/Reverse07/EmpresaCeramica/pull/10/checks) | **Opcional.** Vista de los cinco jobs aprobados. |
| Docker Desktop | [Comandos de Compose y consulta SQL](despliegue-docker.md) | **Pendiente.** Servicios `ceramica-app` y `ceramica-db` saludables. |
| Kubernetes | [Comandos de Kubernetes y port-forward](despliegue-docker.md) | **Pendiente.** Deployment listo, Pod `1/1 Running`, Service y respuesta de `/health` a través del port-forward. |

Las [capturas históricas de la tienda](capturas/) documentan la interfaz. Adjuntar las capturas de infraestructura en los espacios señalados cuando el equipo las tome.

## 7. Guion de exposición (6 minutos)

| Tiempo | Integrante | Qué decir y qué mostrar |
| --- | --- | --- |
| 0:00–2:00 | **Reverse07** | **0:00–0:30.** Presentar el objetivo académico y el escenario ficticio. **0:30–1:30.** Abrir la tienda HTTPS, filtrar la categoría Vajilla, abrir la ficha de un producto y añadirlo al carrito. **1:30–2:00.** Mostrar `/health` y el catálogo JSON de 12 productos. «La versión pública permite explorar la tienda y usar el carrito. Mostramos la gestión de pedidos en la instalación local». |
| 2:00–4:00 | **JhonEscriba3** | **2:00–2:30.** Abrir el PR #10 y señalar rama, destino y commit. **2:30–3:30.** Mostrar los cinco jobs exitosos y explicar qué valida cada workflow. **3:30–4:00.** Citar las 30 pruebas y mostrar un ejemplo de cobertura, como el acceso restringido a la API administrativa. |
| 4:00–6:00 | **RibauAlexander** | **4:00–4:50.** Mostrar los servicios saludables de Compose y la consulta que devuelve cuatro filas. «PostgreSQL está operativo en Compose. Express todavía usa datos en memoria». **4:50–5:40.** Mostrar el Deployment, el Pod, el Service y la respuesta de `/health` mediante `port-forward`. **5:40–6:00.** Cerrar con la versión en Render y la integración de PostgreSQL como trabajo futuro. |

## 8. Pendientes de entrega

- Adjuntar las capturas reales de Render, Docker Desktop y Kubernetes.
- Completar la revisión e integración del PR #10 y publicar el tag y release de la entrega cuando el equipo autorice esas acciones. Registrar el enlace al release.
