'use client';
import React from 'react';
// CORRECCIÓN: Se importa 'FooterData' para que TypeScript conozca el tipo de datos del nuevo bloque.
import { BLOCKS, BlockType, BlockData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData } from './blocks';
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

// --- El Componente Inteligente (Ahora sí, completo) ---
export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockRendererProps) {
  
  // Esta función interna determina qué componente renderizar.
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
        case 'cta': {
            const Component = BLOCKS.cta.renderer;
            return <Component data={block.data as CtaData} />;
        }
        // --- ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA! ---
        case 'footer': {
            const Component = BLOCKS.footer.renderer;
            return <Component data={block.data as FooterData} />;
        }
        default:
            return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque de tipo &apos;{block.type}&apos; no está registrado en el renderizador.</div>;
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