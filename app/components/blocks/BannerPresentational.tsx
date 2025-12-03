import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { BannerData } from '../editor/blocks/BannerBlock';
import { getBackgroundStyles, getTextStyles, getButtonStyles } from '../../lib/block-style-helpers';

const BannerPresentational: React.FC<BlockComponentProps<BannerData>> = ({ data }) => {
  const bg = getBackgroundStyles(data.bgColor, 'bg-blue-50');
  const textStyle = getTextStyles(data.textColor, 'text-blue-900');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor, 'bg-yellow-400', 'text-yellow-900');
  const alignClass = data.textAlign === 'left' ? 'justify-start' : data.textAlign === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className={`w-full ${data.height || 'h-12'} flex items-center px-4 shadow-sm gap-2 ${bg.className} ${alignClass}`} style={bg.style as React.CSSProperties}>
      <span className={`font-semibold ${textStyle.className} ${data.textSize || 'text-base'}`} style={textStyle.style as React.CSSProperties}>{data.text}</span>
      {data.buttonText ? <a href="#" className={`ml-2 px-3 py-1 rounded-md font-semibold ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{data.buttonText}</a> : null}
    </div>
  );
};

export default BannerPresentational;
