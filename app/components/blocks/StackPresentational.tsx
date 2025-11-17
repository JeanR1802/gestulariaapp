import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { StackData } from '../editor/blocks/StackBlock';

const StackPresentational: React.FC<BlockComponentProps<StackData>> = ({ data }) => {
  const elements = data.elements || [];
  return (
    <div className={`${data.backgroundColor || ''}`}>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {elements.map((el, i: number) => {
            switch(el.type) {
              case 'paragraph': return <div key={i} className="prose prose-slate"><p>{el.data.content}</p></div>;
              case 'heading': return <div key={i} className="prose prose-slate">{el.data.level === 'h2' ? <h2>{el.data.content}</h2> : el.data.level === 'h3' ? <h3>{el.data.content}</h3> : <h4>{el.data.content}</h4>}</div>;
              case 'image': return <div key={i}><img src={el.data.imageUrl || ''} alt={el.data.alt || ''} className="rounded-lg w-full"/></div>;
              case 'button': return <div key={i}><a href={el.data.buttonLink || '#'} className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">{el.data.buttonText || 'Click me'}</a></div>;
              case 'spacer': return <div key={i} style={{ height: `${el.data.height || 20}px` }}></div>;
              default: return <div key={i}>{JSON.stringify(el)}</div>;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default StackPresentational;
