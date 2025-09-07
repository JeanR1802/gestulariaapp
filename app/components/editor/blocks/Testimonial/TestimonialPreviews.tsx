import React from 'react';
// CORRECCIÓN: Se añadió la comilla de cierre que faltaba
import { TestimonialData } from '../TestimonialBlock';

// Variante 1: Cita Simple
export function TestimonialPreviewDefault({ data }: { data: TestimonialData }) {
  return (
    <div className="bg-slate-50 w-full p-4 flex flex-col items-center gap-2 border border-slate-200 rounded">
      <div className="bg-slate-300 h-1.5 w-full rounded-full" />
      <div className="bg-slate-300 h-1.5 w-3/4 rounded-full" />
      <div className="bg-slate-500 h-2 w-1/3 rounded-full mt-2" />
    </div>
  );
}

// Variante 2: Cita con Imagen
export function TestimonialPreviewWithImage({ data }: { data: TestimonialData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-2 border border-slate-200 rounded">
            <div className="bg-slate-300 h-8 w-8 rounded-full" />
            <div className="bg-slate-300 h-1.5 w-full rounded-full mt-1" />
            <div className="bg-slate-300 h-1.5 w-3/4 rounded-full" />
            <div className="bg-slate-500 h-2 w-1/3 rounded-full mt-1" />
        </div>
    );
}

// Variante 3: Cuadrícula (Grid)
export function TestimonialPreviewGrid({ data }: { data: TestimonialData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
             <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
             <div className="w-full grid grid-cols-2 gap-2">
                {[1, 2].map(i => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col gap-1">
                        <div className="bg-slate-300 h-1 w-full rounded-full" />
                        <div className="bg-slate-300 h-1 w-3/4 rounded-full" />
                        <div className="bg-slate-500 h-1.5 w-1/2 rounded-full mt-1" />
                    </div>
                ))}
           </div>
        </div>
    );
}

