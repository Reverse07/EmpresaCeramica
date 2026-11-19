# Documentación de la API — EmpresaCeramica

Base URL: `http://localhost:3000`

---

## Estado del servicio

### `GET /health`

Verifica que la aplicación está en línea. Usado por el HEALTHCHECK del Dockerfile.

**Respuesta exitosa `200`:**
```json
{ "estado": "ok" }
```

---

## Productos

### `GET /api/productos`

Devuelve el catálogo completo de productos. Acepta filtro opcional por categoría.

**Parámetros de consulta:**

| Parámetro  | Tipo   | Requerido | Descripción                        |
|------------|--------|-----------|------------------------------------|
| `categoria`| string | No        | Filtra productos por categoría     |

**Ejemplo sin filtro:**
```
GET /api/productos
```
```json
[
  { "id": 1, "nombre": "Taza de cerámica esmaltada", "categoria": "vajilla", "precio": 18.5 },
  { "id": 3, "nombre": "Macetero mediano", "categoria": "decoración", "precio": 35.0 }
]
```

**Ejemplo con filtro:**
```
GET /api/productos?categoria=vajilla
```

---

### `GET /api/productos/:id`

Devuelve un producto por su identificador numérico.

**Parámetros de ruta:**

| Parámetro | Tipo    | Descripción           |
|-----------|---------|-----------------------|
| `id`      | integer | ID del producto       |

**Respuesta exitosa `200`:**
```json
{ "id": 1, "nombre": "Taza de cerámica esmaltada", "categoria": "vajilla", "precio": 18.5 }
```

**Error `404`:**
```json
{ "error": "Producto no encontrado" }
```

---

## Categorías

### `GET /api/categorias`

Devuelve las categorías únicas disponibles en el catálogo, ordenadas alfabéticamente.

**Respuesta exitosa `200`:**
```json
{ "categorias": ["decoración", "vajilla"] }
```

---

## Códigos de estado

| Código | Significado                        |
|--------|------------------------------------|
| 200    | Solicitud exitosa                  |
| 404    | Recurso no encontrado              |
| 500    | Error interno del servidor         |
