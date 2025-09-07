import React from 'react';
import { FaqData } from '../FaqBlock';

// Variante 1: Lista Simple
export function FaqPreviewList({ data }: { data: FaqData }) {
  return (
    <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
      <div className="w-full space-y-2">
        {[1, 2].map(i => (
          <div key={i} className="flex flex-col gap-1">
            <div className="bg-slate-500 h-1.5 w-full rounded-full" />
            <div className="bg-slate-300 h-1 w-3/4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Variante 2: Acordeón
export function FaqPreviewAccordion({ data }: { data: FaqData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
            <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
            <div className="w-full space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between w-full bg-slate-100 p-1 rounded">
                       <div className="bg-slate-500 h-1.5 w-3/4 rounded-full" />
                       <div className="bg-slate-400 h-2 w-2 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}