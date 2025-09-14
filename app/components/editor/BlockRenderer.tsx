'use client';
import React from 'react';
import { BLOCKS, Block } from './blocks';
import { HeaderData } from './blocks/HeaderBlock';
import { HeroData } from './blocks/HeroBlock';
import { FeaturedProductData } from './blocks/FeaturedProductBlock';
import { CatalogData } from './blocks/CatalogBlock';
import { TeamData } from './blocks/TeamBlock';
import { TestimonialData } from './blocks/TestimonialBlock';
import { FaqData } from './blocks/FaqBlock';
import { TextData } from './blocks/TextBlock';
import { ImageData } from './blocks/ImageBlock';
import { CardsData } from './blocks/CardsBlock';
import { CtaData } from './blocks/CtaBlock';
import { PricingData } from './blocks/PricingBlock';
import { FooterData } from './blocks/FooterBlock';
import { BlockWrapper } from './blocks/BlockWrapper';



interface BlockRendererProps { 
  block: Block; 
  isEditing: boolean; 
  onEdit: () => void;
  onDelete: () => void; 
  onClose: () => void;
  onUpdate: (key: string, value: unknown) => void;
  onMoveUp?: () => void; 
  onMoveDown?: () => void;
}

export function BlockRenderer({ 
    block, 
    isEditing, 
    onEdit, 
    onDelete, 
    onClose,
    onUpdate,
    onMoveUp, 
    onMoveDown 
}: BlockRendererProps) {
  
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header': {
        const Component = BLOCKS.header.renderer;
        return <Component data={block.data as HeaderData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'hero': {
        const Component = BLOCKS.hero.renderer;
        return <Component data={block.data as HeroData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'featuredProduct': {
        const Component = BLOCKS.featuredProduct.renderer;
        return <Component data={block.data as FeaturedProductData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'catalog': {
        const Component = BLOCKS.catalog.renderer;
        return <Component data={block.data as CatalogData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'team': {
        const Component = BLOCKS.team.renderer;
        return <Component data={block.data as TeamData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'testimonial': {
        const Component = BLOCKS.testimonial.renderer;
        return <Component data={block.data as TestimonialData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'faq': {
        const Component = BLOCKS.faq.renderer;
        return <Component data={block.data as FaqData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'text': {
        const Component = BLOCKS.text.renderer;
        return <Component data={block.data as TextData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'image': {
        const Component = BLOCKS.image.renderer;
        return <Component data={block.data as ImageData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'cards': {
        const Component = BLOCKS.cards.renderer;
        return <Component data={block.data as CardsData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'cta': {
        const Component = BLOCKS.cta.renderer;
        return <Component data={block.data as CtaData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'pricing': {
        const Component = BLOCKS.pricing.renderer;
        return <Component data={block.data as PricingData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'footer': {
        const Component = BLOCKS.footer.renderer;
        return <Component data={block.data as FooterData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'stack': {
        const Component = BLOCKS.stack.renderer;
        return <Component data={block.data as import('./blocks/StackBlock').StackData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      default:
        return <div>Error: Bloque de tipo &apos;{block.type}&apos; no reconocido.</div>;
    }
  };

  return (
    <BlockWrapper 
      block={block}
      isEditing={isEditing} 
      onEdit={onEdit} 
      onClose={onClose}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {renderBlockContent()}
    </BlockWrapper>
  );
}