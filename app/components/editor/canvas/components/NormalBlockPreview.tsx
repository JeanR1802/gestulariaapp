import React from 'react';
import { cn } from '@/lib/utils';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { PlusIcon } from '@heroicons/react/24/outline';

interface NormalBlockPreviewProps {
    customElements: StackElement[];
    insertingType: StackElementType | null;
    onInsertElement: (index: number, zone?: 'left' | 'center' | 'right') => void;
    onRemoveElement: (id: string) => void;
    onMoveElement: (id: string, direction: 'up' | 'down') => void;
    onUpdateElement: (id: string, newData: Partial<StackElement['data']>) => void;
    onFillSlot: (slotId: string) => void;
    onOpenAddPanel: () => void;
}

export function NormalBlockPreview({
    customElements,
    insertingType,
    onInsertElement,
    onRemoveElement,
    onFillSlot,
    onOpenAddPanel
}: NormalBlockPreviewProps) {
    const renderInsertionPoint = (pointIndex: number) => (
        <div
            key={`insert-${pointIndex}`}
            className={cn(
                "relative flex items-center justify-center h-4 group",
                { 'h-10 cursor-pointer': insertingType }
            )}
            onClick={() => insertingType && onInsertElement(pointIndex)}
        >
            <div className={cn(
                "h-0.5 bg-slate-200 w-full transition-all duration-300",
                { 'h-1 bg-blue-500 group-hover:h-2': insertingType }
            )} />
            {insertingType && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusIcon className="w-6 h-6 bg-blue-600 text-white rounded-full p-0.5" />
                </div>
            )}
        </div>
    );

    if (customElements.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No hay elementos en este bloque</p>
                <p className="text-sm text-slate-400">Usa el panel lateral para añadir elementos</p>
                <button
                    onClick={onOpenAddPanel}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Añadir Primer Elemento
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-0 relative">
            {customElements.map((element, index) => (
                <div key={element.id} className="relative">
                    {renderInsertionPoint(index)}
                    <div className="p-2 cursor-pointer transition-all relative group hover:bg-slate-50 rounded-md">
                        {/* Contenido del elemento normal */}
                        <div className="text-slate-800">
                            {element.type === 'heading' && (
                                <h2 className="text-xl font-bold">{element.data.content || 'Título'}</h2>
                            )}
                            {element.type === 'paragraph' && (
                                <p className="text-base">{element.data.content || 'Párrafo'}</p>
                            )}
                            {element.type === 'image' && (
                                <div className="w-full h-32 bg-slate-200 rounded flex items-center justify-center">
                                    {element.data.imageUrl ? (
                                        <img src={element.data.imageUrl} alt={element.data.alt} className="max-h-full max-w-full object-contain" />
                                    ) : (
                                        <span className="text-slate-500">🖼️ Imagen</span>
                                    )}
                                </div>
                            )}
                            {element.type === 'button' && (
                                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                    {element.data.buttonText || 'Botón'}
                                </button>
                            )}
                            {element.type === 'logo' && (
                                <div className="font-bold text-xl text-blue-600">
                                    {element.data.content || 'Logo'}
                                </div>
                            )}
                            {element.type === 'link' && (
                                <a href={element.data.href || '#'} className="text-blue-600 underline">
                                    {element.data.content || 'Enlace'}
                                </a>
                            )}
                            {element.type === 'actions' && (
                                <button className="bg-green-600 text-white px-4 py-2 rounded">
                                    {element.data.buttonText || 'Acción'}
                                </button>
                            )}
                            {element.type === 'spacer' && (
                                <div
                                    className="bg-slate-100 border border-dashed border-slate-300 rounded text-center text-slate-500 text-sm flex items-center justify-center"
                                    style={{ height: `${element.data.height || 20}px` }}
                                >
                                    Espacio ({element.data.height || 20}px)
                                </div>
                            )}
                            {element.type === 'slot' && (
                                <div
                                    className={cn(
                                        "min-h-[60px] border-2 border-dashed rounded-lg p-3 text-center transition-all cursor-pointer",
                                        {
                                            'border-slate-300 bg-slate-50': !insertingType,
                                            'border-green-400 bg-green-50 hover:bg-green-100': insertingType && element.data.acceptedTypes?.includes(insertingType),
                                            'border-red-300 bg-red-50': insertingType && !element.data.acceptedTypes?.includes(insertingType),
                                        }
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (insertingType && element.data.acceptedTypes?.includes(insertingType)) {
                                            onFillSlot(element.id);
                                        }
                                    }}
                                >
                                    <div className="text-2xl mb-1">📦</div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {element.data.placeholder || 'Slot'}
                                    </p>
                                    {insertingType && element.data.acceptedTypes?.includes(insertingType) && (
                                        <p className="text-xs text-green-600 mt-1">
                                            ✓ Compatible con {insertingType}
                                        </p>
                                    )}
                                    {!insertingType && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            Acepta: {element.data.acceptedTypes?.join(', ') || 'cualquier elemento'}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Controles para elementos */}
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(element.id);
                                }}
                                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                title="Eliminar elemento"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Punto de inserción final */}
            {renderInsertionPoint(customElements.length)}

            {/* Instrucciones para vista normal */}
            {customElements.length > 0 && (
                <div className={cn(
                    "text-center text-sm mt-6 p-3 rounded-lg",
                    insertingType ? "bg-green-50 text-green-700" : "bg-blue-50 text-slate-500"
                )}>
                    {insertingType ? (
                        <>
                            ✨ <strong>Modo inserción activo:</strong> Haz clic en cualquier línea de inserción (aparecen entre elementos) para colocar el elemento {insertingType}
                        </>
                    ) : (
                        <>
                            💡 <strong>Cómo usar:</strong> Selecciona un elemento del panel lateral para insertarlo, o usa los controles en elementos existentes para editarlos
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
