'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export interface HeroDecisionData {
    badge?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    bgImage?: string;
    overlayOpacity?: number;
    align?: 'left' | 'center' | 'right';
    height?: 'medium' | 'large' | 'full';
}

export const HeroDecision = ({ data }: { data: HeroDecisionData }) => {
    // VALORES POR DEFECTO "ANTI-VACÍO"
    const {
        badge = "NUEVA TEMPORADA",
        title = "Impacta a tus clientes",
        subtitle = "Este es el espacio principal para tu propuesta de valor única. Convence en 3 segundos.",
        ctaText = "Ver Ofertas",
        bgImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
        overlayOpacity = 50,
        align = 'center',
        height = 'large'
    } = data || {}; // Protección contra undefined

    const alignClasses = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right'
    };

    const heightClasses = {
        medium: 'min-h-[500px]',
        large: 'min-h-[700px]',
        full: 'min-h-screen'
    };

    return (
        <section className={cn("relative w-full flex flex-col justify-center overflow-hidden group", heightClasses[height] || heightClasses.large)}>
            
            {/* FONDO + OVERLAY */}
            <div className="absolute inset-0 z-0">
                {bgImage ? (
                    <img 
                        src={bgImage} 
                        alt="Hero Background" 
                        className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800" />
                )}
                <div 
                    className="absolute inset-0 bg-black transition-opacity duration-500" 
                    style={{ opacity: (overlayOpacity || 50) / 100 }} 
                />
            </div>

            {/* CONTENIDO */}
            <div className={cn("relative z-10 container mx-auto px-6 md:px-12 flex flex-col max-w-5xl", alignClasses[align] || alignClasses.center)}>
                
                {badge && (
                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6">
                        {badge}
                    </span>
                )}

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-xl">
                    {title}
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-md">
                    {subtitle}
                </p>

                <button className="group/btn relative overflow-hidden rounded-full bg-white text-slate-900 font-bold text-sm md:text-base px-10 py-4 shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <span className="relative z-10 flex items-center gap-2">
                        {ctaText} 
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                </button>

            </div>
        </section>
    );
};