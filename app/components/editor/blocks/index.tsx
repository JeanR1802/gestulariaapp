// Archivo: app/components/editor/blocks/index.tsx (VERSIÓN SIMPLIFICADA)
import React from 'react';

// Importaciones
import { HeaderBlock, HeaderEditor, HeaderData } from './HeaderBlock';
import { HeaderVariantDefault, HeaderVariantCentered } from './Header/HeaderPreviews';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
// ... (asegúrate de que todas tus importaciones de bloques estén aquí)
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';

// Re-exporta los tipos de datos
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// Define el registro de bloques
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
        preview: HeaderVariantDefault, // Directamente el componente
        defaultData: { logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData,
      },
      {
        name: 'Centrado',
        description: 'Logo y enlaces centrados.',
        preview: HeaderVariantCentered, // Directamente el componente
        defaultData: { logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData,
      }
    ]
  },
  // Para los demás, puedes crear componentes de previsualización similares o
  // temporalmente usar el componente real si se ve aceptable.
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
        preview: HeroBlock, 
        defaultData: { title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData,
      }
    ]
  },
  // ... (repite la estructura para el resto de tus bloques)
  text: {
    name: 'Texto', icon: '📝', description: 'Párrafo de texto simple.', renderer: TextBlock, editor: TextEditor, variants: [{ name: 'Párrafo', description: 'Un bloque de texto simple.', preview: TextBlock, defaultData: { content: 'Escribe aquí tu contenido.' } as TextData, }]
  },
  image: {
    name: 'Imagen', icon: '🖼️', description: 'Una sola imagen con pie de foto.', renderer: ImageBlock, editor: ImageEditor, variants: [{ name: 'Imagen Simple', description: 'Una imagen con pie de foto opcional.', preview: ImageBlock, defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción', caption: 'Pie de foto.' } as ImageData, }]
  },
  cards: {
    name: 'Tarjetas', icon: '🎴', description: 'Grupo de 3 tarjetas de servicio.', renderer: CardsBlock, editor: CardsEditor, variants: [{ name: 'Tres Columnas', description: 'Muestra características o servicios.', preview: CardsBlock, defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] } as CardsData, }]
  },
  cta: {
    name: 'Llamada a la Acción', icon: '📢', description: 'Invita a los usuarios a actuar.', renderer: CtaBlock, editor: CtaEditor, variants: [{ name: 'Banner Oscuro', description: 'Un banner con fondo oscuro para resaltar.', preview: CtaBlock, defaultData: { title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData, }]
  },
  footer: {
    name: 'Pie de Página', icon: '🦶', description: 'Sección final con copyright y enlaces.', renderer: FooterBlock, editor: FooterEditor, variants: [{ name: 'Simple', description: 'Copyright y redes sociales.', preview: FooterBlock, defaultData: { copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] } as FooterData, }]
  },
};

export type BlockType = keyof typeof BLOCKS;