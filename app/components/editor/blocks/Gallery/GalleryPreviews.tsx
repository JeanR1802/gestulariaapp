import React from 'react';

// Placeholder for Grid Preview
export const GalleryPreviewGrid: React.FC = () => (
  <div className="w-full h-full bg-slate-100 p-2 grid grid-cols-3 gap-1">
    <div className="aspect-square bg-slate-300 rounded-sm"></div>
    <div className="aspect-square bg-slate-300 rounded-sm"></div>
    <div className="aspect-square bg-slate-300 rounded-sm"></div>
    <div className="aspect-square bg-slate-300 rounded-sm"></div>
    <div className="aspect-square bg-slate-300 rounded-sm"></div>
    <div className="aspect-square bg-slate-300 rounded-sm"></div>
  </div>
);

// Placeholder for Carousel Preview
export const GalleryPreviewCarousel: React.FC = () => (
    <div className="w-full h-full bg-slate-100 p-2 flex items-center gap-1 overflow-hidden">
      <div className="aspect-square w-1/3 flex-shrink-0 bg-slate-300 rounded-sm"></div>
      <div className="aspect-square w-1/3 flex-shrink-0 bg-slate-300 rounded-sm"></div>
      <div className="aspect-square w-1/3 flex-shrink-0 bg-slate-300 rounded-sm"></div>
    </div>
  );

// Placeholder for Featured Preview
export const GalleryPreviewFeatured: React.FC = () => (
    <div className="w-full h-full bg-slate-100 p-2 flex gap-1">
        <div className="aspect-square w-2/3 bg-slate-300 rounded-sm"></div>
        <div className="w-1/3 flex flex-col gap-1">
            <div className="aspect-square w-full bg-slate-300 rounded-sm"></div>
            <div className="aspect-square w-full bg-slate-300 rounded-sm"></div>
        </div>
    </div>
  );
