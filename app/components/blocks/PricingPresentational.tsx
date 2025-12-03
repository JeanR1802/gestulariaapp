import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { PricingData } from '../editor/blocks/PricingBlock';
import { getBackgroundStyles, getTextStyles } from '../../lib/block-style-helpers';

const PricingPresentational: React.FC<BlockComponentProps<PricingData>> = ({ data }) => {
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyle = getTextStyles(data.titleColor, 'text-slate-800');
  const titleHtml = <h2 className={`text-3xl font-bold text-center mb-2 ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>;
  const subtitleHtml = <p className={`text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto`}>{data.subtitle}</p>;

  if (data.variant === 'simple') {
    return (
      <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          {titleHtml}
          {subtitleHtml}
          <div className="grid md:grid-cols-2 gap-8">
            {(data.plans || []).map((plan, i: number) => (
              <div key={i} className={`p-6 border rounded-lg flex flex-col ${plan.featured ? `border-2 ${data.featuredCardColor || 'border-blue-600'}` : 'border-slate-200'}`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-4">${plan.price}<span className="text-base font-normal text-slate-500">{plan.frequency}</span></p>
                <p className="text-slate-500 text-sm mb-4">Plan {plan.name}</p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="text-sm text-slate-600 space-y-2 mb-4 flex-grow">
                    {plan.features.map((feat, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6 9 17l-5-5" /></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <a href="#" className="w-full block text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">{plan.buttonText}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.variant === 'list') {
    return (
      <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          {titleHtml}
          {subtitleHtml}
          <div className="space-y-4">
            {(data.plans || []).map((plan, i: number) => (
              <div key={i} className={`p-4 border rounded-lg ${plan.featured ? `border-2 ${data.featuredCardColor || 'border-blue-600'}` : 'border-slate-200'}`}>
                <div className="grid md:grid-cols-3 items-start gap-4">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">Plan {plan.name}</p>
                    {plan.features && plan.features.length > 0 && (
                      <ul className="text-sm text-slate-600 space-y-1">
                        {plan.features.slice(0, 3).map((feat, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 flex-shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-slate-500">{plan.frequency}</span></p>
                    <a href="#" className="mt-2 inline-block w-full text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">{plan.buttonText}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // columns (default)
  return (
    <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
      <div className="max-w-5xl mx-auto">
        {titleHtml}
        {subtitleHtml}
        <div className="grid md:grid-cols-3 gap-8">
          {(data.plans || []).map((plan, i: number) => (
            <div key={i} className={`p-6 border rounded-lg text-left flex flex-col ${plan.featured ? `border-2 ${data.featuredCardColor || 'border-blue-600'}` : 'border-slate-200'}`}>
              <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
              <p className="text-slate-500 mb-4">Plan {plan.name}</p>
              <p className="text-4xl font-bold mb-1">${plan.price}<span className="text-base font-normal text-slate-500">{plan.frequency}</span></p>
              <ul className="text-sm text-slate-600 space-y-2 my-6 flex-grow">{(plan.features || []).map((feat, idx: number) => <li key={idx} className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6 9 17l-5-5" /></svg><span>{feat}</span></li>)}</ul>
              <a href="#" className={`w-full text-center py-2 rounded-md font-semibold ${plan.featured ? `${data.featuredCardColor ? data.featuredCardColor.replace('border-', 'bg-') : 'bg-blue-600'} text-white` : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>{plan.buttonText}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPresentational;
