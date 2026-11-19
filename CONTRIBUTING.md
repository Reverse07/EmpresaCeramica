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

## Entrega del Avance 3

Cuando el equipo autorice la publicación, revisa los PR de calidad y Docker pendientes e integra los cambios del avance por PR hacia `develop`. Revisa el diff respecto a `develop` actualizado, con especial atención al arranque de Compose, los scripts de `package.json` y los workflows. Enlaza los issues en los PR y actualiza el tablero con su estado real.

Abre un PR de entrega de `develop` hacia `main`. Tras la revisión y los tres workflows en verde, actualiza tu checkout limpio de `main` y crea un tag anotado sobre el commit aprobado. Usa `v0.3.0` si el equipo confirma esa versión y el tag está libre:

```powershell
git switch main
git pull --ff-only origin main
git tag -a v0.3.0 -m "Avance 3"
git push origin refs/tags/v0.3.0
```

En GitHub Releases, publica el release a partir del tag y adjunta la URL pública verificada, la guía de ejecución y las evidencias de la entrega.

## Protección de ramas (Settings → Branches)

Para `main` y `develop`: exigir Pull Request, 1 aprobación como mínimo, que pasen los checks de los 3 workflows, y bloquear push directo y force push.
