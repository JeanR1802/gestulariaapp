import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';

const StackPresentational: React.FC<BlockComponentProps<any>> = ({ data }) => {
  const elements = data.elements || [];
  return (
    <div className={`${data.backgroundColor || ''}`}>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {elements.map((el: any, i: number) => {
            switch(el.type) {
              case 'text': return <div key={i} className="prose prose-slate"><p>{el.content}</p></div>;
              case 'image': return <div key={i}><img src={el.imageUrl} alt={el.alt || ''} className="rounded-lg w-full"/></div>;
              case 'cta': return <div key={i}><a href="#" className={`inline-block px-4 py-2 rounded-md ${el.buttonBg || 'bg-blue-600'} ${el.buttonText || 'text-white'}`}>{el.text}</a></div>;
              default: return <div key={i}>{JSON.stringify(el)}</div>;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default StackPresentational;
