import React from 'react';
import Image from 'next/image';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { ImageData } from '../editor/blocks/ImageBlock';

const ImagePresentational: React.FC<BlockComponentProps<ImageData>> = ({ data }) => {
  const caption = data.caption ? `<p class=\"text-sm text-slate-600 mt-2 italic\">${data.caption}</p>` : '';
  if (data.variant === 'fullwidth') {
    return (
      <div className="w-full my-8">
        <Image src={data.imageUrl} alt={data.alt} className="w-full h-auto" width={1200} height={800} />
        {data.caption ? <p className="text-center" dangerouslySetInnerHTML={{ __html: caption }} /> : null}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-center">
      <Image src={data.imageUrl} alt={data.alt} className="rounded-lg mx-auto max-w-full h-auto" width={800} height={600} />
      {data.caption ? <p className="text-sm text-slate-600 mt-2 italic">{data.caption}</p> : null}
    </div>
  );
};

export default ImagePresentational;
