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

  // --- CORRECCIÓN DEFINITIVA: Lógica segura para manejar variantes ---
  const getRenderer = () => {
    // 1. Preguntamos: ¿La configuración de este bloque tiene la propiedad 'variants'?
    // Usamos 'in' para una comprobación segura que TypeScript entiende.
    if ('variants' in blockConfig && blockConfig.variants) {
      const variantKey = block.data.variant || 'default';
      return blockConfig.variants[variantKey]?.renderer;
    }
    // 2. Si no tiene variantes, usamos el renderizador normal.
    return blockConfig.renderer;
  };

  const Component = getRenderer();

  if (!Component) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: No se encontró un renderizador para &apos;{block.type}&apos;.</div>;
  }

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