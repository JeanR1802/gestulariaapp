'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Star } from 'lucide-react';

export interface HeroSplitData {
    title?: string;
    subtitle?: string;
    price?: string;
    oldPrice?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    reverse?: boolean;
}

export const HeroSplit = ({ data }: { data: HeroSplitData }) => {
    const {
        title = "Hoodie Oversize",
        subtitle = "Algodón premium. Diseño exclusivo. Envío Full.",
        price = "$499",
        oldPrice = "$799",
        ctaText = "Comprar Ahora",
        ctaLink = "#",
        image = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
        reverse = false
    } = data;

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
            {/* Lado Imagen */}
            <div className={cn("relative h-[400px] md:h-full bg-slate-100 overflow-hidden", reverse ? "md:order-2" : "md:order-1")}>
                <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </div>
            
            {/* Lado Contenido */}
            <div className={cn("flex flex-col justify-center p-10 md:p-20 bg-white", reverse ? "md:order-1" : "md:order-2")}>
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    <Star className="w-4 h-4 fill-current" /> 
                    <Star className="w-4 h-4 fill-current" /> 
                    <Star className="w-4 h-4 fill-current" /> 
                    <Star className="w-4 h-4 fill-current" /> 
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs text-slate-400 ml-2">(120 reseñas)</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 leading-tight">{title}</h1>
                <p className="text-lg text-slate-600 mb-6">{subtitle}</p>
                
                <div className="flex items-end gap-3 mb-8">
                    <span className="text-3xl font-bold text-slate-900">{price}</span>
                    {oldPrice && (
                        <span className="text-xl text-slate-400 line-through mb-1 decoration-red-500">{oldPrice}</span>
                    )}
                </div>

                <div className="flex gap-4">
                    <a href={ctaLink} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        {ctaText} <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    🔒 Pago seguro con MercadoPago / Stripe
                </p>
            </div>
        </section>
    );
};
