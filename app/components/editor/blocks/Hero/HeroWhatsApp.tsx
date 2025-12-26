'use client';
import React from 'react';
import { MessageCircle } from 'lucide-react';

export interface HeroWhatsAppData {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    bgImage?: string;
    phone?: string;
}

export const HeroWhatsApp = ({ data }: { data: HeroWhatsAppData }) => {
    const {
        title = "¿Necesitas asesoría?",
        subtitle = "Hablemos de tu proyecto directamente. Respondemos en menos de 5 minutos.",
        ctaText = "Mandar WhatsApp",
        bgImage = "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000",
        phone = "5215512345678"
    } = data;

    const whatsappUrl = `https://wa.me/${phone}`;

    return (
        <section className="relative h-[550px] w-full flex items-center">
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="" className="w-full h-full object-cover grayscale opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl flex items-center">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-6">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Disponibles ahora
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">{title}</h1>
                    <p className="text-lg text-slate-600 mb-8">{subtitle}</p>
                    
                    <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-green-300/50 hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <MessageCircle className="w-8 h-8 fill-current" />
                        <div className="text-left leading-tight">
                            <span className="block text-[10px] opacity-80 uppercase tracking-wider">Chat Directo</span>
                            {ctaText}
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
};
