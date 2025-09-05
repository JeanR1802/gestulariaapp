// Archivo: app/lib/render-blocks-to-html.js (ACTUALIZADO)
import { BLOCKS } from '@/app/components/editor/blocks';

// Esta función ahora construye el HTML directamente, evitando la librería que causa el error.
export function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const { data, type } = block;
    
    const blockConfig = BLOCKS[type];
    if (!blockConfig) {
      console.warn(`AVISO: El tipo de bloque "${type}" no está registrado y no será renderizado.`);
      return ``;
    }

    // Usamos un switch simple para generar el HTML, lo que es 100% compatible.
    switch (type) {
      
      // --- SECCIÓN HEADER ACTUALIZADA ---
      case 'header':
        const headerId = `header-${block.id}`;
        const mobileMenuId = `mobile-menu-${block.id}`;
        const toggleButtonId = `toggle-button-${block.id}`;

        let headerHtml = '';
        switch (data.variant) {
          case 'centered':
            headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3">
                <h1 class="text-xl md:text-2xl font-bold text-slate-800">${data.logoText || 'Mi Negocio'}</h1>
                <nav class="hidden md:flex items-center space-x-6 text-sm text-slate-600">
                  <a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a>
                </nav>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-label="Toggle Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
              <nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4">
                <a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                <a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                <a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a>
              </nav>
            `;
            break;
          case 'withButton':
            headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold text-slate-800">${data.logoText || 'Mi Negocio'}</h1>
                <div class="hidden md:flex items-center gap-6">
                  <nav class="flex items-center space-x-6 text-sm text-slate-600">
                    <a href="#" class="hover:text-blue-600">${data.link1 || 'Producto'}</a>
                    <a href="#" class="hover:text-blue-600">${data.link2 || 'Precios'}</a>
                  </nav>
                  <a href="#" class="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700">${data.buttonText || 'Acción'}</a>
                </div>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-label="Toggle Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
              <nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4">
                  <a href="#" class="hover:text-blue-600">${data.link1 || 'Producto'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link2 || 'Precios'}</a>
                  <a href="#" class="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 w-fit">${data.buttonText || 'Acción'}</a>
              </nav>
            `;
            break;
          case 'default':
          default:
             headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold text-slate-800">${data.logoText || 'Mi Negocio'}</h1>
                <nav class="hidden md:flex items-center space-x-6 text-sm text-slate-600">
                  <a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a>
                </nav>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-label="Toggle Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
              <nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4">
                  <a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a>
              </nav>
            `;
            break;
        }

        return `
          <header id="${headerId}" class="bg-white p-4 border-b border-slate-200 w-full relative">
            ${headerHtml}
          </header>
          <script>
            (function() {
              var button = document.getElementById('${toggleButtonId}');
              var menu = document.getElementById('${mobileMenuId}');
              if (button && menu) {
                button.addEventListener('click', function() {
                  menu.classList.toggle('hidden');
                });
              }
            })();
          </script>
        `;
      
      // --- FIN DE SECCIÓN HEADER ---

      case 'hero':
        return `
          <div class="${data.backgroundColor || 'bg-slate-100'} p-12 md:p-20  text-center">
            <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">${data.title}</h1>
            <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">${data.subtitle}</p>
            <a href="${data.buttonLink || '#'}" class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">${data.buttonText}</a>
          </div>
        `;
      case 'text':
        return `
          <div class="max-w-4xl mx-auto py-8 px-4 prose prose-slate">
            <p>${(data.content || '').replace(/\n/g, '<br />')}</p>
          </div>
        `;
      // ... (el resto de los casos se mantienen igual)
      case 'image':
        return `
          <div class="p-4 text-center">
            <img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto" />
            ${data.caption ? `<p class="text-sm text-slate-600 mt-2">${data.caption}</p>` : ''}
          </div>
        `;
      case 'cards':
        return `
          <div class="bg-slate-50 py-12 px-4">
            <h2 class="text-3xl font-bold text-center text-slate-800 mb-12">${data.title}</h2>
            <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
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
      case 'cta':
        return `
          <div class="${data.backgroundColor || 'bg-slate-800'} text-white p-12 text-center">
            <h2 class="text-3xl font-bold mb-2">${data.title}</h2>
            <p class="text-lg opacity-90 mb-6 max-w-xl mx-auto">${data.subtitle}</p>
            <a href="${data.buttonLink || '#'}" class="inline-block bg-white text-slate-800 px-6 py-2.5 rounded-md text-base font-semibold hover:bg-slate-200">
              ${data.buttonText}
            </a>
          </div>
        `;
      case 'footer':
        return `
          <footer class="bg-slate-800 text-slate-400 text-sm text-center p-8">
            <p class="mb-4">${data.copyrightText || ''}</p>
            <div class="flex justify-center space-x-4">
              ${(data.socialLinks || []).map(link => 
                link.url ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-white">${link.platform}</a>` : ''
              ).join('')}
            </div>
          </footer>
        `;
      default:
        return '';
    }
  }).join('');
}