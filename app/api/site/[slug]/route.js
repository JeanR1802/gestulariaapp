import { getTenantBySlug } from '@/lib/tenant';
import { NextResponse } from 'next/server';

// ================== CÓDIGO PEGADO DIRECTAMENTE ==================
// Esta función convierte tu estructura de bloques JSON a HTML.
function blocksToHTML(blocks: any[]): string {
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
          <div class="bg-gray-50 py-12">
            <div class="max-w-7xl mx-auto px-4">
              <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">${data.title}</h2>
              <div class="grid md:grid-cols-3 gap-8">
                ${data.cards.map((card: any) => `
                  <div class="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div class="text-4xl mb-4">${card.icon}</div>
                    <h3 class="text-xl font-semibold mb-2">${card.title}</h3>
                    <p class="text-gray-600">${card.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      case 'contact':
        return `
          <div class="bg-white py-12">
            <div class="max-w-4xl mx-auto px-4">
              <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">${data.title}</h2>
              <div class="text-center space-y-4">
                ${data.showPhone ? `<div class="flex items-center justify-center text-gray-700"><span class="mr-3">📞</span><span>${data.phone}</span></div>` : ''}
                ${data.showEmail ? `<div class="flex items-center justify-center text-gray-700"><span class="mr-3">✉️</span><span>${data.email}</span></div>` : ''}
                ${data.showAddress ? `<div class="flex items-center justify-center text-gray-700"><span class="mr-3">📍</span><span>${data.address}</span></div>` : ''}
              </div>
            </div>
          </div>
        `;
      case 'cta':
        return `
          <div class="${data.backgroundColor || 'bg-blue-600'} text-white p-12 text-center">
            <h2 class="text-3xl font-bold mb-4">${data.title}</h2>
            <p class="text-xl mb-8 opacity-90">${data.subtitle}</p>
            <a href="${data.buttonLink || '#'}" class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
              ${data.buttonText}
            </a>
          </div>
        `;
      default:
        return '';
    }
  }).join('');
}
// ====================================================================

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const tenant = await getTenantBySlug(slug);
    
    if (!tenant) {
      return new NextResponse(`Sitio no encontrado`, { status: 404 });
    }

    const page = tenant.pages.find((p: { slug: string; published: boolean; }) => p.slug === '/' && p.published) || tenant.pages[0];
    
    if (!page || !page.content) {
      return new NextResponse(`Sitio en construcción`, { status: 200 });
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
        // ======================= ¡ESTA ES LA LÍNEA CORREGIDA! =======================
        // Le decimos al navegador y a los servidores que NUNCA guarden una copia.
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
        // =========================================================================
      }
    });
  } catch (error) {
    console.error('Site render error:', error);
    return new NextResponse(`Error en el servidor`, { status: 500 });
  }
}

