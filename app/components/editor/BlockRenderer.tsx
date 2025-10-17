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
import { GalleryData } from './blocks/GalleryBlock';
import { CardsData } from './blocks/CardsBlock';
import { CtaData } from './blocks/CtaBlock';
import { PricingData } from './blocks/PricingBlock';
import { FooterData } from './blocks/FooterBlock';
import { BlockWrapper } from './blocks/BlockWrapper'; // Asegúrate que la importación esté

// --- INTERFAZ DE PROPS ACTUALIZADA ---
interface BlockRendererProps {
  block: Block;
  isEditing: boolean;
  isMobileEdit: boolean;
  isHighlighted?: boolean; // <-- PROP AÑADIDA
  onEdit?: () => void;
  onDelete: () => void;
  onClose: () => void;
  onUpdate: (key: string, value: unknown) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

// --- COMPONENTE ACTUALIZADO CON forwardRef ---
export const BlockRenderer = React.forwardRef<HTMLDivElement, BlockRendererProps>(({
    block,
    isEditing,
    isMobileEdit,
    isHighlighted, // <-- PROP RECIBIDA
    onEdit,
    onDelete,
    onClose,
    onUpdate,
    onMoveUp,
    onMoveDown
}, ref) => { // <-- REF RECIBIDA

  // La lógica interna de renderBlockContent permanece igual
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
      case 'gallery': {
        const Component = BLOCKS.gallery.renderer;
        return <Component data={block.data as GalleryData} isEditing={isEditing} onUpdate={onUpdate} />;
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
        // La importación dinámica requiere manejo especial si se usa, pero aquí parece directa
        return <Component data={block.data as import('./blocks/StackBlock').StackData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      case 'banner': {
        const Component = BLOCKS.banner.renderer;
        // La importación dinámica requiere manejo especial si se usa, pero aquí parece directa
        return <Component data={block.data as import('./blocks/BannerBlock').BannerData} isEditing={isEditing} onUpdate={onUpdate} />;
      }
      default:
        // Considera devolver null o un placeholder más discreto en producción
        return <div>Error: Bloque de tipo &apos;{block.type}&apos; no reconocido.</div>;
    }
  };

  // Pasa la ref y la prop isHighlighted al BlockWrapper
  return (
    <BlockWrapper
      ref={ref} // <-- PASAR LA REF
      isHighlighted={isHighlighted} // <-- PASAR LA PROP
      block={block}
      isEditing={isEditing}
      isMobileEdit={isMobileEdit}
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
});

BlockRenderer.displayName = 'BlockRenderer'; // Necesario para `forwardRef`