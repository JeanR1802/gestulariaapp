import React from 'react';
import Image from 'next/image';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { CtaData } from '../editor/blocks/CtaBlock';

const CtaPresentational: React.FC<BlockComponentProps<CtaData>> = ({ data }) => {
  const buttonClasses = `inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`;
  if (data.variant === 'split') {
    return (
      <div className={`${data.backgroundColor || 'bg-white'} p-8`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className={`text-3xl font-bold mb-2 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
            <p className={`text-lg mb-6 ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>
            <a href="#" className={buttonClasses}>{data.buttonText}</a>
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
      <div className={`${data.backgroundColor || 'bg-slate-100'} p-12 text-center rounded-lg`}>
        <h2 className={`text-3xl font-bold mb-2 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
        <p className={`text-lg mb-6 max-w-xl mx-auto ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>
        <a href="#" className={buttonClasses}>{data.buttonText}</a>
      </div>
    );
  }

  const darkButtonClasses = `inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-800'}`;
  return (
    <div className={`${data.backgroundColor || 'bg-slate-800'} p-12 text-center`}>
      <h2 className={`text-3xl font-bold mb-2 ${data.titleColor || 'text-white'}`}>{data.title}</h2>
      <p className={`text-lg opacity-90 mb-6 max-w-xl mx-auto ${data.subtitleColor || 'text-slate-300'}`}>{data.subtitle}</p>
      <a href="#" className={darkButtonClasses}>{data.buttonText}</a>
    </div>
  );
};

export default CtaPresentational;
