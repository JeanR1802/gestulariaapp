import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';

/**
 * Devuelve los datos por defecto para cada tipo de elemento
 */
export function getDefaultDataForType(type: StackElementType): StackElement['data'] {
    switch (type) {
        case 'heading':
            return { content: 'Nuevo Título', level: 'h2' };
        case 'paragraph':
            return { content: 'Nuevo párrafo de texto.' };
        case 'image':
            return { imageUrl: '', alt: 'Imagen' };
        case 'button':
            return { buttonText: 'Botón', buttonLink: '#' };
        case 'spacer':
            return { height: 20 };
        case 'logo':
            return { content: 'Logo' };
        case 'link':
            return { content: 'Enlace', href: '#' };
        case 'actions':
            return { platform: 'facebook', href: '#' };
        case 'slot':
            return {
                isEmpty: true,
                slotType: 'generic',
                placeholder: 'Slot personalizado',
                acceptedTypes: ['heading', 'paragraph', 'button', 'image', 'link', 'logo', 'actions']
            };
        default:
            return {};
    }
}

/**
 * Genera un ID único para un elemento
 */
export function generateElementId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Tipos de elementos disponibles
 */
export const ELEMENT_TYPES: { type: StackElementType; label: string; icon: string; desc: string }[] = [
    { type: 'heading', label: 'Título', icon: '📝', desc: 'Encabezado de sección' },
    { type: 'paragraph', label: 'Párrafo', icon: '📄', desc: 'Texto normal' },
    { type: 'image', label: 'Imagen', icon: '🖼️', desc: 'Foto o gráfico' },
    { type: 'button', label: 'Botón', icon: '🔘', desc: 'Botón de llamada a la acción' },
    { type: 'spacer', label: 'Espaciador', icon: '⬜', desc: 'Espacio vertical vacío' },
    { type: 'logo', label: 'Logo', icon: '🏷️', desc: 'Logotipo de la marca' },
    { type: 'link', label: 'Enlace', icon: '🔗', desc: 'Enlace de navegación' },
    { type: 'actions', label: 'Acción', icon: '⚡', desc: 'Iconos de acción (carrito, búsqueda)' },
];
