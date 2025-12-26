'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, Star, Heart } from 'lucide-react';

export interface CatalogData {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    showPrice?: boolean;
    showButton?: boolean;
    cardStyle?: 'simple' | 'border' | 'shadow';
    // En el futuro, esto vendrá de tu base de datos de productos
    products?: any[]; 
}

// Datos Mock para que el bloque no se vea vacío al inicio
const MOCK_PRODUCTS = [
    { id: 1, name: 'Nike Air Force', price: '$120.00', salePrice: '$99.00', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80', badge: '-20%' },
    { id: 2, name: 'Minimal Watch', price: '$85.00', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80', badge: 'NUEVO' },
    { id: 3, name: 'Sony Headphones', price: '$250.00', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Classic Sunglasses', price: '$45.00', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80' },
];

export const CatalogPremium = ({ data }: { data: CatalogData }) => {
    const {
        title = "Nuestros Favoritos",
        subtitle = "Selección exclusiva para ti.",
        columns = 4,
        showPrice = true,
        showButton = true,
        cardStyle = 'simple'
    } = data;

    // Clases dinámicas según configuración
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
    };

    const cardClasses = {
        simple: 'bg-transparent',
        border: 'border border-slate-200 bg-white',
        shadow: 'bg-white shadow-lg hover:shadow-xl'
    };

    return (
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
            
            {/* Header de Sección */}
            <div className="text-center mb-12 space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">{subtitle}</p>
            </div>

            {/* Grid de Productos */}
            <div className={cn("grid gap-6 md:gap-8", gridCols[columns])}>
                {MOCK_PRODUCTS.slice(0, columns === 2 ? 2 : 4).map((product) => (
                    <div 
                        key={product.id} 
                        className={cn("group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1", cardClasses[cardStyle])}
                    >
                        {/* Imagen + Badges */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Badges */}
                            {product.badge && (
                                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {product.badge}
                                </span>
                            )}

                            {/* Acciones flotantes (Wishlist) */}
                            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-red-500">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-slate-400">4.8</span>
                                    </div>
                                </div>
                                {showPrice && (
                                    <div className="text-right">
                                        {product.salePrice && <span className="text-xs text-slate-400 line-through block">{product.price}</span>}
                                        <span className="font-black text-slate-900 text-sm md:text-base">{product.salePrice || product.price}</span>
                                    </div>
                                )}
                            </div>

                            {/* Botón CTA */}
                            {showButton && (
                                <button className="w-full mt-3 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                    <ShoppingCart className="w-3.5 h-3.5" /> Agregar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
