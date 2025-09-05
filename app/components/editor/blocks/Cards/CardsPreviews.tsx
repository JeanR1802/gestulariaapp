// Archivo: app/components/editor/blocks/Cards/CardsPreviews.tsx
import React from 'react';
import { CardsData } from '../CardsBlock';

export function CardsPreview({ data }: { data: CardsData }) {
  return (
    <div className="bg-slate-50 w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
      <div className="w-full grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-2 rounded border border-slate-200 flex flex-col items-center gap-1.5">
            <div className="bg-slate-300 h-3 w-3 rounded-full" />
            <div className="bg-slate-500 h-1.5 w-full rounded-full" />
            <div className="bg-slate-300 h-1 w-4/5 rounded-full" />
            <div className="bg-slate-300 h-1 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}