// Archivo: app/components/editor/blocks/Cards/CardsPreviews.tsx (NUEVO)
import React from 'react';
import { CardsData } from '../CardsBlock';

const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

// Variante 1: Tres Columnas
export function CardsPreviewDefault({ data }: { data: CardsData }) {
  return (
    <div className="bg-slate-50 w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
      <div className="w-full grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-2 rounded border border-slate-200 flex flex-col items-center gap-1.5">
            <div className="bg-slate-300 h-3 w-3 rounded-full" />
            <div className="bg-slate-500 h-1.5 w-full rounded-full" />
            <div className="bg-slate-300 h-1 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Variante 2: Lista Vertical
export function CardsPreviewList({ data }: { data: CardsData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
            <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
            <div className="w-full space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="bg-slate-300 h-3 w-3 rounded-full mt-0.5" />
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                            <div className="bg-slate-300 h-1 w-4/5 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Variante 3: Imagen Superior
export function CardsPreviewImageTop({ data }: { data: CardsData }) {
    return (
        <div className="bg-slate-50 w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
            <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
            <div className="w-full grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded border border-slate-200 flex flex-col items-center overflow-hidden">
                        <div className="w-full bg-slate-200 aspect-video flex items-center justify-center"><ImageIcon/></div>
                        <div className="p-1.5 w-full flex flex-col items-center gap-1">
                          <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                          <div className="bg-slate-300 h-1 w-4/5 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}