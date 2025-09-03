import { BLOCKS } from '@/app/components/editor/blocks';

// Esta función es similar a la que teníamos antes, pero ahora vive en su propio
// archivo y es la ÚNICA fuente de verdad para renderizar el HTML público.
export function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const { data, type } = block;
    const blockConfig = BLOCKS[type];

    if (!blockConfig) {
      console.warn(`Block type "${type}" is not registered and will not be rendered.`);
      return `<!-- Bloque de tipo '${type}' no reconocido -->`;
    }

    // Usamos un switch simple para generar el HTML, evitando dependencias del servidor.
    switch (type) {
      case 'hero':
        return `
          <div class="${data.backgroundColor || 'bg-slate-100'} p-12 md:p-20 rounded-md text-center">
            <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">${data.title}</h1>
            <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">${data.subtitle}</p>
            <a href="${data.buttonLink || '#'}" class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">${data.buttonText}</a>
          </div>
        `;
      case 'text':
        return `
          <div class="prose prose-slate max-w-none p-4">
            <p>${(data.content || '').replace(/\n/g, '<br />')}</p>
          </div>
        `;
      case 'image':
        return `
          <div class="p-4 text-center">
            <img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto" />
            ${data.caption ? `<p class="text-sm text-slate-600 mt-2">${data.caption}</p>` : ''}
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
      case 'cta':
        return `
          <div class="${data.backgroundColor || 'bg-slate-800'} text-white p-12 rounded-md text-center">
            <h2 class="text-3xl font-bold mb-2">${data.title}</h2>
            <p class="text-lg opacity-90 mb-6 max-w-xl mx-auto">${data.subtitle}</p>
            <a href="${data.buttonLink || '#'}" class="inline-block bg-white text-slate-800 px-6 py-2.5 rounded-md text-base font-semibold hover:bg-slate-200">
              ${data.buttonText}
            </a>
          </div>
        `;
      default:
        return '';
    }
  }).join('');
}