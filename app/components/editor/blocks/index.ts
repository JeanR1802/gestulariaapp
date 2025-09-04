// --- 1. Importa los componentes y tipos de cada bloque ---
import { HeaderEditor, HeaderData } from './HeaderBlock';
import { HeaderVariantDefault } from './Header/HeaderVariantDefault';
import { HeaderVariantCentered } from './Header/HeaderVariantCentered';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';

// --- 2. Re-exporta los tipos de datos para que estén disponibles en un solo lugar ---
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };

// --- 3. Une todos los tipos de datos en un solo tipo "BlockData" ---
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// --- 4. Define y exporta el registro oficial de bloques ---
export const BLOCKS = {
  header: {
    name: 'Encabezado',
    icon: '🔝',
    description: 'Barra de navegación principal.',
    editor: HeaderEditor,
    defaultData: { 
      logoText: 'Mi Negocio', 
      link1: 'Inicio', 
      link2: 'Servicios', 
      link3: 'Contacto',
      variant: 'default' // Variante por defecto
    } as HeaderData & { variant: string },
    isFullWidth: true, // Este bloque ocupa todo el ancho
    variants: { // Contiene los diferentes diseños
      default: {
        name: 'Clásico',
        renderer: HeaderVariantDefault,
      },
      centered: {
        name: 'Centrado',
        renderer: HeaderVariantCentered,
      }
    }
  },
  hero: {
    name: 'Héroe',
    icon: '🎯',
    description: 'Sección principal llamativa.',
    renderer: HeroBlock, // Este bloque no tiene variantes, así que el renderer va aquí
    editor: HeroEditor,
    defaultData: { title: 'Tu Título Principal Aquí', subtitle: 'Un subtítulo atractivo que describa tu negocio.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData,
    isFullWidth: false // Este bloque es de contenido (centrado)
  },
  text: {
    name: 'Texto',
    icon: '📝',
    description: 'Párrafo de texto simple.',
    renderer: TextBlock,
    editor: TextEditor,
    defaultData: { content: 'Escribe aquí el contenido de tu párrafo.' } as TextData,
    isFullWidth: false
  },
  image: {
    name: 'Imagen',
    icon: '🖼️',
    description: 'Una sola imagen con pie de foto.',
    renderer: ImageBlock,
    editor: ImageEditor,
    defaultData: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Un pie de foto opcional.' } as ImageData,
    isFullWidth: false
  },
  cards: {
    name: 'Tarjetas',
    icon: '🎴',
    description: 'Grupo de 3 tarjetas de servicio.',
    renderer: CardsBlock,
    editor: CardsEditor,
    defaultData: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve del primer servicio.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve del segundo servicio.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve del tercer servicio.' } ] } as CardsData,
    isFullWidth: false
  },
  cta: {
    name: 'Llamada a la Acción',
    icon: '📢',
    description: 'Invita a los usuarios a actuar.',
    renderer: CtaBlock,
    editor: CtaEditor,
    defaultData: { title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos y lleva tu negocio al siguiente nivel.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData,
    isFullWidth: false
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
    } as FooterData,
    isFullWidth: true
  },
};

// --- 5. Exporta el tipo que representa los nombres de los bloques ---
export type BlockType = keyof typeof BLOCKS;