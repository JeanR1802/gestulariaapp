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
    overlayOpacity?: number; // 0 a 90
    align?: 'left' | 'center' | 'right';
    height?: 'medium' | 'large' | 'full';
}

export const HeroDecision = ({ data }: { data: HeroDecisionData }) => {
    // Valores por defecto "Venta Rápida"
    const {
        badge = "NUEVA COLECCIÓN",
        title = "Define tu estilo hoy",
        subtitle = "Descubre la calidad premium que nos diferencia. Envíos gratis a todo el país en compras mayores a $999.",
        ctaText = "Ver Catálogo",
        bgImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80",
        overlayOpacity = 40,
        align = 'center',
        height = 'large'
    } = data;

    // Mapas de clases para "Decisiones Guiadas"
    const alignClasses = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right'
    };

    const heightClasses = {
        medium: 'h-[500px]',
        large: 'h-[700px]',
        full: 'h-screen'
    };

    return (
        <section className={cn("relative w-full flex flex-col justify-center overflow-hidden group", heightClasses[height] || 'h-[600px]')}>
            
            {/* 1. FONDO + OVERLAY */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={bgImage} 
                    alt="Background" 
                    className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
                />
                <div 
                    className="absolute inset-0 bg-black transition-opacity duration-500" 
                    style={{ opacity: (overlayOpacity || 40) / 100 }} 
                />
            </div>

            {/* 2. CONTENIDO DE VENTA */}
            <div className={cn("relative z-10 container mx-auto px-6 md:px-12 flex flex-col max-w-5xl", alignClasses[align] || 'items-center')}>
                
                {/* Badge (Prueba Social / Novedad) */}
                {badge && (
                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {badge}
                    </span>
                )}

                {/* Título (Promesa Principal) */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    {title}
                </h1>

                {/* Subtítulo (Justificación) */}
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {subtitle}
                </p>

                {/* CTA (Acción) */}
                <button className="group/btn relative overflow-hidden rounded-full bg-white text-slate-900 font-bold text-sm md:text-base px-10 py-4 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-700 delay-300">
                    <span className="relative z-10 flex items-center gap-2">
                        {ctaText} 
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                </button>

            </div>
        </section>
    );
};