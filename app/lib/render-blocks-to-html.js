import { getTenantBySlug } from '@/lib/tenant';

export async function renderBlocksToHTML(blocks, options = {}) {
  const { cssUrl, blockBehaviorsUrl, faviconUrl } = options;

  const renderBlock = (block) => {
    // Extraemos la data asegurando valores por defecto para evitar errores
    const data = block.data || {};

    switch (block.type) {
      
      // =======================================================
      // 1. HERO DE IMPACTO (hero_decision)
      // =======================================================
      case 'hero_decision':
        return `
          <section class="relative w-full h-[600px] flex items-center justify-center text-center overflow-hidden bg-slate-900 text-white">
            ${data.bgImage ? `
              <div class="absolute inset-0 bg-black/50 z-0"></div>
              <img src="${data.bgImage}" alt="${data.title || 'Hero'}" class="absolute inset-0 w-full h-full object-cover -z-10 opacity-60">
            ` : `<div class="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 -z-10"></div>`}
            
            <div class="relative z-10 container mx-auto px-4 flex flex-col items-center animate-fade-in-up">
              ${data.badge ? `<span class="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-widest uppercase border border-white/20 bg-white/10 rounded-full backdrop-blur-sm">${data.badge}</span>` : ''}
              <h1 class="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">${data.title || 'Tu Título Aquí'}</h1>
              <p class="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">${data.subtitle || ''}</p>
              ${data.ctaText ? `
                <button onclick="document.querySelector('#products')?.scrollIntoView({behavior: 'smooth'})" class="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  ${data.ctaText}
                </button>` : ''}
            </div>
          </section>
        `;

      // =======================================================
      // 2. HERO DIVIDIDO (hero_split)
      // =======================================================
      case 'hero_split':
        const reverseClass = data.reverse ? 'md:flex-row-reverse' : 'md:flex-row';
        return `
          <section class="flex flex-col ${reverseClass} min-h-[600px] w-full bg-white overflow-hidden">
            <div class="relative w-full md:w-1/2 h-[400px] md:h-auto bg-slate-100">
              <img src="${data.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800'}" alt="${data.title}" class="w-full h-full object-cover">
            </div>
            
            <div class="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white">
              <div class="flex items-center gap-1 text-yellow-500 mb-4">
                ${'★'.repeat(5)} <span class="text-xs text-slate-400 ml-2 font-medium">(120 reseñas)</span>
              </div>
              <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 leading-none">${data.title || 'Producto Estrella'}</h1>
              <p class="text-lg text-slate-600 mb-8 leading-relaxed">${data.subtitle || 'Descripción corta del producto que resalte sus beneficios principales.'}</p>
              
              <div class="flex items-baseline gap-4 mb-8">
                <span class="text-4xl font-bold text-slate-900">${data.price || '$0.00'}</span>
                ${data.oldPrice ? `<span class="text-xl text-slate-400 line-through decoration-red-500">${data.oldPrice}</span>` : ''}
              </div>

              <button class="w-full md:w-auto py-4 px-8 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg">
                Comprar Ahora →
              </button>
              <p class="text-xs text-slate-400 mt-4 flex items-center gap-1">🔒 Pago 100% Seguro</p>
            </div>
          </section>
        `;

      // =======================================================
      // 3. HERO VIDEO (hero_video)
      // =======================================================
      case 'hero_video':
        return `
          <section class="relative h-[600px] w-full overflow-hidden flex items-center justify-center text-center bg-black">
            <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover z-0 opacity-60">
                <source src="${data.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4'}" type="video/mp4">
            </video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-0"></div>
            
            <div class="relative z-10 container px-4">
                <div class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <h1 class="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-xl">${data.title || 'Experiencia Visual'}</h1>
                <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">${data.subtitle || 'Descubre un nuevo mundo de posibilidades.'}</p>
                <button class="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                    Ver Video Completo
                </button>
            </div>
          </section>
        `;

      // =======================================================
      // 4. HERO WHATSAPP (hero_whatsapp)
      // =======================================================
      case 'hero_whatsapp':
        return `
          <section class="relative min-h-[550px] w-full flex items-center bg-slate-50 overflow-hidden">
            <div class="absolute right-0 top-0 w-1/2 h-full bg-green-50 skew-x-12 translate-x-20 hidden md:block"></div>
            
            <div class="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl flex flex-col md:flex-row items-center gap-12">
                <div class="w-full md:w-1/2 pt-12 md:pt-0">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold mb-6">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Disponibles Ahora
                    </div>
                    <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">${data.title || 'Hablemos de tu Proyecto'}</h1>
                    <p class="text-lg text-slate-600 mb-8 leading-relaxed">Contacta directamente con nuestro equipo. Respondemos en menos de 5 minutos.</p>
                    
                    <a href="https://wa.me/${(data.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="group inline-flex items-center gap-4 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-green-500/20 transition-all hover:-translate-y-1 w-full md:w-auto justify-center md:justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <div class="text-left leading-tight">
                            <span class="block text-[10px] opacity-80 uppercase tracking-wider mb-0.5">Escríbenos al</span>
                            Chat de WhatsApp
                        </div>
                    </a>
                </div>
            </div>
          </section>
        `;

      // =======================================================
      // 5. HERO COUNTDOWN (hero_countdown)
      // =======================================================
      case 'hero_countdown':
        return `
          <section class="relative py-24 bg-[#DC2626] text-white overflow-hidden flex flex-col items-center justify-center text-center" data-block-type="countdown" data-end-date="${data.endDate || ''}">
            <div class="absolute inset-0 opacity-10" style="background-image: url('https://www.transparenttextures.com/patterns/cubes.png');"></div>
            
            <div class="relative z-10 container px-4">
                <span class="inline-block bg-yellow-400 text-black font-black text-xs px-4 py-1.5 rounded-lg mb-8 transform -rotate-2 shadow-lg uppercase tracking-widest">
                    ⚡ Oferta Limitada
                </span>
                <h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-8 uppercase italic tracking-tighter drop-shadow-xl leading-none">${data.title || 'Venta Flash'}</h1>
                
                <div class="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
                    <div class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 min-w-[100px]">
                        <span class="text-4xl md:text-5xl font-black text-white" id="cd-hours-${block.id}">24</span>
                        <span class="text-[10px] uppercase tracking-wider text-white/60 mt-1">Horas</span>
                    </div>
                    <div class="text-4xl font-black self-center opacity-50">:</div>
                    <div class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 min-w-[100px]">
                        <span class="text-4xl md:text-5xl font-black text-white" id="cd-minutes-${block.id}">00</span>
                        <span class="text-[10px] uppercase tracking-wider text-white/60 mt-1">Min</span>
                    </div>
                    <div class="text-4xl font-black self-center opacity-50">:</div>
                    <div class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 min-w-[100px]">
                        <span class="text-4xl md:text-5xl font-black text-white" id="cd-seconds-${block.id}">00</span>
                        <span class="text-[10px] uppercase tracking-wider text-white/60 mt-1">Seg</span>
                    </div>
                </div>

                <button class="px-12 py-5 bg-white text-red-600 font-black text-xl rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1">
                    Ver Ofertas
                </button>
            </div>
          </section>
        `;

      // =======================================================
      // BLOQUES ESTÁNDAR (Legacy)
      // =======================================================
      case 'header':
        return `
          <header class="w-full py-4 px-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
            <div class="font-bold text-xl tracking-tight text-slate-900">Logo</div>
            <nav class="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                <a href="#" class="hover:text-blue-600">Inicio</a>
                <a href="#" class="hover:text-blue-600">Productos</a>
                <a href="#" class="hover:text-blue-600">Contacto</a>
            </nav>
            <button class="md:hidden text-slate-900"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          </header>
        `;

      case 'footer':
        return `
          <footer class="bg-slate-900 text-slate-400 py-12 px-6 mt-auto">
            <div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div><h4 class="text-white font-bold mb-4">Empresa</h4><p class="text-sm">Creando experiencias digitales únicas.</p></div>
                <div><h4 class="text-white font-bold mb-4">Enlaces</h4><ul class="text-sm space-y-2"><li><a href="#">Inicio</a></li><li><a href="#">Tienda</a></li></ul></div>
            </div>
            <div class="border-t border-slate-800 pt-8 text-center text-xs">© 2024 Todos los derechos reservados.</div>
          </footer>
        `;

      case 'catalog':
        return `
          <section class="py-16 px-4 bg-slate-50">
            <div class="container mx-auto">
              <h2 class="text-3xl font-bold text-center text-slate-900 mb-12">${data.title || 'Catálogo'}</h2>
              <div class="grid grid-cols-2 md:grid-cols-${data.columns || 4} gap-6">
                 ${Array(4).fill(0).map((_, i) => `
                    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div class="aspect-[4/5] bg-slate-200 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        </div>
                        <div class="p-4">
                            <h3 class="font-bold text-slate-900 mb-1">Producto ${i+1}</h3>
                            <p class="text-sm text-slate-500">$99.00</p>
                        </div>
                    </div>
                 `).join('')}
              </div>
            </div>
          </section>
        `;

      // Fallback para bloques no reconocidos
      default:
        console.warn(`Block type "${block.type}" not handled in HTML renderer.`);
        return `<div class="p-4 text-center text-gray-400 border border-dashed border-gray-300 rounded m-4">Bloque ${block.type}</div>`;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="es" class="scroll-smooth">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sitio Generado</title>
        <meta name="description" content="Sitio creado con Gestularia">
        
        <link rel="icon" type="image/png" href="${faviconUrl || '/favicon.ico'}">
        
        <script src="https://cdn.tailwindcss.com"></script>
        
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
          @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        </style>
      </head>
      <body class="bg-white min-h-screen flex flex-col">
        ${blocks.map(renderBlock).join('')}
        
        <script src="${blockBehaviorsUrl || '/block-behaviors.js'}"></script>
      </body>
    </html>
  `;
}