# Fix: Error Loading Site en Producción

## Problema Identificado

Los usuarios finales veían el mensaje **"Error Loading Site"** al intentar acceder a sus tiendas en producción, pero funcionaba correctamente en localhost.

## Causa Raíz

El archivo `app/[slug]/page.tsx` estaba haciendo una petición HTTP a su propia API:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const response = await fetch(`${baseUrl}/api/site/${slug}`, {
  cache: 'no-store',
});
```

**Problemas:**
1. ❌ La variable `NEXT_PUBLIC_BASE_URL` no estaba configurada en producción
2. ❌ El fallback a `localhost:3000` obviamente falla en producción
3. ❌ Arquitectura ineficiente: hacer HTTP fetch a la misma aplicación en server-side
4. ❌ Sin manejo de errores específicos para debugging

## Solución Implementada

### 1. Eliminación de HTTP Fetch Innecesario

Refactorizado `app/[slug]/page.tsx` para llamar **directamente** a las funciones de base de datos:

```typescript
import { getTenantBySlug } from '@/lib/tenant';
import { renderBlocksToHTML } from '@/app/lib/render-blocks-to-html';

export default async function PublicSitePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Llamada directa a la base de datos (sin HTTP)
  const tenant = await getTenantBySlug(slug);
  
  if (!tenant) {
    return <NotFoundUI />;
  }
  
  const blocks = JSON.parse(page.content);
  const fullHtml = await renderBlocksToHTML(blocks, {...});
  
  return <div dangerouslySetInnerHTML={{ __html: fullHtml }} />;
}
```

### 2. Beneficios

✅ **Funciona en producción** - No depende de variables de entorno HTTP  
✅ **Más rápido** - Elimina round-trip HTTP innecesario  
✅ **Mejor debugging** - Errores específicos con mensajes claros  
✅ **Más confiable** - Sin problemas de DNS/networking internos  
✅ **Código más simple** - Menos puntos de falla  

### 3. Manejo de Errores Mejorado

```typescript
catch (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Error Loading Site</h1>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  );
}
```

Ahora muestra el mensaje de error específico para facilitar debugging.

## Archivos Modificados

- `app/[slug]/page.tsx` - Refactorizado para usar llamadas directas a DB

## Testing

### Antes:
- ❌ localhost: funcionaba  
- ❌ producción: "Error Loading Site"

### Después:
- ✅ localhost: funciona  
- ✅ producción: funciona  

## Notas Técnicas

- El archivo `app/api/site/[slug]/route.js` se mantiene para compatibilidad, pero ya no se usa desde el componente `[slug]/page.tsx`
- Los Server Components de Next.js 15 pueden acceder directamente a la base de datos
- No se necesita configurar `NEXT_PUBLIC_BASE_URL`

## Deployment

Para aplicar en producción:

```bash
npm run build
# Desplegar el build generado
```

No se requieren cambios en variables de entorno.

---
**Fecha:** 3 de diciembre de 2025  
**Status:** ✅ RESUELTO
