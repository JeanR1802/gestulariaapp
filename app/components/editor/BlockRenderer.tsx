'use client';
import React from 'react';
import { BLOCKS, BlockType, BlockData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData, HeaderData } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

interface Block { id: number; type: string; data: BlockData; }
interface BlockRendererProps { block: Block; isEditing: boolean; onEdit: () => void; onDelete: () => void; onMoveUp?: () => void; onMoveDown?: () => void; onToggleMobileToolbar: (blockId: number | null) => void; isMobileToolbarVisible: boolean; }

export function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, onToggleMobileToolbar, isMobileToolbarVisible }: BlockRendererProps) {
  const blockConfig = BLOCKS[block.type as BlockType];
  if (!blockConfig) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Bloque de tipo &apos;{block.type}&apos; no está registrado.</div>;
  }

  // --- CORRECCIÓN: Lógica para renderizar el componente del bloque ---
  const renderBlockContent = () => {
    const Component = blockConfig.renderer;
    switch(block.type) {
      case 'header': return <Component data={block.data as HeaderData} />;
      case 'hero':   return <Component data={block.data as HeroData} />;
      case 'text':   return <Component data={block.data as TextData} />;
      case 'image':  return <Component data={block.data as ImageData} />;
      case 'cards':  return <Component data={block.data as CardsData} />;
      case 'cta':    return <Component data={block.data as CtaData} />;
      case 'footer': return <Component data={block.data as FooterData} />;
      default: return null;
    }
  };
  
  // --- CORRECCIÓN: Lógica para decidir si envolver el bloque o no ---
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

  // Si el bloque NO es de ancho completo, lo envolvemos en un contenedor centrado.
  if (!blockConfig.isFullWidth) {
    return (
      <div className="max-w-5xl mx-auto px-4">
        {blockElement}
      </div>
    );
  }

  // Si es de ancho completo, lo devolvemos tal cual.
  return blockElement;
}