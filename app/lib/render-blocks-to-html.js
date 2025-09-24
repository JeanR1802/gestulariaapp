// Archivo: app/lib/render-blocks-to-html.js (ACTUALIZADO CON EL DISEÑO FINAL)
export function renderBlocksToHTML(blocks) {
  // --- Utilidades para colores personalizados ---
    function getClassOrStyle(color, tailwindDefault, cssProp) {
    if (!color) return { class: tailwindDefault, style: '' };

    // Si es un valor arbitrario de Tailwind JIT (ej. [#aabbcc])
    if (color.startsWith('[#') && color.endsWith(']')) {
      const hex = color.slice(1, -1);
      return { class: '', style: `${cssProp}: ${hex};` };
    }

    // Si es una clase de Tailwind (heurística: contiene un guión, no es un color funcional como `rgb()`)
    if (color.includes('-') && !color.includes('(')) {
      return { class: color, style: '' };
    }

    // Si es un color hexadecimal, rgb, o nombre de color, aplicar como estilo en línea
    return { class: '', style: `${cssProp}: ${color};` };
  }

  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const { data, type } = block;
    if (!data) {
      console.warn(`AVISO: Bloque de tipo "${type}" no tiene datos y no será renderizado.`);
      return '';
    }
    // --- HEADER ---
    switch (type) {
      case 'header': {
        const headerId = `header-${block.id}`;
        const mobileMenuId = `mobile-menu-${block.id}`;
        const toggleButtonId = `toggle-button-${block.id}`;
        let headerHtml = '';
        const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
        const logo = getClassOrStyle(data.logoColor, 'text-slate-800', 'color');
        const link = getClassOrStyle(data.linkColor, 'text-slate-600', 'color');
        const buttonBg = getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color');
        const buttonText = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
        switch (data.variant) {
          case 'centered':
            headerHtml = `<div class="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3"><h1 class="text-xl md:text-2xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1><nav class="hidden md:flex items-center space-x-6 text-sm ${link.class}" style="${link.style}"><a href="#" class="hover:opacity-100">${data.link1 || 'Inicio'}</a><a href="#" class="hover:opacity-100">${data.link2 || 'Servicios'}</a><a href="#" class="hover:opacity-100">${data.link3 || 'Contacto'}</a></nav><div class="md:hidden"><button id="${toggleButtonId}" aria-label="Toggle Menu" class="${logo.class}" style="${logo.style}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button></div></div><nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4"><a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Inicio'}</a><a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Servicios'}</a><a href="#" class="text-slate-800 hover:text-blue-600">${data.link3 || 'Contacto'}</a></nav>`;
            break;
          case 'withButton':
            headerHtml = `<div class="max-w-5xl mx-auto flex justify-between items-center"><h1 class="text-xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1><div class="hidden md:flex items-center gap-6"><nav class="flex items-center space-x-6 text-sm ${link.class}" style="${link.style}"><a href="#" class="hover:opacity-100">${data.link1 || 'Producto'}</a><a href="#" class="hover:opacity-100">${data.link2 || 'Precios'}</a></nav><a href="#" class="px-4 py-1.5 rounded-md text-sm font-semibold ${buttonBg.class}" style="${buttonBg.style}">${data.buttonText || 'Acción'}</a></div><div class="md:hidden"><button id="${toggleButtonId}" aria-label="Toggle Menu" class="${logo.class}" style="${logo.style}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button></div></div><nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4"><a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Producto'}</a><a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Precios'}</a><a href="#" class="text-slate-800 hover:text-blue-600">${data.buttonText || 'Acción'}</a></nav>`;
            break;
          default:
             headerHtml = `<div class="max-w-5xl mx-auto flex justify-between items-center"><h1 class="text-xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1><nav class="hidden md:flex items-center space-x-6 text-sm ${link.class}" style="${link.style}"><a href="#" class="hover:opacity-100">${data.link1 || 'Inicio'}</a><a href="#" class="hover:opacity-100">${data.link2 || 'Servicios'}</a><a href="#" class="hover:opacity-100">${data.link3 || 'Contacto'}</a></nav><div class="md:hidden"><button id="${toggleButtonId}" aria-label="Toggle Menu" class="${logo.class}" style="${logo.style}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button></div></div><nav id="${mobileMenuId}" class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4"><a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Inicio'}</a><a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Servicios'}</a><a href="#" class="text-slate-800 hover:text-blue-600">${data.link3 || 'Contacto'}</a></nav>`;
            break;
        }
        // Elimino border-b para evitar línea blanca debajo del header
        // Aplica style en línea en el header
        return `<header id="${headerId}" class="${bg.class} p-4 w-full sticky top-0 z-30" style="${bg.style}">${headerHtml}</header><script>(function(){var button=document.getElementById('${toggleButtonId}');var menu=document.getElementById('${mobileMenuId}');if(button&&menu){button.addEventListener('click',function(){menu.classList.toggle('hidden');});}})();</script>`;
      }
      case 'hero': {
        const titleClass = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const subtitleClass = getClassOrStyle(data.subtitleColor, 'text-slate-600', 'color');
        const buttonBaseClasses = "inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105";
        switch (data.variant) {
          case 'leftImage':
            const btnClassesLeft = `${buttonBaseClasses} ${getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color').class} ${getClassOrStyle(data.buttonTextColor, 'text-white', 'color').class}`;
            return `<div class="${getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color').class}" style="${getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color').style}"><div class="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8 p-8 md:p-12"><div class="text-center md:text-left"><h1 class="text-3xl md:text-4xl font-bold mb-4 ${titleClass.class}" style="${titleClass.style}">${data.title}</h1><p class="text-lg mb-8 ${subtitleClass.class}" style="${subtitleClass.style}">${data.subtitle}</p><a href="${data.buttonLink || '#'}" class="${btnClassesLeft}">${data.buttonText}</a></div><div><img src="${data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${data.title}" class="rounded-lg shadow-lg mx-auto" /></div></div></div>`;
          case 'darkMinimal':
            const btnClassesDark = `${buttonBaseClasses} ${getClassOrStyle(data.buttonBgColor, 'bg-white', 'background-color').class} ${getClassOrStyle(data.buttonTextColor, 'text-slate-800', 'color').class}`;
            return `<div class="${getClassOrStyle(data.backgroundColor, 'bg-slate-900', 'background-color').class} p-12 md:p-24 text-center" style="${getClassOrStyle(data.backgroundColor, 'bg-slate-900', 'background-color').style}"><h1 class="text-4xl md:text-5xl font-bold mb-8 ${getClassOrStyle(data.titleColor, 'text-white', 'color').class}" style="${getClassOrStyle(data.titleColor, 'text-white', 'color').style}">${data.title}</h1><a href="${data.buttonLink || '#'}" class="${btnClassesDark}">${data.buttonText}</a></div>`;
          default:
            const btnClassesDefault = `${buttonBaseClasses} ${getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color').class} ${getClassOrStyle(data.buttonTextColor, 'text-white', 'color').class}`;
            return `<div class="${getClassOrStyle(data.backgroundColor, 'bg-slate-100', 'background-color').class} p-12 md:p-20 text-center" style="${getClassOrStyle(data.backgroundColor, 'bg-slate-100', 'background-color').style}"><h1 class="text-3xl md:text-4xl font-bold mb-4 ${titleClass.class}" style="${titleClass.style}">${data.title}</h1><p class="text-lg max-w-2xl mx-auto mb-8 ${subtitleClass.class}" style="${subtitleClass.style}">${data.subtitle}</p><a href="${data.buttonLink || '#'}" class="${btnClassesDefault}">${data.buttonText}</a></div>`;
        }
      }
      case 'catalog': {
        const headerHtml = `<div class="text-center mb-8 md:mb-12 lg:mb-16"><h2 class="text-2xl md:text-3xl lg:text-4xl font-bold ${data.titleColor || 'text-slate-800'} mb-3 md:mb-4 lg:mb-6">${data.title}</h2><p class="text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${data.subtitleColor || 'text-slate-600'}">${data.subtitle}</p></div>`;
        const products = data.products || [];
        
        switch(data.variant) {
            case 'minimalGrid':
                return `<div class="${data.backgroundColor || 'bg-white'} py-12 md:py-16 lg:py-20 px-4"><div class="max-w-7xl mx-auto">${headerHtml}<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">${products.map(product => `
                    <a href="#" class="group cursor-pointer">
                        <div class="relative overflow-hidden rounded-lg bg-slate-50 mb-4">
                            <img class="w-full aspect-square object-cover transition-all duration-500 group-hover:scale-110" src="${product.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'}" alt="${product.name}" loading="lazy"/>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-sm md:text-base lg:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors ${data.productNameColor || 'text-slate-800'}">${product.name}</h3>
                            <p class="text-xs md:text-sm lg:text-base font-medium ${data.productPriceColor || 'text-slate-600'}">${product.price}</p>
                        </div>
                    </a>
                `).join('')}</div></div></div>`;
            case 'carousel': {
                const scrollContainerId = `scroll-${block.id}`;
                const prevButtonId = `prev-${block.id}`;
                const nextButtonId = `next-${block.id}`;
                return `
                    <style>
                        #${scrollContainerId}::-webkit-scrollbar { display: none; }
                        #${scrollContainerId} { -ms-overflow-style: none; scrollbar-width: none; scroll-behavior: smooth; }
                    </style>
                    <div class="${data.backgroundColor || 'bg-white'} py-12 md:py-16 lg:py-20">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                            <div class="flex justify-between items-end mb-8 md:mb-10 lg:mb-12">
                                <div class="text-left flex-1">
                                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold ${data.titleColor || 'text-slate-800'} mb-2 md:mb-3 lg:mb-4">${data.title}</h2>
                                    <p class="text-base md:text-lg lg:text-xl max-w-3xl ${data.subtitleColor || 'text-slate-600'}">${data.subtitle}</p>
                                </div>
                                <div class="hidden md:flex gap-2 ml-8">
                                    <button id="${prevButtonId}" aria-label="Anterior" class="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
                                    <button id="${nextButtonId}" aria-label="Siguiente" class="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
                                </div>
                            </div>
                            <div id="${scrollContainerId}" class="flex overflow-x-auto snap-x snap-mandatory space-x-4 md:space-x-6 lg:space-x-8 pb-4">
                                ${products.map(product => `<a href="#" class="group text-left flex-shrink-0 w-64 sm:w-72 lg:w-80 snap-center">
                                    <div class="relative overflow-hidden rounded-xl bg-slate-50 mb-4">
                                        <img class="w-full aspect-square object-cover transition-all duration-500 group-hover:scale-110" src="${product.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'}" alt="${product.name}" loading="lazy"/>
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    </div>
                                    <div class="space-y-1 md:space-y-2">
                                        <h3 class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 group-hover:text-blue-600 transition-colors ${data.productNameColor || 'text-slate-800'}">${product.name}</h3>
                                        <p class="font-semibold text-sm md:text-base lg:text-lg ${data.productPriceColor || 'text-slate-600'}">${product.price}</p>
                                    </div>
                                </a>`).join('')}
                            </div>
                        </div>
                    </div>
                    <script>
                        (function() {
                            var container = document.getElementById('${scrollContainerId}');
                            var prevBtn = document.getElementById('${prevButtonId}');
                            var nextBtn = document.getElementById('${nextButtonId}');
                            if (!container || !prevBtn || !nextBtn) return;
                            var scrollAmount = container.querySelector('a')?.offsetWidth + 32 || 352;
                            function updateButtons() {
                                if (!container) return;
                                var scrollLeft = container.scrollLeft;
                                var scrollWidth = container.scrollWidth;
                                var clientWidth = container.clientWidth;
                                prevBtn.disabled = scrollLeft <= 0;
                                nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
                            }
                            prevBtn.addEventListener('click', function() { container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
                            nextBtn.addEventListener('click', function() { container.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });
                            container.addEventListener('scroll', updateButtons, { passive: true });
                            var resizeObserver = new ResizeObserver(updateButtons);
                            resizeObserver.observe(container);
                            var mutationObserver = new MutationObserver(updateButtons);
                            mutationObserver.observe(container, { childList: true });
                            setTimeout(updateButtons, 100);
                        })();
                    </script>
                `;
            }
            case 'grid':
            default:
                return `<div class="${data.backgroundColor || 'bg-white'} py-20 px-4"><div class="max-w-7xl mx-auto">${headerHtml}<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 text-left">${products.map(product => `
                    <div class="group rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${data.cardColor || 'bg-white border-slate-200'}">
                        <div class="relative overflow-hidden bg-slate-50">
                            <img class="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110" src="${product.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=Producto'}" alt="${product.name}" loading="lazy"/>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div class="p-4 md:p-6 flex flex-col flex-grow">
                            <h3 class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 mb-2 md:mb-3 ${data.productNameColor || 'text-slate-900'}">${product.name}</h3>
                            <p class="font-bold text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 ${data.productPriceColor || 'text-blue-600'}">${product.price}</p>
                            <p class="flex-grow text-sm md:text-base line-clamp-3 mb-4 md:mb-6 ${data.productDescriptionColor || 'text-slate-600'}">${product.description}</p>
                            <button class="w-full text-center rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 mt-auto py-2 md:py-2.5 lg:py-3 text-sm md:text-base ${data.buttonBgColor || 'bg-slate-800 hover:bg-slate-700'} ${data.buttonTextColor || 'text-white'}">${product.buttonText}</button>
</div>
</div>
`).join('')}</div></div></div>`;
        }
      }
      case 'team': {
        const titleHtml = `<h2 class="text-3xl font-bold text-center ${data.titleColor || 'text-slate-800'}">${data.title}</h2>`;
        const subtitleHtml = `<p class="text-lg text-center mt-2 mb-12 max-w-2xl mx-auto ${data.subtitleColor || 'text-slate-600'}">${data.subtitle}</p>`;
        const members = data.members || [];
        switch(data.variant) {
            case 'list':
                return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-3xl mx-auto">${titleHtml}${subtitleHtml}<div class="space-y-8">${members.map(member => `<div class="flex items-center gap-6"><img class="w-20 h-20 rounded-full object-cover shadow-sm" src="${member.imageUrl || 'https://placehold.co/100x100/e2e8f0/64748b?text=Foto'}" alt="${member.name}" /><div><h3 class="font-semibold text-xl ${data.nameColor || 'text-slate-900'}">${member.name}</h3><p class="${data.roleColor || 'text-slate-500'}">${member.role}</p></div></div>`).join('')}</div></div></div>`;
            case 'grid':
            default:
                return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-6xl mx-auto text-center">${titleHtml}${subtitleHtml}<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${members.map(member => `<div><img class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md" src="${member.imageUrl || 'https://placehold.co/200x200/e2e8f0/64748b?text=Foto'}" alt="${member.name}" /><h3 class="font-semibold text-lg ${data.nameColor || 'text-slate-900'}">${member.name}</h3><p class="${data.roleColor || 'text-slate-500'} text-sm">${member.role}</p></div>`).join('')}</div></div></div>`;
        }
      }
      case 'testimonial': {
        const titleHtml = data.title ? `<h2 class="text-3xl font-bold text-center mb-12 text-slate-800">${data.title}</h2>` : '';
        const testimonials = data.testimonials || [];
        switch(data.variant) {
            case 'singleWithImage':
                const singleWithImage = testimonials[0];
                if (!singleWithImage) return '';
                return `<div class="bg-white py-16"><div class="max-w-2xl mx-auto text-center"><img class="w-24 h-24 mx-auto rounded-full object-cover" src="${singleWithImage.imageUrl || 'https://placehold.co/100x100/e2e8f0/64748b?text=Foto'}" alt="${singleWithImage.author}" /><blockquote class="mt-8 text-2xl font-medium text-slate-700"><p>&ldquo;${singleWithImage.quote}&rdquo;</p></blockquote><footer class="mt-6"><div class="font-semibold text-slate-900">${singleWithImage.author}</div><div class="text-slate-500">${singleWithImage.role}</div></footer></div></div>`;
            case 'grid':
                return `<div class="bg-white py-16 px-4"><div class="max-w-6xl mx-auto">${titleHtml}<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${testimonials.map(t => `<figure class="bg-slate-50 p-8 rounded-lg"><blockquote class="text-slate-700"><p>&ldquo;${t.quote}&rdquo;</p></blockquote><figcaption class="flex items-center gap-4 mt-6"><img class="w-12 h-12 rounded-full object-cover" src="${t.imageUrl || 'https://placehold.co/50x50/e2e8f0/64748b?text=Foto'}" alt="${t.author}" /><div><div class="font-semibold text-slate-900">${t.author}</div><div class="text-slate-500 text-sm">${t.role}</div></div></figcaption></figure>`).join('')}</div></div></div>`;
            case 'single':
            default:
                const single = testimonials[0];
                if (!single) return '';
                return `<div class="bg-slate-50 p-16"><div class="max-w-4xl mx-auto text-center"><blockquote class="text-3xl font-medium text-slate-700"><p>&ldquo;${single.quote}&rdquo;</p></blockquote><footer class="mt-8 text-lg"><div class="font-semibold text-slate-900">${single.author}</div><div class="text-slate-500">${single.role}</div></footer></div></div>`;
        }
      }
      case 'faq': {
        const titleHtml = `<h2 class="text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}">${data.title}</h2>`;
        const items = data.items || [];
        switch(data.variant) {
            case 'accordion':
                return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-3xl mx-auto">${titleHtml}<div class="divide-y divide-slate-200">${items.map((item) => `<details class="group py-4"><summary class="flex justify-between items-center font-medium cursor-pointer list-none"><span class="font-semibold text-lg ${data.questionColor || 'text-slate-900'}">${item.question}</span><span class="transition group-open:rotate-180 text-slate-500"><svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span></summary><p class="text-slate-600 mt-3 ${data.answerColor || 'text-slate-600'}">${item.answer}</p></details>`).join('')}</div></div></div>`;
            case 'list':
            default:
                return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-3xl mx-auto">${titleHtml}<div class="space-y-8">${items.map(item => `<div><h3 class="font-semibold text-xl mb-2 ${data.questionColor || 'text-slate-900'}">${item.question}</h3><p class="${data.answerColor || 'text-slate-600'}">${item.answer}</p></div>`).join('')}</div></div></div>`;
        }
      }
      case 'text': {
        const formattedContent = (data.content || '').replace(/\n/g, '<br />');
        switch (data.variant) {
          case 'quote': return `<div class="${data.backgroundColor || ''}"><div class="max-w-4xl mx-auto py-8 px-4"><blockquote class="border-l-4 border-slate-400 pl-4 italic"><p class="${data.textColor || 'text-slate-600'}">${formattedContent}</p></blockquote></div></div>`;
          case 'highlighted': return `<div class="max-w-4xl mx-auto py-8 px-4"><div class="${data.backgroundColor || 'bg-blue-50 border-blue-200'} border rounded-lg p-4"><p class="${data.textColor || 'text-blue-800'}">${formattedContent}</p></div></div>`;
          default: return `<div class="${data.backgroundColor || ''}"><div class="max-w-4xl mx-auto py-8 px-4 prose prose-slate"><p class="${data.textColor || 'text-slate-800'}">${formattedContent}</p></div></div>`;
        }
      }
      case 'image': {
        const captionHtml = data.caption ? `<p class="text-sm text-slate-600 mt-2 italic">${data.caption}</p>` : '';
        switch (data.variant) {
          case 'bordered': return `<div class="max-w-4xl mx-auto p-4 text-center"><img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto border-4 border-white shadow-lg" />${captionHtml.replace('mt-2', 'mt-3')}</div>`;
          case 'fullwidth': return `<div class="w-full my-8"><img src="${data.imageUrl}" alt="${data.alt}" class="w-full h-auto" />${captionHtml ? `<p class="text-center">${captionHtml}</p>` : ''}</div>`;
          default: return `<div class="max-w-4xl mx-auto p-4 text-center"><img src="${data.imageUrl}" alt="${data.alt}" class="rounded-lg mx-auto max-w-full h-auto" />${captionHtml}</div>`;
        }
      }
      case 'gallery': {
        const spacingClasses = { sm: 'gap-2', md: 'gap-4', lg: 'gap-8' };
        const spacingClass = spacingClasses[data.spacing] || 'gap-4';
        
        const widthClasses = { normal: 'max-w-4xl', wide: 'max-w-7xl', full: 'w-full' };
        const widthClass = widthClasses[data.width] || 'max-w-7xl';

        const images = data.images || [];
        const galleryId = `gallery-${block.id}`;

        let galleryHtml = '';

        switch (data.variant) {
          case 'carousel': {
            const scrollContainerId = `scroll-${galleryId}`;
            const prevButtonId = `prev-${galleryId}`;
            const nextButtonId = `next-${galleryId}`;
            galleryHtml = `
              <div class="relative">
                <div id="${scrollContainerId}" class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth ${spacingClass}" style="scrollbar-width: none; -ms-overflow-style: none;">
                  ${images.map((img, i) => `
                    <div class="snap-center flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4">
                      <img src="${img.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Imagen'}" alt="${img.alt}" class="w-full aspect-square object-cover rounded-lg gallery-image" data-gallery-id="${galleryId}" data-image-index="${i}" />
                    </div>
                  `).join('')}
                </div>
                <button id="${prevButtonId}" aria-label="Anterior" class="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
                <button id="${nextButtonId}" aria-label="Siguiente" class="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
              <script>
                (function() {
                  var container = document.getElementById('${scrollContainerId}');
                  var prevBtn = document.getElementById('${prevButtonId}');
                  var nextBtn = document.getElementById('${nextButtonId}');
                  if (!container || !prevBtn || !nextBtn) return;
                  
                  function updateButtons() {
                    var scrollLeft = container.scrollLeft;
                    var scrollWidth = container.scrollWidth;
                    var clientWidth = container.clientWidth;
                    prevBtn.disabled = scrollLeft <= 0;
                    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
                  }

                  function scrollToNext() {
                    var itemWidth = container.querySelector('div').offsetWidth;
                    var currentScroll = container.scrollLeft;
                    var targetScroll = Math.floor((currentScroll + itemWidth) / itemWidth) * itemWidth;
                    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
                  }

                  function scrollToPrev() {
                    var itemWidth = container.querySelector('div').offsetWidth;
                    var currentScroll = container.scrollLeft;
                    var targetScroll = Math.ceil((currentScroll - itemWidth) / itemWidth) * itemWidth;
                    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
                  }

                  prevBtn.addEventListener('click', scrollToPrev);
                  nextBtn.addEventListener('click', scrollToNext);
                  container.addEventListener('scroll', updateButtons, { passive: true });
                  
                  var resizeObserver = new ResizeObserver(updateButtons);
                  resizeObserver.observe(container);
                  
                  setTimeout(updateButtons, 100);
                })();
              </script>
            `;
            break;
          }
          case 'featured': {
            const [first, ...rest] = images;
            if (!first) break;
            galleryHtml = `
              <div class="grid grid-cols-1 md:grid-cols-3 ${spacingClass}">
                <div class="md:col-span-2">
                  <img src="${first.url || 'https://placehold.co/800x800/e2e8f0/64748b?text=Imagen'}" alt="${first.alt}" class="w-full aspect-square object-cover rounded-lg gallery-image" data-gallery-id="${galleryId}" data-image-index="0" />
                </div>
                <div class="grid grid-cols-2 md:grid-cols-1 ${spacingClass}">
                  ${rest.slice(0, 2).map((img, i) => `
                    <img src="${img.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Imagen'}" alt="${img.alt}" class="w-full aspect-square object-cover rounded-lg gallery-image" data-gallery-id="${galleryId}" data-image-index="${i + 1}" />
                  `).join('')}
                </div>
              </div>
            `;
            break;
          }
          case 'grid':
          default: {
            galleryHtml = `
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${spacingClass}">
                ${images.map((img, i) => `
                  <img src="${img.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Imagen'}" alt="${img.alt}" class="w-full aspect-square object-cover rounded-lg gallery-image" data-gallery-id="${galleryId}" data-image-index="${i}" />
                `).join('')}
              </div>
            `;
            break;
          }
        }

        let lightboxScript = '';
        if (data.lightbox) {
          lightboxScript = `
            <script>
              (function() {
                if (document.getElementById('gallery-lightbox-container')) return;

                var container = document.createElement('div');
                container.id = 'gallery-lightbox-container';
                container.className = 'fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4 hidden';
                container.innerHTML = '<img id="gallery-lightbox-image" src="" alt="Vista ampliada" class="max-w-full max-h-full rounded-lg" /><button id="gallery-lightbox-close" class="absolute top-4 right-4 text-white text-3xl">&times;</button>';
                document.body.appendChild(container);

                var imageEl = document.getElementById('gallery-lightbox-image');
                var closeBtn = document.getElementById('gallery-lightbox-close');

                function closeLightbox() {
                  container.classList.add('hidden');
                }

                container.addEventListener('click', closeLightbox);
                closeBtn.addEventListener('click', closeLightbox);

                var allImages = ${JSON.stringify(images.map(i => i.url))};

                document.querySelectorAll('.gallery-image[data-gallery-id="${galleryId}"]').forEach(function(el) {
                  el.addEventListener('click', function() {
                    var index = parseInt(this.getAttribute('data-image-index'), 10);
                    if (imageEl) {
                      imageEl.src = allImages[index];
                    }
                    container.classList.remove('hidden');
                  });
                });
              })();
            </script>
          `;
        }

        return `<div class="py-8 px-4" id="${galleryId}">
                  <div class="${widthClass} mx-auto">
                    ${galleryHtml}
                  </div>
                </div>${lightboxScript}`;
      }
      case 'cards': {
        const cardsTitleHtml = `<h2 class="text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}">${data.title}</h2>`;
        switch (data.variant) {
          case 'list': return `<div class="${data.sectionBackgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-3xl mx-auto">${cardsTitleHtml}<div class="space-y-8">${(data.cards || []).map(card => `<div class="flex items-start gap-6"><div class="text-3xl mt-1">${card.icon}</div><div><h3 class="text-xl font-semibold mb-2 ${data.titleColor || 'text-slate-800'}">${card.title}</h3><p class="${data.textColor || 'text-slate-600'}">${card.description}</p></div></div>`).join('')}</div></div></div>`;
          case 'imageTop': return `<div class="${data.sectionBackgroundColor || 'bg-slate-50'} py-12 px-4"><div class="max-w-5xl mx-auto">${cardsTitleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.cards || []).map(card => `<div class="${data.cardBackgroundColor || 'bg-white'} rounded-lg shadow-sm ring-1 ring-slate-100 overflow-hidden"><img src="${card.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${card.title}" class="w-full h-40 object-cover" /><div class="p-6 text-center"><h3 class="text-xl font-semibold mb-2 ${data.titleColor || 'text-slate-800'}">${card.title}</h3><p class="${data.textColor || 'text-slate-600'} text-sm">${card.description}</p></div></div>`).join('')}</div></div></div>`;
          default: return `<div class="${data.sectionBackgroundColor || 'bg-slate-50'} py-12 px-4"><div class="max-w-5xl mx-auto">${cardsTitleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.cards || []).map(card => `<div class="text-center p-6 rounded-lg shadow-sm ring-1 ring-slate-100 ${data.cardBackgroundColor || 'bg-white'}"><div class="text-4xl mb-4">${card.icon}</div><h3 class="text-xl font-semibold mb-2 ${data.titleColor || 'text-slate-800'}">${card.title}</h3><p class="${data.textColor || 'text-slate-600'} text-sm">${card.description}</p></div>`).join('')}</div></div></div>`;
        }
      }
      case 'cta': {
        const ctaButtonClasses = `inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`;
        switch (data.variant) {
          case 'light': return `<div class="${data.backgroundColor || 'bg-slate-100'} p-12 text-center rounded-lg"><h2 class="text-3xl font-bold mb-2 ${data.titleColor || 'text-slate-800'}">${data.title}</h2><p class="text-lg mb-6 max-w-xl mx-auto ${data.subtitleColor || 'text-slate-600'}">${data.subtitle}</p><a href="#" class="${ctaButtonClasses}">${data.buttonText}</a></div>`;
          case 'split': return `<div class="${data.backgroundColor || 'bg-white'} p-8"><div class="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8"><div class="text-center md:text-left"><h2 class="text-3xl font-bold mb-2 ${data.titleColor || 'text-slate-800'}">${data.title}</h2><p class="text-lg mb-6 ${data.subtitleColor || 'text-slate-600'}">${data.subtitle}</p><a href="#" class="${ctaButtonClasses}">${data.buttonText}</a></div><div><img src="${data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${data.title}" class="rounded-lg shadow-lg mx-auto" /></div></div></div>`;
          default: 
            const darkButtonClasses = `inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-800'}`;
            return `<div class="${data.backgroundColor || 'bg-slate-800'} p-12 text-center"><h2 class="text-3xl font-bold mb-2 ${data.titleColor || 'text-white'}">${data.title}</h2><p class="text-lg opacity-90 mb-6 max-w-xl mx-auto ${data.subtitleColor || 'text-slate-300'}">${data.subtitle}</p><a href="#" class="${darkButtonClasses}">${data.buttonText}</a></div>`;
        }
      }
      case 'pricing': {
        const titleHtml = `<h2 class="text-3xl font-bold text-center mb-2 ${data.titleColor || 'text-slate-800'}">${data.title}</h2><p class="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">${data.subtitle}</p>`;
        switch (data.variant) {
          case 'list':
            return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-4xl mx-auto">${titleHtml}<div class="space-y-4">${(data.plans || []).map(plan => `<div class="p-4 border rounded-lg grid md:grid-cols-3 items-center gap-4 ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}"><div class="md:col-span-2"><h3 class="text-xl font-semibold mb-1">${plan.name}</h3><p class="text-sm text-slate-500">${plan.description}</p></div><div class="text-right"><p class="text-3xl font-bold">$${plan.price}<span class="text-sm font-normal text-slate-500">${plan.frequency}</span></p><a href="#" class="mt-2 inline-block w-full text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">${plan.buttonText}</a></div></div>`).join('')}</div></div></div>`;
          case 'simple':
            return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-4xl mx-auto">${titleHtml}<div class="grid md:grid-cols-2 gap-8">${(data.plans || []).map(plan => `<div class="p-6 border rounded-lg ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}"><h3 class="text-xl font-semibold mb-2">${plan.name}</h3><p class="text-4xl font-bold mb-4">$${plan.price}<span class="text-base font-normal text-slate-500">${plan.frequency}</span></p><p class="text-slate-500 text-sm mb-4">${plan.description}</p><a href="#" class="w-full block text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">${plan.buttonText}</a></div>`).join('')}</div></div></div>`;
          default: // columns
            return `<div class="${data.backgroundColor || 'bg-white'} py-12 px-4"><div class="max-w-5xl mx-auto">${titleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.plans || []).map(plan => `<div class="p-6 border rounded-lg text-left flex flex-col ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}"><h3 class="text-xl font-semibold mb-1">${plan.name}</h3><p class="text-slate-500 mb-4">${plan.description}</p><p class="text-4xl font-bold mb-1">$${plan.price}<span class="text-base font-normal text-slate-500">${plan.frequency}</span></p><ul class="text-sm text-slate-600 space-y-2 my-6 flex-grow">${(plan.features || []).map(feat => `<li class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><path d="M20 6 9 17l-5-5"/></svg><span>${feat}</span></li>`).join('')}</ul><a href="#" class="w-full text-center py-2 rounded-md font-semibold ${plan.highlighted ? `${data.highlightColor ? data.highlightColor.replace('border-', 'bg-') : 'bg-blue-600'} text-white` : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}">${plan.buttonText}</a></div>`).join('')}</div></div></div>`;
        }
      }
      case 'footer': {
        switch (data.variant) {
          case 'multiColumn': return `<footer class="${data.backgroundColor || 'bg-slate-800'} ${data.textColor || 'text-slate-400'} text-sm p-8"><div class="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">${(data.columns || []).map(col => `<div><h4 class="font-semibold text-white mb-3">${col.title}</h4><ul class="space-y-2">${(col.links || []).map(link => `<li><a href="#" class="hover:text-white">${link}</a></li>`).join('')}</ul></div>`).join('')}</div><div class="mt-8 border-t border-slate-700 pt-4 text-center"><p>${data.copyrightText || ''}</p></div></footer>`;
          case 'minimal': return `<footer class="${data.backgroundColor || 'bg-white'} ${data.textColor || 'text-slate-500'} text-xs text-center p-4"><p>${data.copyrightText || ''}</p></footer>`;
          default: return `<footer class="${data.backgroundColor || 'bg-slate-800'} ${data.textColor || 'text-slate-400'} text-sm text-center p-8"><p class="mb-4">${data.copyrightText || ''}</p><div class="flex justify-center space-x-4">${(data.socialLinks || []).map(link => link.url ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-white">${link.platform}</a>` : '').join('')}</div></footer>`;
        }
      }
      case 'featuredProduct': {
        const rating = data.rating || 0;
        const starsHtml = [...Array(5)].map((_, i) => 
            `<svg class="w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`
        ).join('');
        switch(data.variant) {
            case 'background':
                return `<div class="relative text-white min-h-[500px] flex items-center"><img src="${data.imageUrl || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Producto'}" alt="${data.title}" class="absolute inset-0 w-full h-full object-cover" /><div class="absolute inset-0 bg-black/60"></div><div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-lg"><span class="text-sm font-bold uppercase tracking-widest text-blue-400">${data.tag}</span><h2 class="font-bold my-4 text-4xl md:text-5xl">${data.title}</h2><p class="mb-6 text-slate-200 text-lg leading-relaxed">${data.description}</p><div class="flex items-center gap-8 mb-8"><p class="font-bold text-3xl md:text-4xl">${data.price}</p><div class="flex items-center gap-1">${starsHtml}</div></div><a href="#" class="inline-block text-center rounded-lg font-semibold transition-transform hover:scale-105 py-4 px-12 text-lg ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-900'}">${data.buttonText}</a></div></div></div>`;
            case 'imageLeft':
            default:
                return `<div class="${data.backgroundColor || 'bg-white'} py-20 px-4"><div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12"><div class="rounded-lg overflow-hidden bg-slate-100"><img src="${data.imageUrl || 'https://placehold.co/600x600/e2e8f0/64748b?text=Producto'}" alt="${data.title}" class="w-full h-full object-cover aspect-square" /></div><div class="text-left"><span class="text-sm font-bold uppercase tracking-widest ${data.textColor || 'text-blue-600'}">${data.tag}</span><h2 class="font-bold my-4 text-4xl md:text-5xl ${data.textColor || 'text-slate-800'}">${data.title}</h2><p class="mb-6 text-lg leading-relaxed ${data.textColor || 'text-slate-600'}">${data.description}</p><div class="flex items-center justify-between mb-8"><p class="font-bold text-4xl ${data.textColor || 'text-slate-900'}">${data.price}</p><div class="flex items-center gap-1">${starsHtml}</div></div><a href="#" class="w-full block text-center rounded-lg font-semibold transition-transform hover:scale-105 py-4 text-lg ${data.buttonBgColor || 'bg-slate-900'} ${data.buttonTextColor || 'text-white'}">${data.buttonText}</a></div></div></div>`;
        }
      }
      case 'banner': {
        const bg = getClassOrStyle(data.bgColor, 'bg-blue-50', 'background-color');
        const text = getClassOrStyle(data.textColor, 'text-blue-900', 'color');
        const btnBg = getClassOrStyle(data.buttonBgColor, 'bg-yellow-400/90', 'background-color');
        const btnText = getClassOrStyle(data.buttonTextColor, 'text-yellow-900', 'color');

        const heightClass = data.height || 'h-12';
        const textSizeClass = data.textSize || 'text-base';
        
        // Simplificar la lógica de alineación para que coincida con el editor de React
        const align = data.textAlign || 'center';
        const alignClass = {
          left: 'justify-start',
          center: 'justify-center',
          right: 'justify-end'
        }[align];

        const textClass = `font-semibold ${text.class} ${textSizeClass}`;
        
        // La clase del contenedor ahora es siempre flex horizontal
        const containerClass = `w-full ${heightClass} flex items-center px-4 shadow-sm gap-2 ${bg.class} ${alignClass}`;

        const buttonClass = `ml-2 px-3 py-1 rounded-md font-semibold transition ${btnBg.class} ${btnText.class} ${textSizeClass}`;
        const buttonStyle = `${btnBg.style} ${btnText.style}`.trim();

        return `<div class="${containerClass}" style="${bg.style}">
                  <span class="${textClass}" style="${text.style}">${data.text}</span>
                  ${data.buttonText ? `<a href="#" class="${buttonClass}" style="${buttonStyle}">${data.buttonText}</a>` : ''}
                </div>`;
      }
      default:
        console.warn(`AVISO: El tipo de bloque "${type}" no está registrado y no será renderizado.`);
        return '';
    }
  }).join('');
}

