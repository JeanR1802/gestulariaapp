// app/components/editor/BlockRenderer.tsx (CORREGIDO)
'use client';
import React from 'react';
import { BLOCKS, BlockData, BlockType } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

interface Block { 
  id: number; 
  type: string; 
  data: BlockData;
}

interface BlockRendererProps { 
  block: Block; 
  isEditing: boolean; 
  onEdit: () => void;
  onDelete: () => void; 
  onMoveUp?: () => void; 
  onMoveDown?: () => void;
}

export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockRendererProps) {
  
  const renderBlockContent = () => {
    const Component = BLOCKS[block.type as BlockType]?.renderer;
    if (!Component) {
      return <div>Error: Bloque de tipo &apos;{block.type}&apos; no reconocido.</div>;
    }
    // --- INICIO DE LA CORRECCIÓN ---
    // Se cambia @ts-ignore por @ts-expect-error para cumplir con las reglas de ESLint
    // @ts-expect-error: Se espera un error aquí porque pasamos props genéricas a componentes específicos.
    return <Component data={block.data} />;
    // --- FIN DE LA CORRECCIÓN ---
  };

  return (
    <BlockWrapper 
      blockId={block.id}
      blockType={block.type as BlockType}
      isEditing={isEditing} 
      onEdit={onEdit} 
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {renderBlockContent()}
    </BlockWrapper>
  );
}