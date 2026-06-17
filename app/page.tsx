// app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Fondo estructural sutil (Efecto malla/cuadrícula tecnológica) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
      
      {/* Barra de Navegación Simplificada */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Locablo<span className="text-indigo-500">.com</span>
          </span>
        </div>
        
        {/* Acceso directo superior */}
        <Link 
          href="/login" 
          className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all duration-200 shadow-sm"
        >
          Entrar
        </Link>
      </header>

      {/* Contenedor Hero Principal */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Etiqueta de Contexto Local */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400 mb-8">
          <span>🇲🇽 Optimizado para el comercio y consumo en México</span>
        </div>

        {/* Título de Alto Impacto */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-[1.15]">
          Construye sitios web que{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            conectan y venden
          </span>{' '}
          en tu localidad
        </h1>

        {/* Subtítulo Descriptivo del MVP */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          La plataforma SaaS modular basada en bloques para estructurar tiendas y páginas de negocios. Diseñada específicamente con las mejores tácticas de conversión reconocibles por el público local.
        </p>

        {/* Botón de Entrada Directa y Rápida */}
        <div className="w-full flex justify-center">
          <Link
            href="/login"
            className="group relative px-8 py-4 rounded-xl bg-indigo-600 font-semibold text-white text-base shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
          >
            Acceder a la plataforma
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>

        {/* Tres Pilares Estructurales Básicos (Visuales pero sin ruido) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-20 text-left border-t border-slate-900 pt-12">
          
          <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm">
            <div className="text-indigo-400 font-bold text-sm mb-2">01. Bloques Locales</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Módulos visuales adaptados al comportamiento real del consumidor: confianza visual, ofertas claras y fricción cero.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm">
            <div className="text-indigo-400 font-bold text-sm mb-2">02. Cierre Conversacional</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Estructuras optimizadas para conectar con herramientas nativas de mensajería y cerrar las ventas de forma humana.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm">
            <div className="text-indigo-400 font-bold text-sm mb-2">03. Despliegue Multi-tenant</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Aislamiento de rutas dinámicas eficiente para que cada negocio cuente con su espacio e identidad de inmediato.
            </p>
          </div>

        </div>
      </main>

      {/* Pie de página con el dominio actualizado */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 uppercase tracking-widest mt-auto">
        © {new Date().getFullYear()} Locablo. Todos los derechos reservados.
      </footer>

    </div>
  );
}