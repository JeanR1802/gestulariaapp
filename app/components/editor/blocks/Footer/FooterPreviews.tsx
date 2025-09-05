// Archivo: app/components/editor/blocks/Footer/FooterPreviews.tsx (NUEVO)
import React from 'react';
import { FooterData } from '../FooterBlock';

// Variante 1: Simple
export function FooterPreviewSimple({ data }: { data: FooterData }) {
  return (
    <div className="bg-slate-800 w-full p-3 flex flex-col items-center gap-2 border border-slate-700 rounded">
      <div className="bg-slate-400 h-1.5 w-1/2 rounded-full" />
      <div className="flex items-center space-x-2">
        <div className="bg-slate-500 h-1 w-8 rounded-full" />
        <div className="bg-slate-500 h-1 w-8 rounded-full" />
      </div>
    </div>
  );
}

// Variante 2: Multicolumna
export function FooterPreviewMultiColumn({ data }: { data: FooterData }) {
    return (
        <div className="bg-slate-800 w-full p-3 flex flex-col items-center gap-3 border border-slate-700 rounded">
            <div className="w-full grid grid-cols-2 gap-3">
                {[1, 2].map(i => (
                    <div key={i} className="flex flex-col gap-1.5">
                        <div className="bg-white h-1.5 w-full rounded-full" />
                        <div className="bg-slate-500 h-1 w-4/5 rounded-full" />
                        <div className="bg-slate-500 h-1 w-4/5 rounded-full" />
                    </div>
                ))}
            </div>
             <div className="bg-slate-400 h-1 w-full rounded-full mt-2" />
        </div>
    );
}

// Variante 3: Mínimo
export function FooterPreviewMinimal({ data }: { data: FooterData }) {
    return (
        <div className="bg-white w-full p-3 flex flex-col items-center justify-center border border-slate-200 rounded">
             <div className="bg-slate-400 h-1.5 w-full rounded-full" />
        </div>
    );
}