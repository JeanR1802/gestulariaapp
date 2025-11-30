# Script de Diagnóstico para Sitio Público

## ¿Por qué el sitio público no muestra bloques?

Este documento te ayudará a diagnosticar paso a paso por qué el sitio público puede no estar mostrando bloques.

## Pasos de Diagnóstico

### 1. Verificar que existe un tenant con el slug correcto

Abre tu base de datos (JSON) en `lib/database.js` o donde esté almacenada y verifica:
- ¿Existe un tenant con el slug que estás usando en la URL?
- Ejemplo: si visitas `http://localhost:3000/mitienda`, debe existir un tenant con `slug: "mitienda"`

### 2. Verificar que el tenant tiene páginas

- ¿El tenant tiene un array `pages`?
- ¿Hay al menos una página en el array?

### 3. Verificar que hay una página publicada con slug "/"

- Busca en el array de páginas una que tenga `slug: "/"` y `published: true`
- Si no existe, se tomará la primera página del array

### 4. Verificar que la página tiene contenido

- La página debe tener una propiedad `content` que NO esté vacía
- El `content` debe ser un string JSON válido

### 5. Verificar el formato del contenido

El contenido debe ser un array de bloques en formato JSON:

```json
[
  {
    "id": "block-123",
    "type": "header",
    "data": {
      "variant": "default",
      "logoText": "Mi Logo",
      ...
    }
  },
  {
    "id": "block-456",
    "type": "hero",
    "data": {
      "title": "Bienvenido",
      ...
    }
  }
]
```

**IMPORTANTE**: Cada bloque DEBE tener:
- Un `id` único
- Un `type` válido (header, hero, cards, etc.)
- Un objeto `data` con las propiedades del bloque

### 6. Casos comunes de problemas

#### Problema: Content es un string vacío
```json
{
  "content": ""
}
```
**Solución**: Guarda al menos un bloque desde el editor.

#### Problema: Content no es un JSON válido
```json
{
  "content": "[object Promise]"
}
```
**Solución**: Hay un bug en el código de guardado. Asegúrate de que se use `JSON.stringify()` correctamente.

#### Problema: Bloques sin propiedad `data`
```json
[
  {
    "id": "block-123",
    "type": "header"
    // ❌ Falta la propiedad "data"
  }
]
```
**Solución**: Todos los bloques deben tener un objeto `data` con sus propiedades.

#### Problema: Content es un objeto en vez de un array
```json
{
  "content": "{\"blocks\": [...]}"
}
```
**Solución**: El content debe ser directamente un array, no un objeto con una propiedad blocks.

### 7. Verificar los logs en la consola del servidor

Con los logs agregados, deberías ver en la terminal del servidor:

```
🔍 [GET /api/site/[slug]] Slug: mitienda
🔍 [GET /api/site/[slug]] Tenant found: true
🔍 [GET /api/site/[slug]] Page found: true has content: true
🔍 [GET /api/site/[slug]] Blocks parsed: true count: 3
🔍 [GET /api/site/[slug]] Blocks: [... JSON de los bloques ...]
🔍 [GET /api/site/[slug]] HTML generated, length: 5234
🔍 [GET /api/site/[slug]] HTML preview (first 500 chars): <!doctype html>...
```

Si ves algo diferente, ahí está el problema:

- **Tenant found: false** → El slug no existe en la base de datos
- **Page found: false** → No hay páginas o ninguna cumple los criterios
- **has content: false** → La página no tiene contenido guardado
- **Blocks parsed: false** → El JSON no es válido
- **count: 0** → El array está vacío

### 8. Cómo verificar manualmente la base de datos

Busca el archivo donde se almacenan los tenants (probablemente `lib/database.js` o similar) y verifica el formato:

```javascript
{
  tenants: [
    {
      id: 1,
      name: "Mi Tienda",
      slug: "mitienda",
      pages: [
        {
          title: "Home",
          slug: "/",
          published: true,
          content: "[{\"id\":\"block-1\",\"type\":\"header\",\"data\":{...}}]"
        }
      ]
    }
  ]
}
```

### 9. Solución rápida: Recrear el sitio desde el editor

1. Ve al dashboard del tenant
2. Edita la página
3. Agrega al menos un bloque (por ejemplo, un header)
4. Guarda
5. Intenta ver el sitio público de nuevo

### 10. Verificar la ruta del sitio público

La URL correcta es: `http://localhost:3000/{slug-del-tenant}`

Por ejemplo:
- Si el tenant tiene `slug: "mitienda"` → `http://localhost:3000/mitienda`
- Si el tenant tiene `slug: "demo"` → `http://localhost:3000/demo`

NO uses rutas como:
- ❌ `http://localhost:3000/api/site/mitienda` (esto es el endpoint de la API)
- ❌ `http://localhost:3000/dashboard/sites/1` (esto es el editor)

## Archivo de logs instrumentado

Los siguientes archivos ahora tienen logs adicionales para ayudar en el diagnóstico:

### `app/api/site/[slug]/route.js`
- Log del slug recibido
- Log de si el tenant fue encontrado
- Log de si la página fue encontrada
- Log de los bloques parseados
- Log del HTML generado

### `app/lib/render-blocks-to-html.js`
- Log al iniciar el render
- Log de cada bloque individual siendo renderizado
- Log si los bloques no son un array

## Siguiente paso después del diagnóstico

Una vez que hayas identificado dónde está el problema:

1. **Si el problema es que no hay datos**: Crea un sitio desde el editor y guarda bloques
2. **Si el problema es formato inválido**: Revisa el código de guardado en el dashboard
3. **Si el problema es un tipo de bloque no soportado**: Verifica que el tipo esté en la lista de cases del switch en `render-blocks-to-html.js`

## Ejecutar el servidor con logs

```powershell
npm run dev
```

Luego visita tu sitio público y mira los logs en la terminal.

Si ves `🔍 [GET /api/site/[slug]]` significa que el endpoint se está ejecutando. Revisa qué información aparece después.
