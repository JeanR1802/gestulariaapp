// Archivo: app/components/editor/blocks/Pricing/PricingPreviews.tsx (NUEVO)
import React from 'react';
import { PricingData } from '../PricingBlock';

// Variante 1: Columnas
export function PricingPreviewColumns({ data }: { data: PricingData }) {
  return (
    <div className="bg-slate-50 w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
      <div className="w-full grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className={`p-2 rounded border ${i === 2 ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}>
            <div className={`h-1.5 w-1/2 rounded-full ${i === 2 ? 'bg-white' : 'bg-slate-500'}`} />
            <div className="flex items-baseline gap-0.5 mt-1">
              <div className={`h-2 w-2 rounded-full ${i === 2 ? 'bg-white' : 'bg-slate-700'}`} />
              <div className={`h-1 w-4 rounded-full ${i === 2 ? 'bg-blue-300' : 'bg-slate-300'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Variante 2: Lista Detallada
export function PricingPreviewList({ data }: { data: PricingData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
            <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
            <div className="w-full space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-2 border-b border-slate-200 pb-1">
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="bg-slate-500 h-1.5 w-1/2 rounded-full" />
                            <div className="bg-slate-300 h-1 w-full rounded-full" />
                        </div>
                        <div className="bg-blue-600 h-3 w-8 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Variante 3: Simple
export function PricingPreviewSimple({ data }: { data: PricingData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
           <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
           <div className="w-full grid grid-cols-2 gap-2">
                {[1, 2].map(i => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col gap-1">
                        <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                        <div className="bg-slate-300 h-1 w-1/2 rounded-full" />
                        <div className="bg-slate-300 h-1 w-3/4 rounded-full" />
                    </div>
                ))}
           </div>
        </div>
    );
}