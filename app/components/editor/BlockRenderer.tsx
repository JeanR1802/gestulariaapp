'use client';
import React from 'react';
import { BLOCKS, BlockData, Block, BlockType } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';



interface BlockRendererProps { 
  block: Block; 
  isEditing: boolean; 
  onEdit: () => void;
  onDelete: () => void; 
  onClose: () => void;
  onUpdate: (key: string, value: unknown) => void;
  onMoveUp?: () => void; 
  onMoveDown?: () => void;
}

export function BlockRenderer({ 
    block, 
    isEditing, 
    onEdit, 
    onDelete, 
    onClose,
    onUpdate,
    onMoveUp, 
    onMoveDown 
}: BlockRendererProps) {
  
  const renderBlockContent = () => {
    const Component = BLOCKS[block.type]?.renderer;
    if (!Component) {
      return <div>Error: Bloque de tipo &apos;{block.type}&apos; no reconocido.</div>;
    }
    
        return <Component data={block.data} isEditing={isEditing} onUpdate={onUpdate} />;

  };

  return (
    <BlockWrapper 
      block={block}
      isEditing={isEditing} 
      onEdit={onEdit} 
      onClose={onClose}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {renderBlockContent()}
    </BlockWrapper>
  );
}