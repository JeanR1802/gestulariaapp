'use client';
import React from 'react';
import { BLOCKS, BlockType, BlockData, HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

// CORRECCIÓN: Se añade 'variant' como propiedad opcional a los datos del bloque.
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

  // CORRECCIÓN: Lógica mejorada para manejar variantes de forma segura.
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

  const renderBlockContent = () => {
    // El switch sigue siendo útil para el tipado estricto de datos
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