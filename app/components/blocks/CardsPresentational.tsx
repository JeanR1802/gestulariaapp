import React from 'react';
import Image from 'next/image';

export interface CardsPresentationalData {
  variant?: 'default' | 'list' | 'imageTop';
  title?: string;
  cards?: { title: string; description?: string; imageUrl?: string }[];
  backgroundColor?: string;
  titleColor?: string;
  cardBackgroundColor?: string;
  cardTitleColor?: string;
  cardDescriptionColor?: string;
}

export default function CardsPresentational({ data }: { data: CardsPresentationalData }) {
  const bg = data.backgroundColor || '';
  const titleClass = data.titleColor || 'text-slate-800';

  return (
    <section className={`py-12 px-4 ${bg}`} data-block-type="cards">
      <div className="max-w-7xl mx-auto">
        {data.title && <h2 className={`text-2xl font-bold mb-6 ${titleClass}`}>{data.title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.cards || []).map((c, i) => (
            <div key={i} className={`rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg`}> 
              {c.imageUrl && <Image src={c.imageUrl} className="w-full h-48 object-cover" alt={c.title} width={400} height={192} />}
              <div className="p-4">
                <h3 className={`font-semibold ${data.cardTitleColor || 'text-slate-900'}`}>{c.title}</h3>
                {c.description && <p className={`mt-2 text-sm ${data.cardDescriptionColor || 'text-slate-600'}`}>{c.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
