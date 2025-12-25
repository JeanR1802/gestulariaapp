'use client';

import React from 'react';
import { cn } from '@/lib/utils'; // Tu utilidad de clases
// Asumimos que recibirás las props de estilos globales pronto, 
// por ahora usaremos clases de Tailwind que se adaptan bien.

interface HeroData {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    bgImage?: string;
    overlayOpacity?: number; // 0 a 100
    align?: 'left' | 'center' | 'right';
}

export const HeroPremium = ({ data }: { data: HeroData }) => {
    const {
        title = "Tu Título Impactante Aquí",
        subtitle = "Describe tu propuesta de valor en una frase corta y persuasiva.",
        ctaText = "Ver Ofertas",
        bgImage = "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80", // Placeholder pro
        overlayOpacity = 50, // Oscuridad del fondo
        align = 'center'
    } = data;

    // Alineación dinámica
    const alignClass = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right'
    }[align];

    return (
        <section className="relative w-full h-[500px] md:h-[600px] flex flex-col justify-center overflow-hidden group">
            
            {/* 1. IMAGEN DE FONDO (Con efecto Zoom suave al hover) */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={bgImage} 
                    alt="Hero Background" 
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                {/* Overlay dinámico (Capa oscura para leer el texto) */}
                <div 
                    className="absolute inset-0 bg-black" 
                    style={{ opacity: overlayOpacity / 100 }} 
                />
            </div>

            {/* 2. CONTENIDO (Flotando encima) */}
            <div className={cn("relative z-10 container mx-auto px-6 md:px-12 flex flex-col", alignClass)}>
                
                {/* Badge opcional (Ej: "Nueva Colección") */}
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Novedad
                </span>

                {/* Título Gigante */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 max-w-4xl drop-shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    {title}
                </h1>

                {/* Subtítulo */}
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {subtitle}
                </p>

                {/* Botón de Acción (CTA) */}
                <button className="group/btn relative overflow-hidden rounded-full bg-white text-black font-bold text-sm md:text-base px-8 py-4 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-1000 delay-300">
                    <span className="relative z-10 flex items-center gap-2">
                        {ctaText} 
                        <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </button>

            </div>
        </section>
    );
};