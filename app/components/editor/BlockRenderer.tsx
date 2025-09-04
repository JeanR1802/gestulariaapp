'use client';
import React from 'react';
import { BLOCKS, BlockType, BlockData, HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

// --- Definiciones de Tipos ---
interface Block { 
  id: number; 
  type: string; 
  data: BlockData & { variant?: string }; // Se añade la propiedad opcional 'variant'
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

// --- El Componente Inteligente (Ahora sí, 100% corregido) ---
export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, onToggleMobileToolbar, isMobileToolbarVisible }: BlockRendererProps) {
  
  const blockConfig = BLOCKS[block.type as BlockType];
  if (!blockConfig) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque &apos;{block.type}&apos; no registrado.</div>;
  }

  // Lógica para seleccionar el componente correcto, ya sea de una variante o el principal
  const getRenderer = () => {
    if (blockConfig.variants) {
      const variantKey = block.data.variant || 'default';
      return blockConfig.variants[variantKey]?.renderer;
    }
    return blockConfig.renderer;
  };

  const Component = getRenderer();

  if (!Component) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: No se encontró el renderizador para &apos;{block.type}&apos;.</div>;
  }
  
  // Esta función interna determina qué componente renderizar, asegurando los tipos correctos.
  const renderBlockContent = () => {
    switch(block.type) {
        case 'header': return <Component data={block.data as HeaderData} />;
        case 'hero': return <Component data={block.data as HeroData} />;
        case 'text': return <Component data={block.data as TextData} />;
        case 'image': return <Component data={block.data as ImageData} />;
        case 'cards': return <Component data={block.data as CardsData} />;
        case 'cta': return <Component data={block.data as CtaData} />;
        case 'footer': return <Component data={block.data as FooterData} />;
        default: return null;
    }
  };

  return (
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
}