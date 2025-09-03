// app/lib/block-editor-utils.js

// 1. DEFINICIÓN DE LOS TIPOS DE BLOQUES
// Copiamos la misma constante que teníamos en el editor.
export const BLOCK_TYPES = [
  { id: 'hero', name: 'Héroe', icon: '🎯', description: 'Sección principal con título y botón' },
  { id: 'text', name: 'Texto', icon: '📝', description: 'Párrafo de texto simple' },
  { id: 'image', name: 'Imagen', icon: '🖼️', description: 'Imagen con descripción opcional' },
  { id: 'cards', name: 'Tarjetas', icon: '🎴', description: '3 tarjetas con icono, título y texto' },
  { id: 'contact', name: 'Contacto', icon: '📞', description: 'Información de contacto' },
  { id: 'cta', name: 'Llamada a la Acción', icon: '📢', description: 'Sección destacada con botón' }
];

// 2. FUNCIÓN PARA CREAR NUEVOS BLOQUES
// Crea un nuevo objeto de bloque con datos por defecto según su tipo.
export function createBlock(type) {
  const baseBlock = {
    id: Date.now() + Math.random(),
    type,
  };

  const templates = {
    hero: { ...baseBlock, data: { title: 'Tu Título Principal Aquí', subtitle: 'Describe tu negocio o servicio', buttonText: 'Comenzar', backgroundColor: 'bg-gradient-to-br from-blue-50 to-white' } },
    text: { ...baseBlock, data: { content: 'Escribe aquí el contenido de tu párrafo.' } },
    image: { ...baseBlock, data: { imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Pie de foto opcional' } },
    cards: { ...baseBlock, data: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción del primer servicio' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción del segundo servicio' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción del tercer servicio' } ] } },
    contact: { ...baseBlock, data: { title: 'Contáctanos', phone: '+52 123 456 7890', email: 'contacto@tuempresa.com', address: 'Tu dirección aquí', showPhone: true, showEmail: true, showAddress: true } },
    cta: { ...baseBlock, data: { title: '¿Listo para comenzar?', subtitle: 'Únete a miles de clientes satisfechos', buttonText: 'Contactar Ahora', backgroundColor: 'bg-blue-600' } }
  };

  return templates[type] || baseBlock;
}

// 3. FUNCIONES DE AYUDA
// Obtienen el nombre o el ícono de un bloque a partir de su tipo.
export function getBlockName(type) {
  const blockType = BLOCK_TYPES.find(b => b.id === type);
  return blockType ? blockType.name : 'Desconocido';
}

export function getBlockIcon(type) {
  const blockType = BLOCK_TYPES.find(b => b.id === type);
  return blockType ? blockType.icon : '❓';
}


// 4. FUNCIÓN CLAVE: CONVERTIR BLOQUES A HTML
// Esta es la función más importante. Recorre el array de bloques y genera el HTML
// que se mostrará en el sitio público.
export function blocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const { data } = block;
    switch (block.type) {
      case 'hero':
        return `
          <div class="p-8 md:p-16 text-center ${data.backgroundColor || 'bg-gray-100'}">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
            <p class="text-xl text-gray-600 mb-8">${data.subtitle}</p>
            <a href="#" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
              ${data.buttonText}
            </a>
          </div>
        `;
      
      case 'text':
        return `
          <div class="max-w-4xl mx-auto py-8 px-4">
            <p class="text-gray-700 leading-relaxed">${data.content.replace(/\n/g, '<br>')}</p>
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
                ${data.cards.map(card => `
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
            <a href="#" class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
              ${data.buttonText}
            </a>
          </div>
        `;

      default:
        return '';
    }
  }).join('');
}
