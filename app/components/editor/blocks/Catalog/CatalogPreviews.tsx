import React from 'react';

// Base común
const CatalogPreviewBase = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full bg-white flex flex-col p-2 gap-2 pointer-events-none select-none">
        {children}
    </div>
);

// Variante 1: Grid Simple (Tarjetas)
export const CatalogPreviewGrid = () => (
    <CatalogPreviewBase>
        <div className="flex flex-col items-center gap-1 mb-1">
            <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
            <div className="w-8 h-0.5 bg-slate-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            {[1, 2].map(i => (
                <div key={i} className="flex flex-col gap-1">
                    <div className="w-full aspect-square bg-slate-100 rounded-sm relative">
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full"></div>
                    <div className="w-1/2 h-1 bg-slate-300 rounded-full"></div>
                </div>
            ))}
        </div>
    </CatalogPreviewBase>
);

// Variante 2: Carrusel / Destacado
export const CatalogPreviewFeatured = () => (
    <CatalogPreviewBase>
        <div className="flex gap-2 h-full items-center">
            <div className="w-1/2 h-4/5 bg-slate-100 rounded-sm relative">
                 <div className="absolute top-2 left-2 w-6 h-1 bg-slate-800 rounded-full"></div>
            </div>
            <div className="w-1/2 flex flex-col gap-2">
                <div className="w-full h-2 bg-slate-800 rounded-sm"></div>
                <div className="w-full h-1 bg-slate-200 rounded-full"></div>
                <div className="w-full h-1 bg-slate-200 rounded-full"></div>
                <div className="w-10 h-3 bg-blue-500 rounded-sm mt-1"></div>
            </div>
        </div>
    </CatalogPreviewBase>
);
