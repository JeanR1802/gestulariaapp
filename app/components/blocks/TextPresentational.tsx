import React from 'react';

export interface TextPresentationalData {
  variant?: 'default' | 'quote' | 'highlighted';
  content?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function TextPresentational({ data }: { data: TextPresentationalData }) {
  const bgClass = data.backgroundColor || '';
  const textClass = data.textColor || 'text-slate-700';

  switch (data.variant) {
    case 'quote':
      return (
        <section className={`p-6 ${bgClass}`} data-block-type="text">
          <blockquote className={`max-w-3xl mx-auto italic text-lg ${textClass}`}>{data.content}</blockquote>
        </section>
      );
    case 'highlighted':
      return (
        <section className={`p-6 ${bgClass}`} data-block-type="text">
          <p className={`max-w-3xl mx-auto font-semibold ${textClass}`}>{data.content}</p>
        </section>
      );
    default:
      return (
        <section className={`p-6 ${bgClass}`} data-block-type="text">
          <p className={`max-w-3xl mx-auto ${textClass}`}>{data.content}</p>
        </section>
      );
  }
}
