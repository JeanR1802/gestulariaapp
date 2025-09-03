import { HeaderBlock, HeaderEditor } from './HeaderBlock';
// Importa los otros bloques aquí...
// import { HeroBlock, HeroEditor } from './HeroBlock';
// import { TextBlock, TextEditor } from './TextBlock';

export const BLOCKS = {
  header: {
    name: 'Encabezado',
    icon: '🔝',
    description: 'Barra de navegación principal.',
    renderer: HeaderBlock,
    editor: HeaderEditor,
    defaultData: {
      logoText: 'Mi Negocio',
      link1: 'Inicio',
      link2: 'Servicios',
      link3: 'Contacto',
    }
  },
  // Define los otros bloques aquí de la misma manera...
  // hero: { ... },
  // text: { ... },
};

export type BlockType = keyof typeof BLOCKS;