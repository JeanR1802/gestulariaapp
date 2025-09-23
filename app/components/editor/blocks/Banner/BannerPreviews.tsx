import React from 'react';
import { BannerData } from '../BannerBlock';

// BannerPreviewDefault: preview visual simple, sin lógica ni helpers, solo estructura y colores neutros
export function BannerPreviewDefault({ data }: { data: BannerData }) {
  return (
    <section className="w-full h-12 md:h-16 flex items-center justify-center relative overflow-hidden p-0 md:p-0 transition-all bg-slate-100 border border-slate-200 rounded">
      {/* Barra de acciones simulada arriba del banner, como overlay */}
      <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-none">
        <div className="flex items-center gap-1 p-1 mt-[-2.5rem] bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400">✏️</span>
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-400">🗑️</span>
        </div>
      </div>
      <div className="relative z-10 w-full flex items-center justify-center px-2 py-0">
        <span className="w-full text-center text-base md:text-lg font-semibold text-slate-700 truncate">
          Banner de ejemplo
        </span>
      </div>
    </section>
  );
}

export function BannerPreviewInfo({ data }: { data: BannerData }) {
  return (
    <section className="w-full h-12 md:h-16 flex items-center justify-center relative overflow-hidden p-0 md:p-0 transition-all bg-blue-50 border border-blue-200 rounded">
      <div className="relative z-10 w-full flex items-center justify-center px-2 py-0 gap-2">
        <span className="text-blue-500">ℹ️</span>
        <span className="w-full text-center text-base md:text-lg font-semibold text-blue-700 truncate">
          {data.text || 'Información importante'}
        </span>
      </div>
    </section>
  );
}

export function BannerPreviewSuccess({ data }: { data: BannerData }) {
  return (
    <section className="w-full h-12 md:h-16 flex items-center justify-center relative overflow-hidden p-0 md:p-0 transition-all bg-green-50 border border-green-200 rounded">
      <div className="relative z-10 w-full flex items-center justify-center px-2 py-0 gap-2">
        <span className="text-green-500">✅</span>
        <span className="w-full text-center text-base md:text-lg font-semibold text-green-700 truncate">
          {data.text || '¡Éxito!'}
        </span>
      </div>
    </section>
  );
}

export function BannerPreviewPromo({ data }: { data: BannerData }) {
  return (
    <section className="w-full h-12 md:h-16 flex items-center justify-center relative overflow-hidden p-0 md:p-0 transition-all bg-pink-50 border border-pink-200 rounded">
      <div className="relative z-10 w-full flex items-center justify-center px-2 py-0 gap-2">
        <span className="text-pink-500">🎉</span>
        <span className="w-full text-center text-base md:text-lg font-semibold text-pink-700 truncate">
          {data.text || 'Promoción especial'}
        </span>
        {data.buttonText && (
          <span className="ml-2 px-3 py-1 bg-pink-500 text-white rounded text-xs font-bold">
            {data.buttonText}
          </span>
        )}
      </div>
    </section>
  );
}
