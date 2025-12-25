import { Block } from "@/app/components/editor/blocks";

export const TEMPLATE_CATEGORIES = ['Todos', 'Moda', 'Comida', 'Tech', 'Servicios', 'Portafolio'];

export const PREDEFINED_TEMPLATES: Record<string, { name: string; type: string; category: string; blocks: Block[] }> = {
    fashion_minimal: {
        name: 'Moda Minimal',
        type: 'fashion',
        category: 'Moda',
        blocks: [
            { id: 1, type: 'header', data: { title: 'MODA', align: 'center' } as any },
            { id: 2, type: 'hero', data: { title: 'Nueva Colección', subtitle: 'Elegancia pura.', align: 'center', height: 'large' } as any },
            { id: 3, type: 'gallery', data: { title: 'Lookbook 2025' } as any },
            { id: 4, type: 'footer', data: { text: '© 2025 Moda Inc.' } as any }
        ]
    },
    food_burger: {
        name: 'Burger House',
        type: 'food',
        category: 'Comida',
        blocks: [
            { id: 1, type: 'header', data: { title: 'Burger House', align: 'left' } as any },
            { id: 2, type: 'hero', data: { title: 'Hamburguesas Reales', subtitle: '100% Carne Angus.', align: 'left' } as any },
            { id: 3, type: 'featuredProduct', data: { productName: 'La Bestia', price: '$12.99' } as any },
            { id: 4, type: 'footer', data: { text: 'Delivery 24/7' } as any }
        ]
    },
    tech_saas: {
        name: 'SaaS Startup',
        type: 'tech',
        category: 'Tech',
        blocks: [
            { id: 1, type: 'header', data: { title: 'SoftCorp', align: 'right' } as any },
            { id: 2, type: 'hero', data: { title: 'Automatiza todo', subtitle: 'IA para tu negocio.', align: 'center' } as any },
            { id: 3, type: 'pricing', data: { title: 'Precios' } as any },
            { id: 4, type: 'footer', data: { text: 'Contacto' } as any }
        ]
    }
    // Aquí puedes agregar 20 o 50 más sin ensuciar el editor
};