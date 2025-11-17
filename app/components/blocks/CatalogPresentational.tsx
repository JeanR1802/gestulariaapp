import React from 'react';
import Image from 'next/image';

export interface CatalogPresentationalData {
  variant?: 'grid' | 'minimalGrid' | 'carousel';
  title?: string;
  subtitle?: string;
  products?: { name: string; price?: string; imageUrl?: string; description?: string }[];
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export default function CatalogPresentational({ data }: { data: CatalogPresentationalData }) {
  const bg = data.backgroundColor || 'bg-white';
  const titleClass = data.titleColor || 'text-slate-800';
  const subtitleClass = data.subtitleColor || 'text-slate-600';

  switch (data.variant) {
    case 'minimalGrid':
      return (
        <section className={`${bg} py-12`} data-block-type="catalog">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${titleClass}`}>{data.title}</h2>
              {data.subtitle && <p className={`mt-2 ${subtitleClass}`}>{data.subtitle}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(data.products || []).map((p, i) => (
                <a key={i} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-slate-50 mb-4">
                    <Image src={p.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'} alt={p.name} className="w-full aspect-square object-cover" width={400} height={400} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
                  <p className="text-sm text-slate-600">{p.price}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    case 'carousel':
      return (
        <section className={`${bg} py-12`} data-block-type="catalog">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
              {(data.products || []).map((p, i) => (
                <a key={i} className="group flex-shrink-0 w-64 snap-center">
                  <div className="relative overflow-hidden rounded-xl bg-slate-50 mb-4">
                    <Image src={p.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'} alt={p.name} className="w-full aspect-square object-cover" width={400} height={400} />
                  </div>
                  <h3 className="font-semibold text-base">{p.name}</h3>
                  <p className="text-sm text-slate-600">{p.price}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    default:
      return (
        <section className={`${bg} py-20`} data-block-type="catalog">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${titleClass}`}>{data.title}</h2>
              {data.subtitle && <p className={`mt-2 ${subtitleClass}`}>{data.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(data.products || []).map((p, i) => (
                <div key={i} className="group rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg">
                  <div className="relative overflow-hidden bg-slate-50">
                    <Image src={p.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=Producto'} alt={p.name} className="w-full h-48 object-cover" width={400} height={192} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-2">{p.name}</h3>
                    <p className="font-bold text-lg mb-3">{p.price}</p>
                    <p className="text-sm text-slate-600">{p.description}</p>
                    <button className="w-full text-center rounded-lg font-semibold mt-4 py-2 text-sm bg-slate-800 text-white">Comprar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
  }
}
