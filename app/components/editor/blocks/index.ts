import React from 'react';
// --- Importa los componentes y tipos de cada bloque ---
import { HeaderEditor, HeaderData } from './HeaderBlock';
import { HeaderVariantDefault } from './Header/HeaderVariantDefault';
import { HeaderVariantCentered } from './Header/HeaderVariantCentered';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';

// --- Re-exporta los tipos de datos para que estén disponibles en un solo lugar ---
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };

// --- Une todos los tipos de datos en uno solo ---
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// --- CORRECCIÓN DEFINITIVA: Se define un tipo más flexible y correcto para la configuración ---
type BlockConfig = {
  name: string;
  icon: string;
  description: string;
  isFullWidth: boolean;
  // Se usa 'any' aquí a propósito para decirle a TypeScript:
  // "Confía en mí, sé que el componente que estoy pasando es el correcto para los datos".
  // La validación real ocurre en los componentes 'BlockRenderer' y 'EditPanel'.
  editor: React.ComponentType<any>;
  renderer?: React.ComponentType<any>;
  variants?: {
    [key: string]: {
      name: string;
      renderer: React.ComponentType<any>;
    }
  };
  defaultData: BlockData & { variant?: string };
};

// --- Define y exporta el registro oficial de bloques ---
export const BLOCKS: { [key: string]: BlockConfig } = {
  header: {
    name: 'Encabezado',
    icon: '🔝',
    description: 'Barra de navegación principal.',
    editor: HeaderEditor,
    defaultData: { logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto', variant: 'default' },
    isFullWidth: true,
    variants: {
      default: { name: 'Clásico', renderer: HeaderVariantDefault },
      centered: { name: 'Centrado', renderer: HeaderVariantCentered }
    }
  },
  hero: {
    name: 'Héroe',
    icon: '🎯',
    description: 'Sección principal llamativa.',
    renderer: HeroBlock,
    editor: HeroEditor,
    defaultData: { title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' },
    isFullWidth: false
  },
  text: {
    name: 'Texto',
    icon: '📝',
    description: 'Párrafo de texto simple.',
    renderer: TextBlock,
    editor: TextEditor,
    defaultData: { content: 'Escribe aquí tu contenido.' },
    isFullWidth: false
  },
  image: {
    name: 'Imagen',
    icon: '🖼️',
    description: 'Una sola imagen con pie de foto.',
    renderer: ImageBlock,
    editor: ImageEditor,
    defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción', caption: 'Pie de foto.' },
    isFullWidth: false
  },
  cards: {
    name: 'Tarjetas',
    icon: '🎴',
    description: 'Grupo de 3 tarjetas de servicio.',
    renderer: CardsBlock,
    editor: CardsEditor,
    defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] },
    isFullWidth: false
  },
  cta: {
    name: 'Llamada a la Acción',
    icon: '📢',
    description: 'Invita a los usuarios a actuar.',
    renderer: CtaBlock,
    editor: CtaEditor,
    defaultData: { title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' },
    isFullWidth: false
  },
  footer: {
    name: 'Pie de Página',
    icon: '🦶',
    description: 'Sección final con copyright y enlaces.',
    renderer: FooterBlock,
    editor: FooterEditor,
    defaultData: { copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] },
    isFullWidth: true
  },
};

export type BlockType = keyof typeof BLOCKS;