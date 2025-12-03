import React from 'react';
import Image from 'next/image';
import { getBackgroundStyles, getTextStyles, getButtonStyles } from '../../lib/block-style-helpers';

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
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-slate-100');
  const titleStyle = getTextStyles(data.titleColor, 'text-slate-800');
  const subtitleStyle = getTextStyles(data.subtitleColor, 'text-slate-600');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor, 'bg-blue-600', 'text-white');

  switch (variant) {
    case 'leftImage':
      return (
        <section className={`${bg.className} p-8`} style={bg.style as React.CSSProperties} data-block-type="hero">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h1>
              <p className={`text-lg mb-8 ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>
              <a href={data.buttonLink || '#'} className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a>
            </div>
            <div>
              <Image src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={data.title || 'Imagen'} className="rounded-lg shadow-lg mx-auto" width={600} height={400} />
            </div>
          </div>
        </section>
      );
    case 'darkMinimal':
      return (
        <section className={`${bg.className} p-12 md:p-24 text-center`} style={bg.style as React.CSSProperties} data-block-type="hero">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h1>
          {data.buttonText && <a href={data.buttonLink || '#'} className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a>}
        </section>
      );
    default:
      return (
        <section className={`${bg.className} p-12 md:p-20 text-center`} style={bg.style as React.CSSProperties} data-block-type="hero">
          <div className="max-w-5xl mx-auto">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h1>
            <p className={`text-lg max-w-2xl mx-auto mb-8 ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>
            {data.buttonText && <a href={data.buttonLink || '#'} className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a>}
          </div>
        </section>
      );
  }
}
