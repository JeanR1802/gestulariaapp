import React from 'react';
import Image from 'next/image';

export interface HeroPresentationalData {
  variant?: 'default' | 'leftImage' | 'darkMinimal';
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  imageUrl?: string;
}

export default function HeroPresentational({ data }: { data: HeroPresentationalData }) {
  const variant = data.variant || 'default';
  const bgClass = data.backgroundColor || 'bg-slate-100';
  const titleClass = data.titleColor || 'text-slate-800';
  const subtitleClass = data.subtitleColor || 'text-slate-600';
  const btnClass = data.buttonBgColor || 'bg-blue-600';

  switch (variant) {
    case 'leftImage':
      return (
        <section className={`${bgClass} p-8`} data-block-type="hero">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClass}`}>{data.title}</h1>
              <p className={`text-lg mb-8 ${subtitleClass}`}>{data.subtitle}</p>
              <a href={data.buttonLink || '#'} className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold ${btnClass} ${data.buttonTextColor || 'text-white'}`}>{data.buttonText}</a>
            </div>
            <div>
              <Image src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={data.title || 'Imagen'} className="rounded-lg shadow-lg mx-auto" width={600} height={400} />
            </div>
          </div>
        </section>
      );
    case 'darkMinimal':
      return (
        <section className={`${bgClass} p-12 md:p-24 text-center`} data-block-type="hero">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${titleClass}`}>{data.title}</h1>
          {data.buttonText && <a href={data.buttonLink || '#'} className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold ${btnClass} ${data.buttonTextColor || 'text-slate-800'}`}>{data.buttonText}</a>}
        </section>
      );
    default:
      return (
        <section className={`${bgClass} p-12 md:p-20 text-center`} data-block-type="hero">
          <div className="max-w-5xl mx-auto">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClass}`}>{data.title}</h1>
            <p className={`text-lg max-w-2xl mx-auto mb-8 ${subtitleClass}`}>{data.subtitle}</p>
            {data.buttonText && <a href={data.buttonLink || '#'} className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold ${btnClass} ${data.buttonTextColor || 'text-white'}`}>{data.buttonText}</a>}
          </div>
        </section>
      );
  }
}
