'use client';
import React from 'react';
import { BLOCKS, BlockType, BlockData, HeroData, TextData, ImageData, CardsData } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

// --- Definiciones de Tipos ---
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

// --- El Componente Inteligente (Ahora sí, corregido) ---
export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockRendererProps) {
  
  // Esta función interna determina qué componente renderizar.
  // El 'switch' es la clave, porque le permite a TypeScript saber
  // el tipo exacto de 'data' en cada caso.
  const renderBlockContent = () => {
    const blockConfig = BLOCKS[block.type as BlockType];
    if (!blockConfig) {
      return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque de tipo &apos;{block.type}&apos; no está registrado.</div>;
    }
    
    const Component = blockConfig.renderer;

    // Dentro de cada 'case', TypeScript sabe que 'block.data' tiene la forma correcta.
    switch(block.type) {
        case 'hero':
            return <Component data={block.data as HeroData} />;
        case 'text':
            return <Component data={block.data as TextData} />;
        case 'image':
            return <Component data={block.data as ImageData} />;
        case 'cards':
            return <Component data={block.data as CardsData} />;
        default:
            return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Tipo de bloque no renderizable.</div>;
    }
  };

  return (
    <BlockWrapper 
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