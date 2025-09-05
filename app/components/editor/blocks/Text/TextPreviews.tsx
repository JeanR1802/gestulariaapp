// Archivo: app/components/editor/blocks/Text/TextPreviews.tsx (ACTUALIZADO)
import React from 'react';
import { TextData } from '../TextBlock';

// Variante 1: Párrafo Estándar
export function TextPreviewDefault({ data }: { data: TextData }) {
  return (
    <div className="bg-white w-full p-4 flex flex-col gap-1.5 border border-slate-200 rounded">
      <div className="bg-slate-300 h-1.5 w-full rounded-full" />
      <div className="bg-slate-300 h-1.5 w-full rounded-full" />
      <div className="bg-slate-300 h-1.5 w-3/4 rounded-full" />
    </div>
  );
}

// Variante 2: Cita Destacada
export function TextPreviewQuote({ data }: { data: TextData }) {
    return (
        <div className="bg-white w-full p-4 flex items-center gap-3 border border-slate-200 rounded">
            <div className="bg-slate-400 h-8 w-1 rounded-full" />
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="bg-slate-300 h-1.5 w-full rounded-full" />
                <div className="bg-slate-300 h-1.5 w-full rounded-full" />
                <div className="bg-slate-300 h-1.5 w-3/4 rounded-full" />
            </div>
        </div>
    );
}

// Variante 3: Texto Resaltado
export function TextPreviewHighlighted({ data }: { data: TextData }) {
    return (
        <div className="bg-blue-50 w-full p-4 flex flex-col gap-1.5 border border-blue-200 rounded">
            <div className="bg-blue-300 h-1.5 w-full rounded-full" />
            <div className="bg-blue-300 h-1.5 w-full rounded-full" />
            <div className="bg-blue-300 h-1.5 w-3/4 rounded-full" />
        </div>
    );
}