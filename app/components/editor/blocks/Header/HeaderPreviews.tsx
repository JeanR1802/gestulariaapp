// Archivo: app/components/editor/blocks/Header/HeaderPreviews.tsx (NUEVA VERSIÓN)
import React from 'react';
import { HeaderData } from '../HeaderBlock';

// Vista previa del diseño por defecto
export function HeaderVariantDefault({ data }: { data: HeaderData }) {
  return (
    <div className="bg-white w-full border border-slate-200 rounded">
      <div className="p-2 flex justify-between items-center">
        <div className="bg-slate-700 h-3 w-12 rounded-sm" />
        <div className="flex items-center space-x-2">
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Vista previa del diseño centrado
export function HeaderVariantCentered({ data }: { data: HeaderData }) {
  return (
    <div className="bg-white w-full border border-slate-200 rounded">
      <div className="p-2 flex flex-col items-center gap-1">
        <div className="bg-slate-700 h-3 w-12 rounded-sm" />
        <div className="flex items-center space-x-2">
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function HeaderVariantButtonPreview({ data }: { data: HeaderData }) {
  return (
    <div className="bg-white w-full border border-slate-200 rounded">
      <div className="p-2 flex justify-between items-center">
        <div className="bg-slate-700 h-3 w-12 rounded-sm" />
        <div className="flex items-center space-x-2">
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
          <div className="bg-slate-300 h-1 w-6 rounded-full" />
          <div className="bg-blue-600 h-3 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}