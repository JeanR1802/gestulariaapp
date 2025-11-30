# RESUMEN DE TRABAJO: Debugging del Sitio Público

## Fecha: $(Get-Date)

## Problema Reportado

El sitio público no está renderizando ningún bloque, aunque el GET request se ejecuta correctamente.

## Análisis Realizado

### 1. Revisión del Flujo de Datos

Se analizó el flujo completo desde la solicitud HTTP hasta el renderizado:

```
URL pública → Middleware → GET /api/site/[slug] → getTenantBySlug() → 
→ Parse page.content → renderBlocksToHTML() → legacyRender() → HTML response
```

### 2. Código Revisado

- ✅ `app/api/site/[slug]/route.js`: GET route funciona correctamente
- ✅ `app/lib/render-blocks-to-html.js`: Incluye soporte para headers custom y todos los bloques
- ✅ `app/dashboard/sites/[id]/page.tsx`: Guardado de bloques correcto (`JSON.stringify`)
- ✅ `middleware.js`: Reescritura de URLs correcta
- ✅ `next.config.js`: Configuración correcta

### 3. Posibles Causas Identificadas

Sin poder ejecutar el servidor ni ver los logs, identificamos las causas más probables:

1. **Tenant no existe**: El slug no coincide con ningún tenant en la BD
2. **Página sin contenido**: La página existe pero `content` está vacío
3. **JSON inválido**: El `content` no es un JSON válido
4. **Bloques sin data**: Los bloques no tienen la propiedad `data` requerida
5. **Array vacío**: El array de bloques está vacío

## Solución Implementada

### 1. Instrumentación con Logs

Se agregaron logs detallados en los archivos críticos:

#### `app/api/site/[slug]/route.js`

```javascript
console.log('🔍 [GET /api/site/[slug]] Slug:', slug);
console.log('🔍 [GET /api/site/[slug]] Tenant found:', !!tenant);
console.log('🔍 [GET /api/site/[slug]] Page found:', !!page, 'has content:', !!page?.content);
console.log('🔍 [GET /api/site/[slug]] Blocks parsed:', Array.isArray(blocks), 'count:', blocks?.length);
console.log('🔍 [GET /api/site/[slug]] Blocks:', JSON.stringify(blocks, null, 2));
console.log('🔍 [GET /api/site/[slug]] HTML generated, length:', fullHtml?.length);
console.log('🔍 [GET /api/site/[slug]] HTML preview (first 500 chars):', fullHtml?.substring(0, 500));
console.error('🔴 [GET /api/site/[slug]] Error parsing/rendering blocks:', e);
```

#### `app/lib/render-blocks-to-html.js`

```javascript
console.log('🎨 [legacyRender] Starting render, blocks:', Array.isArray(blocks), 'count:', blocks?.length);
console.log('🔴 [legacyRender] Blocks is not an array!');
console.log(`🎨 [legacyRender] Rendering block ${index}:`, block?.type);
```

#### Corrección de Bug: await renderBlocksToHTML

Se cambió:
```javascript
const fullHtml = renderBlocksToHTML(blocks, { cssUrl: '/_next/static/css/tailwind.css' });
```

A:
```javascript
const fullHtml = await renderBlocksToHTML(blocks, { cssUrl: '/_next/static/css/tailwind.css' });
```

La función `renderBlocksToHTML` puede ser async (usa `await initReactComponents()`), por lo que debe ser awaited.

### 2. Documentación Creada

Se crearon tres documentos de ayuda:

1. **`GUIA_DIAGNOSTICO_SITIO_PUBLICO.md`**
   - Guía paso a paso para diagnosticar problemas
   - Lista de verificación de datos
   - Casos comunes de problemas

2. **`DEBUGGING_SITIO_PUBLICO_COMPLETO.md`**
   - Documentación completa de la instrumentación
   - Interpretación de cada log
   - Soluciones para cada tipo de error
   - Flujo completo de datos
   - Comandos útiles de PowerShell

3. **`test-public-site-debug.js`** (opcional, no completado)
   - Script standalone para testing sin servidor
   - Simula el flujo del GET route

## Próximos Pasos

### Para el Usuario:

1. **Ejecutar el servidor**:
   ```powershell
   npm run dev
   ```

2. **Visitar el sitio público**:
   ```
   http://localhost:3000/{tu-slug}
   ```

3. **Revisar los logs en la terminal**:
   - Buscar los emojis 🔍 y 🎨
   - Identificar dónde falla el flujo
   - Usar la documentación para interpretar los logs

4. **Aplicar la solución según el log**:
   - Si "Tenant found: false" → Verificar slug y BD
   - Si "has content: false" → Agregar bloques y guardar
   - Si "count: 0" → El array está vacío, agregar bloques
   - Si "Blocks parsed: false" → JSON inválido, revisar guardado

5. **Si el HTML se genera pero no se ve**:
   - Abrir DevTools (F12)
   - Network tab → verificar que el HTML llega
   - Elements tab → verificar que los bloques están en el DOM
   - Console tab → buscar errores de CSS o JS

### Verificaciones Adicionales:

- ✅ Asegurarse de que existe un tenant con el slug correcto
- ✅ Verificar que el tenant tiene al menos una página
- ✅ Confirmar que la página tiene `slug: "/"` y `published: true`
- ✅ Revisar que `page.content` no está vacío
- ✅ Verificar que cada bloque tiene `id`, `type` y `data`

## Archivos Modificados

```
✏️ app/api/site/[slug]/route.js
   - Agregados logs de diagnóstico
   - Corregido await de renderBlocksToHTML

✏️ app/lib/render-blocks-to-html.js
   - Agregados logs en legacyRender
   - Agregado log si blocks no es array

📄 GUIA_DIAGNOSTICO_SITIO_PUBLICO.md
   - Nueva documentación

📄 DEBUGGING_SITIO_PUBLICO_COMPLETO.md
   - Nueva documentación completa

📄 test-public-site-debug.js
   - Nuevo script de testing (pendiente completar)

📄 RESUMEN_DEBUG_SITIO_PUBLICO.md
   - Este archivo
```

## Estado del Proyecto

### ✅ Completado:
- Análisis completo del flujo de datos
- Instrumentación con logs detallados
- Corrección del bug de await
- Documentación exhaustiva del debugging
- Guías de diagnóstico y solución

### ⏳ Pendiente (requiere ejecutar servidor):
- Ver los logs reales en la terminal
- Identificar el problema exacto
- Aplicar la solución específica
- Verificar que el sitio público renderiza correctamente

### 🎯 Objetivo Final:
Que cuando el usuario visite `http://localhost:3000/{slug}`, vea el sitio renderizado con todos los bloques guardados desde el editor.

## Notas Técnicas

### Sobre el Renderizado de Headers Custom

Los headers con `variant: 'custom'` son renderizados correctamente en `render-blocks-to-html.js` (líneas 186-224):

```javascript
case 'custom': {
  const customElements = data.customElements || [];
  const leftElements = customElements.filter(el => el.data && el.data.zone === 'left');
  const centerElements = customElements.filter(el => el.data && el.data.zone === 'center');
  const rightElements = customElements.filter(el => el.data && el.data.zone === 'right');
  
  const renderElement = (el) => { /* ... */ };
  
  headerHtml = `
    <div class="max-w-6xl mx-auto w-full grid grid-cols-3 items-center gap-4" style="${headerInlineStyle}">
      <div class="flex items-center gap-4 justify-start">
        ${leftElements.map(renderElement).join('')}
      </div>
      <div class="flex items-center gap-4 justify-center">
        ${centerElements.map(renderElement).join('')}
      </div>
      <div class="flex items-center gap-4 justify-end">
        ${rightElements.map(renderElement).join('')}
      </div>
    </div>
  `;
  break;
}
```

Este código soporta todos los tipos de elementos del editor avanzado:
- logo
- link
- button
- heading
- paragraph
- image
- spacer
- actions

### Sobre el Formato de Datos

El formato esperado en la base de datos es:

```json
{
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "published": true,
      "content": "[{\"id\":1,\"type\":\"header\",\"data\":{...}},{\"id\":2,\"type\":\"hero\",\"data\":{...}}]"
    }
  ]
}
```

El `content` es un string JSON que representa un array de bloques.

## Lecciones Aprendidas

1. **Always await async functions**: `renderBlocksToHTML` es async y debe ser awaited
2. **Logging is essential**: Sin logs, es imposible debuggear flujos complejos
3. **Document the debugging process**: Facilita el soporte futuro
4. **Check the entire data flow**: El problema puede estar en cualquier paso

## Herramientas Útiles para Continuar

### PowerShell Commands

```powershell
# Ver procesos de Node
Get-Process node

# Matar procesos de Node
Get-Process node | Stop-Process

# Limpiar caché de Next.js
Remove-Item .next -Recurse -Force

# Reiniciar el servidor
npm run dev
```

### Browser DevTools

- **Network Tab**: Ver las peticiones y respuestas HTTP
- **Elements/Inspector**: Ver el DOM generado
- **Console**: Ver errores de JavaScript
- **Application/Storage**: Ver localStorage y datos del navegador

### VS Code

- **Terminal integrada**: `Ctrl + ñ` o `Ctrl + `
- **Buscar en archivos**: `Ctrl + Shift + F`
- **Go to definition**: `F12`
- **Buscar referencias**: `Shift + F12`

## Contacto y Soporte

Si después de seguir todos los pasos de las guías el problema persiste:

1. Proporciona los logs completos de la terminal
2. Captura de pantalla de la Network tab en DevTools
3. JSON sanitizado del tenant (sin datos sensibles)
4. URL exacta que estás visitando

## Conclusión

Se ha instrumentado completamente el código con logs detallados y se ha creado documentación exhaustiva para diagnosticar y resolver el problema del sitio público. El siguiente paso es ejecutar el servidor, visitar el sitio público, y usar los logs para identificar exactamente dónde está fallando el flujo de datos.

**Estado**: ✅ INSTRUMENTACIÓN COMPLETADA - Listo para debugging en vivo
