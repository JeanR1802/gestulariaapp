import React from 'react';
import { TeamData } from '../TeamBlock';

// Variante 1: Cuadrícula
export function TeamPreviewGrid({ data }: { data: TeamData }) {
  return (
    <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="bg-slate-300 h-6 w-6 rounded-full" />
            <div className="bg-slate-500 h-1.5 w-full rounded-full" />
            <div className="bg-slate-300 h-1 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Variante 2: Lista
export function TeamPreviewList({ data }: { data: TeamData }) {
    return (
        <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
            <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
            <div className="w-full space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="bg-slate-300 h-6 w-6 rounded-full flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                            <div className="bg-slate-300 h-1 w-3/4 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}