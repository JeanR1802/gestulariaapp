import React from 'react';
// 1. Importa todos los componentes y tipos de datos de cada bloque
import { HeaderBlock, HeaderEditor, HeaderData } from './HeaderBlock';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';

// 2. Re-exporta los tipos de datos
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };

// 3. Une todos los tipos de datos en uno solo
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// 4. Define y exporta el registro oficial de bloques (versión simple y estable)
export const BLOCKS = {
  header: {
    name: 'Encabezado',
    icon: '🔝',
    description: 'Barra de navegación principal.',
    renderer: HeaderBlock,
    editor: HeaderEditor,
    defaultData: { logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData,
    isFullWidth: true
  },
  hero: {
    name: 'Héroe',
    icon: '🎯',
    description: 'Sección principal llamativa.',
    renderer: HeroBlock,
    editor: HeroEditor,
    defaultData: { title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData,
    isFullWidth: false
  },
  text: {
    name: 'Texto',
    icon: '📝',
    description: 'Párrafo de texto simple.',
    renderer: TextBlock,
    editor: TextEditor,
    defaultData: { content: 'Escribe aquí tu contenido.' } as TextData,
    isFullWidth: false
  },
  image: {
    name: 'Imagen',
    icon: '🖼️',
    description: 'Una sola imagen con pie de foto.',
    renderer: ImageBlock,
    editor: ImageEditor,
    defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción', caption: 'Pie de foto.' } as ImageData,
    isFullWidth: false
  },
  cards: {
    name: 'Tarjetas',
    icon: '🎴',
    description: 'Grupo de 3 tarjetas de servicio.',
    renderer: CardsBlock,
    editor: CardsEditor,
    defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] } as CardsData,
    isFullWidth: false
  },
  cta: {
    name: 'Llamada a la Acción',
    icon: '📢',
    description: 'Invita a los usuarios a actuar.',
    renderer: CtaBlock,
    editor: CtaEditor,
    defaultData: { title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData,
    isFullWidth: false
  },
  footer: {
    name: 'Pie de Página',
    icon: '🦶',
    description: 'Sección final con copyright y enlaces.',
    renderer: FooterBlock,
    editor: FooterEditor,
    defaultData: { copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] } as FooterData,
    isFullWidth: true
  },
};

export type BlockType = keyof typeof BLOCKS;