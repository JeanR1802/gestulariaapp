// Archivo: app/lib/render-blocks-to-html.js (VERSIÓN COMPLETA Y FINAL)
import { BLOCKS } from '@/app/components/editor/blocks';

export function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const { data, type } = block;
    
    const blockConfig = BLOCKS[type];
    if (!blockConfig) {
      console.warn(`AVISO: El tipo de bloque "${type}" no está registrado y no será renderizado.`);
      return ``;
    }

    switch (type) {
      case 'header':
        const headerId = `header-${block.id}`;
        const mobileMenuId = `mobile-menu-${block.id}`;
        const toggleButtonId = `toggle-button-${block.id}`;
        let headerHtml = '';

        switch (data.variant) {
          case 'centered':
            headerHtml = `<div class="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3"><h1 class="text-xl md:text-2xl font-bold text-slate-800">${data.logoText || 'Mi Negocio'}</h1><nav class="hidden md:flex items-center space-x-6 text-sm text-slate-600"><a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a><a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a><a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a></nav><div class="md:hidden"><button id="${toggleButtonId}" aria-label="Toggle Menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button></div></div><nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4"><a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a><a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a><a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a></nav>`;
            break;
          case 'withButton':
            headerHtml = `<div class="max-w-5xl mx-auto flex justify-between items-center"><h1 class="text-xl font-bold text-slate-800">${data.logoText || 'Mi Negocio'}</h1><div class="hidden md:flex items-center gap-6"><nav class="flex items-center space-x-6 text-sm text-slate-600"><a href="#" class="hover:text-blue-600">${data.link1 || 'Producto'}</a><a href="#" class="hover:text-blue-600">${data.link2 || 'Precios'}</a></nav><a href="#" class="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700">${data.buttonText || 'Acción'}</a></div><div class="md:hidden"><button id="${toggleButtonId}" aria-label="Toggle Menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button></div></div><nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4"><a href="#" class="hover:text-blue-600">${data.link1 || 'Producto'}</a><a href="#" class="hover:text-blue-600">${data.link2 || 'Precios'}</a><a href="#" class="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 w-fit">${data.buttonText || 'Acción'}</a></nav>`;
            break;
          case 'default':
          default:
             headerHtml = `<div class="max-w-5xl mx-auto flex justify-between items-center"><h1 class="text-xl font-bold text-slate-800">${data.logoText || 'Mi Negocio'}</h1><nav class="hidden md:flex items-center space-x-6 text-sm text-slate-600"><a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a><a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a><a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a></nav><div class="md:hidden"><button id="${toggleButtonId}" aria-label="Toggle Menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button></div></div><nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4"><a href="#" class="hover:text-blue-600">${data.link1 || 'Inicio'}</a><a href="#" class="hover:text-blue-600">${data.link2 || 'Servicios'}</a><a href="#" class="hover:text-blue-600">${data.link3 || 'Contacto'}</a></nav>`;
            break;
        }
        return `<header id="${headerId}" class="bg-white p-4 border-b border-slate-200 w-full relative">${headerHtml}</header><script>(function(){var button=document.getElementById('${toggleButtonId}');var menu=document.getElementById('${mobileMenuId}');if(button&&menu){button.addEventListener('click',function(){menu.classList.toggle('hidden');});}})();</script>`;
      
      case 'hero':
        switch (data.variant) {
          case 'leftImage': return `<div class="${data.backgroundColor || 'bg-white'}"><div class="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8 p-8 md:p-12"><div class="text-center md:text-left"><h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">${data.title}</h1><p class="text-lg text-slate-600 mb-8">${data.subtitle}</p><a href="${data.buttonLink || '#'}" class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">${data.buttonText}</a></div><div><img src="${data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${data.title}" class="rounded-lg shadow-lg mx-auto" /></div></div></div>`;
          case 'darkMinimal': return `<div class="${data.backgroundColor || 'bg-slate-900'} p-12 md:p-24 text-center"><h1 class="text-4xl md:text-5xl font-bold text-white mb-8">${data.title}</h1><a href="${data.buttonLink || '#'}" class="inline-block bg-white text-slate-800 px-8 py-3 rounded-md text-base font-semibold hover:bg-slate-200">${data.buttonText}</a></div>`;
          case 'default': default: return `<div class="${data.backgroundColor || 'bg-slate-100'} p-12 md:p-20 text-center"><h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">${data.title}</h1><p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">${data.subtitle}</p><a href="${data.buttonLink || '#'}" class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">${data.buttonText}</a></div>`;
        }

      case 'text':
        const formattedContent = (data.content || '').replace(/\n/g, '<br />');
        switch (data.variant) {
          case 'quote': return `<div class="max-w-4xl mx-auto py-8 px-4"><blockquote class="border-l-4 border-slate-400 pl-4 italic text-slate-600"><p>${formattedContent}</p></blockquote></div>`;
          case 'highlighted': return `<div class="max-w-4xl mx-auto py-8 px-4"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800"><p>${formattedContent}</p></div></div>`;
          case 'default': default: return `<div class="max-w-4xl mx-auto py-8 px-4 prose prose-slate"><p>${formattedContent}</p></div>`;
        }

      case 'image':
        const captionHtml = data.caption ? `<p class="text-sm text-slate-600 mt-2 italic">${data.caption}</p>` : '';
        switch (data.variant) {
          case 'bordered': return `<div class="max-w-4xl mx-auto p-4 text-center"><img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto border-4 border-white shadow-lg" />${captionHtml.replace('mt-2', 'mt-3')}</div>`;
          case 'fullwidth': return `<div class="w-full my-8"><img src="${data.imageUrl}" alt="${data.alt}" class="w-full h-auto" />${captionHtml ? `<p class="text-center">${captionHtml}</p>` : ''}</div>`;
          case 'default': default: return `<div class="max-w-4xl mx-auto p-4 text-center"><img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto" />${captionHtml}</div>`;
        }

      case 'cards':
        const cardsTitleHtml = `<h2 class="text-3xl font-bold text-center text-slate-800 mb-12">${data.title}</h2>`;
        switch (data.variant) {
          case 'list': return `<div class="bg-white py-12 px-4"><div class="max-w-3xl mx-auto">${cardsTitleHtml}<div class="space-y-8">${(data.cards || []).map(card => `<div class="flex items-start gap-6"><div class="text-3xl mt-1">${card.icon}</div><div><h3 class="text-xl font-semibold mb-2 text-slate-800">${card.title}</h3><p class="text-slate-600">${card.description}</p></div></div>`).join('')}</div></div></div>`;
          case 'imageTop': return `<div class="bg-slate-50 py-12 px-4"><div class="max-w-5xl mx-auto">${cardsTitleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.cards || []).map(card => `<div class="bg-white rounded-lg shadow-sm ring-1 ring-slate-100 overflow-hidden"><img src="${card.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${card.title}" class="w-full h-40 object-cover" /><div class="p-6 text-center"><h3 class="text-xl font-semibold mb-2 text-slate-800">${card.title}</h3><p class="text-slate-600 text-sm">${card.description}</p></div></div>`).join('')}</div></div></div>`;
          case 'default': default: return `<div class="bg-slate-50 py-12 px-4"><div class="max-w-5xl mx-auto">${cardsTitleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.cards || []).map(card => `<div class="text-center p-6 bg-white rounded-lg shadow-sm ring-1 ring-slate-100"><div class="text-4xl mb-4">${card.icon}</div><h3 class="text-xl font-semibold mb-2 text-slate-800">${card.title}</h3><p class="text-slate-600 text-sm">${card.description}</p></div>`).join('')}</div></div></div>`;
        }

      case 'cta':
        switch (data.variant) {
          case 'light': return `<div class="${data.backgroundColor || 'bg-slate-100'} p-12 text-center rounded-lg"><h2 class="text-3xl font-bold text-slate-800 mb-2">${data.title}</h2><p class="text-lg text-slate-600 mb-6 max-w-xl mx-auto">${data.subtitle}</p><a href="#" class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">${data.buttonText}</a></div>`;
          case 'split': return `<div class="${data.backgroundColor || 'bg-white'} p-8"><div class="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8"><div class="text-center md:text-left"><h2 class="text-3xl font-bold text-slate-800 mb-2">${data.title}</h2><p class="text-lg text-slate-600 mb-6">${data.subtitle}</p><a href="#" class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">${data.buttonText}</a></div><div><img src="${data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${data.title}" class="rounded-lg shadow-lg mx-auto" /></div></div></div>`;
          case 'dark': default: return `<div class="${data.backgroundColor || 'bg-slate-800'} text-white p-12 text-center"><h2 class="text-3xl font-bold mb-2">${data.title}</h2><p class="text-lg opacity-90 mb-6 max-w-xl mx-auto">${data.subtitle}</p><a href="#" class="inline-block bg-white text-slate-800 px-6 py-2.5 rounded-md text-base font-semibold hover:bg-slate-200">${data.buttonText}</a></div>`;
        }

      case 'footer':
        switch (data.variant) {
          case 'multiColumn': return `<footer class="bg-slate-800 text-slate-400 text-sm p-8"><div class="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">${(data.columns || []).map(col => `<div><h4 class="font-semibold text-white mb-3">${col.title}</h4><ul class="space-y-2">${(col.links || []).map(link => `<li><a href="#" class="hover:text-white">${link}</a></li>`).join('')}</ul></div>`).join('')}</div><div class="mt-8 border-t border-slate-700 pt-4 text-center"><p>${data.copyrightText || ''}</p></div></footer>`;
          case 'minimal': return `<footer class="bg-white text-slate-500 text-xs text-center p-4"><p>${data.copyrightText || ''}</p></footer>`;
          case 'simple': default: return `<footer class="bg-slate-800 text-slate-400 text-sm text-center p-8"><p class="mb-4">${data.copyrightText || ''}</p><div class="flex justify-center space-x-4">${(data.socialLinks || []).map(link => link.url ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-white">${link.platform}</a>` : '').join('')}</div></footer>`;
        }
        
      default:
        return '';
    }
  }).join('');
}