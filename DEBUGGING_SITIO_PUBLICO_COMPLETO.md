# Resumen de Instrumentación para Diagnóstico del Sitio Público

## Cambios Realizados

Se han agregado logs extensivos para diagnosticar por qué el sitio público no muestra bloques.

### Archivos Modificados

#### 1. `app/api/site/[slug]/route.js`

Se agregaron logs en cada paso del proceso:

```javascript
console.log('🔍 [GET /api/site/[slug]] Slug:', slug);
console.log('🔍 [GET /api/site/[slug]] Tenant found:', !!tenant);
console.log('🔍 [GET /api/site/[slug]] Page found:', !!page, 'has content:', !!page?.content);
console.log('🔍 [GET /api/site/[slug]] Blocks parsed:', Array.isArray(blocks), 'count:', blocks?.length);
console.log('🔍 [GET /api/site/[slug]] Blocks:', JSON.stringify(blocks, null, 2));
console.log('🔍 [GET /api/site/[slug]] HTML generated, length:', fullHtml?.length);
console.log('🔍 [GET /api/site/[slug]] HTML preview (first 500 chars):', fullHtml?.substring(0, 500));
```

También se cambió `renderBlocksToHTML` para usar `await` (era necesario porque la función puede ser async):

```javascript
const fullHtml = await renderBlocksToHTML(blocks, { cssUrl: '/_next/static/css/tailwind.css' });
```

#### 2. `app/lib/render-blocks-to-html.js`

Se agregaron logs en la función `legacyRender`:

```javascript
console.log('🎨 [legacyRender] Starting render, blocks:', Array.isArray(blocks), 'count:', blocks?.length);
console.log(`🎨 [legacyRender] Rendering block ${index}:`, block?.type);
```

## Cómo Usar Esta Instrumentación

### Paso 1: Iniciar el servidor

```powershell
npm run dev
```

### Paso 2: Visitar el sitio público

Abre tu navegador y ve a: `http://localhost:3000/{tu-slug}`

Por ejemplo: `http://localhost:3000/mitienda`

### Paso 3: Revisar los logs en la terminal

En la terminal donde ejecutaste `npm run dev`, deberías ver una secuencia de logs como esta:

#### Ejemplo de logs exitosos:

```
🔍 [GET /api/site/[slug]] Slug: mitienda
🔍 [GET /api/site/[slug]] Tenant found: true
🔍 [GET /api/site/[slug]] Page found: true has content: true
🔍 [GET /api/site/[slug]] Blocks parsed: true count: 3
🔍 [GET /api/site/[slug]] Blocks: [
  {
    "id": "block-123",
    "type": "header",
    "data": {
      "variant": "custom",
      "customElements": [...],
      ...
    }
  },
  {
    "id": "block-456",
    "type": "hero",
    "data": {...}
  }
]
🎨 [legacyRender] Starting render, blocks: true count: 3
🎨 [legacyRender] Rendering block 0: header
🎨 [legacyRender] Rendering block 1: hero
🎨 [legacyRender] Rendering block 2: footer
🔍 [GET /api/site/[slug]] HTML generated, length: 5234
🔍 [GET /api/site/[slug]] HTML preview (first 500 chars): <!doctype html>...
```

## Interpretación de los Logs

### 🔴 Problema: "Tenant found: false"

**Causa**: El slug no existe en la base de datos.

**Solución**: 
1. Verifica que creaste un tenant con ese slug
2. Revisa el archivo de base de datos (si usas JSON)
3. Comprueba que el slug en la URL coincide exactamente (case-sensitive)

### 🔴 Problema: "Page found: false"

**Causa**: El tenant no tiene páginas o ninguna página cumple los criterios (slug="/" y published=true).

**Solución**:
1. Ve al dashboard del tenant
2. Crea una página con slug "/"
3. Márcala como publicada
4. Guárdala

### 🔴 Problema: "has content: false"

**Causa**: La página existe pero no tiene contenido guardado.

**Solución**:
1. Ve al editor del sitio
2. Agrega al menos un bloque
3. Guarda (botón Guardar)
4. Recarga el sitio público

### 🔴 Problema: "Blocks parsed: false"

**Causa**: El contenido no es un JSON válido.

**Solución**:
1. Revisa el log que muestra el contenido
2. Si ves algo como `[object Promise]`, hay un bug en el guardado
3. Si ves JSON malformado, revisa el código de guardado
4. Guarda de nuevo desde el editor

### 🔴 Problema: "count: 0"

**Causa**: El array de bloques está vacío.

**Solución**:
1. Agrega bloques desde el editor
2. Guarda
3. Recarga

### 🔴 Problema: "Rendering block X: undefined"

**Causa**: El bloque no tiene la propiedad `type` definida.

**Solución**:
1. Revisa el JSON de los bloques en los logs
2. Asegúrate de que cada bloque tenga `id`, `type` y `data`
3. Si falta información, guarda de nuevo desde el editor

### 🔴 Problema: "HTML generated, length: 0" o muy corto

**Causa**: Los bloques se parsearon pero no se renderizaron.

**Posibles causas**:
1. Los bloques no tienen la propiedad `data`
2. El tipo de bloque no está soportado en `render-blocks-to-html.js`
3. Hay un error en el renderizado

**Solución**:
1. Revisa los logs de legacyRender
2. Busca warnings como "Bloque de tipo X no tiene datos"
3. Verifica que el tipo del bloque esté en el switch-case de `render-blocks-to-html.js`

## Casos Especiales

### Headers Personalizados (variant: 'custom')

Para que un header personalizado se renderice correctamente, debe tener:

```json
{
  "id": "header-1",
  "type": "header",
  "data": {
    "variant": "custom",
    "headerMode": "advanced",
    "customElements": [
      {
        "id": "el-1",
        "type": "logo",
        "data": {
          "zone": "left",
          "content": "Mi Logo"
        }
      }
      // ... más elementos
    ],
    "paddingLeft": 20,
    "paddingRight": 20,
    "backgroundColor": "bg-white",
    "logoColor": "text-slate-800",
    "linkColor": "text-slate-600",
    "buttonBgColor": "bg-blue-600"
  }
}
```

Cada elemento en `customElements` debe tener:
- `id`: identificador único
- `type`: tipo de elemento (logo, link, button, etc.)
- `data.zone`: 'left', 'center', o 'right'
- `data.content`: el contenido del elemento

## Verificar el HTML en el Navegador

Si los logs muestran que el HTML se generó correctamente pero no ves nada en el navegador:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Busca la petición a tu slug (ej. `mitienda`)
5. Haz clic en ella
6. Ve a la pestaña "Response"
7. Verifica que el HTML está ahí

Si el HTML está en la respuesta pero no se ve:

1. Ve a la pestaña "Elements" o "Inspector"
2. Busca el `<body>` en el DOM
3. Verifica que los bloques estén ahí
4. Si están pero no se ven, puede ser un problema de CSS:
   - Verifica que Tailwind CSS se está cargando
   - Revisa la consola en busca de errores 404 de CSS

## Quitar los Logs Después

Una vez que hayas resuelto el problema, puedes quitar los logs para limpiar la consola:

1. Busca todos los `console.log` que agregamos (tienen el emoji 🔍 o 🎨 o 🔴)
2. Elimínalos o coméntalos

O simplemente déjalos, no afectan el funcionamiento y pueden ser útiles para futuro debugging.

## Comandos Útiles

```powershell
# Ver si el servidor está corriendo
Get-Process node

# Matar todos los procesos de Node (si algo quedó colgado)
Get-Process node | Stop-Process

# Limpiar caché de Next.js
Remove-Item .next -Recurse -Force
npm run dev
```

## Resumen del Flujo de Datos

```
1. Usuario visita: http://localhost:3000/mitienda
   ↓
2. Middleware NO intercepta (porque es localhost)
   ↓
3. Next.js busca una ruta que coincida
   ↓
4. NO hay ruta `/mitienda` definida
   ↓
5. Next.js ejecuta el middleware
   ↓
6. Middleware reescribe a: /api/site/mitienda
   ↓
7. Se ejecuta: app/api/site/[slug]/route.js
   ↓
8. GET route:
   - Obtiene el slug de params
   - Busca el tenant con getTenantBySlug(slug)
   - Encuentra la página (slug "/" y published)
   - Parsea page.content como JSON
   - Llama a renderBlocksToHTML(blocks)
   - Retorna HTML completo
   ↓
9. render-blocks-to-html.js:
   - Intenta usar React SSR si está disponible
   - Si no, usa legacyRender()
   - legacyRender() recorre cada bloque
   - Para cada bloque, renderiza HTML según su tipo
   - Retorna HTML completo con head y body
   ↓
10. El HTML se envía al navegador
    ↓
11. El navegador renderiza el HTML
```

## Si Nada Funciona

1. Verifica que tienes un tenant en la base de datos
2. Verifica que el tenant tiene al menos una página
3. Desde el dashboard, edita el sitio
4. Agrega un bloque simple (por ejemplo, un Hero)
5. Guarda
6. Revisa los logs en la terminal
7. Si no ves NINGÚN log, el endpoint no se está ejecutando:
   - Verifica la URL (debe ser `http://localhost:3000/{slug}`)
   - Verifica que el servidor esté corriendo
   - Reinicia el servidor

## Contacto para Soporte

Si después de seguir todos estos pasos aún tienes problemas, proporciona:

1. Los logs completos de la terminal
2. La respuesta de la Network tab en DevTools
3. El JSON de tu tenant (sanitizado, sin datos sensibles)
4. La URL exacta que estás visitando
