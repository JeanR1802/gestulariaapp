import React from 'react';
import Image from 'next/image';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { TestimonialData } from '../editor/blocks/TestimonialBlock';

const TestimonialPresentational: React.FC<BlockComponentProps<TestimonialData>> = ({ data }) => {
  const testimonials = data.testimonials || [];
  if (data.variant === 'grid') {
    return (
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {data.title ? <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{data.title}</h2> : null}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i: number) => (
              <figure key={i} className="bg-slate-50 p-8 rounded-lg">
                <blockquote className="text-slate-700"><p>“{t.quote}”</p></blockquote>
                <figcaption className="flex items-center gap-4 mt-6">
                  <Image className="w-12 h-12 rounded-full object-cover" src={t.imageUrl || 'https://placehold.co/50x50'} alt={t.author} width={48} height={48} />
                  <div>
                    <div className="font-semibold text-slate-900">{t.author}</div>
                    <div className="text-slate-500 text-sm">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const first = testimonials[0];
  if (!first) return null;
  return (
    <div className={data.variant === 'singleWithImage' ? 'bg-white py-16' : 'bg-slate-50 p-16'}>
      <div className="max-w-2xl mx-auto text-center">
        {data.variant === 'singleWithImage' && <Image className="w-24 h-24 mx-auto rounded-full object-cover" src={first.imageUrl || 'https://placehold.co/100x100'} alt={first.author} width={96} height={96} />}
        <blockquote className="mt-8 text-2xl font-medium text-slate-700"><p>“{first.quote}”</p></blockquote>
        <footer className="mt-6">
          <div className="font-semibold text-slate-900">{first.author}</div>
          <div className="text-slate-500">{first.role}</div>
        </footer>
      </div>
    </div>
  );
};

export default TestimonialPresentational;
