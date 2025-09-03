import { getTenantBySlug } from '@/lib/tenant';
import { NextResponse } from 'next/server';

// ================== CÓDIGO PEGADO DIRECTAMENTE ==================
function blocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map(block => {
    const { data } = block;
    switch (block.type) {
      case 'hero':
        return `
          <div class="p-8 md:p-16 text-center ${data.backgroundColor || 'bg-gray-100'}">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
            <p class="text-xl text-gray-600 mb-8">${data.subtitle}</p>
            <a href="${data.buttonLink || '#'}" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
              ${data.buttonText}
            </a>
          </div>
        `;
      case 'text':
        return `
          <div class="max-w-4xl mx-auto py-8 px-4">
            <p class="text-gray-700 leading-relaxed">${(data.content || '').replace(/\n/g, '<br>')}</p>
          </div>
        `;
      case 'image':
        return `
          <div class="max-w-4xl mx-auto py-8 px-4 text-center">
            <img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto shadow-md" />
            ${data.caption ? `<p class="text-sm text-gray-600 mt-2">${data.caption}</p>` : ''}
          </div>
        `;
      case 'cards':
        return `
          <div class="bg-slate-50 py-12 px-4 rounded-md">
            <h2 class="text-3xl font-bold text-center text-slate-800 mb-12">${data.title}</h2>
            <div class="grid md:grid-cols-3 gap-8">
              ${(data.cards || []).map(card => `
                <div class="text-center p-6 bg-white rounded-lg shadow-sm ring-1 ring-slate-100">
                  <div class="text-4xl mb-4">${card.icon}</div>
                  <h3 class="text-xl font-semibold mb-2 text-slate-800">${card.title}</h3>
                  <p class="text-slate-600 text-sm">${card.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
      // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
      // Se añade la lógica para renderizar el nuevo bloque CTA.
      case 'cta':
        return `
          <div class="${data.backgroundColor || 'bg-slate-800'} text-white p-12 rounded-md text-center">
            <h2 class="text-3xl font-bold mb-2">${data.title}</h2>
            <p class="text-lg opacity-90 mb-6 max-w-xl mx-auto">${data.subtitle}</p>
            <a 
              href="${data.buttonLink || '#'}" 
              class="inline-block bg-white text-slate-800 px-6 py-2.5 rounded-md text-base font-semibold hover:bg-slate-200"
            >
              ${data.buttonText}
            </a>
          </div>
        `;
      // --- FIN DE LA CORRECCIÓN ---

      default:
        // Mensaje de error mejorado para futuras depuraciones
        return `<!-- Bloque de tipo '${block.type}' no reconocido -->`;
    }
  }).join('');
}
// ====================================================================

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

    let finalContent = '';
    try {
      const blocks = JSON.parse(page.content);
      if (Array.isArray(blocks)) {
        finalContent = blocksToHTML(blocks);
      } else {
        finalContent = page.content; // Compatibilidad con contenido antiguo en HTML
      }
    } catch (e) {
      finalContent = page.content;
    }

    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${page.title || tenant.name}</title>
      <meta name="description" content="${tenant.description || ''}">
      <script src="https://cdn.tailwindcss.com"></script>
      ${tenant.config && tenant.config.customCSS ? `<style>${tenant.config.customCSS}</style>` : ''}
    </head>
    <body>
      ${finalContent}
    </body>
    </html>`;

    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
      }
    });
  } catch (error) {
    console.error('Site render error:', error);
    return new NextResponse(`Error en el servidor`, { status: 500 });
  }
}