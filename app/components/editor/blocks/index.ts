import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';

// Re-exportar los tipos de datos para que estén disponibles en un solo lugar
export type { HeroData, TextData, ImageData, CardsData };

// Unir todos los tipos de datos en uno solo
export type BlockData = HeroData | TextData | ImageData | CardsData;

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
};

export type BlockType = keyof typeof BLOCKS;