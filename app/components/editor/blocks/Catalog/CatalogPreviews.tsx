import React from 'react';
import { CatalogData } from '../CatalogBlock';

const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

export function CatalogPreviewGrid({ data }: { data: CatalogData }) {
  return (
    <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
      <div className="grid grid-cols-2 gap-2 w-full mt-2">
        {[1, 2].map(i => (
          <div key={i} className="border rounded-md overflow-hidden">
            <div className="w-full bg-slate-200 aspect-video flex items-center justify-center"><ImageIcon/></div>
            <div className="p-1.5 w-full flex flex-col items-start gap-1">
                <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                <div className="bg-slate-400 h-1 w-1/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CatalogPreviewMinimalGrid({ data }: { data: CatalogData }) {
    return (
      <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
        <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          {[1, 2].map(i => (
            <div key={i} className="flex flex-col gap-1">
                <div className="w-full bg-slate-200 aspect-square rounded-md flex items-center justify-center"><ImageIcon/></div>
                <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                <div className="bg-slate-400 h-1 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
}

// --- NUEVA VISTA PREVIA DEL CARRUSEL ---
export function CatalogPreviewCarousel({ data }: { data: CatalogData }) {
    return (
      <div className="bg-white w-full p-4 flex flex-col items-center gap-3 border border-slate-200 rounded">
        <div className="bg-slate-700 h-2 w-1/2 rounded-sm" />
        <div className="flex w-full items-center justify-start gap-2 mt-2 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col gap-1 flex-shrink-0 w-1/3">
                <div className="w-full bg-slate-200 aspect-square rounded-md flex items-center justify-center"><ImageIcon/></div>
                <div className="bg-slate-500 h-1.5 w-full rounded-full" />
                <div className="bg-slate-400 h-1 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
}