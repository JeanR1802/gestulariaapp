'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export const HeroSection = () => {
  
  const scrollToDemo = () => {
    // Buscamos el contenedor y lo scrolleamos
    const container = document.getElementById('main-scroll-container');
    if (container) {
        container.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[100dvh] flex flex-col justify-center items-center overflow-hidden bg-transparent text-white px-4 pt-20 md:pt-0">
      {/* Premium background (CSS-only, optimized): layered radial gradients + dark base.
          - No heavy blur or JS animations to keep performance.
          - pointer-events-none so it never intercepts input. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          /* Nuevo fondo: dos blobs suaves (indigo + teal) + base oscuro
             Más sutil y balanceado que el anterior; sin filtros ni animaciones. */
          backgroundImage:
            'radial-gradient(600px 420px at 12% 18%, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.03) 35%, transparent 60%), radial-gradient(520px 360px at 88% 78%, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.02) 30%, transparent 62%), linear-gradient(180deg, rgba(6,7,11,0.94), rgba(12,14,18,0.96))',
          backgroundBlendMode: 'screen, screen, normal',
          willChange: 'transform'
        }}
      />
      
      <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.05] drop-shadow-2xl max-w-5xl">
          Dale a tu{' '}
          <span className="relative inline-block">
             <span className="relative z-10">negocio</span>
             <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-indigo-500/80 -z-0 transform -rotate-2 rounded-sm opacity-80"></span>
          </span>
          <br/>
          <span className="text-white">
            el lugar que merece.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl font-normal leading-relaxed px-4">
          Deja los mensajitos. En 15 minutos, tu tienda cobra sola, vende sola y genera confianza las 24 horas.
        </p>

        <div className="mb-8 sm:mb-10 w-full flex justify-center px-4">
            <div className="w-full max-w-[380px] h-[42px] sm:h-[46px] bg-[#0f172a]/90 border border-white/10 rounded-full shadow-2xl overflow-hidden relative">
                <style jsx>{`
                  @keyframes infiniteScroll {
                    0%, 15% { transform: translateY(0px); }
                    20%, 35% { transform: translateY(-42px); }
                    40%, 55% { transform: translateY(-84px); }
                    60%, 75% { transform: translateY(-126px); }
                    80%, 95% { transform: translateY(-168px); }
                    100% { transform: translateY(-168px); }
                  }
                  @media (min-width: 640px) {
                    @keyframes infiniteScroll {
                      0%, 15% { transform: translateY(0px); }
                      20%, 35% { transform: translateY(-46px); }
                      40%, 55% { transform: translateY(-92px); }
                      60%, 75% { transform: translateY(-138px); }
                      80%, 95% { transform: translateY(-184px); }
                      100% { transform: translateY(-184px); }
                    }
                  }
                  .capsule-slider {
                    animation: infiniteScroll 10s ease-in-out infinite;
                    will-change: transform;
                    transform: translateZ(0);
                  }
                  /* Highlights por frase - colores sólidos (reemplazamos degradados) */
                  .highlight-tech-1 { color: #0ea5e9; font-weight: 900; margin-left: 5px; } /* sky-500 */
                  .highlight-tech-2 { color: #34d399; font-weight: 900; margin-left: 5px; } /* green-400 */
                  .highlight-tech-3 { color: #f59e0b; font-weight: 900; margin-left: 5px; } /* amber-500 */
                  .highlight-tech-4 { color: #8b5cf6; font-weight: 900; margin-left: 5px; } /* indigo-500 */
                  .highlight-tech-5 { color: #fb7185; font-weight: 900; margin-left: 5px; } /* rose-400 */
                `}</style>

                <div className="capsule-slider flex flex-col">
                    <div className="h-[42px] sm:h-[46px] flex items-center justify-center px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                      TU TIENDA LISTA EN <span className="highlight-tech-1">15 MINUTOS</span>
                    </div>
                    <div className="h-[42px] sm:h-[46px] flex items-center justify-center px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                      SIN MENSAJITOS, TODO <span className="highlight-tech-2">AUTOMATIZADO</span>
                    </div>
                    <div className="h-[42px] sm:h-[46px] flex items-center justify-center px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                      COBRA 24/7 CON <span className="highlight-tech-3">BOTÓN DE PAGO</span>
                    </div>
                    <div className="h-[42px] sm:h-[46px] flex items-center justify-center px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                      CATALOGOS QUE <span className="highlight-tech-4">REALMENTE VENDEN</span>
                    </div>
                    <div className="h-[42px] sm:h-[46px] flex items-center justify-center px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                      TECNOLOGÍA <span className="highlight-tech-5">SIN CÓDIGO</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
          <button
              onClick={scrollToDemo}
              className="group flex items-center justify-center gap-3 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300 w-full sm:w-auto"
          >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black text-white rounded-full flex items-center justify-center p-1.5 transition-transform group-hover:translate-y-1">
                  <ArrowDown className="w-full h-full" strokeWidth={2.5} />
              </div>
              Ver cómo funciona
          </button>
          
          <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all duration-300 w-full sm:w-auto text-center"
          >
              Prueba gratis
          </Link>
        </div>

      </div>
    </section>
  );
};