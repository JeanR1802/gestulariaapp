import React from 'react';
import Image from 'next/image';
import { getBackgroundStyles, getTextStyles, getButtonStyles } from '../../lib/block-style-helpers';

export interface CatalogPresentationalData {
  variant?: 'grid' | 'minimalGrid' | 'carousel';
  title?: string;
  subtitle?: string;
  products?: { name: string; price?: string; imageUrl?: string; description?: string; buttonText?: string }[];
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  cardColor?: string;
  productNameColor?: string;
  productPriceColor?: string;
  productDescriptionColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export default function CatalogPresentational({ data }: { data: CatalogPresentationalData }) {
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyle = getTextStyles(data.titleColor, 'text-slate-800');
  const subtitleStyle = getTextStyles(data.subtitleColor, 'text-slate-600');
  const cardBg = getBackgroundStyles(data.cardColor, 'bg-white');
  const productNameStyle = getTextStyles(data.productNameColor, 'text-slate-900');
  const productPriceStyle = getTextStyles(data.productPriceColor, 'text-slate-900');
  const productDescStyle = getTextStyles(data.productDescriptionColor, 'text-slate-600');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor, 'bg-slate-800', 'text-white');

  switch (data.variant) {
    case 'minimalGrid':
      return (
        <section className={`${bg.className} py-12`} style={bg.style as React.CSSProperties} data-block-type="catalog">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
              {data.subtitle && <p className={`mt-2 ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(data.products || []).map((p, i) => (
                <a key={i} className="group">
                  <div className={`relative overflow-hidden rounded-lg mb-4 ${cardBg.className}`} style={cardBg.style as React.CSSProperties}>
                    <Image src={p.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'} alt={p.name} className="w-full aspect-square object-cover" width={400} height={400} />
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${productNameStyle.className}`} style={productNameStyle.style as React.CSSProperties}>{p.name}</h3>
                  <p className={`text-sm ${productPriceStyle.className}`} style={productPriceStyle.style as React.CSSProperties}>{p.price}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    case 'carousel':
      return (
        <section className={`${bg.className} py-12`} style={bg.style as React.CSSProperties} data-block-type="catalog">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
              {(data.products || []).map((p, i) => (
                <a key={i} className="group flex-shrink-0 w-64 snap-center">
                  <div className={`relative overflow-hidden rounded-xl mb-4 ${cardBg.className}`} style={cardBg.style as React.CSSProperties}>
                    <Image src={p.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'} alt={p.name} className="w-full aspect-square object-cover" width={400} height={400} />
                  </div>
                  <h3 className={`font-semibold text-base ${productNameStyle.className}`} style={productNameStyle.style as React.CSSProperties}>{p.name}</h3>
                  <p className={`text-sm ${productPriceStyle.className}`} style={productPriceStyle.style as React.CSSProperties}>{p.price}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    default:
      return (
        <section className={`${bg.className} py-20`} style={bg.style as React.CSSProperties} data-block-type="catalog">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
              {data.subtitle && <p className={`mt-2 ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(data.products || []).map((p, i) => (
                <div key={i} className={`group rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg ${cardBg.className}`} style={cardBg.style as React.CSSProperties}>
                  <div className="relative overflow-hidden bg-slate-50">
                    <Image src={p.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=Producto'} alt={p.name} className="w-full h-48 object-cover" width={400} height={192} />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-semibold text-base mb-2 ${productNameStyle.className}`} style={productNameStyle.style as React.CSSProperties}>{p.name}</h3>
                    <p className={`font-bold text-lg mb-3 ${productPriceStyle.className}`} style={productPriceStyle.style as React.CSSProperties}>{p.price}</p>
                    {p.description && <p className={`text-sm mb-3 ${productDescStyle.className}`} style={productDescStyle.style as React.CSSProperties}>{p.description}</p>}
                    {p.buttonText && <button className={`w-full text-center rounded-lg font-semibold mt-4 py-2 text-sm ${buttonStyle.className}`} style={buttonStyle.style as React.CSSProperties}>{p.buttonText}</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
  }
}
