import React from 'react';
import Image from 'next/image';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { CtaData } from '../editor/blocks/CtaBlock';
import { getBackgroundStyles, getTextStyles, getButtonStyles } from '../../lib/block-style-helpers';

const CtaPresentational: React.FC<BlockComponentProps<CtaData>> = ({ data }) => {
  const bg = getBackgroundStyles(data.backgroundColor, data.variant === 'split' ? 'bg-white' : data.variant === 'light' ? 'bg-slate-100' : 'bg-slate-800');
  const titleStyle = getTextStyles(data.titleColor, data.variant === 'split' || data.variant === 'light' ? 'text-slate-800' : 'text-white');
  const subtitleStyle = getTextStyles(data.subtitleColor, data.variant === 'split' || data.variant === 'light' ? 'text-slate-600' : 'text-slate-300');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor, data.variant === 'split' || data.variant === 'light' ? 'bg-blue-600' : 'bg-white', data.variant === 'split' || data.variant === 'light' ? 'text-white' : 'text-slate-800');
  
  if (data.variant === 'split') {
    return (
      <div className={`${bg.className} p-8`} style={bg.style as React.CSSProperties}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className={`text-3xl font-bold mb-2 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
            <p className={`text-lg mb-6 ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>
            <a href="#" className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a>
          </div>
          <div>
            <Image src={data.imageUrl || 'https://placehold.co/600x400'} alt={data.title} className="rounded-lg shadow-lg mx-auto" width={600} height={400} />
          </div>
        </div>
      </div>
    );
  }

  if (data.variant === 'light') {
    return (
      <div className={`${bg.className} p-12 text-center rounded-lg`} style={bg.style as React.CSSProperties}>
        <h2 className={`text-3xl font-bold mb-2 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
        <p className={`text-lg mb-6 max-w-xl mx-auto ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>
        <a href="#" className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a>
      </div>
    );
  }

  return (
    <div className={`${bg.className} p-12 text-center`} style={bg.style as React.CSSProperties}>
      <h2 className={`text-3xl font-bold mb-2 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
      <p className={`text-lg opacity-90 mb-6 max-w-xl mx-auto ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>
      <a href="#" className={`inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a>
    </div>
  );
};

export default CtaPresentational;
