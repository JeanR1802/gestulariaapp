import { getTenantBySlug } from '@/lib/tenant';
import { NextResponse } from 'next/server';
// CORRECCIÓN DEFINITIVA: Se usa una ruta relativa para asegurar que el archivo se encuentre.
import { renderBlocksToHTML } from '../../../lib/render-blocks-to-html';

export async function GET(request, { params }) {
  try {
    // Next.js 15 requires awaiting params before accessing properties
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    console.log('🔍 [GET /api/site/[slug]] Slug:', slug);
    
    const tenant = await getTenantBySlug(slug);
    console.log('🔍 [GET /api/site/[slug]] Tenant found:', !!tenant);
    
    if (!tenant) {
      return new NextResponse(`Sitio no encontrado`, { status: 404 });
    }

    const page = tenant.pages.find((p) => p.slug === '/' && p.published) || tenant.pages[0];
    console.log('🔍 [GET /api/site/[slug]] Page found:', !!page, 'has content:', !!page?.content);
    
    if (!page || !page.content) {
      return new NextResponse(`Sitio en construcción`, { status: 200 });
    }

    try {
      const blocks = JSON.parse(page.content);
      console.log('🔍 [GET /api/site/[slug]] Blocks parsed:', Array.isArray(blocks), 'count:', blocks?.length);
      console.log('🔍 [GET /api/site/[slug]] Blocks:', JSON.stringify(blocks, null, 2));
      
      if (Array.isArray(blocks)) {
        // Build an absolute CSS URL based on the request origin to avoid 404s
        const origin = (typeof request?.url === 'string') ? new URL(request.url).origin : '';
        const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
        const cssUrl = `${origin}${basePath}/_next/static/css/tailwind.css`;
        const blockBehaviorsUrl = `${origin}${basePath}/block-behaviors.js`;
        // No incluir manifest ni favicon por ahora (evitar 404s de iconos faltantes)
        const faviconUrl = `${origin}${basePath}/lgo.png`; // Usar logo existente como favicon

        // renderBlocksToHTML now returns a full HTML document
        const fullHtml = await renderBlocksToHTML(blocks, { cssUrl, blockBehaviorsUrl, faviconUrl });
        console.log('🔍 [GET /api/site/[slug]] CSS URL used:', cssUrl);
        console.log('🔍 [GET /api/site/[slug]] Favicon URL used:', faviconUrl);
        console.log('🔍 [GET /api/site/[slug]] HTML generated, length:', fullHtml?.length);
        console.log('🔍 [GET /api/site/[slug]] HTML preview (first 500 chars):', fullHtml?.substring(0, 500));
        
        return new NextResponse(fullHtml, {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0' }
        });
      }
    } catch (e) {
      console.error('🔴 [GET /api/site/[slug]] Error parsing/rendering blocks:', e);
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