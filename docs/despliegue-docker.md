# Guía de despliegue de EmpresaCeramica

La configuración de contenedores y el esquema inicial de PostgreSQL incorporan el trabajo de [@RibauAlexander](https://github.com/RibauAlexander).

## Docker y Docker Compose en Windows

Inicia Docker Desktop con contenedores Linux. Desde PowerShell, en la raíz:

```powershell
docker version
docker compose version
$env:APP_PORT = '3300'
$env:ADMIN_TOKEN = [guid]::NewGuid().ToString('N')
docker compose -p ceramica-avance3 config --quiet
docker compose -p ceramica-avance3 up --build --detach --wait --wait-timeout 120
docker compose -p ceramica-avance3 ps
curl.exe -fsS http://127.0.0.1:3300/health
curl.exe -fsS http://127.0.0.1:3300/api/productos
docker compose -p ceramica-avance3 exec -T db psql -U ceramica -d ceramica -c 'SELECT count(*) FROM productos'
Start-Process http://127.0.0.1:3300/
```

El Dockerfile instala dependencias de producción con `npm ci --omit=dev`, ejecuta `node src/server.js` como usuario `node` y consulta `/health`. Compose publica el puerto elegido solo en IPv4 local. Configura `ADMIN_TOKEN` en la sesión o en un `.env` local usando `.env.example` como referencia. Para verlo durante el ensayo, ejecuta `$env:ADMIN_TOKEN` en privado. El navegador permite ingresar el mismo valor en `/admin`.

PostgreSQL 16 se mantiene en la red interna y guarda sus datos en el volumen `db_data`. Ejecuta `docker/init-db/01-init.sql` al inicializar un volumen vacío. El catálogo inicial de SQL contiene cuatro filas. Si personalizaste el usuario o la base, adapta `-U` y `-d` al consultar. La aplicación Express aún lee el catálogo de doce productos y los pedidos desde memoria. Conserva el volumen al apagar:

```powershell
docker compose -p ceramica-avance3 logs --tail 30 app db
docker compose -p ceramica-avance3 down
```

## Kubernetes de Docker Desktop

En **Settings → Kubernetes**, selecciona **Enable Kubernetes → Kubeadm → Apply**, confirma la instalación si aparece y espera que el clúster esté listo. Usa el mismo Docker Desktop para construir y ejecutar. Kubeadm en Docker Desktop permite usar imágenes locales. `imagePullPolicy: Never` obliga a usar la etiqueta ya construida. Usa un clúster Kubeadm local para esta secuencia. [Documentación de Docker Desktop](https://docs.docker.com/desktop/use-desktop/kubernetes/)

```powershell
kubectl --context docker-desktop get nodes
docker build --tag empresa-ceramica:avance3 .
kubectl --context docker-desktop apply -f k8s/app.yaml
kubectl --context docker-desktop rollout status deployment/empresa-ceramica --timeout=120s
kubectl --context docker-desktop get deployments,pods,services,endpointslices
kubectl --context docker-desktop port-forward service/empresa-ceramica 8080:80
```

En otra terminal:

```powershell
curl.exe -fsS http://127.0.0.1:8080/health
curl.exe -fsS http://127.0.0.1:8080/api/productos
Start-Process http://127.0.0.1:8080/
```

Si PowerShell indica `Unable to listen on port 8080`, ese puerto local ya está ocupado. Si ya tienes un `port-forward` a `service/empresa-ceramica`, reutiliza la URL y comprueba `/health` y el catálogo con los comandos anteriores. Para iniciar una sesión nueva sin cerrar el proceso que ocupa el puerto, deja que Kubernetes elija un puerto local libre:

```powershell
kubectl --context docker-desktop port-forward service/empresa-ceramica :80
```

Usa el puerto que aparezca en la línea `Forwarding from 127.0.0.1:<puerto>` en lugar de `8080` en las URL de prueba.

El Deployment mantiene una réplica y comprueba disponibilidad y salud con HTTP. El Service ClusterIP selecciona el Pod y lleva el tráfico del puerto 80 al 3000. Para actualizar tras reconstruir con la misma etiqueta, ejecuta `kubectl --context docker-desktop rollout restart deployment/empresa-ceramica` y espera el rollout. Para diagnosticar la imagen o el arranque, usa `kubectl --context docker-desktop describe pod -l app=empresa-ceramica` y `kubectl --context docker-desktop logs deployment/empresa-ceramica`.

Si la prueba requiere el panel en Kubernetes, crea de forma privada un Secret genérico local llamado `empresa-ceramica-admin` con la clave `ADMIN_TOKEN` y reinicia el Deployment. Para terminar la exposición local, presiona **Ctrl+C** en la terminal que ejecuta `port-forward`.

## Render

1. Con autorización del equipo, sube los cambios en una rama y abre un PR a `develop`. Tras revisar los tres workflows, integra la entrega y confirma que la rama elegida para el despliegue contiene `render.yaml`.
2. En Render, abre **New → Blueprint**, conecta `Reverse07/EmpresaCeramica` y selecciona la rama de entrega. Revisa el plan disponible antes de confirmar. [Referencia de Blueprints](https://render.com/docs/blueprint-spec)
3. Render construye con `./Dockerfile`. El comando de arranque del Dockerfile es `node src/server.js`. Express escucha en `0.0.0.0:10000` mediante `PORT`. Render sondea `/health`. La variable `PUBLIC_CATALOG_ONLY=true` habilita el catálogo y el carrito sin procesar pedidos ni ofrecer el panel administrativo. [Servicios Web de Render](https://render.com/docs/web-services)
4. Si el equipo prefiere configurar el servicio manualmente, elige **New → Web Service**, runtime **Docker**, Dockerfile `./Dockerfile`, deja que se use su CMD y aplica el mismo puerto, variable de catálogo y ruta de salud.
5. Cuando el servicio esté disponible, copia la URL HTTPS asignada por Render. Comprueba la portada, el filtro, el detalle y el carrito desde un navegador. Comprueba `/health` y `/api/productos` con `curl.exe -fsS`. Registra la URL y adjunta capturas del despliegue y de la tienda visible.
