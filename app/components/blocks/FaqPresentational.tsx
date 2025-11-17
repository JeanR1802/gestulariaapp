import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';

const FaqPresentational: React.FC<BlockComponentProps<any>> = ({ data }) => {
  const items = data.items || [];
  if (data.variant === 'accordion') {
    return (
      <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
          <div className="divide-y divide-slate-200">
            {items.map((item: any, i: number) => (
              <details className="group py-4" key={i}>
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className={`font-semibold text-lg ${data.questionColor || 'text-slate-900'}`}>{item.question}</span>
                  <span className="transition group-open:rotate-180 text-slate-500">▾</span>
                </summary>
                <p className={`text-slate-600 mt-3 ${data.answerColor || 'text-slate-600'}`}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
      <div className="max-w-3xl mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
        <div className="space-y-8">
          {items.map((item: any, i: number) => (
            <div key={i}>
              <h3 className={`font-semibold text-xl mb-2 ${data.questionColor || 'text-slate-900'}`}>{item.question}</h3>
              <p className={`${data.answerColor || 'text-slate-600'}`}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPresentational;
