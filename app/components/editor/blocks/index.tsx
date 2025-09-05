// Archivo: app/components/editor/blocks/index.tsx (VERSIÓN FINAL DEFINITIVA)
import React from 'react';

// 1. Importa TODOS los componentes
import { HeaderBlock, HeaderEditor, HeaderData } from './HeaderBlock';
import { HeaderVariantDefault, HeaderVariantCentered } from './Header/HeaderPreviews';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';
import { BlockPreviewWrapper } from '@/app/components/editor/BlockPreviewWrapper';

// 2. Re-exporta los tipos de datos
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };

// 3. Une todos los tipos de datos en uno solo
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// Definimos un tipo estricto para las props de los componentes de bloque
interface BlockComponentProps {
  data: BlockData;
}

// Función auxiliar para envolver los componentes de previsualización
// CORRECCIÓN FINALÍSIMA: Se elimina el 'any' de forma segura.
function wrapPreview<T extends { data: BlockData }>(Component: React.ComponentType<T>) {
  const WrappedComponent: React.FC<T> = (props) => (
    <BlockPreviewWrapper>
      <Component {...props} />
    </BlockPreviewWrapper>
  );
  const componentName = ('displayName' in Component && typeof Component.displayName === 'string' ? Component.displayName : Component.name) || 'Block';
  WrappedComponent.displayName = `Wrapped${componentName}`;
  return WrappedComponent;
};


// 4. Define el registro de bloques con previsualizaciones envueltas
export const BLOCKS = {
  header: {
    name: 'Encabezado',
    icon: '🔝',
    description: 'Barra de navegación principal.',
    renderer: HeaderBlock,
    editor: HeaderEditor,
    variants: [
      {
        name: 'Clásico',
        description: 'Logo a la izquierda, enlaces a la derecha.',
        preview: wrapPreview(HeaderVariantDefault),
        defaultData: { logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData,
      },
      {
        name: 'Centrado',
        description: 'Logo y enlaces centrados.',
        preview: wrapPreview(HeaderVariantCentered),
        defaultData: { logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData,
      }
    ]
  },
  hero: {
    name: 'Héroe',
    icon: '🎯',
    description: 'Sección principal llamativa.',
    renderer: HeroBlock,
    editor: HeroEditor,
    variants: [
      {
        name: 'Por Defecto',
        description: 'Un héroe estándar y efectivo.',
        preview: wrapPreview(HeroBlock),
        defaultData: { title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData,
      }
    ]
  },
  text: {
    name: 'Texto',
    icon: '📝',
    description: 'Párrafo de texto simple.',
    renderer: TextBlock,
    editor: TextEditor,
    variants: [
        {
            name: 'Párrafo',
            description: 'Un bloque de texto simple.',
            preview: wrapPreview(TextBlock),
            defaultData: { content: 'Escribe aquí tu contenido.' } as TextData,
        }
    ]
  },
  image: {
    name: 'Imagen',
    icon: '🖼️',
    description: 'Una sola imagen con pie de foto.',
    renderer: ImageBlock,
    editor: ImageEditor,
    variants: [
        {
            name: 'Imagen Simple',
            description: 'Una imagen con pie de foto opcional.',
            preview: wrapPreview(ImageBlock),
            defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción', caption: 'Pie de foto.' } as ImageData,
        }
    ]
  },
  cards: {
    name: 'Tarjetas',
    icon: '🎴',
    description: 'Grupo de 3 tarjetas de servicio.',
    renderer: CardsBlock,
    editor: CardsEditor,
    variants: [
        {
            name: 'Tres Columnas',
            description: 'Muestra características o servicios.',
            preview: wrapPreview(CardsBlock),
            defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] } as CardsData,
        }
    ]
  },
  cta: {
    name: 'Llamada a la Acción',
    icon: '📢',
    description: 'Invita a los usuarios a actuar.',
    renderer: CtaBlock,
    editor: CtaEditor,
    variants: [
        {
            name: 'Banner Oscuro',
            description: 'Un banner con fondo oscuro para resaltar.',
            preview: wrapPreview(CtaBlock),
            defaultData: { title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData,
        }
    ]
  },
  footer: {
    name: 'Pie de Página',
    icon: '🦶',
    description: 'Sección final con copyright y enlaces.',
    renderer: FooterBlock,
    editor: FooterEditor,
    variants: [
        {
            name: 'Simple',
            description: 'Copyright y redes sociales.',
            preview: wrapPreview(FooterBlock),
            defaultData: { copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] } as FooterData,
        }
    ]
  },
};

export type BlockType = keyof typeof BLOCKS;