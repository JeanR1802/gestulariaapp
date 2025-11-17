import React from 'react';
import type { BlockComponentProps, BlockData } from '../editor/blocks/index';

const ImagePresentational: React.FC<BlockComponentProps<BlockData>> = ({ data }) => {
  const caption = data.caption ? `<p class=\"text-sm text-slate-600 mt-2 italic\">${(data as any).caption}</p>` : '';
  if ((data as any).variant === 'fullwidth') {
    return (
      <div className="w-full my-8">
        <img src={(data as any).imageUrl} alt={(data as any).alt} className="w-full h-auto" />
        {(data as any).caption ? <p className="text-center" dangerouslySetInnerHTML={{ __html: caption }} /> : null}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-center">
      <img src={(data as any).imageUrl} alt={(data as any).alt} className="rounded-lg mx-auto max-w-full h-auto" />
      {(data as any).caption ? <p className="text-sm text-slate-600 mt-2 italic">{(data as any).caption}</p> : null}
    </div>
  );
};

export default ImagePresentational;
