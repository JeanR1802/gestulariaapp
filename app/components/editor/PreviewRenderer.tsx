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

interface PreviewRendererProps { 
  block: Block; 
}

export function PreviewRenderer({ block }: PreviewRendererProps) {
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header': {
        const Component = BLOCKS.header.component;
        return <Component data={block.data as HeaderData} isEditing={false} />;
      }
      case 'hero': {
        const Component = BLOCKS.hero.component;
        return <Component data={block.data as HeroData} isEditing={false} />;
      }
      case 'featuredProduct': {
        const Component = BLOCKS.featuredProduct.component;
        return <Component data={block.data as FeaturedProductData} isEditing={false} />;
      }
      case 'catalog': {
        const Component = BLOCKS.catalog.component;
        return <Component data={block.data as CatalogData} isEditing={false} />;
      }
      case 'team': {
        const Component = BLOCKS.team.component;
        return <Component data={block.data as TeamData} isEditing={false} />;
      }
      case 'testimonial': {
        const Component = BLOCKS.testimonial.component;
        return <Component data={block.data as TestimonialData} isEditing={false} />;
      }
      case 'faq': {
        const Component = BLOCKS.faq.component;
        return <Component data={block.data as FaqData} isEditing={false} />;
      }
      case 'text': {
        const Component = BLOCKS.text.component;
        return <Component data={block.data as TextData} isEditing={false} />;
      }
      case 'image': {
        const Component = BLOCKS.image.component;
        return <Component data={block.data as ImageData} isEditing={false} />;
      }
      case 'gallery': {
        const Component = BLOCKS.gallery.component;
        return <Component data={block.data as GalleryData} isEditing={false} />;
      }
      case 'cards': {
        const Component = BLOCKS.cards.component;
        return <Component data={block.data as CardsData} isEditing={false} />;
      }
      case 'cta': {
        const Component = BLOCKS.cta.component;
        return <Component data={block.data as CtaData} isEditing={false} />;
      }
      case 'pricing': {
        const Component = BLOCKS.pricing.component;
        return <Component data={block.data as PricingData} isEditing={false} />;
      }
      case 'footer': {
        const Component = BLOCKS.footer.component;
        return <Component data={block.data as FooterData} isEditing={false} />;
      }
      case 'stack': {
        const Component = BLOCKS.stack.component;
        return <Component data={block.data as import('./blocks/StackBlock').StackData} isEditing={false} />;
      }
      case 'banner': {
        const Component = BLOCKS.banner.component;
        return <Component data={block.data as import('./blocks/BannerBlock').BannerData} isEditing={false} />;
      }
      default:
        return <div>Error: Bloque de tipo &apos;{block.type}&apos; no reconocido.</div>;
    }
  };

  return renderBlockContent();
}