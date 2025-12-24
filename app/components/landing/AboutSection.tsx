'use client';

import React from 'react';
import Image from 'next/image';
import { Oswald } from 'next/font/google';

const oswald = Oswald({ subsets: ['latin'], weight: '700', display: 'swap' });

export const AboutSection = () => {
  return (
    <section className="relative py-20 px-4 bg-[#050505] flex flex-col items-center overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col items-center relative z-10">

        {/* Título "Nosotros" */}
        <h2 className={`${oswald.className} text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-8 md:mb-12`}>
          Nosotros
        </h2>

        {/* Logo blanco en grande */}
        <div className="relative w-48 h-48 md:w-80 md:h-80 mb-8 md:mb-12">
          <Image 
            src="/lgc.png" 
            alt="Gestularia Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Texto */}
        <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6 px-2">
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                Somos desarrolladores y emprendedores que vivieron <strong className="text-indigo-400">el dolor de vender por mensajitos</strong>. 
                Creamos Gestularia para que ningún negocio tenga que perder tiempo, clientes o dinero por no tener tecnología accesible.
            </p>
        </div>

      </div>
    </section>
  );
};