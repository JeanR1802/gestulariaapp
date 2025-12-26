import React from 'react';
import { Play, MessageCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Contenedor base para consistencia visual
const PreviewContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("w-full h-full overflow-hidden relative select-none flex flex-col", className)}>
        {children}
    </div>
);

// 1. HERO IMPACTO (Oscuro, centrado, badge)
export const HeroPreviewImpact = () => (
    <PreviewContainer className="bg-slate-900 items-center justify-center p-4 gap-2">
        {/* Badge */}
        <div className="h-1.5 w-12 bg-indigo-500/30 border border-indigo-500 rounded-full mb-1"></div>
        {/* Título */}
        <div className="h-2 w-3/4 bg-white rounded-sm"></div>
        <div className="h-2 w-1/2 bg-white rounded-sm"></div>
        {/* Subtítulo */}
        <div className="h-1 w-2/3 bg-slate-500 rounded-sm mt-1"></div>
        {/* Botón */}
        <div className="h-5 w-20 bg-white rounded mt-2 shadow-lg"></div>
        
        {/* Adorno de fondo */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
    </PreviewContainer>
);

// 2. HERO SPLIT (Imagen lado a lado)
export const HeroPreviewSplit = () => (
    <PreviewContainer className="flex-row bg-white">
        {/* Texto Izquierda */}
        <div className="w-1/2 p-3 flex flex-col justify-center gap-1.5 border-r border-slate-100">
            <div className="h-1.5 w-10 bg-blue-100 rounded-full"></div>
            <div className="h-2 w-full bg-slate-800 rounded-sm"></div>
            <div className="h-2 w-2/3 bg-slate-800 rounded-sm"></div>
            <div className="h-4 w-16 bg-slate-900 rounded-md mt-1"></div>
        </div>
        {/* Imagen Derecha */}
        <div className="w-1/2 bg-slate-100 relative flex items-center justify-center">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <ShoppingBag className="w-4 h-4 text-slate-300" />
            </div>
        </div>
    </PreviewContainer>
);

// 3. HERO VIDEO (Inmersivo con botón play)
export const HeroPreviewVideo = () => (
    <PreviewContainer className="bg-slate-800 items-center justify-center relative">
        <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-slate-700 to-slate-900"></div>
        </div>
        <div className="z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            <div className="h-1.5 w-24 bg-white/80 rounded-full"></div>
        </div>
    </PreviewContainer>
);

// 4. HERO WHATSAPP (Enfoque en chat)
export const HeroPreviewWhatsApp = () => (
    <PreviewContainer className="bg-green-50 flex-row items-center relative overflow-hidden">
        <div className="w-2/3 pl-4 z-10 flex flex-col gap-1.5">
            <div className="h-2 w-3/4 bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-full bg-slate-400 rounded-sm"></div>
            <div className="flex items-center gap-1 mt-1 bg-white border border-green-200 px-2 py-1 rounded-full w-fit shadow-sm">
                <MessageCircle className="w-2 h-2 text-green-600" />
                <div className="h-1 w-8 bg-green-600 rounded-full"></div>
            </div>
        </div>
        {/* Decoración derecha */}
        <div className="absolute -right-4 top-0 h-full w-1/3 bg-green-100/50 -skew-x-12 transform"></div>
    </PreviewContainer>
);

// 5. HERO COUNTDOWN (Urgencia roja)
export const HeroPreviewCountdown = () => (
    <PreviewContainer className="bg-red-600 items-center justify-center text-white gap-2">
        <div className="flex items-center gap-1 opacity-80">
            <Clock className="w-2 h-2" />
            <div className="h-1 w-12 bg-white rounded-full"></div>
        </div>
        <div className="h-3 w-3/4 bg-white rounded-sm"></div>
        
        {/* Cajas de tiempo */}
        <div className="flex gap-1 mt-1">
            <div className="w-5 h-5 bg-black/20 rounded flex items-center justify-center"><div className="w-2 h-2 bg-white/50 rounded-sm"></div></div>
            <div className="w-5 h-5 bg-black/20 rounded flex items-center justify-center"><div className="w-2 h-2 bg-white/50 rounded-sm"></div></div>
            <div className="w-5 h-5 bg-black/20 rounded flex items-center justify-center"><div className="w-2 h-2 bg-white/50 rounded-sm"></div></div>
        </div>
    </PreviewContainer>
);

// 6. HERO SIMPLE (Minimalista / Default)
export const HeroPreviewDefault = () => (
    <PreviewContainer className="bg-white items-center justify-center border border-slate-100">
        <div className="h-2 w-1/2 bg-slate-900 rounded-sm mb-2"></div>
        <div className="h-1 w-2/3 bg-slate-400 rounded-sm mb-1"></div>
        <div className="h-1 w-1/2 bg-slate-400 rounded-sm mb-3"></div>
        <div className="flex gap-2">
            <div className="h-3 w-10 bg-slate-900 rounded-sm"></div>
            <div className="h-3 w-10 border border-slate-200 rounded-sm"></div>
        </div>
    </PreviewContainer>
);

// Legacy exports para compatibilidad si algo más los usa
export const HeroPreviewLeftImage = HeroPreviewSplit;
export const HeroPreviewDarkMinimal = HeroPreviewImpact;

export default {} as Record<string, unknown>;