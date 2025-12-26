'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

export interface HeroVideoData {
    title?: string;
    subtitle?: string;
    videoUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    overlayOpacity?: number;
}

export const HeroVideo = ({ data }: { data: HeroVideoData }) => {
    const {
        title = "Vive la experiencia",
        subtitle = "Conoce nuestros destinos turísticos.",
        videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
        ctaText = "Reservar Ahora",
        ctaLink = "#",
        overlayOpacity = 40
    } = data;

    return (
        <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center text-center">
            {/* Video Background */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
                <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black transition-opacity" style={{ opacity: overlayOpacity / 100 }} />
            
            {/* Contenido */}
            <div className="relative z-10 container px-4 animate-in fade-in zoom-in duration-1000">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6 border border-white/50 shadow-2xl">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">{title}</h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">{subtitle}</p>
                <a href={ctaLink} className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                    {ctaText}
                </a>
            </div>
        </section>
    );
};
