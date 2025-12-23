'use client';

import React from 'react';
import { Oswald } from 'next/font/google';

const oswald = Oswald({ subsets: ['latin'], weight: '700' });

export const AboutSection = () => {
  return (
    <section className="relative py-20 px-4 bg-[#050505] flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col items-center relative z-10">

        {/* Avatares con iniciales en lugar de imágenes */}
        <div className="relative w-full h-[320px] md:h-[400px] flex justify-center mb-6 md:mb-10 mt-10">
            
            {/* Avatar 1 */}
            <div className="absolute left-1/2 -translate-x-1/2 -ml-[140px] md:-ml-[220px] top-4 md:top-10 w-32 h-40 md:w-52 md:h-64 rounded-2xl border-4 border-white/10 shadow-2xl transform rotate-[-8deg] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center z-10">
                <span className="text-white text-6xl md:text-8xl font-black opacity-50">J</span>
            </div>

            {/* Avatar 2 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-40 h-48 md:w-64 md:h-80 rounded-2xl border-4 border-indigo-500/40 shadow-2xl z-20 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white text-7xl md:text-9xl font-black opacity-60">R</span>
            </div>

            {/* Avatar 3 */}
            <div className="absolute left-1/2 -translate-x-1/2 ml-[140px] md:ml-[220px] top-4 md:top-10 w-32 h-40 md:w-52 md:h-64 rounded-2xl border-4 border-white/10 shadow-2xl transform rotate-[8deg] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-10">
                <span className="text-white text-6xl md:text-8xl font-black opacity-50">M</span>
            </div>
        </div>

        {/* Texto */}
        <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6">
            <h2 className={`${oswald.className} text-5xl md:text-7xl font-black text-white tracking-tight leading-tight`}>
                Nosotros
            </h2>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Somos desarrolladores y emprendedores que vivieron <strong className="text-white">el dolor de vender por mensajitos</strong>. 
                Creamos Gestularia para que ningún negocio tenga que perder tiempo, clientes o dinero por no tener tecnología accesible.
            </p>
        </div>

      </div>
    </section>
  );
};
