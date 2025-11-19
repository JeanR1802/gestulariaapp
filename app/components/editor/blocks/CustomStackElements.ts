// app/components/editor/blocks/CustomStackElements.ts
// Tipos genéricos para la composición interna de bloques avanzados (Header, Footer, Stack, etc.)

export type StackElementType = 'heading' | 'paragraph' | 'image' | 'button' | 'spacer' | 'logo' | 'link' | 'actions' | 'slot';

export interface StackElement {
  id: string;
  type: StackElementType;
  data: {
    // Propiedades generales
    content?: string;
    level?: 'h2' | 'h3' | 'h4';
    imageUrl?: string;
    alt?: string;
    buttonText?: string;
    buttonLink?: string;
    height?: number; // en píxeles para el espaciador
    
    // Propiedades específicas de Header (usadas para tipar los sub-elementos)
    href?: string;
    platform?: string; // Para links o acciones sociales
    
    // Propiedades específicas de slots
    slotType?: string;
    isEmpty?: boolean;
    placeholder?: string;
    acceptedTypes?: StackElementType[]; // Array de tipos que acepta el slot
  };
}
