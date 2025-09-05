// Archivo: app/components/editor/blocks/Hero/HeroPreviews.tsx (ACTUALIZADO)
import React from 'react';
import { HeroData } from '../HeroBlock';

// Variante 1: Centrado Clásico
export function HeroPreviewDefault({ data }: { data: HeroData }) {
  return (
    <div className="bg-slate-100 w-full p-4 flex flex-col items-center justify-center gap-2 border border-slate-200 rounded">
      <div className="bg-slate-700 h-3 w-3/5 rounded-sm" />
      <div className="bg-slate-400 h-2 w-4/5 rounded-full" />
      <div className="bg-slate-400 h-2 w-3/4 rounded-full" />
      <div className="bg-blue-600 h-4 w-16 rounded-md mt-2" />
    </div>
  );
}

// Variante 2: Izquierda con Imagen
export function HeroPreviewLeftImage({ data }: { data: HeroData }) {
    return (
        <div className="bg-white w-full p-3 grid grid-cols-2 items-center gap-3 border border-slate-200 rounded">
            <div className="flex flex-col gap-1.5">
                <div className="bg-slate-700 h-2 w-full rounded-sm" />
                <div className="bg-slate-400 h-1.5 w-full rounded-full" />
                <div className="bg-slate-400 h-1.5 w-3/4 rounded-full" />
                <div className="bg-blue-600 h-3 w-10 rounded-md mt-1" />
            </div>
            <div className="w-full bg-slate-200 rounded-sm aspect-square flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
        </div>
    );
}

// Variante 3: Mínimo Oscuro
export function HeroPreviewDarkMinimal({ data }: { data: HeroData }) {
    return (
        <div className="bg-slate-900 w-full p-4 flex flex-col items-center justify-center gap-3 border border-slate-700 rounded">
            <div className="bg-white h-3 w-4/5 rounded-sm" />
            <div className="bg-white h-4 w-16 rounded-md mt-1" />
        </div>
    );
}