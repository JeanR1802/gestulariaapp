import { getTenantBySlug } from '@/lib/tenant'
import { NextResponse } from 'next/server'
import { blocksToHTML } from '@/lib/block-editor-utils' // ¡Importamos nuestra función!

export async function GET(request, { params }) {
  try {
    const { slug } = params
    const tenant = await getTenantBySlug(slug)
    
    if (!tenant) {
      // ... (código de sitio no encontrado sin cambios)
      return new NextResponse(`...`, { status: 404, headers: { 'Content-Type': 'text/html' } })
    }

    const page = tenant.pages.find(p => p.slug === '/' && p.published) || tenant.pages[0]
    
    if (!page || !page.content) {
      // ... (código de sitio en construcción sin cambios)
      return new NextResponse(`...`, { status: 200, headers: { 'Content-Type': 'text/html' } })
    }

    // --- NUEVA LÓGICA DE RENDERIZADO ---
    let finalContent = '';
    try {
      // Intentamos parsear el contenido como JSON
      const blocks = JSON.parse(page.content);
      // Si es un array, lo convertimos a HTML
      if (Array.isArray(blocks)) {
        finalContent = blocksToHTML(blocks);
      } else {
        // Si no es un array, es probable que sea HTML antiguo
        finalContent = page.content;
      }
    } catch (e) {
      // Si falla el parseo, asumimos que es HTML plano
      finalContent = page.content;
    }

    // Generar HTML completo del sitio con el contenido final
    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${page.title} - ${tenant.name}</title>
      <meta name="description" content="${tenant.description || ''}">
      <script src="https://cdn.tailwindcss.com"></script>
      ${tenant.config.customCSS ? `<style>${tenant.config.customCSS}</style>` : ''}
    </head>
    <body>
      ${finalContent}
      
      <!-- ... (resto del body, branding, scripts, etc. sin cambios) ... -->
    </body>
    </html>`

    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Site render error:', error)
    // ... (código de manejo de error 500 sin cambios)
    return new NextResponse(`...`, { status: 500, headers: { 'Content-Type': 'text/html' } })
  }
}
