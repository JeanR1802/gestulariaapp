import React from 'react';
import { getBackgroundStyles, getTextStyles } from '../../lib/block-style-helpers';

export interface FooterPresentationalData {
  variant?: 'simple' | 'multiColumn' | 'minimal';
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  copyrightText?: string;
  socialLinks?: { platform: string; url: string }[];
  columns?: { title: string; links: string[] }[];
}

export default function FooterPresentational({ data }: { data: FooterPresentationalData }) {
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-slate-800');
  const textStyle = getTextStyles(data.textColor, 'text-slate-400');
  const linkStyle = getTextStyles(data.linkColor, 'text-slate-300');

  switch (data.variant) {
    case 'minimal':
      return (
        <footer className={`py-6 px-4 ${bg.className}`} style={bg.style as React.CSSProperties}>
          <div className="max-w-7xl mx-auto text-center">
            <p className={`${textStyle.className}`} style={textStyle.style as React.CSSProperties}>{data.copyrightText}</p>
          </div>
        </footer>
      );

    case 'multiColumn':
      return (
        <footer className={`py-16 px-4 ${bg.className}`} style={bg.style as React.CSSProperties}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {(data.columns || []).map((col, i) => (
                <div key={i}>
                  <h3 className={`font-semibold mb-4 ${textStyle.className}`} style={textStyle.style as React.CSSProperties}>{col.title}</h3>
                  <ul className="space-y-2">
                    {(col.links || []).map((l, idx) => (
                      <li key={idx}><a className={`${linkStyle.className} hover:opacity-80 transition-opacity`} style={linkStyle.style as React.CSSProperties}>{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className={`${textStyle.className}`} style={textStyle.style as React.CSSProperties}>{data.copyrightText}</p>
            </div>
          </div>
        </footer>
      );

    default:
      return (
        <footer className={`py-8 px-4 ${bg.className}`} style={bg.style as React.CSSProperties}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`${textStyle.className}`} style={textStyle.style as React.CSSProperties}>{data.copyrightText}</p>
            <div className="flex gap-4">
              {(data.socialLinks || []).map((s, i) => (
                <a key={i} href={s.url} className={`${linkStyle.className}`} style={linkStyle.style as React.CSSProperties}>{s.platform}</a>
              ))}
            </div>
          </div>
        </footer>
      );
  }
}
