'use client';
import React from 'react';
import { BLOCKS, BlockType, BlockData, HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

// --- Definiciones de Tipos ---
interface Block { 
  id: number; 
  type: string; 
  data: BlockData & { variant?: string };
}
interface BlockRendererProps { 
  block: Block; 
  isEditing: boolean; 
  onEdit: () => void; 
  onDelete: () => void; 
  onMoveUp?: () => void; 
  onMoveDown?: () => void; 
  onToggleMobileToolbar: (blockId: number | null) => void;
  isMobileToolbarVisible: boolean;
}

export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, onToggleMobileToolbar, isMobileToolbarVisible }: BlockRendererProps) {
  const blockConfig = BLOCKS[block.type as BlockType];
  if (!blockConfig) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque &apos;{block.type}&apos; no registrado.</div>;
  }

  // --- CORRECCIÓN: Lógica para renderizar el componente del bloque ---
  const renderBlockContent = () => {
    // Si el bloque tiene variantes, usamos la lógica de variantes
    if (blockConfig.variants) {
      const variantKey = block.data.variant || 'default';
      const Component = blockConfig.variants[variantKey]?.renderer;
      if (Component) {
        // Aquí TypeScript sabe que 'Component' es el correcto para 'header'
        if (block.type === 'header') {
          return <Component data={block.data as HeaderData} />;
        }
      }
    }

    // Si no tiene variantes, usamos el renderizador principal
    const Component = blockConfig.renderer;
    if (Component) {
        switch(block.type) {
            case 'hero': return <Component data={block.data as HeroData} />;
            case 'text': return <Component data={block.data as TextData} />;
            case 'image': return <Component data={block.data as ImageData} />;
            case 'cards': return <Component data={block.data as CardsData} />;
            case 'cta': return <Component data={block.data as CtaData} />;
            case 'footer': return <Component data={block.data as FooterData} />;
        }
    }
    
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: No se encontró un renderizador para el bloque &apos;{block.type}&apos;.</div>;
  };
  
  const blockElement = (
    <BlockWrapper 
      isEditing={isEditing} 
      onEdit={onEdit} 
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      blockId={block.id}
      onToggleMobileToolbar={onToggleMobileToolbar}
      isMobileToolbarVisible={isMobileToolbarVisible}
    >
      {renderBlockContent()}
    </BlockWrapper>
  );

  if (!blockConfig.isFullWidth) {
    return (
      <div className="max-w-5xl mx-auto px-4">
        {blockElement}
      </div>
    );
  }

  return blockElement;
}