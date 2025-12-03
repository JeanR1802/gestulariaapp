import React from 'react';
import Image from 'next/image';
import { getBackgroundStyles, getTextStyles } from '../../lib/block-style-helpers';

export interface CardsPresentationalData {
  variant?: 'default' | 'list' | 'imageTop';
  title?: string;
  cards?: { title: string; description?: string; imageUrl?: string; icon?: string }[];
  backgroundColor?: string;
  titleColor?: string;
  cardBackgroundColor?: string;
  cardTitleColor?: string;
  cardDescriptionColor?: string;
}

export default function CardsPresentational({ data }: { data: CardsPresentationalData }) {
  const sectionBg = getBackgroundStyles(data.backgroundColor, '');
  const titleStyle = getTextStyles(data.titleColor, 'text-slate-800');
  const cardBg = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
  const cardTitle = getTextStyles(data.cardTitleColor, 'text-slate-900');
  const cardDesc = getTextStyles(data.cardDescriptionColor, 'text-slate-600');

  return (
    <section className={`py-12 px-4 ${sectionBg.className}`} style={sectionBg.style as React.CSSProperties} data-block-type="cards">
      <div className="max-w-7xl mx-auto">
        {data.title && <h2 className={`text-2xl font-bold mb-6 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.cards || []).map((c, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg ${cardBg.className}`}
              style={cardBg.style as React.CSSProperties}
            >
              {c.imageUrl && <Image src={c.imageUrl} className="w-full h-48 object-cover" alt={c.title} width={400} height={192} />}
              <div className="p-4 text-center">
                {c.icon && (
                  <div className="flex justify-center text-4xl mb-3" aria-hidden>
                    {c.icon}
                  </div>
                )}
                <h3 className={`font-semibold ${cardTitle.className}`} style={cardTitle.style as React.CSSProperties}>{c.title}</h3>
                {c.description && <p className={`mt-2 text-sm ${cardDesc.className}`} style={cardDesc.style as React.CSSProperties}>{c.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
