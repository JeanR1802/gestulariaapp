import React from 'react';
import type { BlockComponentProps, BlockData } from '../editor/blocks/index';

const GalleryPresentational: React.FC<BlockComponentProps<BlockData>> = ({ data }) => {
  const images = (data as any).images || [];
  const spacingMap: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-8' };
  const spacing = spacingMap[(data as any).spacing] || 'gap-4';

  if ((data as any).variant === 'carousel') {
    const id = `scroll-gallery-${Math.random().toString(36).slice(2,8)}`;
    return (
      <div className="relative">
        <div id={id} className={`flex overflow-x-auto snap-x snap-mandatory scroll-smooth ${spacing}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((img: any, i: number) => (
            <div key={i} className="snap-center flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4">
              <img src={img.url || 'https://placehold.co/400x400'} alt={img.alt || ''} className="w-full aspect-square object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if ((data as any).variant === 'featured') {
    const first = images[0];
    const rest = images.slice(1,3);
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing}`}>
        <div className="md:col-span-2">
          {first && <img src={first.url || 'https://placehold.co/800x800'} alt={first.alt || ''} className="w-full aspect-square object-cover rounded-lg" />}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {rest.map((img: any, idx: number) => <img key={idx} src={img.url || 'https://placehold.co/400x400'} alt={img.alt || ''} className="w-full aspect-square object-cover rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${spacing}`}>
      {images.map((img: any, i: number) => (
        <img key={i} src={img.url || 'https://placehold.co/400x400'} alt={img.alt || ''} className="w-full aspect-square object-cover rounded-lg" />
      ))}
    </div>
  );
};

export default GalleryPresentational;
