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
  // La clave es que dentro de cada 'case', renderizamos el componente específico
  // directamente. Esto le permite a TypeScript saber el tipo exacto de 'data'.
  const renderBlockContent = () => {
    switch(block.type) {
        case 'hero': {
            const Component = BLOCKS.hero.renderer;
            return <Component data={block.data as HeroData} />;
        }
        case 'text': {
            const Component = BLOCKS.text.renderer;
            return <Component data={block.data as TextData} />;
        }
        case 'image': {
            const Component = BLOCKS.image.renderer;
            return <Component data={block.data as ImageData} />;
        }
        case 'cards': {
            const Component = BLOCKS.cards.renderer;
            return <Component data={block.data as CardsData} />;
        }
        default:
            return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque de tipo &apos;{block.type}&apos; no está registrado.</div>;
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