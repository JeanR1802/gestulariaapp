import React from 'react';
import { FeaturedProductData } from '../FeaturedProductBlock';

const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

export function FeaturedProductPreviewImageLeft({ data }: { data: FeaturedProductData }) {
  return (
    <div className="bg-white w-full p-3 grid grid-cols-2 items-center gap-3 border border-slate-200 rounded">
      <div className="w-full bg-slate-200 rounded-sm aspect-square flex items-center justify-center"><ImageIcon /></div>
      <div className="flex flex-col gap-1.5">
        <div className="bg-blue-300 h-1 w-1/3 rounded-full" />
        <div className="bg-slate-700 h-2 w-full rounded-sm" />
        <div className="bg-slate-400 h-1.5 w-4/5 rounded-full" />
        <div className="bg-slate-800 h-3 w-full rounded-md mt-1" />
      </div>
    </div>
  );
}

export function FeaturedProductPreviewBackground({ data }: { data: FeaturedProductData }) {
  return (
    <div className="bg-slate-800 w-full p-3 flex items-center border border-slate-700 rounded relative aspect-video">
        <div className="absolute inset-0 bg-slate-500/30"></div>
        <div className="flex flex-col gap-1.5 z-10 w-2/3">
            <div className="bg-blue-300 h-1 w-1/3 rounded-full" />
            <div className="bg-white h-2 w-full rounded-sm" />
            <div className="bg-slate-300 h-1.5 w-4/5 rounded-full" />
            <div className="bg-white h-3 w-1/2 rounded-md mt-1" />
        </div>
    </div>
  );
}