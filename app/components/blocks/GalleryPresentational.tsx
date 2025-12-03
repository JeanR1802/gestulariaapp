'use client';

import React from 'react';
import Image from 'next/image';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { GalleryData } from '../editor/blocks/GalleryBlock';

const GalleryPresentational: React.FC<BlockComponentProps<GalleryData>> = ({ data }) => {
  const images = data.images || [];
  const spacingMap: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-8' };
  const spacing = spacingMap[data.spacing] || 'gap-4';
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  if (data.variant === 'carousel') {
    const id = `scroll-gallery-${Math.random().toString(36).slice(2,8)}`;
    return (
      <div className="relative">
        <div id={id} className={`flex overflow-x-auto snap-x snap-mandatory scroll-smooth ${spacing}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((img, i: number) => (
            <div key={i} className="snap-center flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4">
              <Image src={img.url || 'https://placehold.co/400x400'} alt={img.alt || ''} className="w-full aspect-square object-cover rounded-lg" width={400} height={400} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.variant === 'featured') {
    const first = images[0];
    const rest = images.slice(1,3);
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing}`}>
        <div className="md:col-span-2">
          {first && <Image src={first.url || 'https://placehold.co/800x800'} alt={first.alt || ''} className="w-full aspect-square object-cover rounded-lg" width={800} height={800} />}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {rest.map((img, idx: number) => <Image key={idx} src={img.url || 'https://placehold.co/400x400'} alt={img.alt || ''} className="w-full aspect-square object-cover rounded-lg" width={400} height={400} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${spacing}`}>
        {images.map((img, i: number) => (
          <div key={i} onClick={() => data.lightbox && setLightboxIndex(i)} className={data.lightbox ? 'cursor-pointer' : ''}>
            <Image src={img.url || 'https://placehold.co/400x400'} alt={img.alt || ''} className="w-full aspect-square object-cover rounded-lg" width={400} height={400} />
          </div>
        ))}
      </div>
      {data.lightbox && lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl" onClick={() => setLightboxIndex(null)}>&times;</button>
          <Image src={images[lightboxIndex]?.url || ''} alt={images[lightboxIndex]?.alt || ''} className="max-w-full max-h-full object-contain" width={1200} height={1200} />
        </div>
      )}
    </>
  );
};

export default GalleryPresentational;
