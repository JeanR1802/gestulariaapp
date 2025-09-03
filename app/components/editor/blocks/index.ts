import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';
// Re-exportar los tipos de datos para que estén disponibles en un solo lugar
export type { HeroData, TextData, ImageData, CardsData, CtaData, FooterData };

// Unir todos los tipos de datos en uno solo
export type BlockData = HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// Define todos los bloques disponibles en tu aplicación
export const BLOCKS = {
  hero: {
    name: 'Héroe',
    icon: '🎯',
    description: 'Sección principal llamativa.',
    renderer: HeroBlock,
    editor: HeroEditor,
    defaultData: { title: 'Tu Título Principal Aquí', subtitle: 'Un subtítulo atractivo que describa tu negocio.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData
  },
    // --- 2. Registra el nuevo bloque en la lista ---
  cta: {
    name: 'Llamada a la Acción',
    icon: '📢',
    description: 'Invita a los usuarios a actuar.',
    renderer: CtaBlock,
    editor: CtaEditor,
    defaultData: { 
      title: '¿Listo para empezar?', 
      subtitle: 'Únete a miles de clientes satisfechos y lleva tu negocio al siguiente nivel.', 
      buttonText: 'Contactar Ahora',
      backgroundColor: 'bg-slate-800' 
    } as CtaData
  },
  text: {
    name: 'Texto',
    icon: '📝',
    description: 'Párrafo de texto simple.',
    renderer: TextBlock,
    editor: TextEditor,
    defaultData: { content: 'Escribe aquí el contenido de tu párrafo.' } as TextData
  },
  image: {
    name: 'Imagen',
    icon: '🖼️',
    description: 'Una sola imagen con pie de foto.',
    renderer: ImageBlock,
    editor: ImageEditor,
    defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Un pie de foto opcional.' } as ImageData
  },
  cards: {
    name: 'Tarjetas',
    icon: '🎴',
    description: 'Grupo de 3 tarjetas de servicio.',
    renderer: CardsBlock,
    editor: CardsEditor,
    defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve del primer servicio.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve del segundo servicio.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve del tercer servicio.' } ] } as CardsData
  },
  footer: {
    name: 'Pie de Página',
    icon: '🦶',
    description: 'Sección final con copyright y enlaces.',
    renderer: FooterBlock,
    editor: FooterEditor,
    defaultData: { 
      copyrightText: `© ${new Date().getFullYear()} Mi Negocio. Todos los derechos reservados.`,
      socialLinks: [
        { platform: 'Twitter', url: '' },
        { platform: 'Instagram', url: '' },
        { platform: 'LinkedIn', url: '' },
      ]
    } as FooterData
  },
};

export type BlockType = keyof typeof BLOCKS;