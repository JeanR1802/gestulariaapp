import React from 'react';
import { cn } from '@/lib/utils';

// Base para todos los wireframes
const WireframeBase = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("w-full h-full bg-white flex flex-col overflow-hidden pointer-events-none select-none", className)}>
        {children}
    </div>
);

// --- HERO VARIANTS ---

export const HeroCenteredPreview = () => (
    <WireframeBase className="justify-center items-center bg-slate-50 gap-1 p-2">
        <div className="w-8 h-1 bg-slate-300 rounded-full mb-1"></div>
        <div className="w-16 h-1 bg-slate-200 rounded-full mb-2"></div>
        <div className="w-6 h-2 bg-blue-500 rounded-sm"></div>
    </WireframeBase>
);

export const HeroSplitPreview = () => (
    <WireframeBase className="flex-row">
        <div className="w-1/2 h-full bg-slate-200"></div>
        <div className="w-1/2 h-full bg-white flex flex-col justify-center p-2 gap-1">
            <div className="w-full h-1 bg-slate-300 rounded-full"></div>
            <div className="w-2/3 h-1 bg-slate-200 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-500 rounded-sm mt-1"></div>
        </div>
    </WireframeBase>
);

export const HeroOverlayPreview = () => (
    <WireframeBase className="justify-center items-center bg-slate-800 gap-1 p-2 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="w-10 h-1 bg-white/50 rounded-full mb-1 relative z-10"></div>
        <div className="w-20 h-1 bg-white/30 rounded-full mb-2 relative z-10"></div>
        <div className="w-6 h-2 bg-white rounded-sm relative z-10"></div>
    </WireframeBase>
);

// --- HEADER VARIANTS ---

export const HeaderSimplePreview = () => (
    <WireframeBase className="flex-row items-center justify-between px-2 border-b border-slate-100">
        <div className="w-4 h-4 rounded-full bg-slate-300"></div>
        <div className="flex gap-1">
            <div className="w-3 h-1 bg-slate-200 rounded-full"></div>
            <div className="w-3 h-1 bg-slate-200 rounded-full"></div>
        </div>
    </WireframeBase>
);

export const HeaderCenteredPreview = () => (
    <WireframeBase className="flex-col items-center justify-center border-b border-slate-100 gap-1 py-1">
        <div className="w-4 h-4 rounded-full bg-slate-300 mb-0.5"></div>
        <div className="flex gap-1">
            <div className="w-3 h-0.5 bg-slate-200 rounded-full"></div>
            <div className="w-3 h-0.5 bg-slate-200 rounded-full"></div>
            <div className="w-3 h-0.5 bg-slate-200 rounded-full"></div>
        </div>
    </WireframeBase>
);

// --- PRODUCT VARIANTS ---

export const ProductCardPreview = () => (
    <WireframeBase className="p-2 gap-1 border border-slate-100">
        <div className="w-full h-1/2 bg-slate-100 rounded-sm mb-1"></div>
        <div className="w-2/3 h-1 bg-slate-300 rounded-full"></div>
        <div className="w-1/3 h-1 bg-slate-200 rounded-full"></div>
        <div className="w-full h-2 bg-blue-500 rounded-sm mt-auto"></div>
    </WireframeBase>
);

export const ProductListPreview = () => (
    <WireframeBase className="p-2 gap-1">
        <div className="flex gap-1 items-center mb-1">
            <div className="w-6 h-6 bg-slate-200 rounded-sm"></div>
            <div className="flex-1 flex flex-col gap-0.5">
                <div className="w-full h-1 bg-slate-300 rounded-full"></div>
                <div className="w-1/2 h-1 bg-slate-200 rounded-full"></div>
            </div>
        </div>
        <div className="flex gap-1 items-center">
            <div className="w-6 h-6 bg-slate-200 rounded-sm"></div>
            <div className="flex-1 flex flex-col gap-0.5">
                <div className="w-full h-1 bg-slate-300 rounded-full"></div>
                <div className="w-1/2 h-1 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    </WireframeBase>
);

// --- HERO DE IMPACTO (DECISIÓN) ---

export const HeroImpactPreview = () => (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-3 relative overflow-hidden pointer-events-none select-none">
        {/* Fondo simulado */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-black opacity-50"></div>
        
        {/* Badge */}
        <div className="w-10 h-1 bg-white/20 backdrop-blur-sm rounded-full mb-1.5 relative z-10 border border-white/10"></div>
        
        {/* Título Grande */}
        <div className="w-20 h-1.5 bg-white rounded-full mb-1 relative z-10 shadow-sm"></div>
        <div className="w-14 h-1.5 bg-white rounded-full mb-2 relative z-10 shadow-sm"></div>
        
        {/* Subtítulo */}
        <div className="w-16 h-0.5 bg-slate-400 rounded-full mb-3 relative z-10"></div>
        
        {/* Botón CTA */}
        <div className="w-8 h-2 bg-white rounded-full relative z-10 shadow-lg"></div>
    </div>
);