// Archivo: app/components/editor/blocks/Hero/HeroPreviews.tsx
import React from 'react';
import { HeroData } from '../HeroBlock';

export function HeroPreview({ data }: { data: HeroData }) {
  return (
    <div className="bg-slate-100 w-full p-4 flex flex-col items-center justify-center gap-2 border border-slate-200 rounded">
      <div className="bg-slate-700 h-3 w-3/5 rounded-sm" />
      <div className="bg-slate-400 h-2 w-4/5 rounded-full" />
      <div className="bg-slate-400 h-2 w-3/4 rounded-full" />
      <div className="bg-blue-600 h-4 w-16 rounded-md mt-2" />
    </div>
  );
}