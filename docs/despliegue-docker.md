# Guía de Despliegue y Arquitectura de Contenedores

**Responsable:** Alexander Ribau ([@RibauAlexander](https://github.com/RibauAlexander))  
**Rol:** Integrante 3 — Docker, Contenedores y Despliegue  
**Proyecto:** EmpresaCeramica  

---

## 1. Arquitectura de Contenedores

El entorno de ejecución contenerizado se compone de dos servicios interconectados a través de una red virtual administrada por **Docker Compose**:

```
+--------------------------------------------------------------+
|                    Red: empresa-ceramica                     |
|                                                              |
|   +-----------------------+      +-----------------------+   |
|   |   ceramica-app        |      |   ceramica-db         |   |
|   |   (Node.js 20 Alpine) | ---> |   (PostgreSQL 16)     |   |
|   |   Puerto expuesto:    |      |   Puerto interno:     |   |
|   |   ${APP_PORT:-3000}   |      |   5432                |   |
|   +-----------------------+      +-----------------------+   |
|              |                               |               |
+--------------|-------------------------------|---------------+
               |                               |
       Host (localhost:3000)        Volumen: db_data
```

### 1.1 Servicio `app` (Aplicación Express)
- **Imagen base:** `node:20-alpine`.
- **Estrategia multi-etapa (*multi-stage build*):**
  - **Etapa `deps`:** Descarga e instala únicamente las dependencias de producción (`npm ci --omit=dev`).
  - **Etapa de ejecución:** Copia las dependencias optimizadas y el código fuente. Se descartan herramientas de compilación y dependencias de testing/linting para minimizar el peso total de la imagen (<150 MB).
- **Seguridad:** La aplicación se ejecuta bajo el usuario sin privilegios `USER node` para evitar riesgos de elevación de privilegios dentro del contenedor.
- **Healthcheck:** Monitoreo periódico cada 30 segundos validando el endpoint `/health`.

### 1.2 Servicio `db` (Base de Datos PostgreSQL)
- **Imagen base:** `postgres:16-alpine`.
- **Persistencia:** Volumen nombrado `db_data` montado en `/var/lib/postgresql/data`.
- **Inicialización automática:** Scripts SQL ubicados en `./docker/init-db` montados en `/docker-entrypoint-initdb.d:ro` para poblar el esquema y catálogo al crearse el contenedor.
- **Sincronización:** El servicio `app` utiliza `depends_on: db: condition: service_healthy` garantizando que PostgreSQL acepte conexiones antes de levantar Express.

---

## 2. Requisitos Previos

- **Docker Desktop** (en Windows/macOS) o **Docker Engine + Docker Compose v2** (en Linux).
- Opcional: **Node.js 20+** si se desea usar los scripts auxiliares de `npm`.

---

## 3. Instrucciones de Despliegue

### 3.1 Configuración de Variables de Entorno
Copia la plantilla de variables de entorno antes del primer arranque:
```bash
cp .env.example .env
```

Puedes personalizar las credenciales si lo requieres:
```env
APP_PORT=3000
POSTGRES_USER=ceramica
POSTGRES_PASSWORD=tu_clave_segura
POSTGRES_DB=ceramica
```

### 3.2 Despliegue con Comandos NPM
Se han configurado accesos directos en el `package.json`:

```bash
# 1. Construir o reconstruir las imágenes
npm run docker:build

# 2. Levantar la aplicación y base de datos en segundo plano
npm run docker:up

# 3. Seguir los logs en tiempo real
npm run docker:logs

# 4. Validar sintaxis del archivo compose
npm run docker:check

# 5. Detener y remover los contenedores
npm run docker:down
```

### 3.3 Despliegue directo con Docker Compose
```bash
# Construir y levantar
docker compose up --build -d

# Verificar estado de los contenedores y healthcheck
docker compose ps

# Comprobar respuesta de la API
curl http://localhost:3000/health
curl http://localhost:3000/api/productos

# Bajar servicios conservando los datos de la base de datos
docker compose down

# Bajar servicios eliminando volúmenes (reinicio limpio)
docker compose down --volumes
```

---

## 4. Pipeline de CI/CD (GitHub Actions)

El archivo `.github/workflows/docker-integrante-3.yml` automatiza la verificación en cada PR y push hacia `main` y `develop`:
1. Valida la sintaxis de `docker-compose.yml`.
2. Compila la imagen con el Dockerfile multi-etapa.
3. Levanta la aplicación completa esperando el estado `healthy`.
4. Ejecuta pruebas de humo contra `/health` y `/api/productos`.
5. Permite ejecución manual a través del trigger `workflow_dispatch`.

---

## 5. Solución de Problemas Frecuentes

* **Conflicto de puerto 3000:**  
  Si el puerto 3000 está en uso en el host, define `APP_PORT=3001` en tu archivo `.env`.
* **Reiniciar base de datos desde cero:**  
  Ejecutar `docker compose down -v` y luego `docker compose up --build -d` para volver a ejecutar el script `./docker/init-db/01-init.sql`.
* **Revisar logs específicos de PostgreSQL:**  
  Ejecutar `docker compose logs -f db`.
