"use client";

import React, { useEffect, useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { BLOCKS, BlockData, Block } from '@/app/components/editor/blocks';
import { StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { useEditorElements } from './hooks/useEditorElements';
import { EditorSidebar } from './components/EditorSidebar';
import { SimpleHeaderEditor } from './components/SimpleHeaderEditor';
import { AdvancedMobileToolbar } from './components/AdvancedMobileToolbar';
import { NormalBlockPreview } from './components/NormalBlockPreview';

// Stub for ActiveElementEditor used in mobile modal
function ActiveElementEditor() {
    return (
        <div className="p-2 text-sm text-slate-700">
            <p className="font-medium">Editor de Elemento Activo</p>
            <p className="text-xs text-slate-500">Selecciona un elemento en la lista para editar sus propiedades.</p>
        </div>
    );
}

export interface AdvancedEditorProps {
    block: Block;
    onClose: () => void;
    onSave: (newData: BlockData) => void;
}

export function AdvancedEditorCanvas({ block, onClose, onSave }: AdvancedEditorProps) {
    const [localData, setLocalData] = useState<BlockData>(block.data);
    const [mobilePanelOpen, setMobilePanelOpen] = useState<'elements' | 'styles' | 'settings' | null>(null);
    const [rowMinHeight, setRowMinHeight] = useState<number>(60);
    const [headerMode, setHeaderMode] = useState<'fijo' | 'dinamico'>('fijo');
    const [showProperties, setShowProperties] = useState<boolean>(false);

    // Usar el hook personalizado para gestionar elementos
    const {
        customElements,
        insertingType,
        setInsertingType,
        handleInsertElementInRow,
        removeElement,
        moveElement,
        updateElement,
        handleFillSlot,
        addElement,
    } = useEditorElements(block, localData, setLocalData);

    // Wrapper para compatibilidad con NormalBlockPreview: inserta en row 0
    const handleInsertElement = (index: number, zone?: 'left' | 'center' | 'right') => {
        // index is ignored for header rows; for normal blocks we insert at row 0
        try {
            handleInsertElementInRow && handleInsertElementInRow(0, zone || 'center');
        } catch (e) {
            console.error('handleInsertElement wrapper error', e);
        }
    };

    // Sincronizar el estado local al cambiar el bloque
    useEffect(() => {
        setLocalData(block.data);
    }, [block.id]);

    const handleSave = () => {
        onSave(localData);
        onClose();
    };

    const handleAddElementSelect = (type: StackElementType) => {
        setInsertingType(type);
        setMobilePanelOpen(null);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col">
            {/* Header del Editor Avanzado */}
            <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800">
                    <span className="text-blue-600">🛠️ Edición Avanzada</span>: {BLOCKS[block.type].name}
                    {insertingType && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Insertando: {insertingType}
                        </span>
                    )}
                </h2>
                <div className="flex items-center gap-2">
                    {insertingType && (
                        <button
                            onClick={() => setInsertingType(null)}
                            className="px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                        >
                            Cancelar inserción
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <CheckIcon className="w-5 h-5 inline-block mr-1" /> Aplicar y Cerrar
                    </button>
                </div>
            </header>

            {/* Contenido principal del lienzo avanzado */}
            <main className="flex-1 md:flex overflow-hidden">
                {/* Bandeja de Elementos (Izquierda) - OCULTO EN MOBILE */}
                <EditorSidebar
                    onAddElementSelect={handleAddElementSelect}
                />

                {/* Vista Previa (Derecha) - OCUPA TODO EL ANCHO EN MOBILE */}
                <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-100">
                    <div className={cn(
                        "max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 relative transition-all duration-300",
                        { 'ring-2 ring-green-400 ring-offset-4': insertingType }
                    )}>
                        {insertingType && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium z-10">
                                💡 Haz clic donde quieras insertar: {insertingType}
                            </div>
                        )}

                        {/* EDITOR SIMPLE BASADO EN EL HTML */}
                        {block.type === 'header' ? (
                            <div className="space-y-4">
                                {/* Pestaña de Propiedades */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowProperties(!showProperties)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                                            showProperties 
                                                ? "bg-blue-600 text-white shadow-md" 
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        )}
                                    >
                                        ⚙️ Propiedades
                                    </button>
                                </div>

                                {/* Panel de Propiedades (desplegable) */}
                                {showProperties && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Modo de Posicionamiento</h4>
                                        
                                        {/* Toggle Fijo/Dinámico */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setHeaderMode('fijo')}
                                                className={cn(
                                                    "flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                                                    headerMode === 'fijo'
                                                        ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                                                        : "bg-white text-slate-600 border border-slate-300 hover:border-blue-400"
                                                )}
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-lg">🔒</span>
                                                    <span>Modo Fijo</span>
                                                    <span className="text-xs opacity-75">Centro inamovible</span>
                                                </div>
                                            </button>
                                            
                                            <button
                                                onClick={() => setHeaderMode('dinamico')}
                                                className={cn(
                                                    "flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                                                    headerMode === 'dinamico'
                                                        ? "bg-green-600 text-white shadow-md ring-2 ring-green-300"
                                                        : "bg-white text-slate-600 border border-slate-300 hover:border-green-400"
                                                )}
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-lg">↔️</span>
                                                    <span>Modo Dinámico</span>
                                                    <span className="text-xs opacity-75">Empuje bilateral</span>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Descripción del modo activo */}
                                        <div className="mt-3 p-3 bg-white rounded-md border border-slate-200">
                                            <p className="text-xs text-slate-600">
                                                {headerMode === 'fijo' ? (
                                                    <><strong>Modo Fijo:</strong> El centro siempre permanece en el medio. Los elementos laterales no pueden empujarlo ni tocarlo.</>
                                                ) : (
                                                    <><strong>Modo Dinámico:</strong> El centro se mueve si los elementos laterales lo empujan. Permite máxima flexibilidad.</>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Editor del Header */}
                                <SimpleHeaderEditor
                                    elements={customElements}
                                    onAddElement={(zone) => {
                                        if (addElement) {
                                            addElement('logo', zone, 0);
                                        }
                                    }}
                                    onRemoveElement={removeElement}
                                    mode={headerMode}
                                />
                            </div>
                        ) : (
                            <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">📄</div>
                                    <h3 className="text-xl font-semibold text-slate-700">Bloque: {BLOCKS[block.type].name}</h3>
                                    <p className="text-sm text-slate-500 max-w-md">
                                        Este tipo de bloque aún no tiene editor avanzado.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Toolbar (Visible solo en móvil) */}
            <AdvancedMobileToolbar
                onOpenPanel={(group) => setMobilePanelOpen(group)}
                onAddElement={() => setMobilePanelOpen('elements')}
                isEditing={true}
            />

            {/* Mobile Modal Panel (Bottom Sheet) */}
            <Transition show={!!mobilePanelOpen} as={Fragment}>
                <div className="md:hidden fixed inset-0 z-[100]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobilePanelOpen(null)} />
                    </Transition.Child>

                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="ease-in duration-200" leaveFrom="translate-y-0" leaveTo="translate-y-full">
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl max-h-[70vh] overflow-y-auto p-4">
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <h3 className="font-bold text-lg">{mobilePanelOpen === 'elements' ? 'Insertar Elementos' : mobilePanelOpen === 'styles' ? 'Estilos del Bloque' : 'Editar Propiedades'}</h3>
                                <button onClick={() => setMobilePanelOpen(null)} className="text-slate-500 hover:text-slate-800"><XMarkIcon className="w-5 h-5" /></button>
                            </div>
                            {mobilePanelOpen === 'elements' && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-800 mb-4">Elementos a Insertar</h3>
                                    <div className="space-y-2">
                                        {['logo'].map((t) => (
                                            <button key={t} onClick={() => { handleAddElementSelect(t as StackElementType); }} className="w-full p-3 text-left rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                                <span className="font-semibold text-sm text-slate-800 capitalize">{t === 'slot' ? 'Slot (Contenedor)' : t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mobilePanelOpen === 'styles' && (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">Aquí iría el editor de estilos globales del bloque.</p>
                                </div>
                            )}

                            {mobilePanelOpen === 'settings' && (
                                <ActiveElementEditor />
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            {/* Advanced Test Canvas removed — use HeaderPreview's built-in test mode to avoid duplicate test UIs */}
        </div>
    );
}
