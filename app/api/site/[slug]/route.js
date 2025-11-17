import { getTenantBySlug } from '@/lib/tenant';
import { NextResponse } from 'next/server';
// CORRECCIÓN DEFINITIVA: Se usa una ruta relativa para asegurar que el archivo se encuentre.
import { renderBlocksToHTML } from '../../../lib/render-blocks-to-html';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const tenant = await getTenantBySlug(slug);
    
    if (!tenant) {
      return new NextResponse(`Sitio no encontrado`, { status: 404 });
    }

    const page = tenant.pages.find((p) => p.slug === '/' && p.published) || tenant.pages[0];
    
    if (!page || !page.content) {
      return new NextResponse(`Sitio en construcción`, { status: 200 });
    }

    try {
      const blocks = JSON.parse(page.content);
      if (Array.isArray(blocks)) {
        // renderBlocksToHTML now returns a full HTML document
        const fullHtml = renderBlocksToHTML(blocks, { cssUrl: '/_next/static/css/tailwind.css' });
        return new NextResponse(fullHtml, {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0' }
        });
      }
    } catch (e) {
      // fall through to serve raw page.content below
    }
    
    // Fallback: serve existing page.content embedded in a simple HTML shell
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${page.title || tenant.name}</title><meta name="description" content="${tenant.description || ''}"><script src="https://cdn.tailwindcss.com"></script>${tenant.config && tenant.config.customCSS ? `<style>${tenant.config.customCSS}</style>` : ''}</head><body>${page.content}</body></html>`;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (error) {
    console.error('Site render error:', error);
    return new NextResponse(`Error en el servidor`, { status: 500 });
  }
}