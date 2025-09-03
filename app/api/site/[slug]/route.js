// app/api/site/[slug]/route.js
import { getTenantBySlug } from '@/lib/tenant'
import { NextResponse } from 'next/server'
// CORRECCIÓN: Se usa una ruta relativa para asegurar que el archivo se encuentre.
import { blocksToHTML } from '../../../lib/block-editor-utils'

export async function GET(request, { params }) {
  try {
    const { slug } = params
    const tenant = await getTenantBySlug(slug)
    
    if (!tenant) {
      return new NextResponse(`<!DOCTYPE html><html lang="es"><head><title>Sitio no encontrado</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-gray-50 flex items-center justify-center min-h-screen"><div class="text-center"><h1 class="text-2xl font-bold">Sitio no encontrado</h1><p class="text-gray-600">El sitio <strong>${slug}</strong> no existe.</p></div></body></html>`, { status: 404, headers: { 'Content-Type': 'text/html' } })
    }

    const page = tenant.pages.find(p => p.slug === '/' && p.published) || tenant.pages[0]
    
    if (!page || !page.content) {
      return new NextResponse(`<!DOCTYPE html><html lang="es"><head><title>En construcción</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-gray-50 flex items-center justify-center min-h-screen"><div class="text-center"><h1 class="text-2xl font-bold">${tenant.name}</h1><p class="text-gray-600">Este sitio está en construcción.</p></div></body></html>`, { status: 200, headers: { 'Content-Type': 'text/html' } })
    }

    let finalContent = '';
    try {
      const blocks = JSON.parse(page.content);
      if (Array.isArray(blocks)) {
        finalContent = blocksToHTML(blocks);
      } else {
        finalContent = page.content;
      }
    } catch (e) {
      finalContent = page.content;
    }

    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale-1.0">
      <title>${page.title} - ${tenant.name}</title>
      <meta name="description" content="${tenant.description || ''}">
      <script src="https://cdn.tailwindcss.com"></script>
      ${tenant.config.customCSS ? `<style>${tenant.config.customCSS}</style>` : ''}
    </head>
    <body>
      ${finalContent}
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
    return new NextResponse(`<!DOCTYPE html><html lang="es"><head><title>Error</title></head><body>Error en el servidor.</body></html>`, { status: 500, headers: { 'Content-Type': 'text/html' } })
  }
}