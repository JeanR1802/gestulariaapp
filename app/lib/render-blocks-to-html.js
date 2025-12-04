// app/lib/render-blocks-to-html.js
const buildHead = (cssUrl, manifestUrl, faviconUrl) => {
  // En desarrollo, usar Tailwind CDN; en producción, usar el CSS compilado si existe
  const isDev = process.env.NODE_ENV !== 'production';
  const cssLink = isDev 
    ? '<script src="https://cdn.tailwindcss.com"></script>' 
    : `<link rel="stylesheet" href="${cssUrl}"/>`;
  
  // Solo incluir manifest y favicon si están disponibles
  const manifestLink = manifestUrl ? `<link rel="manifest" href="${manifestUrl}"/>` : '';
  const faviconLink = faviconUrl ? `<link rel="icon" type="image/png" href="${faviconUrl}"/>` : '';
  
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Preview</title>${cssLink}${manifestLink}${faviconLink}</head><body>`;
};
const buildTail = (initScript) => `${initScript}</body></html>`;

let canUseReactServer = false;
let React, ReactDOMServer, BlockRenderer;

// Dynamic imports for server-side rendering  
const initReactComponents = async () => {
  try {
    React = (await import('react')).default;
    ReactDOMServer = (await import('react-dom/server')).default;
    const BlockRendererModule = await import('../components/editor/BlockRenderer');
    BlockRenderer = BlockRendererModule.default;
    canUseReactServer = !!React && !!ReactDOMServer && !!BlockRenderer;
  } catch {
    canUseReactServer = false;
  }
};

function legacyRender(blocks) {
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
      // Provide a small inline-style fallback for common Tailwind classes to
      // avoid mismatches when the final CSS build doesn't include dynamic
      // class names (JIT/purge issues). We only add safe fallbacks for a
      // handful of common classes used by the editor (expand as needed).
      // Normalize opacity suffixes like `bg-white/90` -> `bg-white`
      const normalize = (cls) => (cls.includes('/') ? cls.split('/')[0] : cls);

      const classToFallback = (cls, prop) => {
        if (!cls) return '';
        const n = normalize(cls);
        // Background color fallbacks
        if (prop === 'background-color') {
          if (n.includes('bg-blue-800')) return 'background-color:#1e40af;';
          if (n.includes('bg-blue-700')) return 'background-color:#1d4ed8;';
          if (n.includes('bg-blue-600')) return 'background-color:#2563eb;';
          if (n.includes('bg-blue-500')) return 'background-color:#3b82f6;';
          if (n.includes('bg-blue-400')) return 'background-color:#60a5fa;';
          // Red fallbacks
          if (n.includes('bg-red-800')) return 'background-color:#7f1d1d;';
          if (n.includes('bg-red-700')) return 'background-color:#b91c1c;';
          if (n.includes('bg-red-600')) return 'background-color:#dc2626;';
          if (n.includes('bg-red-500')) return 'background-color:#ef4444;';
          if (n.includes('bg-red-400')) return 'background-color:#f87171;';
          // Green fallbacks
          if (n.includes('bg-green-800')) return 'background-color:#064e3b;';
          if (n.includes('bg-green-700')) return 'background-color:#047857;';
          if (n.includes('bg-green-600')) return 'background-color:#16a34a;';
          if (n.includes('bg-green-500')) return 'background-color:#22c55e;';
          if (n.includes('bg-green-400')) return 'background-color:#4ade80;';
          if (n.includes('bg-slate-900')) return 'background-color:#0f172a;';
          if (n.includes('bg-slate-800')) return 'background-color:#1e293b;';
          if (n.includes('bg-slate-700')) return 'background-color:#334155;';
          if (n.includes('bg-slate-600')) return 'background-color:#475569;';
          if (n.includes('bg-slate-500')) return 'background-color:#64748b;';
          if (n.includes('bg-slate-400')) return 'background-color:#94a3b8;';
          if (n.includes('bg-slate-300')) return 'background-color:#cbd5e1;';
          if (n.includes('bg-slate-200')) return 'background-color:#e2e8f0;';
          if (n.includes('bg-slate-100')) return 'background-color:#f1f5f9;';
          if (n.includes('bg-slate-50')) return 'background-color:#f8fafc;';
          if (n.includes('bg-white')) return 'background-color:#ffffff;';
          if (n.includes('bg-black')) return 'background-color:#000000;';
        }
        // Text color fallbacks
        if (prop === 'color') {
          if (n.includes('text-white')) return 'color:#ffffff;';
          if (n.includes('text-black')) return 'color:#000000;';
          if (n.includes('text-slate-900')) return 'color:#0f172a;';
          if (n.includes('text-slate-800')) return 'color:#1e293b;';
          if (n.includes('text-slate-700')) return 'color:#334155;';
          if (n.includes('text-slate-600')) return 'color:#475569;';
          if (n.includes('text-slate-500')) return 'color:#64748b;';
          if (n.includes('text-slate-400')) return 'color:#94a3b8;';
          if (n.includes('text-slate-300')) return 'color:#cbd5e1;';
          if (n.includes('text-slate-200')) return 'color:#e2e8f0;';
          if (n.includes('text-slate-100')) return 'color:#f1f5f9;';
          if (n.includes('text-slate-50')) return 'color:#f8fafc;';
          if (n.includes('text-blue-700')) return 'color:#1d4ed8;';
          if (n.includes('text-blue-600')) return 'color:#2563eb;';
          if (n.includes('text-blue-500')) return 'color:#3b82f6;';
          if (n.includes('text-blue-400')) return 'color:#60a5fa;';
          // Red text fallbacks
          if (n.includes('text-red-700')) return 'color:#b91c1c;';
          if (n.includes('text-red-600')) return 'color:#dc2626;';
          if (n.includes('text-red-500')) return 'color:#ef4444;';
          if (n.includes('text-red-400')) return 'color:#f87171;';
          // Green text fallbacks
          if (n.includes('text-green-700')) return 'color:#047857;';
          if (n.includes('text-green-600')) return 'color:#16a34a;';
          if (n.includes('text-green-500')) return 'color:#22c55e;';
          if (n.includes('text-green-400')) return 'color:#4ade80;';
        }
        return '';
      };

      return { class: color, style: classToFallback(color, cssProp) };
    }

    // Si es un color hexadecimal, rgb, o nombre de color, aplicar como estilo en línea
    return { class: '', style: `${cssProp}: ${color};` };
  }

  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks.map((block, index) => {
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
        const closeButtonId = `close-button-${block.id}`;
        let headerHtml = '';
        const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
        const logo = getClassOrStyle(data.logoColor, 'text-slate-800', 'color');
        const link = getClassOrStyle(data.linkColor, 'text-slate-600', 'color');
        const buttonBg = getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color');
        const buttonText = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
        const menuMaxHeight = 'max-h-[70vh] overflow-y-auto';
        const menuInlineStyle = 'max-height:70vh; overflow-y:auto;';

        switch (data.variant) {
          case 'centered':
            headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3">
                <h1 class="text-xl md:text-2xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1>
                <nav class="hidden md:flex items-center space-x-6 text-sm ${link.class}" style="${link.style}">
                  <a href="#" class="hover:opacity-100">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="hover:opacity-100">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="hover:opacity-100">${data.link3 || 'Contacto'}</a>
                </nav>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-controls="${mobileMenuId}" aria-expanded="false" aria-label="Abrir menú" class="${logo.class}" style="${logo.style}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <nav id="${mobileMenuId}" class="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 ${menuMaxHeight}" style="${menuInlineStyle}" role="dialog" aria-modal="true" aria-hidden="true">
                <button id="${closeButtonId}" aria-label="Cerrar menú" class="self-end mr-4 text-slate-600">×</button>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link3 || 'Contacto'}</a>
              </nav>
            `;
            break;

          case 'withButton':
            headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1>
                <div class="hidden md:flex items-center gap-6">
                  <nav class="flex items-center space-x-6 text-sm ${link.class}" style="${link.style}">
                    <a href="#" class="hover:opacity-100">${data.link1 || 'Producto'}</a>
                    <a href="#" class="hover:opacity-100">${data.link2 || 'Precios'}</a>
                  </nav>
                  <a href="#" class="px-4 py-1.5 rounded-md text-sm font-semibold ${buttonBg.class} ${buttonText.class}" style="${buttonBg.style} ${buttonText.style}">${data.buttonText || 'Acción'}</a>
                </div>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-controls="${mobileMenuId}" aria-expanded="false" aria-label="Abrir menú" class="${logo.class}" style="${logo.style}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <nav id="${mobileMenuId}" class="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 ${menuMaxHeight}" style="${menuInlineStyle}" role="dialog" aria-modal="true" aria-hidden="true">
                <button id="${closeButtonId}" aria-label="Cerrar menú" class="self-end mr-4 text-slate-600">×</button>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Producto'}</a>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Precios'}</a>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.buttonText || 'Acción'}</a>
              </nav>
            `;
            break;

          case 'sticky':
            // Live site can have a sticky header; mobile menu is an off-canvas panel
            headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1>
                <nav class="hidden md:flex items-center space-x-6 text-sm ${link.class}" style="${link.style}">
                  <a href="#" class="hover:opacity-100">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="hover:opacity-100">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="hover:opacity-100">${data.link3 || 'Contacto'}</a>
                </nav>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-controls="${mobileMenuId}" aria-expanded="false" aria-label="Abrir menú" class="${logo.class}" style="${logo.style}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <nav id="${mobileMenuId}" class="fixed inset-y-0 right-0 w-72 bg-white z-50 transform translate-x-full transition-transform ${menuMaxHeight}" role="dialog" aria-modal="true" aria-hidden="true">
                <div class="p-4 border-b flex items-center justify-between">
                  <h3 class="font-semibold">Menu</h3>
                  <button id="${closeButtonId}" aria-label="Cerrar menú" class="text-slate-600">×</button>
                </div>
                <div class="p-4 flex flex-col gap-4">
                  <a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="text-slate-800 hover:text-blue-600">${data.link3 || 'Contacto'}</a>
                </div>
              </nav>
            `;
            break;

          case 'nueva':
            // Nueva: modern centered links and right-side action; mobile opens full-screen compact menu
            headerHtml = `
              <div class="max-w-5xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <h1 class="text-lg font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Marca'}</h1>
                </div>
                <nav class="hidden md:flex items-center gap-8 ${link.class}" style="${link.style}">
                  <a href="#" class="text-sm">${data.link1 || 'Características'}</a>
                  <a href="#" class="text-sm">${data.link2 || 'Precios'}</a>
                  <a href="#" class="text-sm">${data.link3 || 'Soporte'}</a>
                </nav>
                <div class="hidden md:flex items-center gap-4">
                  <a href="#" class="px-4 py-1.5 rounded-full text-sm font-semibold ${buttonBg.class} ${buttonText.class}" style="${buttonBg.style} ${buttonText.style}">${data.buttonText || 'Comenzar'}</a>
                </div>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-controls="${mobileMenuId}" aria-expanded="false" aria-label="Abrir menú" class="${logo.class}" style="${logo.style}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>

                <nav id="${mobileMenuId}" class="hidden md:hidden fixed inset-0 bg-white z-50 p-6 ${menuMaxHeight} overflow-y-auto">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="font-bold">${data.logoText || 'Mi Marca'}</h2>
                    <button id="${closeButtonId}" aria-label="Cerrar menú" class="text-slate-600">×</button>
                  </div>
                  <div class="flex flex-col gap-4">
                    <a href="#" class="text-lg font-semibold">${data.link1 || 'Características'}</a>
                    <a href="#" class="text-lg font-semibold">${data.link2 || 'Precios'}</a>
                    <a href="#" class="text-lg font-semibold">${data.link3 || 'Soporte'}</a>
                    <a href="#" class="mt-4 inline-block px-4 py-2 rounded-md font-semibold ${buttonBg.class} ${buttonText.class}" style="${buttonBg.style} ${buttonText.style}">${data.buttonText || 'Comenzar'}</a>
                  </div>
                </nav>
            `;
            break;

          case 'custom': {
            // Custom header with customElements
            // Respect the editor's advanced layout logic (fixed/dynamic mode, padding)
            const customElements = data.customElements || [];
            const leftElements = customElements.filter(el => el.data && el.data.zone === 'left');
            const centerElements = customElements.filter(el => el.data && el.data.zone === 'center');
            const rightElements = customElements.filter(el => el.data && el.data.zone === 'right');
            
            // Get mode (default to 'fijo' if not specified, match editor's headerMode field)
            const layoutMode = data.headerMode || data.mode || 'fijo';
            
            // Get padding values (in px)
            const paddingLeft = typeof data.paddingLeft === 'number' ? data.paddingLeft : 0;
            const paddingRight = typeof data.paddingRight === 'number' ? data.paddingRight : 0;

            const renderElement = (el) => {
              const elData = el.data || {};
              switch (el.type) {
                case 'logo':
                  return `<span class="font-bold text-xl ${logo.class}" style="${logo.style}">${elData.content || 'Logo'}</span>`;
                case 'link':
                  return `<a href="${elData.href || '#'}" class="text-sm hover:opacity-80 transition-opacity ${link.class}" style="${link.style}">${elData.content || 'Link'}</a>`;
                case 'button':
                  return `<a href="${elData.buttonLink || elData.href || '#'}" class="px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity ${buttonBg.class} ${buttonText.class}" style="${buttonBg.style} ${buttonText.style}">${elData.buttonText || elData.content || 'Button'}</a>`;
                case 'heading':
                  const HeadingTag = elData.level || 'h2';
                  return `<${HeadingTag} class="font-bold text-lg ${logo.class}" style="${logo.style}">${elData.content || 'Heading'}</${HeadingTag}>`;
                case 'paragraph':
                  return `<p class="text-sm ${link.class}" style="${link.style}">${elData.content || 'Text'}</p>`;
                case 'image':
                  return `<img src="${elData.imageUrl || '/placeholder.svg'}" alt="${elData.alt || 'Image'}" class="h-8 w-auto object-contain"/>`;
                case 'spacer':
                  return `<div style="width:${elData.width || elData.height || 20}px" class="flex-shrink-0"></div>`;
                case 'actions':
                  return `<a href="${elData.href || '#'}" class="text-sm hover:opacity-80 transition-opacity ${link.class}" style="${link.style}">${elData.platform || 'Action'}</a>`;
                default:
                  return '<span class="text-xs text-slate-400">Unknown</span>';
              }
            };

            // Render based on layout mode
            if (layoutMode === 'fijo') {
              // Fixed mode: center is always centered, left/right absolute positioned
              // Padding is applied via invisible spacers (matching editor logic)
              // Use full width container for custom headers to avoid side gaps at large viewports
              headerHtml = `
                <div class="w-full relative" style="height:90px;">
                  ${paddingLeft > 0 ? `<div style="position:absolute;left:0;top:0;width:${paddingLeft}px;height:100%;pointer-events:none;"></div>` : ''}
                  ${paddingRight > 0 ? `<div style="position:absolute;right:0;top:0;width:${paddingRight}px;height:100%;pointer-events:none;"></div>` : ''}
                  
                  <div class="absolute h-full flex items-center gap-2" style="left:${paddingLeft}px;">
                    ${leftElements.map(renderElement).join('')}
                  </div>
                  
                  <div class="absolute h-full flex items-center justify-center gap-2" style="left:50%;transform:translateX(-50%);">
                    ${centerElements.map(renderElement).join('')}
                  </div>
                  
                  <div class="absolute h-full flex items-center flex-row-reverse gap-2" style="right:${paddingRight}px;">
                    ${rightElements.map(renderElement).join('')}
                  </div>
                </div>
              `;
            } else {
              // Dynamic mode: flex layout, center can be pushed
              // Padding still applied via spacers for consistency
              headerHtml = `
                <div class="w-full flex items-center justify-between" style="height:90px;">
                  ${paddingLeft > 0 ? `<div style="width:${paddingLeft}px;flex-shrink:0;"></div>` : ''}
                  
                  <div class="flex items-center gap-2">
                    ${leftElements.map(renderElement).join('')}
                  </div>
                  
                  <div class="flex items-center justify-center gap-2">
                    ${centerElements.map(renderElement).join('')}
                  </div>
                  
                  <div class="flex items-center flex-row-reverse gap-2">
                    ${rightElements.map(renderElement).join('')}
                  </div>
                  
                  ${paddingRight > 0 ? `<div style="width:${paddingRight}px;flex-shrink:0;"></div>` : ''}
                </div>
              `;
            }
            break;
          }

          default:
            headerHtml = `
              <div class="max-w-5xl mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold ${logo.class}" style="${logo.style}">${data.logoText || 'Mi Negocio'}</h1>
                <nav class="hidden md:flex items-center space-x-6 text-sm ${link.class}" style="${link.style}">
                  <a href="#" class="hover:opacity-100">${data.link1 || 'Inicio'}</a>
                  <a href="#" class="hover:opacity-100">${data.link2 || 'Servicios'}</a>
                  <a href="#" class="hover:opacity-100">${data.link3 || 'Contacto'}</a>
                </nav>
                <div class="md:hidden">
                  <button id="${toggleButtonId}" aria-controls="${mobileMenuId}" aria-expanded="false" aria-label="Abrir menú" class="${logo.class}" style="${logo.style}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <nav id="${mobileMenuId}" class="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 ${menuMaxHeight}" style="${menuInlineStyle}" role="dialog" aria-modal="true" aria-hidden="true">
                <button id="${closeButtonId}" aria-label="Cerrar menú" class="self-end mr-4 text-slate-600">×</button>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link1 || 'Inicio'}</a>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link2 || 'Servicios'}</a>
                <a href="#" class="text-slate-800 hover:text-blue-600">${data.link3 || 'Contacto'}</a>
              </nav>
            `;
            break;
        }

        // Script to handle mobile menu open/close and accessibility
        const overlayId = `overlay-${block.id}`;
        const script = `
          <script>
            (function(){
              var toggle = document.getElementById('${toggleButtonId}');
              var menu = document.getElementById('${mobileMenuId}');
              var closeBtn = document.getElementById('${closeButtonId}');
              if(!toggle || !menu) return;

              // Move menu to document.body to avoid positioning issues inside constrained containers
              try {
                if(menu.parentElement !== document.body) {
                  document.body.appendChild(menu);
                  // ensure the menu is fixed and full-width when moved
                  menu.style.position = menu.style.position || 'fixed';
                  menu.style.left = menu.style.left || '0';
                  menu.style.right = menu.style.right || '0';
                  menu.style.zIndex = menu.style.zIndex || '50';
                }
              } catch { /* noop */ }

              // Create or reuse overlay backdrop
              var overlay = document.getElementById('${overlayId}');
              if(!overlay) {
                overlay = document.createElement('div');
                overlay.id = '${overlayId}';
                overlay.style.position = 'fixed';
                overlay.style.inset = '0';
                overlay.style.background = 'rgba(0,0,0,0.35)';
                overlay.style.zIndex = '49';
                overlay.style.display = 'none';
                document.body.appendChild(overlay);
              }

              // Ensure menu starts hidden using inline styles (works without Tailwind)
              if(menu.classList.contains('hidden') || getComputedStyle(menu).display === 'none') {
                menu.style.display = 'none';
              }
              menu.style.transition = menu.style.transition || 'transform 0.28s ease, opacity 0.18s ease';

              function openMenu(){
                var isOffcanvas = menu.classList.contains('translate-x-full') || menu.classList.contains('translate-x-0') || menu.classList.contains('w-72');
                var isFullscreen = menu.classList.contains('inset-0');
                if(isOffcanvas){
                  // ensure off-canvas slides in from right
                  menu.style.display = 'block';
                  menu.style.transform = 'translateX(0)';
                } else if(isFullscreen){
                  overlay.style.display = 'block';
                  menu.style.display = 'block';
                } else {
                  menu.style.display = 'block';
                }
                menu.setAttribute('aria-hidden','false');
                toggle.setAttribute('aria-expanded','true');
                setTimeout(function(){
                  var focusTarget = menu.querySelector('button') || menu.querySelector('a');
                  if(focusTarget) try{ focusTarget.focus(); }catch(e){}
                }, 60);
              }

              function closeMenu(){
                var isOffcanvas = menu.classList.contains('translate-x-full') || menu.classList.contains('translate-x-0') || menu.classList.contains('w-72');
                var isFullscreen = menu.classList.contains('inset-0');
                if(isOffcanvas){
                  menu.style.transform = 'translateX(100%)';
                  setTimeout(function(){ menu.style.display = 'none'; }, 280);
                } else if(isFullscreen){
                  overlay.style.display = 'none';
                  menu.style.display = 'none';
                } else {
                  menu.style.display = 'none';
                }
                menu.setAttribute('aria-hidden','true');
                toggle.setAttribute('aria-expanded','false');
                try{ toggle.focus(); } catch(e){}
              }

              toggle.addEventListener('click', function(e){
                var expanded = toggle.getAttribute('aria-expanded') === 'true';
                if(expanded) closeMenu(); else openMenu();
              });

              if(closeBtn) closeBtn.addEventListener('click', closeMenu);
              overlay.addEventListener('click', closeMenu);

              // close on Escape
              document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });
            })();
          </script>
        `;
 
         // Return header + script
         // For custom variant, don't apply p-4 padding to outer header (padding is handled internally)
         const outerPadding = data.variant === 'custom' ? '' : 'p-4';
         // Ensure header margin is always 0 to avoid unexpected gaps in the final site
         const headerStyle = `${bg.style ? bg.style + ' ' : ''}margin:0;`;
         return `<header id="${headerId}" class="${bg.class} ${outerPadding} w-full ${data.variant === 'sticky' ? 'sticky top-0 z-40' : ''}" style="${headerStyle}">${headerHtml}</header>${script}`;
      }
      case 'hero': {
        const titleClass = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const subtitleClass = getClassOrStyle(data.subtitleColor, 'text-slate-600', 'color');
        const buttonBaseClasses = "inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105";
        switch (data.variant) {
          case 'leftImage':
            const btnBgLeft = getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color');
            const btnTextLeft = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
            const btnClassesLeft = `${buttonBaseClasses} ${btnBgLeft.class} ${btnTextLeft.class}`;
            const btnStyleLeft = `${btnBgLeft.style} ${btnTextLeft.style}`.trim();
            return `<div class="${getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color').class}" style="${getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color').style}"><div class="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8 p-8 md:p-12"><div class="text-center md:text-left"><h1 class="text-3xl md:text-4xl font-bold mb-4 ${titleClass.class}" style="${titleClass.style}">${data.title}</h1><p class="text-lg mb-8 ${subtitleClass.class}" style="${subtitleClass.style}">${data.subtitle}</p><a href="${data.buttonLink || '#'}" class="${btnClassesLeft}" style="${btnStyleLeft}">${data.buttonText}</a></div><div><img src="${data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${data.title}" class="rounded-lg shadow-lg mx-auto" /></div></div></div>`;
          case 'darkMinimal':
            const btnBgDark = getClassOrStyle(data.buttonBgColor, 'bg-white', 'background-color');
            const btnTextDark = getClassOrStyle(data.buttonTextColor, 'text-slate-800', 'color');
            const btnClassesDark = `${buttonBaseClasses} ${btnBgDark.class} ${btnTextDark.class}`;
            const btnStyleDark = `${btnBgDark.style} ${btnTextDark.style}`.trim();
            return `<div class="${getClassOrStyle(data.backgroundColor, 'bg-slate-900', 'background-color').class} p-12 md:p-24 text-center" style="${getClassOrStyle(data.backgroundColor, 'bg-slate-900', 'background-color').style}"><h1 class="text-4xl md:text-5xl font-bold mb-8 ${getClassOrStyle(data.titleColor, 'text-white', 'color').class}" style="${getClassOrStyle(data.titleColor, 'text-white', 'color').style}">${data.title}</h1><a href="${data.buttonLink || '#'}" class="${btnClassesDark}" style="${btnStyleDark}">${data.buttonText}</a></div>`;
          default:
            const btnBgDefault = getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color');
            const btnTextDefault = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
            const btnClassesDefault = `${buttonBaseClasses} ${btnBgDefault.class} ${btnTextDefault.class}`;
            const btnStyleDefault = `${btnBgDefault.style} ${btnTextDefault.style}`.trim();
            return `<div class="${getClassOrStyle(data.backgroundColor, 'bg-slate-100', 'background-color').class} p-12 md:p-20 text-center" style="${getClassOrStyle(data.backgroundColor, 'bg-slate-100', 'background-color').style}"><h1 class="text-3xl md:text-4xl font-bold mb-4 ${titleClass.class}" style="${titleClass.style}">${data.title}</h1><p class="text-lg max-w-2xl mx-auto mb-8 ${subtitleClass.class}" style="${subtitleClass.style}">${data.subtitle}</p><a href="${data.buttonLink || '#'}" class="${btnClassesDefault}" style="${btnStyleDefault}">${data.buttonText}</a></div>`;
        }
      }
      case 'catalog': {
        const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
        const titleC = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const subtitleC = getClassOrStyle(data.subtitleColor, 'text-slate-600', 'color');
        const headerHtml = `<div class="text-center mb-8 md:mb-12 lg:mb-16"><h2 class="text-2xl md:text-3xl lg:text-4xl font-bold ${titleC.class} mb-3 md:mb-4 lg:mb-6" style="${titleC.style}">${data.title}</h2><p class="text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${subtitleC.class}" style="${subtitleC.style}">${data.subtitle}</p></div>`;
        const products = data.products || [];
        
        switch(data.variant) {
            case 'minimalGrid': {
                const productNameC = getClassOrStyle(data.productNameColor, 'text-slate-800', 'color');
                const productPriceC = getClassOrStyle(data.productPriceColor, 'text-slate-600', 'color');
                return `<div class="${bg.class} py-12 md:py-16 lg:py-20 px-4" style="${bg.style}"><div class="max-w-7xl mx-auto">${headerHtml}<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">${products.map(product => `
                    <a href="#" class="group cursor-pointer">
                        <div class="relative overflow-hidden rounded-lg bg-slate-50 mb-4">
                            <img class="w-full aspect-square object-cover transition-all duration-500 group-hover:scale-110" src="${product.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'}" alt="${product.name}" loading="lazy"/>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-sm md:text-base lg:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors ${productNameC.class}" style="${productNameC.style}">${product.name}</h3>
                            <p class="text-xs md:text-sm lg:text-base font-medium ${productPriceC.class}" style="${productPriceC.style}">${product.price}</p>
                        </div>
                    </a>
                `).join('')}</div></div></div>`;
            }
            case 'carousel': {
                const productNameC = getClassOrStyle(data.productNameColor, 'text-slate-800', 'color');
                const productPriceC = getClassOrStyle(data.productPriceColor, 'text-slate-600', 'color');
                const scrollContainerId = `scroll-${block.id}`;
                const prevButtonId = `prev-${block.id}`;
                const nextButtonId = `next-${block.id}`;
                return `
                    <style>
                        #${scrollContainerId}::-webkit-scrollbar { display: none; }
                        #${scrollContainerId} { -ms-overflow-style: none; scrollbar-width: none; scroll-behavior: smooth; }
                    </style>
                    <div class="${bg.class} py-12 md:py-16 lg:py-20" style="${bg.style}">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                            <div class="flex justify-between items-end mb-8 md:mb-10 lg:mb-12">
                                <div class="text-left flex-1">
                                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold ${titleC.class} mb-2 md:mb-3 lg:mb-4" style="${titleC.style}">${data.title}</h2>
                                    <p class="text-base md:text-lg lg:text-xl max-w-3xl ${subtitleC.class}" style="${subtitleC.style}">${data.subtitle}</p>
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
                                        <h3 class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 group-hover:text-blue-600 transition-colors ${productNameC.class}" style="${productNameC.style}">${product.name}</h3>
                                        <p class="font-semibold text-sm md:text-base lg:text-lg ${productPriceC.class}" style="${productPriceC.style}">${product.price}</p>
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
            default: {
                const productNameC = getClassOrStyle(data.productNameColor, 'text-slate-900', 'color');
                const productPriceC = getClassOrStyle(data.productPriceColor, 'text-blue-600', 'color');
                const productDescC = getClassOrStyle(data.productDescriptionColor, 'text-slate-600', 'color');
                const cardC = getClassOrStyle(data.cardColor, 'bg-white border-slate-200', 'background-color');
                return `<div class="${bg.class} py-20 px-4" style="${bg.style}"><div class="max-w-7xl mx-auto">${headerHtml}<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 text-left">${products.map(product => `
                    <div class="group rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${cardC.class}" style="${cardC.style}">
                        <div class="relative overflow-hidden bg-slate-50">
                            <img class="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110" src="${product.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=Producto'}" alt="${product.name}" loading="lazy"/>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div class="p-4 md:p-6 flex flex-col flex-grow">
                            <h3 class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 mb-2 md:mb-3 ${productNameC.class}" style="${productNameC.style}">${product.name}</h3>
                            <p class="font-bold text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 ${productPriceC.class}" style="${productPriceC.style}">${product.price}</p>
                            <p class="flex-grow text-sm md:text-base line-clamp-3 mb-4 md:mb-6 ${productDescC.class}" style="${productDescC.style}">${product.description}</p>
                            ${(() => {
                              const pb = getClassOrStyle(data.buttonBgColor, 'bg-slate-800', 'background-color');
                              const pt = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
                              const cls = 'w-full text-center rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 mt-auto py-2 md:py-2.5 lg:py-3 text-sm md:text-base ' + (pb.class || '') + ' ' + (pt.class || '');
                              const style = (pb.style || '') + ' ' + (pt.style || '');
                              return '<button class="' + cls + '" style="' + (style || '') + '">' + (product.buttonText || '') + '</button>';
                            })()}
                        </div>
                    </div>
                `).join('')}</div></div></div>`;
            }
        }
      }
      case 'team': {
        const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
        const titleC = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const subtitleC = getClassOrStyle(data.subtitleColor, 'text-slate-600', 'color');
        const nameC = getClassOrStyle(data.nameColor, 'text-slate-900', 'color');
        const roleC = getClassOrStyle(data.roleColor, 'text-slate-500', 'color');
        
        const titleHtml = `<h2 class="text-3xl font-bold text-center ${titleC.class}" style="${titleC.style}">${data.title}</h2>`;
        const subtitleHtml = `<p class="text-lg text-center mt-2 mb-12 max-w-2xl mx-auto ${subtitleC.class}" style="${subtitleC.style}">${data.subtitle}</p>`;
        const members = data.members || [];
        
        switch(data.variant) {
            case 'list':
                return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-3xl mx-auto">${titleHtml}${subtitleHtml}<div class="space-y-8">${members.map(member => `<div class="flex items-center gap-6"><img class="w-20 h-20 rounded-full object-cover shadow-sm" src="${member.imageUrl || 'https://placehold.co/100x100/e2e8f0/64748b?text=Foto'}" alt="${member.name}" /><div><h3 class="font-semibold text-xl ${nameC.class}" style="${nameC.style}">${member.name}</h3><p class="${roleC.class}" style="${roleC.style}">${member.role}</p></div></div>`).join('')}</div></div></div>`;
            case 'grid':
            default:
                return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-6xl mx-auto text-center">${titleHtml}${subtitleHtml}<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${members.map(member => `<div><img class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md" src="${member.imageUrl || 'https://placehold.co/200x200/e2e8f0/64748b?text=Foto'}" alt="${member.name}" /><h3 class="font-semibold text-lg ${nameC.class}" style="${nameC.style}">${member.name}</h3><p class="${roleC.class} text-sm" style="${roleC.style}">${member.role}</p></div>`).join('')}</div></div></div>`;
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
        const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
        const titleC = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const questionC = getClassOrStyle(data.questionColor, 'text-slate-900', 'color');
        const answerC = getClassOrStyle(data.answerColor, 'text-slate-600', 'color');
        
        const titleHtml = `<h2 class="text-3xl font-bold text-center mb-12 ${titleC.class}" style="${titleC.style}">${data.title}</h2>`;
        const items = data.items || [];
        
        switch(data.variant) {
            case 'accordion':
                return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-3xl mx-auto">${titleHtml}<div class="divide-y divide-slate-200">${items.map((item) => `<details class="group py-4"><summary class="flex justify-between items-center font-medium cursor-pointer list-none"><span class="font-semibold text-lg ${questionC.class}" style="${questionC.style}">${item.question}</span><span class="transition group-open:rotate-180 text-slate-500"><svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span></summary><p class="mt-3 ${answerC.class}" style="${answerC.style}">${item.answer}</p></details>`).join('')}</div></div></div>`;
            case 'list':
            default:
                return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-3xl mx-auto">${titleHtml}<div class="space-y-8">${items.map(item => `<div><h3 class="font-semibold text-xl mb-2 ${questionC.class}" style="${questionC.style}">${item.question}</h3><p class="${answerC.class}" style="${answerC.style}">${item.answer}</p></div>`).join('')}</div></div></div>`;
        }
      }
      case 'text': {
        const formattedContent = (data.content || '').replace(/\n/g, '<br />');
        const bg = getClassOrStyle(data.backgroundColor, '', 'background-color');
        const textC = getClassOrStyle(data.textColor, 'text-slate-600', 'color');
        
        switch (data.variant) {
          case 'quote': 
            return `<div class="${bg.class}" style="${bg.style}"><div class="max-w-4xl mx-auto py-8 px-4"><blockquote class="border-l-4 border-slate-400 pl-4 italic"><p class="${textC.class}" style="${textC.style}">${formattedContent}</p></blockquote></div></div>`;
          case 'highlighted': {
            const bgH = getClassOrStyle(data.backgroundColor, 'bg-blue-50 border-blue-200', 'background-color');
            const textH = getClassOrStyle(data.textColor, 'text-blue-800', 'color');
            return `<div class="max-w-4xl mx-auto py-8 px-4"><div class="${bgH.class} border rounded-lg p-4" style="${bgH.style}"><p class="${textH.class}" style="${textH.style}">${formattedContent}</p></div></div>`;
          }
          default: {
            const textD = getClassOrStyle(data.textColor, 'text-slate-800', 'color');
            return `<div class="${bg.class}" style="${bg.style}"><div class="max-w-4xl mx-auto py-8 px-4 prose prose-slate"><p class="${textD.class}" style="${textD.style}">${formattedContent}</p></div></div>`;
          }
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
        // Use getClassOrStyle so Tailwind classes or arbitrary colors get a style fallback
        const titleClass = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const bg = getClassOrStyle(data.backgroundColor, 'bg-slate-50', 'background-color');
        const cardBg = getClassOrStyle(data.cardBackgroundColor, 'bg-white', 'background-color');
        const cardTitle = getClassOrStyle(data.cardTitleColor, 'text-slate-900', 'color');
        const cardDesc = getClassOrStyle(data.cardDescriptionColor, 'text-slate-600', 'color');

        const cardsTitleHtml = data.title ? `<h2 class="text-3xl font-bold text-center mb-12 ${titleClass.class}" style="${titleClass.style}">${data.title}</h2>` : '';

        switch (data.variant) {
          case 'list':
            return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-3xl mx-auto">${cardsTitleHtml}<div class="space-y-8">${(data.cards || []).map(card => `<div class="flex items-start gap-6">${card.icon ? `<div class="text-3xl mt-1">${card.icon}</div>` : ''}<div><h3 class="text-xl font-semibold mb-2 ${cardTitle.class}" style="${cardTitle.style}">${card.title}</h3>${card.description ? `<p class="${cardDesc.class}" style="${cardDesc.style}">${card.description}</p>` : ''}</div></div>`).join('')}</div></div></div>`;

          case 'imageTop':
            return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-5xl mx-auto">${cardsTitleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.cards || []).map(card => `<div class="${cardBg.class} rounded-lg shadow-sm ring-1 ring-slate-100 overflow-hidden" style="${cardBg.style}">${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.title}" class="w-full h-40 object-cover" />` : ''}<div class="p-6 text-center">${card.icon ? `<div class="text-4xl mb-3">${card.icon}</div>` : ''}<h3 class="text-xl font-semibold mb-2 ${cardTitle.class}" style="${cardTitle.style}">${card.title}</h3>${card.description ? `<p class="${cardDesc.class} text-sm" style="${cardDesc.style}">${card.description}</p>` : ''}</div></div>`).join('')}</div></div></div>`;

          default:
            return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-5xl mx-auto">${cardsTitleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.cards || []).map(card => `<div class="text-center p-6 rounded-lg shadow-sm ring-1 ring-slate-100 ${cardBg.class}" style="${cardBg.style}">${card.icon ? `<div class="text-4xl mb-4">${card.icon}</div>` : ''}<h3 class="text-xl font-semibold mb-2 ${cardTitle.class}" style="${cardTitle.style}">${card.title}</h3>${card.description ? `<p class="${cardDesc.class} text-sm" style="${cardDesc.style}">${card.description}</p>` : ''}</div>`).join('')}</div></div></div>`;
        }
      }
      case 'cta': {
        const _ctaBtnBg = getClassOrStyle(data.buttonBgColor, 'bg-blue-600', 'background-color');
        const _ctaBtnText = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
        const ctaButtonClasses = `inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${_ctaBtnBg.class} ${_ctaBtnText.class}`;
        const ctaButtonStyle = `${_ctaBtnBg.style} ${_ctaBtnText.style}`.trim();
        
        switch (data.variant) {
          case 'light': {
            const bg = getClassOrStyle(data.backgroundColor, 'bg-slate-100', 'background-color');
            const titleC = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
            const subtitleC = getClassOrStyle(data.subtitleColor, 'text-slate-600', 'color');
            return `<div class="${bg.class} p-12 text-center rounded-lg" style="${bg.style}"><h2 class="text-3xl font-bold mb-2 ${titleC.class}" style="${titleC.style}">${data.title}</h2><p class="text-lg mb-6 max-w-xl mx-auto ${subtitleC.class}" style="${subtitleC.style}">${data.subtitle}</p><a href="#" class="${ctaButtonClasses}" style="${ctaButtonStyle}">${data.buttonText}</a></div>`;
          }
          case 'split': {
            const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
            const titleC = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
            const subtitleC = getClassOrStyle(data.subtitleColor, 'text-slate-600', 'color');
            return `<div class="${bg.class} p-8" style="${bg.style}"><div class="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8"><div class="text-center md:text-left"><h2 class="text-3xl font-bold mb-2 ${titleC.class}" style="${titleC.style}">${data.title}</h2><p class="text-lg mb-6 ${subtitleC.class}" style="${subtitleC.style}">${data.subtitle}</p><a href="#" class="${ctaButtonClasses}" style="${ctaButtonStyle}">${data.buttonText}</a></div><div><img src="${data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}" alt="${data.title}" class="rounded-lg shadow-lg mx-auto" /></div></div></div>`;
          }
          default: {
            const bg = getClassOrStyle(data.backgroundColor, 'bg-slate-800', 'background-color');
            const titleC = getClassOrStyle(data.titleColor, 'text-white', 'color');
            const subtitleC = getClassOrStyle(data.subtitleColor, 'text-slate-300', 'color');
            const _darkBtnBg = getClassOrStyle(data.buttonBgColor, 'bg-white', 'background-color');
            const _darkBtnText = getClassOrStyle(data.buttonTextColor, 'text-slate-800', 'color');
            const darkButtonClasses = `inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${_darkBtnBg.class} ${_darkBtnText.class}`;
            const darkButtonStyle = `${_darkBtnBg.style} ${_darkBtnText.style}`.trim();
            return `<div class="${bg.class} p-12 text-center" style="${bg.style}"><h2 class="text-3xl font-bold mb-2 ${titleC.class}" style="${titleC.style}">${data.title}</h2><p class="text-lg opacity-90 mb-6 max-w-xl mx-auto ${subtitleC.class}" style="${subtitleC.style}">${data.subtitle}</p><a href="#" class="${darkButtonClasses}" style="${darkButtonStyle}">${data.buttonText}</a></div>`;
          }
        }
      }
      case 'pricing': {
        const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
        const titleC = getClassOrStyle(data.titleColor, 'text-slate-800', 'color');
        const titleHtml = `<h2 class="text-3xl font-bold text-center mb-2 ${titleC.class}" style="${titleC.style}">${data.title}</h2><p class="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">${data.subtitle}</p>`;
        
        switch (data.variant) {
          case 'list':
            return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-4xl mx-auto">${titleHtml}<div class="space-y-4">${(data.plans || []).map(plan => `<div class="p-4 border rounded-lg grid md:grid-cols-3 items-center gap-4 ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}"><div class="md:col-span-2"><h3 class="text-xl font-semibold mb-1">${plan.name}</h3><p class="text-sm text-slate-500">${plan.description}</p></div><div class="text-right"><p class="text-3xl font-bold">$${plan.price}<span class="text-sm font-normal text-slate-500">${plan.frequency}</span></p><a href="#" class="mt-2 inline-block w-full text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">${plan.buttonText}</a></div></div>`).join('')}</div></div></div>`;
          case 'simple':
            return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-4xl mx-auto">${titleHtml}<div class="grid md:grid-cols-2 gap-8">${(data.plans || []).map(plan => `<div class="p-6 border rounded-lg ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}"><h3 class="text-xl font-semibold mb-2">${plan.name}</h3><p class="text-4xl font-bold mb-4">$${plan.price}<span class="text-base font-normal text-slate-500">${plan.frequency}</span></p><p class="text-slate-500 text-sm mb-4">${plan.description}</p><a href="#" class="w-full block text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">${plan.buttonText}</a></div>`).join('')}</div></div></div>`;
          default: // columns
            return `<div class="${bg.class} py-12 px-4" style="${bg.style}"><div class="max-w-5xl mx-auto">${titleHtml}<div class="grid md:grid-cols-3 gap-8">${(data.plans || []).map(plan => `<div class="p-6 border rounded-lg text-left flex flex-col ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}"><h3 class="text-xl font-semibold mb-1">${plan.name}</h3><p class="text-slate-500 mb-4">${plan.description}</p><p class="text-4xl font-bold mb-1">$${plan.price}<span class="text-base font-normal text-slate-500">${plan.frequency}</span></p><ul class="text-sm text-slate-600 space-y-2 my-6 flex-grow">${(plan.features || []).map(feat => `<li class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><path d="M20 6 9 17l-5-5"/></svg><span>${feat}</span></li>`).join('')}</ul><a href="#" class="w-full text-center py-2 rounded-md font-semibold ${plan.highlighted ? `${data.highlightColor ? data.highlightColor.replace('border-', 'bg-') : 'bg-blue-600'} text-white` : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}">${plan.buttonText}</a></div>`).join('')}</div></div></div>`;
        }
      }
      case 'footer': {
        const bg = getClassOrStyle(data.backgroundColor, 'bg-slate-800', 'background-color');
        const textC = getClassOrStyle(data.textColor, 'text-slate-400', 'color');
        
        switch (data.variant) {
          case 'multiColumn':
            return `<footer class="${bg.class} ${textC.class} text-sm p-8" style="${bg.style} ${textC.style}"><div class="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">${(data.columns || []).map(col => `<div><h4 class="font-semibold text-white mb-3">${col.title}</h4><ul class="space-y-2">${(col.links || []).map(link => `<li><a href="#" class="hover:text-white">${link}</a></li>`).join('')}</ul></div>`).join('')}</div><div class="mt-8 border-t border-slate-700 pt-4 text-center"><p>${data.copyrightText || ''}</p></div></footer>`;
          case 'minimal': {
            const bgMin = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
            const textMin = getClassOrStyle(data.textColor, 'text-slate-500', 'color');
            return `<footer class="${bgMin.class} ${textMin.class} text-xs text-center p-4" style="${bgMin.style} ${textMin.style}"><p>${data.copyrightText || ''}</p></footer>`;
          }
          default:
            return `<footer class="${bg.class} ${textC.class} text-sm text-center p-8" style="${bg.style} ${textC.style}"><p class="mb-4">${data.copyrightText || ''}</p><div class="flex justify-center space-x-4">${(data.socialLinks || []).map(link => link.url ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-white">${link.platform}</a>` : '').join('')}</div></footer>`;
        }
      }
      case 'featuredProduct': {
        const rating = data.rating || 0;
        const starsHtml = [...Array(5)].map((_, i) => 
            `<svg class="w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`
        ).join('');
        switch(data.variant) {
            case 'background':
                const _fpBg = getClassOrStyle(data.buttonBgColor, 'bg-white', 'background-color');
                const _fpText = getClassOrStyle(data.buttonTextColor, 'text-slate-900', 'color');
                const _fpClasses = `inline-block text-center rounded-lg font-semibold transition-transform hover:scale-105 py-4 px-12 text-lg ${_fpBg.class} ${_fpText.class}`;
                const _fpStyle = `${_fpBg.style} ${_fpText.style}`.trim();
                return `<div class="relative text-white min-h-[500px] flex items-center"><img src="${data.imageUrl || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Producto'}" alt="${data.title}" class="absolute inset-0 w-full h-full object-cover" /><div class="absolute inset-0 bg-black/60"></div><div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-lg"><span class="text-sm font-bold uppercase tracking-widest text-blue-400">${data.tag}</span><h2 class="font-bold my-4 text-4xl md:text-5xl">${data.title}</h2><p class="mb-6 text-slate-200 text-lg leading-relaxed">${data.description}</p><div class="flex items-center gap-8 mb-8"><p class="font-bold text-3xl md:text-4xl">${data.price}</p><div class="flex items-center gap-1">${starsHtml}</div></div><a href="#" class="${_fpClasses}" style="${_fpStyle}">${data.buttonText}</a></div></div></div>`;
            case 'imageLeft':
            default: {
                const bg = getClassOrStyle(data.backgroundColor, 'bg-white', 'background-color');
                const textC = getClassOrStyle(data.textColor, 'text-slate-800', 'color');
                const textTag = getClassOrStyle(data.textColor, 'text-blue-600', 'color');
                const textDesc = getClassOrStyle(data.textColor, 'text-slate-600', 'color');
                const textPrice = getClassOrStyle(data.textColor, 'text-slate-900', 'color');
                const _fpBg2 = getClassOrStyle(data.buttonBgColor, 'bg-slate-900', 'background-color');
                const _fpText2 = getClassOrStyle(data.buttonTextColor, 'text-white', 'color');
                const _fpClasses2 = `w-full block text-center rounded-lg font-semibold transition-transform hover:scale-105 py-4 text-lg ${_fpBg2.class} ${_fpText2.class}`;
                const _fpStyle2 = `${_fpBg2.style} ${_fpText2.style}`.trim();
                return `<div class="${bg.class} py-20 px-4" style="${bg.style}"><div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12"><div class="rounded-lg overflow-hidden bg-slate-100"><img src="${data.imageUrl || 'https://placehold.co/600x600/e2e8f0/64748b?text=Producto'}" alt="${data.title}" class="w-full h-full object-cover aspect-square" /></div><div class="text-left"><span class="text-sm font-bold uppercase tracking-widest ${textTag.class}" style="${textTag.style}">${data.tag}</span><h2 class="font-bold my-4 text-4xl md:text-5xl ${textC.class}" style="${textC.style}">${data.title}</h2><p class="mb-6 text-lg leading-relaxed ${textDesc.class}" style="${textDesc.style}">${data.description}</p><div class="flex items-center justify-between mb-8"><p class="font-bold text-4xl ${textPrice.class}" style="${textPrice.style}">${data.price}</p><div class="flex items-center gap-1">${starsHtml}</div></div><a href="#" class="${_fpClasses2}" style="${_fpStyle2}">${data.buttonText}</a></div></div></div>`;
            }
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

exports.renderBlocksToHTML = async function renderBlocksToHTML(blocks, opts = {}) {
  const envBase = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '') || '';
  const defaultCss = envBase ? `${envBase}/_next/static/css/tailwind.css` : '/_next/static/css/tailwind.css';
  const cssUrl = opts.cssUrl || defaultCss;
  const manifestUrl = opts.manifestUrl || null; // No incluir manifest por defecto
  const faviconUrl = opts.faviconUrl || null; // No incluir favicon por defecto

  // Initialize React components if not already done
  if (!canUseReactServer) {
    await initReactComponents();
  }

  // minimalInitScript fallback (used to initialize after render)
  function minimalInitScript(){
    return `<script>if(window.blockBehaviors&&window.blockBehaviors.initAll){try{window.blockBehaviors.initAll();}catch(e){} }</script>`;
  }

  const loaderScript = `<script>/* block-behaviors loader */(function(){function load(){try{var s=document.createElement('script');s.src='${envBase}/block-behaviors.js'.replace('//block-behaviors.js','/block-behaviors.js');s.onload=function(){try{if(window.blockBehaviors && window.blockBehaviors.initAll){window.blockBehaviors.initAll();} }catch(e){} };document.head.appendChild(s);}catch(e){} } if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',load);}else load();})();</script>`;
  const initScript = loaderScript + minimalInitScript();

  if (canUseReactServer) {
    try {
      const BlocksApp = (props) => React.createElement(React.Fragment, null, props.blocks.map((block) => React.createElement(BlockRenderer, { block: block, key: block.id, isEditing: false })));
      const inner = ReactDOMServer.renderToStaticMarkup(React.createElement(BlocksApp, { blocks }));
      return buildHead(cssUrl, manifestUrl, faviconUrl) + inner + buildTail(initScript);
    } catch (e) {
      console.error('ReactDOMServer rendering failed, falling back to legacy renderer', e);
      const inner = legacyRender(blocks);
      return buildHead(cssUrl, manifestUrl, faviconUrl) + inner + buildTail(initScript);
    }
  }

  const inner = legacyRender(blocks);
  return buildHead(cssUrl, manifestUrl, faviconUrl) + inner + buildTail(initScript);
};

