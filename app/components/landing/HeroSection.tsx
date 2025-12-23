'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export const HeroSection = () => {
  const scrollToDemo = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative h-[100dvh] flex flex-col justify-center items-center overflow-hidden bg-transparent text-white px-4">
      
      <div className="container mx-auto relative z-10 flex flex-col items-center text-center -mt-12 sm:mt-0">
        
        {/* 1. TÍTULO */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1] sm:leading-[0.95] drop-shadow-2xl">
          Dale a tu{' '}
          <span className="relative inline-block">
             <span className="relative z-10">negocio</span>
             {/* Subrayado índigo/violeta para resaltar sobre el fondo oscuro */}
             <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-500/80 -z-0 transform -rotate-2 rounded-sm opacity-80"></span>
          </span>
          <br/>
          <span className="text-white">
            el lugar que merece.
          </span>
        </h1>

        {/* 2. DESCRIPCIÓN */}
        <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl font-normal leading-relaxed">
          Deja los mensajitos. En 15 minutos, tu tienda cobra sola, vende sola y genera confianza las 24 horas.
        </p>

        {/* 3. WIDGET CÁPSULA OPTIMIZADO */}
        <div className="mb-10 w-full flex justify-center">
            <div className="w-full max-w-[380px] h-[46px] bg-white/[0.03] border border-white/15 rounded-full shadow-2xl overflow-hidden relative backdrop-blur-sm">
                
                <style jsx>{`
                    @keyframes infiniteScroll {
                        0%, 15% { transform: translateY(0px); }          
                        20%, 35% { transform: translateY(-46px); }       
                        40%, 55% { transform: translateY(-92px); }       
                        60%, 75% { transform: translateY(-138px); }      
                        80%, 95% { transform: translateY(-184px); }      
                        100% { transform: translateY(-184px); }          
                    }
                    .capsule-slider {
                        animation: infiniteScroll 10s ease-in-out infinite;
                        will-change: transform;
                    }
                    .highlight-tech { background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; margin-left: 5px; }
                `}</style>

                <div className="capsule-slider flex flex-col">
                    <div className="h-[46px] flex items-center justify-center px-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                        TU TIENDA LISTA EN <span className="highlight-tech">15 MINUTOS</span>
                    </div>
                    <div className="h-[46px] flex items-center justify-center px-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                        SIN MENSAJITOS, TODO <span className="highlight-tech">AUTOMATIZADO</span>
                    </div>
                    <div className="h-[46px] flex items-center justify-center px-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                        COBRA 24/7 CON <span className="highlight-tech">BOTÓN DE PAGO</span>
                    </div>
                    <div className="h-[46px] flex items-center justify-center px-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                        CATALOGOS QUE <span className="highlight-tech">REALMENTE VENDEN</span>
                    </div>
                    <div className="h-[46px] flex items-center justify-center px-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                        TECNOLOGÍA <span className="highlight-tech">SIN CÓDIGO</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. BOTONES CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
              onClick={scrollToDemo}
              className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300"
          >
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center p-1.5 transition-transform group-hover:translate-y-1">
                  <ArrowDown className="w-full h-full" strokeWidth={2.5} />
              </div>
              Ver cómo funciona
          </button>
          
          <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all duration-300"
          >
              Prueba gratis
          </Link>
        </div>

      </div>
    </section>
  );
};
