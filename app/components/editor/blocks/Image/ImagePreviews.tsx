// Archivo: app/components/editor/blocks/Image/ImagePreviews.tsx
import React from 'react';
import { ImageData } from '../ImageBlock';

export function ImagePreview({ data }: { data: ImageData }) {
  return (
    <div className="bg-white w-full p-2 flex flex-col items-center gap-2 border border-slate-200 rounded">
      <div className="w-full bg-slate-200 rounded-sm flex-grow aspect-video flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      </div>
      <div className="bg-slate-300 h-1.5 w-1/3 rounded-full" />
    </div>
  );
}