// Archivo: app/components/editor/blocks/index.tsx (VERSIÓN CORREGIDA Y COMPLETA)
import React from 'react';

// Importaciones de componentes principales
import { HeaderBlock, HeaderEditor, HeaderData } from './HeaderBlock';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';

// Importaciones de las nuevas previsualizaciones
// CORRECCIÓN: Se añade la importación que faltaba aquí
import { HeaderVariantDefault, HeaderVariantCentered, HeaderVariantButtonPreview } from './Header/HeaderPreviews';
import { HeroPreviewDefault, HeroPreviewLeftImage, HeroPreviewDarkMinimal } from './Hero/HeroPreviews';
import { TextPreviewDefault, TextPreviewQuote, TextPreviewHighlighted } from './Text/TextPreviews';
import { ImagePreview } from './Image/ImagePreviews';
import { CardsPreview } from './Cards/CardsPreviews';
import { CtaPreview } from './Cta/CtaPreviews';
import { FooterPreview } from './Footer/FooterPreviews';

// Re-exporta los tipos de datos
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// Define el registro de bloques completo
export const BLOCKS = {
  header: {
    name: 'Encabezado', icon: '🔝', description: 'Barra de navegación principal.', renderer: HeaderBlock, editor: HeaderEditor,
    variants: [
      { 
        name: 'Clásico', 
        description: 'Logo a la izquierda, enlaces a la derecha.', 
        preview: HeaderVariantDefault, 
        defaultData: { variant: 'default', logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData 
      },
      { 
        name: 'Centrado', 
        description: 'Logo y enlaces centrados.', 
        preview: HeaderVariantCentered, 
        defaultData: { variant: 'centered', logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData 
      },
      { 
        name: 'Con Botón CTA', 
        description: 'Ideal para dirigir a una acción principal.', 
        preview: HeaderVariantButtonPreview, 
        defaultData: { variant: 'withButton', logoText: 'Mi Negocio', link1: 'Producto', link2: 'Precios', link3: '', buttonText: 'Registrarse' } as HeaderData
      }
    ]
  },
  hero: {
    name: 'Héroe', icon: '🎯', description: 'Sección principal llamativa.', renderer: HeroBlock, editor: HeroEditor,
    variants: [
      { 
        name: 'Centrado Clásico', 
        description: 'Ideal para mensajes directos.', 
        preview: HeroPreviewDefault, 
        defaultData: { variant: 'default', title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo que describe tu propuesta de valor.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData 
      },
      {
        name: 'Izquierda con Imagen',
        description: 'Combina texto con un elemento visual.',
        preview: HeroPreviewLeftImage,
        defaultData: { variant: 'leftImage', title: 'Describe tu Producto', subtitle: 'Atrae a tus clientes con una descripción clara y una imagen de apoyo.', buttonText: 'Ver Más', backgroundColor: 'bg-white', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tu+Imagen' } as HeroData
      },
      {
        name: 'Mínimo Oscuro',
        description: 'Un diseño elegante y moderno.',
        preview: HeroPreviewDarkMinimal,
        defaultData: { variant: 'darkMinimal', title: 'Un Mensaje Impactante', subtitle: '', buttonText: 'Descubrir', backgroundColor: 'bg-slate-900' } as HeroData
      }
    ]
  },
  text: {
    name: 'Texto', icon: '📝', description: 'Párrafo de texto simple.', renderer: TextBlock, editor: TextEditor,
    variants: [
      { 
        name: 'Párrafo Estándar', 
        description: 'Un bloque de texto simple y legible.', 
        preview: TextPreviewDefault, 
        defaultData: { variant: 'default', content: 'Escribe aquí tu contenido. Este es el estilo de párrafo estándar.' } as TextData 
      },
      {
        name: 'Cita Destacada',
        description: 'Ideal para resaltar testimonios o frases.',
        preview: TextPreviewQuote,
        defaultData: { variant: 'quote', content: 'Esta es una cita para resaltar una idea importante.' } as TextData
      },
      {
        name: 'Texto Resaltado',
        description: 'Un párrafo con fondo para llamar la atención.',
        preview: TextPreviewHighlighted,
        defaultData: { variant: 'highlighted', content: 'Usa este bloque para notas importantes o advertencias.' } as TextData
      }
    ]
  },
  image: {
    name: 'Imagen', icon: '🖼️', description: 'Una sola imagen con pie de foto.', renderer: ImageBlock, editor: ImageEditor,
    variants: [
      { name: 'Imagen Simple', description: 'Una imagen con pie de foto opcional.', preview: ImagePreview, defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción', caption: 'Pie de foto.' } as ImageData }
    ]
  },
  cards: {
    name: 'Tarjetas', icon: '🎴', description: 'Grupo de 3 tarjetas de servicio.', renderer: CardsBlock, editor: CardsEditor,
    variants: [
      { name: 'Tres Columnas', description: 'Muestra características o servicios.', preview: CardsPreview, defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] } as CardsData }
    ]
  },
  cta: {
    name: 'Llamada a la Acción', icon: '📢', description: 'Invita a los usuarios a actuar.', renderer: CtaBlock, editor: CtaEditor,
    variants: [
      { name: 'Banner Oscuro', description: 'Un banner con fondo oscuro para resaltar.', preview: CtaPreview, defaultData: { title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData }
    ]
  },
  footer: {
    name: 'Pie de Página', icon: '🦶', description: 'Sección final con copyright y enlaces.', renderer: FooterBlock, editor: FooterEditor,
    variants: [
      { name: 'Simple', description: 'Copyright y redes sociales.', preview: FooterPreview, defaultData: { copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] } as FooterData }
    ]
  },
};

export type BlockType = keyof typeof BLOCKS;