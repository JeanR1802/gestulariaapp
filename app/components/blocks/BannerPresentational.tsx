import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { BannerData } from '../editor/blocks/BannerBlock';

const BannerPresentational: React.FC<BlockComponentProps<BannerData>> = ({ data }) => {
  const bgClass = data.bgColor || 'bg-blue-50';
  const textClass = data.textColor || 'text-blue-900';
  const btnBgClass = data.buttonBgColor || 'bg-yellow-400/90';
  const btnTextClass = data.buttonTextColor || 'text-yellow-900';
  const alignClass = data.textAlign === 'left' ? 'justify-start' : data.textAlign === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className={`w-full ${data.height || 'h-12'} flex items-center px-4 shadow-sm gap-2 ${bgClass} ${alignClass}`}>
      <span className={`font-semibold ${textClass} ${data.textSize || 'text-base'}`}>{data.text}</span>
      {data.buttonText ? <a href="#" className={`ml-2 px-3 py-1 rounded-md font-semibold ${btnBgClass} ${btnTextClass}`}>{data.buttonText}</a> : null}
    </div>
  );
};

export default BannerPresentational;
