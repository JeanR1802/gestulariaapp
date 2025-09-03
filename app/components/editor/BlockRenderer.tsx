import React from 'react';
// CORRECCIÓN: Se importa 'BlockData' para usar un tipo estricto.
import { BLOCKS, BlockType, BlockData } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

// --- Definiciones de Tipos ---
interface Block { 
  id: number; 
  type: string; 
  data: BlockData; // CORRECCIÓN: Se reemplaza 'any' por el tipo estricto 'BlockData'.
}

interface BlockRendererProps { 
  block: Block; 
  isEditing: boolean; 
  onEdit: () => void; 
  onDelete: () => void; 
  onMoveUp?: () => void; 
  onMoveDown?: () => void; 
}

// --- El Componente Inteligente ---
export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockRendererProps) {
  const blockConfig = BLOCKS[block.type as BlockType];
  
  if (!blockConfig) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque de tipo &apos;{block.type}&apos; no está registrado.</div>;
  }
  
  const BlockComponent = blockConfig.renderer;

  return (
    <BlockWrapper 
      isEditing={isEditing} 
      onEdit={onEdit} 
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      <BlockComponent data={block.data} />
    </BlockWrapper>
  );
}