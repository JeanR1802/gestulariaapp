"use client";

import React, { useEffect, useState, Fragment, useRef } from 'react';
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
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';

// Stub for ActiveElementEditor used in mobile modal
function ActiveElementEditor() {
    const { theme, palette } = useTheme();
    const c = colorPalettes[palette][theme];

    return (
        <div className="p-2 text-sm" style={{ color: c.text.primary }}>
            <p className="font-medium" style={{ color: c.text.primary }}>Editor de Elemento Activo</p>
            <p className="text-xs" style={{ color: c.text.secondary }}>Selecciona un elemento en la lista para editar sus propiedades.</p>
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
    // Cargar headerMode desde block.data si existe, si no usar 'fijo' por defecto
    const [headerMode, setHeaderMode] = useState<'fijo' | 'dinamico'>((block.data as any)?.headerMode || 'fijo');
    const [showProperties, setShowProperties] = useState<boolean>(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [pendingMode, setPendingMode] = useState<'fijo' | 'dinamico' | null>(null);

    // Active element selection for properties panel
    const [activeElementId, setActiveElementId] = useState<string | null>(null);
    
    // Track maximum padding available for header
    const [maxPaddingAvailable, setMaxPaddingAvailable] = useState<number>(0);
    const [maxPaddingLeft, setMaxPaddingLeft] = useState<number>(0);
    const [maxPaddingRight, setMaxPaddingRight] = useState<number>(0);

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

    // DEBUG: detectar elementos iniciales "fantasma" al abrir un header por primera vez
    const _initialLogDone = useRef<boolean>(false);
    // Reset flag when switching blocks
    useEffect(() => { _initialLogDone.current = false; }, [block.id]);

    useEffect(() => {
        if (block.type !== 'header') return;
        if (_initialLogDone.current) return;
        _initialLogDone.current = true;

        try {
            console.log('🐛 [HEADER INIT] Opening header editor for block.id=', block.id);
            console.log('🐛 [HEADER INIT] customElements length=', customElements.length);
            if (customElements.length === 0) {
                console.log('🐛 [HEADER INIT] No elements present on open.');
            }
            customElements.forEach((el, idx) => {
                console.log(`🐛 [HEADER INIT] element[${idx}] id=${el.id} type=${el.type} data=`, el.data);
            });

            const potentialGhosts = customElements.filter(el => el.type === 'slot' || (el.data && (el.data.isEmpty === true || el.data.placeholder)));
            console.log('🐛 [HEADER INIT] potential ghost elements count=', potentialGhosts.length, potentialGhosts.map(e => ({ id: e.id, type: e.type, data: e.data })));
        } catch (e) {
            console.error('🐛 [HEADER INIT] error logging initial elements', e);
        }
    }, [block.id, block.type, customElements]);

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
        // Si el bloque es un header custom, guardar también el headerMode
        if (block.type === 'header' && (localData as any).variant === 'custom') {
            const updatedData = { ...localData, headerMode } as any;
            onSave(updatedData);
        } else {
            onSave(localData);
        }
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

    const { theme, palette } = useTheme();
    const c = colorPalettes[palette][theme];
    const isLight = theme === 'light';
    // When forcing light surfaces in dark mode, use the light palette text colors for readability
    const contentText = isLight ? c.text.primary : colorPalettes[palette].light.text.primary;
    const contentSecondary = isLight ? c.text.secondary : colorPalettes[palette].light.text.secondary;

    // Header padding state is kept inside localData (if block.data is HeaderData)
    const headerPaddingLeft = (localData as any)?.paddingLeft ?? undefined;
    const headerPaddingRight = (localData as any)?.paddingRight ?? undefined;

    const updateHeaderPadding = (left?: number | null, right?: number | null) => {
        const updated = { ...(localData as any) } as any;
        const curL = (localData as any)?.paddingLeft;
        const curR = (localData as any)?.paddingRight;
        let changed = false;

        if (typeof left === 'number') {
            if (curL !== left) {
                updated.paddingLeft = left;
                changed = true;
            }
        } else if (left === null) {
            if (curL !== undefined) {
                updated.paddingLeft = undefined;
                changed = true;
            }
        }

        if (typeof right === 'number') {
            if (curR !== right) {
                updated.paddingRight = right;
                changed = true;
            }
        } else if (right === null) {
            if (curR !== undefined) {
                updated.paddingRight = undefined;
                changed = true;
            }
        }

        if (changed) setLocalData(updated);
    };

    return (
        // Top-level backdrop kept neutral; main surfaces will be forced light below so only sidebar stays dark
        <div className="fixed inset-0 z-[60]" style={{ backgroundColor: isLight ? '#F3F4F6' : '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
            {/* Header del Editor Avanzado */}
            <header className="p-4 flex justify-between items-center flex-shrink-0" style={{ backgroundColor: '#FFFFFF', borderBottom: `1px solid ${c.border.secondary}` }}>
                <h2 className="text-xl font-bold" style={{ color: contentText }}>
                    <span style={{ color: c.accent.primary }}>🛠️ Edición Avanzada</span>: {BLOCKS[block.type].name}
                    {insertingType && (
                        <span style={{ marginLeft: 8, padding: '4px 8px', fontSize: 12, borderRadius: 9999, backgroundColor: `${c.accent.primary}12`, color: c.accent.primary }}>
                            Insertando: {insertingType}
                        </span>
                    )}
                </h2>
                <div className="flex items-center gap-2">
                    {insertingType && (
                        <button
                            onClick={() => setInsertingType(null)}
                            className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                            style={{ color: contentSecondary, backgroundColor: '#F8FAFC' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEF2FF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                        >
                            Cancelar inserción
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: c.accent.primary, color: c.button?.primary?.text || '#FFFFFF' }}
                        onMouseEnter={(e) => (!e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = c.accent.secondary))}
                        onMouseLeave={(e) => (!e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = c.accent.primary))}
                    >
                        <CheckIcon className="w-5 h-5 inline-block mr-1" /> Aplicar y Cerrar
                    </button>
                </div>
            </header>

            {/* Contenido principal del lienzo avanzado */}
            <main className="flex-1 md:flex overflow-hidden" style={{ backgroundColor: 'transparent' }}>
                {/* Bandeja de Elementos (Izquierda) - OCULTO EN MOBILE */}
                <EditorSidebar
                    onAddElementSelect={handleAddElementSelect}
                    onToggleProperties={() => setShowProperties(!showProperties)}
                    showProperties={showProperties}
                    headerMode={headerMode}
                    onModeChange={(m) => handleModeChange(m)}
                    onShowElements={() => setShowProperties(false)}
                    // New props for active element editing
                    activeElementId={activeElementId || undefined}
                    elements={customElements}
                    onUpdateElement={(id, data) => updateElement && updateElement(id, data)}
                    // Header padding controls
                    headerPaddingLeft={headerPaddingLeft}
                    headerPaddingRight={headerPaddingRight}
                    onUpdateHeaderPadding={(l, r) => updateHeaderPadding(l, r)}
                    maxPaddingAvailable={maxPaddingAvailable}
                    maxPaddingLeft={maxPaddingLeft}
                    maxPaddingRight={maxPaddingRight}
                />

                {/* Vista Previa (Derecha) - OCUPA TODO EL ANCHO EN MOBILE */}
                <div className="flex-1 overflow-auto p-4 md:p-8" style={{ backgroundColor: 'transparent' }}>
                    <div className={cn(
                        "max-w-4xl mx-auto rounded-xl p-6 relative transition-all duration-300",
                        { 'shadow-2xl': true }
                    )} style={{ backgroundColor: '#FFFFFF', boxShadow: insertingType ? `0 0 0 4px ${c.accent.primary}26` : undefined }}>
                        {/* Aviso de inserción removido: ahora la bandeja muestra el tipo y el anillo visual indica el modo inserción */}

                        {/* EDITOR SIMPLE BASADO EN EL HTML */}
                        {block.type === 'header' ? (
                            <div className="space-y-4">
                                {/* Editor del Header */}
                                <SimpleHeaderEditor
                                    elements={customElements}
                                    insertingType={insertingType}
                                    // Indicate whether the original block data started empty (new header)
                                    showPlaceholdersIfNew={!(localData as any)?.customElements || ((localData as any)?.customElements || []).length === 0}
                                    onAddElement={async (zone) => {
                                        // Sólo insertar si hay un tipo seleccionado desde la bandeja
                                        if (!insertingType) {
                                            // SimpleHeaderEditor ya mostrará un aviso; evitar doble acción
                                            return [] as any;
                                        }
                                        if (addElement) {
                                            const result = addElement(insertingType, zone, 0);
                                            // limpiar selección de inserción al finalizar
                                            setInsertingType && setInsertingType(null);
                                            return result;
                                        }
                                        return [] as any;
                                    }}
                                    onRemoveElement={removeElement}
                                    onOpenProperties={(id) => {
                                        // If id provided, open element properties, otherwise open header properties
                                        setActiveElementId(id || null);
                                        setShowProperties(true);
                                    }}
                                    mode={headerMode}
                                    headerPaddingLeft={headerPaddingLeft}
                                    headerPaddingRight={headerPaddingRight}
                                    onClampHeaderPadding={(l, r) => updateHeaderPadding(l ?? null, r ?? null)}
                                    onMaxPaddingAvailableChange={(max, maxL, maxR) => {
                                        setMaxPaddingAvailable(max);
                                        setMaxPaddingLeft(maxL ?? 0);
                                        setMaxPaddingRight(maxR ?? 0);
                                    }}
                                />

                                {/* Hint de inserción: aparece centrado debajo del header cuando hay un tipo seleccionado */}
                                {insertingType && (
                                    <div className="mt-3 flex justify-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow-sm" style={{ backgroundColor: c.accent.primary, color: c.button?.primary?.text || '#FFFFFF' }}>
                                            <span>💡</span>
                                            <span>Haz clic donde quieras insertar: {insertingType}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Propiedades ahora sólo se muestran en el panel lateral */}
                            </div>
                        ) : (
                            <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg" style={{ borderColor: c.border.secondary }}>
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">📄</div>
                                    <h3 className="text-xl font-semibold" style={{ color: c.text.primary }}>Bloque: {BLOCKS[block.type].name}</h3>
                                    <p className="text-sm" style={{ color: c.text.tertiary, maxWidth: '24rem' }}>
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
                        <div className="absolute bottom-0 left-0 right-0 rounded-t-xl shadow-2xl max-h-[70vh] overflow-y-auto p-4" style={{ backgroundColor: '#FFFFFF' }}>
                            <div className="flex justify-between items-center border-b pb-3 mb-3" style={{ borderBottom: `1px solid ${c.border.secondary}` }}>
                                <h3 className="font-bold text-lg" style={{ color: contentText }}>{mobilePanelOpen === 'elements' ? 'Insertar Elementos' : mobilePanelOpen === 'styles' ? 'Estilos del Bloque' : 'Editar Propiedades'}</h3>
                                <button onClick={() => setMobilePanelOpen(null)} style={{ color: contentSecondary }} onMouseEnter={(e) => (e.currentTarget.style.color = contentText)} onMouseLeave={(e) => (e.currentTarget.style.color = contentSecondary)}><XMarkIcon className="w-5 h-5" /></button>
                            </div>
                            {mobilePanelOpen === 'elements' && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold mb-4" style={{ color: contentText }}>Elementos a Insertar</h3>
                                    <div className="space-y-2">
                                        {['logo'].map((t) => (
                                            <button key={t} onClick={() => { handleAddElementSelect(t as StackElementType); }} className="w-full p-3 text-left rounded-lg transition-colors" style={{ border: `1px solid ${c.border.primary}`, backgroundColor: '#FFFFFF' }}>
                                                <span className="font-semibold text-sm capitalize" style={{ color: contentText }}>{t === 'slot' ? 'Slot (Contenedor)' : t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mobilePanelOpen === 'styles' && (
                                <div className="space-y-4">
                                    <p className="text-sm" style={{ color: c.text.secondary }}>Aquí iría el editor de estilos globales del bloque.</p>
                                </div>
                            )}

                            {mobilePanelOpen === 'settings' && (
                                <ActiveElementEditor />
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

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
                        <div className="relative rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${c.border.primary}` }}>
                            {/* Icono de advertencia */}
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{ backgroundColor: `${c.accent.primary}15` }}>
                                <span className="text-4xl" style={{ color: c.accent.primary }}>⚠️</span>
                            </div>

                            {/* Título */}
                            <h3 className="text-xl font-bold text-center mb-2" style={{ color: contentText }}>
                                ¿Cambiar modo de posicionamiento?
                            </h3>

                            {/* Descripción */}
                            <div className="text-center mb-6 space-y-2">
                                <p className="text-sm" style={{ color: contentSecondary }}>
                                    Estás a punto de cambiar de <span className="font-semibold" style={{ color: c.text.primary }}>{headerMode === 'fijo' ? 'Modo Fijo 🔒' : 'Modo Dinámico ↔️'}</span> a <span className="font-semibold" style={{ color: c.text.primary }}>{pendingMode === 'fijo' ? 'Modo Fijo 🔒' : 'Modo Dinámico ↔️'}</span>.
                                </p>
                                <div className="rounded-lg p-3 mt-3" style={{ backgroundColor: `${c.error}15`, border: `1px solid ${c.error}25` }}>
                                    <p className="text-sm font-medium" style={{ color: c.error }}>
                                        ⚠️ Esta acción eliminará todos los elementos actuales del header.
                                    </p>
                                    <p className="text-xs" style={{ color: c.error }}>
                                        Tendrás que empezar de nuevo con la configuración seleccionada.
                                    </p>
                                </div>
                            </div>

                            {/* Info del nuevo modo */}
                            <div className="rounded-lg p-3 mb-6" style={{ backgroundColor: c.bg.tertiary, border: `1px solid ${c.border.secondary}` }}>
                                <p className="text-xs" style={{ color: contentSecondary }}>
                                    {pendingMode === 'fijo' ? (
                                        <><strong style={{ color: c.accent.primary }}>Modo Fijo:</strong> El centro permanecerá siempre centrado. Los elementos laterales no podrán empujarlo.</>
                                    ) : (
                                        <><strong style={{ color: c.success }}>Modo Dinámico:</strong> El centro se moverá si los elementos laterales lo empujan. Máxima flexibilidad.</>
                                    )}
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelModeChange}
                                    className="flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                                    style={{ backgroundColor: '#F8FAFC', color: contentText, border: `1px solid ${c.border.primary}` }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmModeChange}
                                    className={cn(
                                        "flex-1 px-4 py-3 text-sm font-bold text-white rounded-lg transition-all shadow-md hover:shadow-lg",
                                        pendingMode === 'fijo' ? '' : ''
                                    )}
                                    style={{ backgroundColor: pendingMode === 'fijo' ? c.accent.primary : c.success, color: c.button?.primary?.text || '#FFFFFF' }}
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
