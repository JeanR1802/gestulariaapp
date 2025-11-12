// Archivo: app/components/editor/blocks/Header/HeaderPreviews.tsx (NUEVA VERSIÓN)
import React from 'react';
import { HeaderData } from '../HeaderBlock';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';

// Vista previa del diseño por defecto
export function HeaderVariantDefault({ data }: { data: HeaderData }) {
  const { isMobile } = usePreviewMode();
  if (isMobile) {
    return (
      <div className="bg-white w-full border border-slate-200 rounded">
        <div className="p-2 flex items-center justify-between">
          <div className="bg-slate-700 h-3 w-10 rounded-sm" />
          {/* hamburger icon for mobile preview */}
          <div className="flex flex-col gap-1">
            <div className="bg-slate-300 h-0.5 w-5 rounded" />
            <div className="bg-slate-300 h-0.5 w-5 rounded" />
            <div className="bg-slate-300 h-0.5 w-5 rounded" />
          </div>
        </div>
      </div>
    );
  }

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
  const { isMobile } = usePreviewMode();
  if (isMobile) {
    return (
      <div className="bg-white w-full border border-slate-200 rounded">
        <div className="p-3 flex flex-col items-center gap-3">
          <div className="bg-slate-700 h-4 w-20 rounded-sm" />
          <div className="mt-1 bg-white border border-slate-200 rounded-full px-4 py-1 flex items-center gap-2">
            <div className="bg-slate-300 h-1 w-4 rounded-full" />
            <div className="bg-slate-300 h-1 w-4 rounded-full" />
            <div className="bg-slate-300 h-1 w-4 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

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
  const { isMobile } = usePreviewMode();
  if (isMobile) {
    return (
      <div className="bg-white w-full border border-slate-200 rounded">
        <div className="p-2 flex items-center justify-between">
          <div className="bg-slate-700 h-3 w-10 rounded-sm" />
          {/* hamburger icon for mobile preview */}
          <div className="flex flex-col gap-1">
            <div className="bg-slate-300 h-0.5 w-5 rounded" />
            <div className="bg-slate-300 h-0.5 w-5 rounded" />
            <div className="bg-slate-300 h-0.5 w-5 rounded" />
          </div>
        </div>
      </div>
    );
  }

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

// Preview for sticky header
export function HeaderVariantSticky({ data }: { data: HeaderData }) {
  const { isMobile } = usePreviewMode();
  if (isMobile) {
    return (
      <div className="w-full border border-slate-200 rounded bg-white">
        <div className="p-2 flex items-center justify-between">
          <div className="bg-slate-700 h-3 w-10 rounded-sm" />
          <div className="bg-slate-300 h-2 w-8 rounded-full" />
          <div className="bg-slate-200 h-3 w-8 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-slate-200 rounded bg-white">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="bg-slate-700 h-3 w-12 rounded-sm" />
          <div className="flex items-center gap-2">
            <div className="bg-slate-300 h-1 w-6 rounded-full" />
            <div className="bg-slate-300 h-1 w-6 rounded-full" />
            <div className="bg-slate-300 h-1 w-6 rounded-full" />
          </div>
          <div className="bg-slate-200 h-3 w-8 rounded" />
        </div>
        <div className="h-1 mt-2 bg-slate-100 rounded" />
      </div>
    </div>
  );
}