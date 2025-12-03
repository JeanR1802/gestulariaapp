import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { FaqData } from '../editor/blocks/FaqBlock';
import { getBackgroundStyles, getTextStyles } from '../../lib/block-style-helpers';

const FaqPresentational: React.FC<BlockComponentProps<FaqData>> = ({ data }) => {
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyle = getTextStyles(data.titleColor, 'text-slate-800');
  const questionStyle = getTextStyles(data.questionColor, 'text-slate-900');
  const answerStyle = getTextStyles(data.answerColor, 'text-slate-600');
  const items = data.items || [];
  if (data.variant === 'accordion') {
    return (
      <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
          <div className="divide-y divide-slate-200">
            {items.map((item, i: number) => (
              <details className="group py-4" key={i}>
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className={`font-semibold text-lg ${questionStyle.className}`} style={questionStyle.style as React.CSSProperties}>{item.question}</span>
                  <span className="transition group-open:rotate-180 text-slate-500">▾</span>
                </summary>
                <p className={`mt-3 ${answerStyle.className}`} style={answerStyle.style as React.CSSProperties}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
      <div className="max-w-3xl mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>
        <div className="space-y-8">
          {items.map((item, i: number) => (
            <div key={i}>
              <h3 className={`font-semibold text-xl mb-2 ${questionStyle.className}`} style={questionStyle.style as React.CSSProperties}>{item.question}</h3>
              <p className={`${answerStyle.className}`} style={answerStyle.style as React.CSSProperties}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPresentational;
