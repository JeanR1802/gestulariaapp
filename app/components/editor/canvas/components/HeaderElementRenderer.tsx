import React from 'react';
import { cn } from '@/lib/utils';
import { StackElement } from '@/app/components/editor/blocks/CustomStackElements';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HeaderElementRendererProps {
    element: StackElement;
    onRemove: (id: string) => void;
    onOpenProperties?: (id: string) => void;
    disableInteractions?: boolean;
}

export function HeaderElementRenderer({ element, onRemove, onOpenProperties, disableInteractions = false }: HeaderElementRendererProps) {
    // Minimal renderer for header elements — logo is plain text with no background or colored box

    return (
        <div
            className="relative group"
            data-header-el
            data-el-id={element.id}
            onClick={(e) => {
                // If interactions disabled (in insertion mode), do nothing here so clicks fall through to slot handler
                if (disableInteractions) {
                    e.stopPropagation();
                    return;
                }
                e.stopPropagation();
                if (onOpenProperties) onOpenProperties(element.id);
            }}
            role={disableInteractions ? undefined : 'button'}
            title={disableInteractions ? undefined : 'Abrir propiedades del elemento'}
            style={{ cursor: disableInteractions ? 'default' : 'pointer' }}
        >
            {/* Renderizado Real del Elemento */}
            {element.type === 'logo' && (
                // Plain text logo — editable via the element editor elsewhere
                <div className="text-base text-slate-900 select-none" style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}>
                    {element.data.imageUrl ? (
                        <img src={element.data.imageUrl} alt={element.data.alt || 'Logo'} className="h-8 w-auto object-contain" />
                    ) : (
                        element.data.content || 'Logo'
                    )}
                </div>
            )}
            
            {element.type === 'heading' && (
                <h2 className={cn("font-bold text-slate-900 whitespace-nowrap",
                    element.data.level === 'h2' ? 'text-xl' :
                        element.data.level === 'h3' ? 'text-lg' : 'text-base'
                )} style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}>
                    {element.data.content || 'Título'}
                </h2>
            )}
            
            {element.type === 'paragraph' && (
                <p className="text-sm text-slate-600 max-w-xs" style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}>
                    {element.data.content || 'Texto del párrafo'}
                </p>
            )}
            
            {element.type === 'image' && (
                <div className="relative" style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}>
                    {element.data.imageUrl ? (
                        <img src={element.data.imageUrl} alt={element.data.alt} className="h-10 w-auto object-cover rounded" />
                    ) : (
                        <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center text-xs">Img</div>
                    )}
                </div>
            )}
            
            {element.type === 'link' && (
                <a
                    href={element.data.href || '#'}
                    className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-slate-50"
                    onClick={(e) => e.preventDefault()}
                    style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}
                >
                    {element.data.content || 'Enlace'}
                </a>
            )}
            
            {element.type === 'button' && (
                <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow" style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}>
                    {element.data.buttonText || 'Botón'}
                </button>
            )}
            
            {element.type === 'actions' && (
                <div className="flex gap-1 items-center" style={{ pointerEvents: disableInteractions ? 'none' : 'auto' }}>
                    <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>
            )}
            
            {element.type === 'spacer' && (
                // Horizontal spacer: use width (px) from element.data; fallback to height or 1
                <div style={{ width: `${(element.data as any).width ?? (element.data as any).height ?? 1}px`, height: '100%', minHeight: 1 }} />
            )}

            {/* Overlay de edición: solo mostrar si interacciones permitidas */}
            {!disableInteractions && element.type !== 'slot' && (
                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(element.id);
                        }}
                        className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-sm"
                    >
                        <XMarkIcon className="w-3 h-3" />
                    </button>
                </div>
            )}

        </div>
    );
}
