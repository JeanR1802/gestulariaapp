import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';

const FeaturedProductPresentational: React.FC<BlockComponentProps<any>> = ({ data }) => {
  const rating = data.rating || 0;
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
  ));

  if (data.variant === 'background') {
    return (
      <div className="relative text-white min-h-[500px] flex items-center">
        <img src={data.imageUrl || 'https://placehold.co/1200x800'} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-400">{data.tag}</span>
            <h2 className="font-bold my-4 text-4xl md:text-5xl">{data.title}</h2>
            <p className="mb-6 text-slate-200 text-lg leading-relaxed">{data.description}</p>
            <div className="flex items-center gap-8 mb-8">
              <p className="font-bold text-3xl md:text-4xl">{data.price}</p>
              <div className="flex items-center gap-1">{stars}</div>
            </div>
            <a href="#" className={`inline-block text-center rounded-lg font-semibold transition-transform hover:scale-105 py-4 px-12 text-lg ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-900'}`}>{data.buttonText}</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${data.backgroundColor || 'bg-white'} py-20 px-4`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="rounded-lg overflow-hidden bg-slate-100"><img src={data.imageUrl || 'https://placehold.co/600x600'} alt={data.title} className="w-full h-full object-cover aspect-square" /></div>
        <div className="text-left">
          <span className={`text-sm font-bold uppercase tracking-widest ${data.textColor || 'text-blue-600'}`}>{data.tag}</span>
          <h2 className={`font-bold my-4 text-4xl md:text-5xl ${data.textColor || 'text-slate-800'}`}>{data.title}</h2>
          <p className={`mb-6 text-lg leading-relaxed ${data.textColor || 'text-slate-600'}`}>{data.description}</p>
          <div className="flex items-center justify-between mb-8"><p className={`font-bold text-4xl ${data.textColor || 'text-slate-900'}`}>{data.price}</p><div className="flex items-center gap-1">{stars}</div></div>
          <a href="#" className={`w-full block text-center rounded-lg font-semibold transition-transform hover:scale-105 py-4 text-lg ${data.buttonBgColor || 'bg-slate-900'} ${data.buttonTextColor || 'text-white'}`}>{data.buttonText}</a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductPresentational;
