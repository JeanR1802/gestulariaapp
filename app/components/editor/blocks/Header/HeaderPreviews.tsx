// Archivo: app/components/editor/blocks/Header/HeaderPreviews.tsx (CORREGIDO)
import React from 'react';
import { HeaderData } from '../HeaderBlock';
import { BlockPreviewWrapper } from '@/app/components/editor/BlockPreviewWrapper'; // Importamos el wrapper

// Vista previa del diseño por defecto
export function HeaderVariantDefault({ data }: { data: HeaderData }) {
  return (
    <BlockPreviewWrapper> {/* Usamos el wrapper aquí */}
      <div className="bg-white p-4 border border-slate-200 rounded-md w-full">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>{data.link1 || 'Inicio'}</span>
            <span>{data.link2 || 'Servicios'}</span>
          </div>
        </div>
      </div>
    </BlockPreviewWrapper>
  );
}

// Vista previa del diseño centrado
export function HeaderVariantCentered({ data }: { data: HeaderData }) {
  return (
    <BlockPreviewWrapper> {/* Usamos el wrapper aquí */}
      <div className="bg-white p-4 border border-slate-200 rounded-md w-full">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
          <h1 className="text-lg font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>{data.link1 || 'Inicio'}</span>
            <span>{data.link2 || 'Servicios'}</span>
          </div>
        </div>
      </div>
    </BlockPreviewWrapper>
  );
}