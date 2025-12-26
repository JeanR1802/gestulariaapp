'use client';
import React from 'react';

export interface HeroCountdownData {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
}

export const HeroCountdown = ({ data }: { data: HeroCountdownData }) => {
    const { 
        title = "Venta Nocturna", 
        subtitle = "Hasta 50% de descuento en toda la tienda.", 
        ctaText = "Ir a la Oferta",
        ctaLink = "#"
    } = data;

    const TimeBox = ({ val, label }: { val: string, label: string }) => (
        <div className="flex flex-col items-center p-4 bg-slate-900/80 backdrop-blur rounded-xl border border-white/10 min-w-[80px]">
            <span className="text-3xl md:text-4xl font-black text-white">{val}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">{label}</span>
        </div>
    );

    return (
        <section className="relative py-20 bg-[#F00] text-white overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="relative z-10 container px-4">
                <span className="inline-block bg-yellow-400 text-black font-black text-xs px-4 py-1 rounded mb-6 transform -rotate-2">
                    ⚡ TIEMPO LIMITADO
                </span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase italic tracking-tighter">{title}</h1>
                <p className="text-xl mb-10 opacity-90 max-w-xl mx-auto">{subtitle}</p>
                
                <div className="flex justify-center gap-3 md:gap-6 mb-12">
                    <TimeBox val="04" label="Horas" />
                    <TimeBox val="12" label="Min" />
                    <TimeBox val="45" label="Seg" />
                </div>

                <a href={ctaLink} className="inline-block px-10 py-4 bg-white text-red-600 font-black text-lg rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                    {ctaText}
                </a>
            </div>
        </section>
    );
};
