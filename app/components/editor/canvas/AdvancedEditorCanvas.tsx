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
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [pendingMode, setPendingMode] = useState<'fijo' | 'dinamico' | null>(null);

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
        clearAllElements,
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

    // Handler para cambiar el modo con confirmación
    const handleModeChange = (newMode: 'fijo' | 'dinamico') => {
        // Si ya está en ese modo, no hacer nada
        if (headerMode === newMode) {
            return;
        }

        // Si no hay elementos, cambiar directamente
        if (customElements.length === 0) {
            setHeaderMode(newMode);
            // Cerrar panel de propiedades inmediatamente al cambiar
            setShowProperties(false);
            return;
        }

        // Si hay elementos, mostrar confirmación
        setPendingMode(newMode);
        setShowConfirmDialog(true);
    };

    // Confirmar cambio de modo y limpiar elementos
    const confirmModeChange = () => {
        if (pendingMode) {
            // Limpiar todos los elementos
            if (clearAllElements) {
                clearAllElements();
            }
            // Cambiar el modo
            setHeaderMode(pendingMode);
            // Cerrar panel de propiedades al confirmar
            setShowProperties(false);
            // Cerrar diálogo
            setShowConfirmDialog(false);
            setPendingMode(null);
        }
    };

    // Cancelar cambio de modo
    const cancelModeChange = () => {
        setShowConfirmDialog(false);
        setPendingMode(null);
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
                    onToggleProperties={() => setShowProperties(!showProperties)}
                    showProperties={showProperties}
                    headerMode={headerMode}
                    onModeChange={(m) => handleModeChange(m)}
                    onShowElements={() => setShowProperties(false)}
                />

                {/* Vista Previa (Derecha) - OCUPA TODO EL ANCHO EN MOBILE */}
                <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-100">
                    <div className={cn(
                        "max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 relative transition-all duration-300",
                        { 'ring-2 ring-green-400 ring-offset-4': insertingType }
                    )}>
                        {/* Aviso de inserción removido: ahora la bandeja muestra el tipo y el anillo visual indica el modo inserción */}

                        {/* EDITOR SIMPLE BASADO EN EL HTML */}
                        {block.type === 'header' ? (
                            <div className="space-y-4">
                                {/* Editor del Header */}
                                <SimpleHeaderEditor
                                    elements={customElements}
                                    insertingType={insertingType}
                                    onAddElement={(zone) => {
                                        // Sólo insertar si hay un tipo seleccionado desde la bandeja
                                        if (!insertingType) {
                                            // SimpleHeaderEditor ya mostrará un aviso; evitar doble acción
                                            return;
                                        }
                                        if (addElement) {
                                            addElement(insertingType, zone, 0);
                                            // limpiar selección de inserción al finalizar
                                            setInsertingType && setInsertingType(null);
                                        }
                                    }}
                                    onRemoveElement={removeElement}
                                    onOpenProperties={() => setShowProperties(true)}
                                    mode={headerMode}
                                />

                                {/* Hint de inserción: aparece centrado debajo del header cuando hay un tipo seleccionado */}
                                {insertingType && (
                                    <div className="mt-3 flex justify-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium shadow-sm">
                                            <span>💡</span>
                                            <span>Haz clic donde quieras insertar: {insertingType}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Propiedades ahora sólo se muestran en el panel lateral */}
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

            {/* Diálogo de Confirmación de Cambio de Modo */}
            <Transition show={showConfirmDialog} as={Fragment}>
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelModeChange} />
                    </Transition.Child>

                    {/* Modal */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
                            {/* Icono de advertencia */}
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full">
                                <span className="text-4xl">⚠️</span>
                            </div>

                            {/* Título */}
                            <h3 className="text-xl font-bold text-center text-slate-800 mb-2">
                                ¿Cambiar modo de posicionamiento?
                            </h3>

                            {/* Descripción */}
                            <div className="text-center mb-6 space-y-2">
                                <p className="text-sm text-slate-600">
                                    Estás a punto de cambiar de <span className="font-semibold text-slate-800">{headerMode === 'fijo' ? 'Modo Fijo 🔒' : 'Modo Dinámico ↔️'}</span> a <span className="font-semibold text-slate-800">{pendingMode === 'fijo' ? 'Modo Fijo 🔒' : 'Modo Dinámico ↔️'}</span>.
                                </p>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                                    <p className="text-sm text-red-700 font-medium">
                                        ⚠️ Esta acción eliminará todos los elementos actuales del header.
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                        Tendrás que empezar de nuevo con la configuración seleccionada.
                                    </p>
                                </div>
                            </div>

                            {/* Info del nuevo modo */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
                                <p className="text-xs text-slate-600">
                                    {pendingMode === 'fijo' ? (
                                        <><strong className="text-blue-600">Modo Fijo:</strong> El centro permanecerá siempre centrado. Los elementos laterales no podrán empujarlo.</>
                                    ) : (
                                        <><strong className="text-green-600">Modo Dinámico:</strong> El centro se moverá si los elementos laterales lo empujan. Máxima flexibilidad.</>
                                    )}
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelModeChange}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmModeChange}
                                    className={cn(
                                        "flex-1 px-4 py-3 text-sm font-bold text-white rounded-lg transition-all shadow-md hover:shadow-lg",
                                        pendingMode === 'fijo'
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    )}
                                >
                                    Sí, cambiar y reiniciar
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition>
        </div>
    );
}
