# Ruta de versionamiento

## Ramas

| Rama | Propósito | Se crea desde | Se integra en |
| --- | --- | --- | --- |
| `main` | Código estable y entregable (cada merge se etiqueta) | – | – |
| `develop` | Integración del trabajo del equipo | `main` | `main` (en cada release) |
| `feature/<n°issue>-<nombre>` | Funcionalidad nueva | `develop` | `develop` |
| `fix/<n°issue>-<nombre>` | Corrección de un error | `develop` | `develop` |
| `docs/<tema>` | Solo documentación | `develop` | `develop` |
| `release/vX.Y.Z` | Congelar y probar una entrega | `develop` | `main` y `develop` |

## Flujo de una tarea

```bash
# 1. Partir de develop actualizado
git checkout develop
git pull origin develop
git checkout -b feature/12-catalogo-productos

# 2. Trabajar con commits pequeños (Conventional Commits)
git add .
git commit -m "feat: agrega filtro de productos por categoría"

# 3. Antes de abrir el PR, actualizar la rama
git fetch origin
git rebase origin/develop      # si hay conflictos: resolverlos, git add, git rebase --continue

# 4. Subir la rama y abrir el Pull Request hacia develop
git push -u origin feature/12-catalogo-productos
```

5. Los 3 GitHub Actions deben quedar en verde.
6. Otro integrante revisa y aprueba (nadie aprueba su propio PR).
7. Se fusiona con **Squash and merge** y se borra la rama.

## Mensajes de commit

Formato: `tipo: descripción corta en minúscula`

| Tipo | Uso |
| --- | --- |
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de error |
| `docs` | Documentación |
| `test` | Pruebas |
| `chore` | Mantenimiento, dependencias, configuración |
| `ci` | Workflows y Docker |

## Releases

```bash
git checkout develop && git pull
git checkout -b release/v0.2.0
# pruebas finales y ajustes menores
git checkout main && git merge --no-ff release/v0.2.0
git tag -a v0.2.0 -m "Avance 2"
git push origin main --tags
git checkout develop && git merge --no-ff release/v0.2.0 && git push origin develop
```

Luego se publica el Release en GitHub a partir del tag.

## Protección de ramas (Settings → Branches)

Para `main` y `develop`: exigir Pull Request, 1 aprobación como mínimo, que pasen los checks de los 3 workflows, y bloquear push directo y force push.
