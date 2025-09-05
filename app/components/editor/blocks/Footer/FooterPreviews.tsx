// Archivo: app/components/editor/blocks/Footer/FooterPreviews.tsx
import React from 'react';
import { FooterData } from '../FooterBlock';

export function FooterPreview({ data }: { data: FooterData }) {
  return (
    <div className="bg-slate-800 w-full p-3 flex flex-col items-center gap-2 border border-slate-700 rounded">
      <div className="bg-slate-400 h-1.5 w-1/2 rounded-full" />
      <div className="flex items-center space-x-2">
        <div className="bg-slate-500 h-1 w-8 rounded-full" />
        <div className="bg-slate-500 h-1 w-8 rounded-full" />
      </div>
    </div>
  );
}