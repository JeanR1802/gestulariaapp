# Solución de Errores 404 en Sitio Público

## 📋 Problemas Identificados

### 1. **Tailwind CSS 404** (`/_next/static/css/tailwind.css`)
**Causa:** Next.js en modo desarrollo no genera archivos CSS estáticos en esa ruta.

**Solución:** 
- Modificado `render-blocks-to-html.js` para usar Tailwind CDN en desarrollo
- En producción usará el CSS compilado si está disponible

### 2. **Manifest e Iconos 404** (`site.webmanifest`, `icon-192.png`, `icon-512.png`)
**Causa:** El manifest buscaba iconos que no existían en `/public/`

**Solución:**
- Actualizado `site.webmanifest` para usar `/lgo.png` (existente) en lugar de iconos faltantes
- Removido el enlace al manifest del HTML generado por defecto (evita 404s)
- Agregado favicon opcional usando `/lgo.png`

### 3. **Middleware Bloqueando Archivos Estáticos**
**Causa:** El matcher del middleware era demasiado restrictivo

**Solución:**
- Actualizado `middleware.js` para excluir todos los archivos estáticos comunes:
  - `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`
  - `.webmanifest`, `.js`, `.css`

### 4. **Logo PNG 404** (`/lgo.png`)
**Causa:** El logo existe en `/public/lgo.png` pero el sitio público lo buscaba en la raíz del subdominio

**Solución:**
- El middleware ahora permite que todos los `.png` pasen directamente
- Next.js servirá automáticamente los archivos de `/public/`

## 🔧 Archivos Modificados

### 1. `app/lib/render-blocks-to-html.js`
```javascript
// Antes
const buildHead = (cssUrl) => `...<link rel="stylesheet" href="${cssUrl}"/>...`;

// Después
const buildHead = (cssUrl, manifestUrl, faviconUrl) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const cssLink = isDev 
    ? '<script src="https://cdn.tailwindcss.com"></script>' 
    : `<link rel="stylesheet" href="${cssUrl}"/>`;
  
  const manifestLink = manifestUrl ? `<link rel="manifest" href="${manifestUrl}"/>` : '';
  const faviconLink = faviconUrl ? `<link rel="icon" type="image/png" href="${faviconUrl}"/>` : '';
  
  return `...${cssLink}${manifestLink}${faviconLink}...`;
};
```

### 2. `app/api/site/[slug]/route.js`
```javascript
// Antes
const manifestUrl = `${origin}${basePath}/site.webmanifest`;
const fullHtml = await renderBlocksToHTML(blocks, { cssUrl, manifestUrl, blockBehaviorsUrl });

// Después
const faviconUrl = `${origin}${basePath}/lgo.png`;
const fullHtml = await renderBlocksToHTML(blocks, { cssUrl, blockBehaviorsUrl, faviconUrl });
```

### 3. `middleware.js`
```javascript
// Antes
matcher: [
  '/((?!api|_next/static|_next/image|favicon.ico|block-behaviors.js).*)',
]

// Después
matcher: [
  '/((?!api|_next/static|_next/image|favicon.ico|block-behaviors.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webmanifest|.*\\.js|.*\\.css).*)',
]
```

### 4. `public/site.webmanifest`
```json
// Antes
"icons": [
  { "src": "/icon-192.png", ... },
  { "src": "/icon-512.png", ... }
]

// Después
"icons": [
  { "src": "/lgo.png", "sizes": "192x192", "type": "image/png" }
]
```

## ✅ Resultado Esperado

Después de estos cambios, NO deberías ver más estos errores 404:
- ❌ `tailwind.css` → ✅ Usa CDN en desarrollo
- ❌ `site.webmanifest` → ✅ No se incluye (opcional)
- ❌ `icon-192.png` → ✅ No se busca más
- ❌ `icon-512.png` → ✅ No se busca más
- ❌ `/lgo.png` → ✅ Se sirve correctamente desde `/public/`
- ❌ `block-behaviors.js` → ✅ Ya estaba excluido

## 🎯 Beneficios

1. **Desarrollo más limpio:** Sin errores 404 en la consola
2. **Performance:** Usa CDN de Tailwind en desarrollo (más rápido)
3. **Flexibilidad:** El middleware permite todos los archivos estáticos comunes
4. **Producción lista:** En producción usará CSS compilado optimizado

## 🔍 Verificación

Para verificar que todo funciona:

1. **Recargar el navegador** en el sitio público (ej: `http://tienda.localhost:3000`)
2. **Abrir DevTools Console** (F12)
3. **Verificar:** No deben aparecer errores 404 relacionados con:
   - CSS
   - Imágenes PNG
   - Manifest
   - Iconos

## 📝 Notas Adicionales

### Si quieres habilitar el manifest en el futuro:
1. Crea los iconos faltantes (`icon-192.png`, `icon-512.png`) en `/public/`
2. Actualiza `site.webmanifest` con las rutas correctas
3. En `route.js`, pasa `manifestUrl` a `renderBlocksToHTML`

### Si quieres usar un favicon diferente:
Cambia la línea en `route.js`:
```javascript
const faviconUrl = `${origin}${basePath}/tu-favicon.png`;
```

## 🐛 Debug

Si sigues viendo errores 404, verifica:
1. Los archivos existen en `/public/`
2. El middleware NO está bloqueando la extensión del archivo
3. Next.js se reinició correctamente después de los cambios
4. No hay caché del navegador (Ctrl + Shift + R para forzar recarga)
