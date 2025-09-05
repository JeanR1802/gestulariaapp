// Archivo: app/components/editor/blocks/Cta/CtaPreviews.tsx
import React from 'react';
import { CtaData } from '../CtaBlock';

export function CtaPreview({ data }: { data: CtaData }) {
  return (
    <div className="bg-slate-800 w-full p-4 flex flex-col items-center justify-center gap-2 border border-slate-700 rounded">
      <div className="bg-white h-2 w-3/5 rounded-sm" />
      <div className="bg-slate-400 h-1.5 w-4/5 rounded-full" />
      <div className="bg-white h-4 w-16 rounded-md mt-1" />
    </div>
  );
}