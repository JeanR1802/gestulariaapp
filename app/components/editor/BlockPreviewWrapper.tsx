// Archivo: app/components/editor/BlockPreviewWrapper.tsx
import React from 'react';

interface BlockPreviewWrapperProps {
  children: React.ReactNode;
}

export const BlockPreviewWrapper: React.FC<BlockPreviewWrapperProps> = ({ children }) => {
  return (
    <div className="relative w-[133.33%] h-[133.33%] origin-top-left scale-[0.75]">
      {children}
    </div>
  );
};