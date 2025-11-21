'use client';
import { useState, useEffect, useCallback, use, Fragment, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BLOCKS, BlockType, BlockData, Block, BlockConfig } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';
import { MobileToolbar } from '@/app/components/editor/controls/MobileToolbar';
import { XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline'; // <-- Añadir CheckIcon
import { Settings, Edit, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';

// --- Tipos y Modales ---

interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }

// --- MobileAddComponentPanel (CON FILTROS) ---
function MobileAddComponentPanel({ onClose, onSelectBlock, selectedCategory, setSelectedCategory }: { onClose: () => void, onSelectBlock: (type: BlockType) => void, selectedCategory: string, setSelectedCategory: (category: string) => void }) {
    // Estas constantes ahora se pasan como props, pero las necesitamos aquí para renderizar
    const categorizedBlocks = Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
      const category = blockInfo.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ key, ...(blockInfo as BlockConfig<BlockData>) });
      return acc;
    }, {} as Record<string, Array<{ key: string } & BlockConfig<BlockData>>>);
    
    const categoryOrder: (keyof typeof categorizedBlocks)[] = ['Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'];

    return (
        <Transition show={true} as={Fragment}>
            <div className="fixed inset-0 z-40 md:hidden">
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                </Transition.Child>
                <div className="fixed inset-y-0 left-0 max-w-full flex">
                    <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                        <div className="w-screen max-w-xs">
                            <div className="h-full flex flex-col bg-white shadow-xl">
                                <div className="p-4 border-b bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900">Añadir Componente</h2>
                                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><XMarkIcon className="h-6 w-6" /></button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                                        {['Todos', ...categoryOrder].map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={cn(
                                                    "px-3 py-1 text-sm font-semibold rounded-full flex-shrink-0 transition-colors",
                                                    selectedCategory === category
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                )}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                            
                                    {categoryOrder
                                        .filter(category => selectedCategory === 'Todos' || selectedCategory === category)
                                        .map(category => (
                                        <div key={category}>
                                            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider px-2 mb-2">{category}</h3>
                                            <div className="space-y-2">
                                                {(categorizedBlocks[category] || []).map((blockInfo) => {
                                                    const Icon = blockInfo.icon;
                                                    return (
                                                        <button key={blockInfo.key} onClick={() => onSelectBlock(blockInfo.key as BlockType)} className="w-full p-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} /></div>
                                                                <div><p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
}

// --- DesktopAddComponentPanel (para desktop/tablet) ---
function DesktopAddComponentPanel({ onClose, onSelectBlock, selectedCategory, setSelectedCategory }: { onClose: () => void, onSelectBlock: (type: BlockType) => void, selectedCategory: string, setSelectedCategory: (category: string) => void }) {
    // Usar la misma lógica de categorización
    const categorizedBlocks = Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
      const category = blockInfo.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ key, ...(blockInfo as BlockConfig<BlockData>) });
      return acc;
    }, {} as Record<string, Array<{ key: string } & BlockConfig<BlockData>>>);
    
    const categoryOrder: (keyof typeof categorizedBlocks)[] = ['Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'];

    return (
        <Transition show={true} as={Fragment}>
            <div className="fixed inset-0 z-40 hidden md:flex items-center justify-center">
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                </Transition.Child>
                <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="transform transition ease-in-out duration-300" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b bg-slate-50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Añadir Componente</h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><XMarkIcon className="h-6 w-6" /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                {['Todos', ...categoryOrder].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0 transition-colors",
                                            selectedCategory === category
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryOrder
                                    .filter(category => selectedCategory === 'Todos' || selectedCategory === category)
                                    .map(category => (
                                    <div key={category}>
                                        <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-3">{category}</h3>
                                        <div className="space-y-2">
                                            {(categorizedBlocks[category] || []).map((blockInfo) => {
                                                const Icon = blockInfo.icon;
                                                return (
                                                    <button key={blockInfo.key} onClick={() => onSelectBlock(blockInfo.key as BlockType)} className="w-full p-3 text-left rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-7 h-7 ${blockInfo.theme.icon}`} /></div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800">{blockInfo.name}</p>
                                                                <p className="text-sm text-slate-500">{blockInfo.description}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    );
}

// --- AddBlockPanel (SIN CAMBIOS) ---
function AddBlockPanel({ blockType, onAddBlock, onClose }: { blockType: BlockType | null, onAddBlock: (type: BlockType, data: BlockData) => void, onClose: () => void }) {
    if (!blockType) return null;
    const blockConfig = BLOCKS[blockType];
    const Icon = blockConfig.icon;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockConfig.theme.bg}`}><Icon className={`w-6 h-6 ${blockConfig.theme.icon}`} /></div>
                        <h3 className="text-lg font-semibold text-slate-800">Elige un diseño de {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                    {blockConfig.variants.map((variant, index) => {
                        const PreviewComponent = variant.preview as React.FC<{ data: BlockData }>;
                        return (
                            <div key={index} onClick={() => onAddBlock(blockType, variant.defaultData)} className="border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all">
                                <div className="p-4 bg-slate-50 flex items-center justify-center h-48"><PreviewComponent data={variant.defaultData} /></div>
                                <div className="p-3"><h4 className="font-semibold text-sm">{variant.name}</h4><p className="text-xs text-slate-500">{variant.description}</p></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// --- Componente Stub para el Lienzo Estructurado ---
interface AdvancedEditorProps {
    block: Block;
    onClose: () => void;
    onSave: (newData: BlockData) => void;
}

function AdvancedEditorCanvas({ block, onClose, onSave }: AdvancedEditorProps) {
    const [localData, setLocalData] = useState<BlockData>(block.data);
    const [mobilePanelOpen, setMobilePanelOpen] = useState<'elements' | 'styles' | 'settings' | null>(null);
    const [insertingGroup, setInsertingGroup] = useState<'text' | 'button' | 'spacer' | null>(null);
    const [insertingType, setInsertingType] = useState<StackElementType | null>(null); // NUEVO ESTADO: Elemento listo para ser insertado
    const [isHoveringInsertion, setIsHoveringInsertion] = useState<boolean>(false); // NUEVO ESTADO: Para activar el resaltado del lienzo
    
    // Sincronizar el estado local al cambiar el bloque
    useEffect(() => {
        setLocalData(block.data);
    }, [block.id]);

    const handleSave = () => {
        onSave(localData);
        onClose();
    };

    // Para bloques estructurados (header), creamos slots predefinidos
    const initializeHeaderStructure = () => {
        return [
            { 
                id: 'slot-logo', 
                type: 'slot' as StackElementType, 
                data: { 
                    slotType: 'logo',
                    isEmpty: true,
                    placeholder: 'Arrastra aquí tu logo',
                    content: undefined
                } 
            },
            { 
                id: 'slot-navigation', 
                type: 'slot' as StackElementType, 
                data: { 
                    slotType: 'navigation',
                    isEmpty: true,
                    placeholder: 'Menú de navegación',
                    content: undefined
                } 
            },
            { 
                id: 'slot-actions', 
                type: 'slot' as StackElementType, 
                data: { 
                    slotType: 'actions',
                    isEmpty: true,
                    placeholder: 'Botones de acción',
                    content: undefined
                } 
            }
        ];
    };

    // Inicializar estructura si está vacía o no existe
    const customElements = React.useMemo(() => {
        const existing = ((localData as BlockData & { customElements?: StackElement[] }).customElements || []) as StackElement[];
        
        // Si es un header y no tiene elementos, crear estructura base
        if (block.type === 'header' && existing.length === 0) {
            return initializeHeaderStructure();
        }
        
        return existing;
    }, [localData, block.type]) as StackElement[];

    const setCustomElements = (elements: StackElement[]) => {
        setLocalData({ ...localData, customElements: elements } as BlockData & { customElements: StackElement[] });
    };

    const addElement = (type: StackElementType) => {
        const newElement: StackElement = {
            id: Date.now().toString(),
            type,
            data: getDefaultDataForType(type)
        };
        const newElements = [...customElements, newElement];
        setCustomElements(newElements);
        // Abrir automáticamente el panel de edición de propiedades en móvil después de añadir el elemento
        setMobilePanelOpen('settings');
    };

    const handleAddElementSelect = (type: StackElementType, level?: 'h2' | 'h3' | 'h4') => {
        // Establecer el elemento que está listo para ser insertado
        setInsertingType(type);
        setInsertingGroup(null); // Sale del sub-panel
    };

    const handleInsertElement = (insertIndex: number) => {
        if (!insertingType) return;

        let newElement: StackElement;
        const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        switch(insertingType) {
            case 'logo':
                newElement = { id: generateId(), type: 'logo', data: { content: 'Mi Logo' }};
                break;
            case 'link':
                newElement = { id: generateId(), type: 'link', data: { content: 'Enlace', href: '#' }};
                break;
            case 'actions':
                newElement = { id: generateId(), type: 'actions', data: { buttonText: 'Acción', buttonLink: '#' }};
                break;
            case 'spacer':
                newElement = { id: generateId(), type: 'spacer', data: { height: 20 }};
                break;
            case 'heading':
                newElement = { id: generateId(), type: 'heading', data: { content: 'Título (H2)', level: 'h2' }}; 
                break;
            case 'paragraph':
                newElement = { id: generateId(), type: 'paragraph', data: { content: 'Nuevo párrafo de texto.' }};
                break;
            case 'image':
                newElement = { id: generateId(), type: 'image', data: { imageUrl: '', alt: 'Imagen' }};
                break;
            case 'button':
                newElement = { id: generateId(), type: 'button', data: { buttonText: 'Botón', buttonLink: '#' }};
                break;
            default: 
                return;
        }
        
        const newElements = [...customElements];
        newElements.splice(insertIndex, 0, newElement);
        setCustomElements(newElements);
        setInsertingType(null);
        setMobilePanelOpen('settings');
    };

    // Nueva función para agregar un slot dinámico
    const handleAddNewSlot = () => {
        const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newSlot: StackElement = {
            id: generateId(),
            type: 'slot' as StackElementType,
            data: {
                isEmpty: true,
                slotType: 'generic',
                placeholder: 'Slot personalizado',
                acceptedTypes: ['heading', 'paragraph', 'button', 'image', 'link', 'logo', 'actions']
            }
        };
        setCustomElements([...customElements, newSlot]);
    };

    // Nueva función para llenar un slot específico
    const handleFillSlot = (slotId: string, elementType: StackElementType) => {
        if (!insertingType) return;
        
        const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
        let elementData: Record<string, unknown>;
        
        switch(insertingType) {
            case 'logo':
                elementData = { content: 'Mi Logo' };
                break;
            case 'link':
                elementData = { content: 'Enlace', href: '#' };
                break;
            case 'actions':
                elementData = { buttonText: 'Acción', buttonLink: '#' };
                break;
            case 'heading':
                elementData = { content: 'Título', level: 'h2' };
                break;
            case 'paragraph':
                elementData = { content: 'Texto' };
                break;
            case 'image':
                elementData = { imageUrl: '', alt: 'Imagen' };
                break;
            case 'button':
                elementData = { buttonText: 'Botón', buttonLink: '#' };
                break;
            default: 
                return;
        }

        const newElements = customElements.map(el => 
            el.id === slotId 
                ? { 
                    ...el, 
                    type: insertingType,
                    data: { 
                        ...el.data, 
                        isEmpty: false, ...elementData 
                    } 
                } as StackElement
                : el
        );
        
        setCustomElements(newElements as StackElement[]);
        setInsertingType(null);
        setMobilePanelOpen('settings');
    };

    const removeElement = (id: string) => {
        setCustomElements(customElements.filter(el => el.id !== id));
    };

    const moveElement = (id: string, direction: 'up' | 'down') => {
        const index = customElements.findIndex(el => el.id === id);
        if (index === -1) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= customElements.length) return;
        const newElements = [...customElements];
        [newElements[index], newElements[newIndex]] = [newElements[newIndex], newElements[index]];
        setCustomElements(newElements);
    };

    const updateElement = (id: string, newData: Partial<StackElement['data']>) => {
        setCustomElements(customElements.map(el => 
            el.id === id ? { ...el, data: { ...el.data, ...newData } } : el
        ));
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
                <aside className="hidden md:block w-80 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-800">Elementos del Bloque</h3>
                        <p className="text-sm text-slate-500">Añade, edita y organiza los sub-elementos.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {customElements.map((element, index) => (
                            <ElementItem 
                                key={element.id} 
                                element={element} 
                                index={index}
                                total={customElements.length}
                                onMove={moveElement}
                                onRemove={removeElement}
                                onUpdate={updateElement}
                            />
                        ))}
                        {customElements.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-8">No hay elementos. Añade uno abajo.</p>
                        )}
                    </div>
                    <div className="p-4 border-t border-slate-200">
                        <AddElementDropdown onAdd={handleAddElementSelect} insertingType={insertingType} />
                    </div>
                </aside>

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
                        
                        {/* Estructura LEGO para Header */}
                        {block.type === 'header' && (
                            <div className="space-y-4">
                                <div className="text-sm text-slate-600 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                            🏗️ Estructura Header
                                        </span>
                                        {insertingType && (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                Selecciona dónde colocar: {insertingType}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleAddNewSlot}
                                        className="flex items-center gap-1 px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                        disabled={insertingType !== null}
                                    >
                                        <PlusIcon className="w-3 h-3" />
                                        Agregar Slot
                                    </button>
                                </div>

                                {/* Layout tipo LEGO para header */}
                                <div className={cn(
                                    "grid gap-4 p-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50/50",
                                    customElements.length <= 3 ? "grid-cols-3" : customElements.length === 4 ? "grid-cols-4" : "grid-cols-5"
                                )}>
                                    {customElements.map((element, index) => {
                                        const elementData = element.data as StackElement['data'] & { isEmpty?: boolean; slotType?: string; acceptedTypes?: string[]; placeholder?: string; content?: unknown };
                                        const isSlot = element.type === 'slot' || elementData.isEmpty;
                                        const isCompatibleSlot = insertingType && (
                                            (elementData.slotType === 'logo' && ['logo', 'image'].includes(insertingType)) ||
                                            (elementData.slotType === 'navigation' && ['link', 'button'].includes(insertingType)) ||
                                            (elementData.slotType === 'actions' && ['button', 'actions'].includes(insertingType)) ||
                                            (elementData.slotType === 'generic' && elementData.acceptedTypes?.includes(insertingType))
                                        );

                                        return (
                                            <div
                                                key={element.id}
                                                className={cn(
                                                    "min-h-[80px] border-2 rounded-lg p-4 transition-all duration-200 flex items-center justify-center relative group",
                                                    {
                                                        // Slot vacío
                                                        'border-dashed border-slate-300 bg-white/50': isSlot,
                                                        // Slot compatible con elemento a insertar
                                                        'border-green-400 bg-green-50 cursor-pointer hover:bg-green-100': isSlot && isCompatibleSlot,
                                                        // Slot incompatible
                                                        'border-red-200 bg-red-50/30': isSlot && insertingType && !isCompatibleSlot,
                                                        // Slot lleno
                                                        'border-blue-300 bg-blue-50': !isSlot,
                                                        // Hover effects
                                                        'hover:border-blue-400': !isSlot,
                                                        'scale-105': isSlot && isCompatibleSlot && insertingType,
                                                    }
                                                )}
                                                onClick={() => {
                                                    if (insertingType && isCompatibleSlot) {
                                                        handleFillSlot(element.id, insertingType);
                                                    }
                                                }}
                                            >
                                                {/* Contenido del slot */}
                                                {isSlot ? (
                                                    <div className="text-center">
                                                        <div className="text-2xl mb-2">
                                                            {elementData.slotType === 'logo' && '🏷️'}
                                                            {elementData.slotType === 'navigation' && '🧭'}
                                                            {elementData.slotType === 'actions' && '⚡'}
                                                            {elementData.slotType === 'generic' && '📦'}
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {elementData.placeholder}
                                                        </p>
                                                        {isCompatibleSlot && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <PlusIcon className="w-8 h-8 text-green-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    // Elemento lleno
                                                    <div className="w-full text-center relative">
                                                        {element.type === 'logo' && (
                                                            <div className="font-bold text-lg text-blue-600">
                                                                {elementData.content || 'Logo'}
                                                            </div>
                                                        )}
                                                        {element.type === 'heading' && (
                                                            <h2 className="text-lg font-bold text-slate-800">
                                                                {elementData.content || 'Título'}
                                                            </h2>
                                                        )}
                                                        {element.type === 'link' && (
                                                            <a href={elementData.href || '#'} className="text-blue-600 underline">
                                                                {elementData.content || 'Enlace'}
                                                            </a>
                                                        )}
                                                        {element.type === 'button' && (
                                                            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                                                                {elementData.buttonText || 'Botón'}
                                                            </button>
                                                        )}
                                                        {element.type === 'actions' && (
                                                            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                                                                {elementData.buttonText || 'Acción'}
                                                            </button>
                                                        )}
                                                        {element.type === 'image' && (
                                                            <div className="w-full h-16 bg-slate-200 rounded flex items-center justify-center">
                                                                {elementData.imageUrl ? (
                                                                    <img src={elementData.imageUrl} alt={elementData.alt} className="max-h-full max-w-full object-contain" />
                                                                ) : (
                                                                    <span className="text-slate-500 text-sm">🖼️ Imagen</span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Controles para elementos llenos */}
                                                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    // Convertir de vuelta a slot vacío
                                                                    const newElements = customElements.map(el => 
                                                                        el.id === element.id 
                                                                            ? { 
                                                                                ...el,                                                                        type: 'slot' as StackElementType,
                                                                        data: { 
                                                                            ...el.data, 
                                                                            isEmpty: true, 
                                                                            content: undefined
                                                                        }
                                                                            }
                                                                            : el
                                                                    );
                                                                    setCustomElements(newElements);
                                                                }} 
                                                                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                                                title="Vaciar slot"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Instrucciones */}
                                <div className={cn(
                                    "text-center text-sm mt-4 p-3 rounded-lg",
                                    insertingType ? "bg-green-50 text-green-700" : "bg-blue-50 text-slate-500"
                                )}>
                                    {insertingType ? (
                                        <>
                                            ✨ <strong>Modo inserción activo:</strong> Haz clic en cualquier slot compatible para colocar el elemento {insertingType}
                                        </>
                                    ) : (
                                        <>
                                            💡 <strong>Cómo usar:</strong> Selecciona un elemento del panel lateral, luego haz clic en el slot compatible para colocarlo
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Renderizado normal para otros tipos de bloques */}
                        {block.type !== 'header' && (
                            <div className="flex flex-col gap-0 relative">
                                {customElements.map((element, index) => {
                                    const isSelected = true;
                                    
                                    const renderInsertionPoint = (pointIndex: number) => (
                                        <div 
                                            key={`insert-${pointIndex}`}
                                            className={cn(
                                                "relative flex items-center justify-center h-4 group",
                                                { 'h-10 cursor-pointer': insertingType }
                                            )}
                                            onClick={() => insertingType && handleInsertElement(pointIndex)}
                                        >
                                            <div className={cn(
                                                "h-0.5 bg-slate-200 w-full transition-all duration-300",
                                                { 'h-1 bg-blue-500 group-hover:h-2': insertingType }
                                            )}/>
                                            {insertingType && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlusIcon className="w-6 h-6 bg-blue-600 text-white rounded-full p-0.5" />
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div key={element.id} className="relative">
                                            {renderInsertionPoint(index)}
                                            <div className={cn("p-2 cursor-pointer transition-all relative group", {
                                                'ring-2 ring-blue-500 ring-offset-2 rounded-md': isSelected,
                                                'hover:bg-slate-50': !isSelected,
                                            })}>
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
                                                                    handleFillSlot(element.id, insertingType);
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
                                                            removeElement(element.id);
                                                        }} 
                                                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                                        title="Eliminar elemento"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                <div 
                                    className={cn(
                                        "relative flex items-center justify-center h-4 group",
                                        { 'h-10 cursor-pointer': insertingType }
                                    )}
                                    onClick={() => insertingType && handleInsertElement(customElements.length)}
                                >
                                    <div className={cn(
                                        "h-0.5 bg-slate-200 w-full transition-all duration-300",
                                        { 'h-1 bg-blue-500 group-hover:h-2': insertingType }
                                    )}/>
                                    {insertingType && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlusIcon className="w-6 h-6 bg-blue-600 text-white rounded-full p-0.5" />
                                        </div>
                                    )}
                                </div>

                                {customElements.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-slate-500 mb-4">No hay elementos en este bloque</p>
                                        <p className="text-sm text-slate-400">Usa el panel lateral para añadir elementos</p>
                                    </div>
                                )}

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
                                        {['heading','paragraph','image','button','spacer','logo','link','actions','slot'].map((t) => (
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
        </div>
     );
}

// --- Helper functions for Advanced Editor ---
function getDefaultDataForType(type: StackElementType): StackElement['data'] {
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

// --- ElementItem Component ---
function ElementItem({ element, index, total, onMove, onRemove, onUpdate }: {
    element: StackElement;
    index: number;
    total: number;
    onMove: (id: string, direction: 'up' | 'down') => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, data: Partial<StackElement['data']>) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(element.data);

    const handleSave = () => {
        onUpdate(element.id, editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(element.data);
        setIsEditing(false);
    };

    const getElementLabel = (type: StackElementType) => {
        const labels = {
            heading: 'Título',
            paragraph: 'Párrafo',
            image: 'Imagen',
            button: 'Botón',
            spacer: 'Espaciador',
            logo: 'Logo',
            link: 'Enlace',
            actions: 'Acción',
            slot: 'Slot'
        };
        return labels[type] || type;
    };

    return (
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-slate-700">{getElementLabel(element.type)}</span>
                <div className="flex gap-1">
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                    <button 
                        onClick={() => onRemove(element.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
            <div className="flex gap-1 mb-2">
                <button 
                    onClick={() => onMove(element.id, 'up')}
                    disabled={index === 0}
                    className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    ↑
                </button>
                <button 
                    onClick={() => onMove(element.id, 'down')}
                    disabled={index === total - 1}
                    className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    ↓
                </button>
            </div>
            {isEditing && (
                <div className="space-y-2">
                    {element.type === 'heading' && (
                        <>
                            <input
                                type="text"
                                value={editData.content || ''}
                                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="Contenido del título"
                            />
                            <select
                                value={editData.level || 'h2'}
                                onChange={(e) => setEditData({ ...editData, level: e.target.value as 'h2' | 'h3' | 'h4' })}
                                className="w-full p-1 border rounded text-sm"
                            >
                                <option value="h2">H2</option>
                                <option value="h3">H3</option>
                                <option value="h4">H4</option>
                            </select>
                        </>
                    )}
                    {element.type === 'paragraph' && (
                        <textarea
                            value={editData.content || ''}
                            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                            className="w-full p-1 border rounded text-sm"
                            placeholder="Contenido del párrafo"
                            rows={3}
                        />
                    )}
                    {element.type === 'image' && (
                        <>
                            <input
                                type="text"
                                value={editData.imageUrl || ''}
                                onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="URL de la imagen"
                            />
                            <input
                                type="text"
                                value={editData.alt || ''}
                                onChange={(e) => setEditData({ ...editData, alt: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="Texto alternativo"
                            />
                        </>
                    )}
                    {element.type === 'button' && (
                        <>
                            <input
                                type="text"
                                value={editData.buttonText || ''}
                                onChange={(e) => setEditData({ ...editData, buttonText: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="Texto del botón"
                            />
                            <input
                                type="text"
                                value={editData.buttonLink || ''}
                                onChange={(e) => setEditData({ ...editData, buttonLink: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="Enlace del botón"
                            />
                        </>
                    )}
                    {element.type === 'spacer' && (
                        <input
                            type="number"
                            value={editData.height || 20}
                            onChange={(e) => setEditData({ ...editData, height: parseInt(e.target.value) })}
                            className="w-full p-1 border rounded text-sm"
                            placeholder="Altura en píxeles"
                        />
                    )}
                    {element.type === 'logo' && (
                        <input
                            type="text"
                            value={editData.content || ''}
                            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                            className="w-full p-1 border rounded text-sm"
                            placeholder="Texto del logo"
                        />
                    )}
                    {element.type === 'link' && (
                        <>
                            <input
                                type="text"
                                value={editData.content || ''}
                                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="Texto del enlace"
                            />
                            <input
                                type="text"
                                value={editData.href || ''}
                                onChange={(e) => setEditData({ ...editData, href: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="URL del enlace"
                            />
                        </>
                    )}
                    {element.type === 'actions' && (
                        <>
                            <select
                                value={editData.platform || 'facebook'}
                                onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                            >
                                <option value="facebook">Facebook</option>
                                <option value="twitter">Twitter</option>
                                <option value="instagram">Instagram</option>
                            </select>
                            <input
                                type="text"
                                value={editData.href || ''}
                                onChange={(e) => setEditData({ ...editData, href: e.target.value })}
                                className="w-full p-1 border rounded text-sm"
                                placeholder="URL de la acción"
                            />
                        </>
                    )}
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="text-xs px-2 py-1 bg-green-500 text-white rounded">Guardar</button>
                        <button onClick={handleCancel} className="text-xs px-2 py-1 bg-gray-500 text-white rounded">Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- AddElementDropdown Component ---
function AddElementDropdown({ onAdd, insertingType }: { onAdd: (type: StackElementType) => void, insertingType: StackElementType | null }) {
    const [isOpen, setIsOpen] = useState(false);

    const elementTypes: { type: StackElementType; label: string; icon: string }[] = [
        { type: 'heading', label: 'Título', icon: '📝' },
        { type: 'paragraph', label: 'Párrafo', icon: '📄' },
        { type: 'image', label: 'Imagen', icon: '🖼️' },
        { type: 'button', label: 'Botón', icon: '🔘' },
        { type: 'spacer', label: 'Espaciador', icon: '⬜' },
        { type: 'logo', label: 'Logo', icon: '🏷️' },
        { type: 'link', label: 'Enlace', icon: '🔗' },
        { type: 'actions', label: 'Acción', icon: '⚡' },
        { type: 'slot', label: 'Slot', icon: '📦' },
    ];

    return (
        <div className="relative">
            {insertingType ? (
                <div className="w-full p-3 bg-green-100 border border-green-300 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-800">
                        ✅ Insertando: {elementTypes.find(et => et.type === insertingType)?.label}
                    </p>
                    <p className="text-xs text-green-600">Haz clic en el canvas para colocar</p>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Añadir Elemento
                    </button>
                    {isOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow p-2 z-20">
                            <div className="grid grid-cols-2 gap-2">
                                {elementTypes.map((et) => (
                                    <button
                                        key={et.type}
                                        onClick={() => { onAdd(et.type); setIsOpen(false); }}
                                        className="flex items-center gap-2 p-2 text-sm rounded hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="text-lg">{et.icon}</span>
                                        <span>{et.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// --- Componente: AdvancedMobileToolbar (Panel Flotante Inferior) ---
interface AdvancedMobileToolbarProps {
    onOpenPanel: (group: 'elements' | 'styles' | 'settings') => void;
    onAddElement: () => void;
    isEditing: boolean;
}

const AdvancedMobileToolbar: React.FC<AdvancedMobileToolbarProps> = ({ onOpenPanel, isEditing }) => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl p-3">
        <div className="flex justify-around items-center max-w-md mx-auto relative">
            <button
                onClick={() => onOpenPanel('elements')}
                className="flex flex-col items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                <AlignJustify className="w-6 h-6" />
                <span>Elementos</span>
            </button>
            <button
                onClick={() => onOpenPanel('styles')}
                className="flex flex-col items-center text-sm font-medium text-slate-600 hover:text-slate-800"
            >
                <Settings className="w-6 h-6" />
                <span>Estilos</span>
            </button>
            <button
                onClick={() => onOpenPanel('settings')}
                className="flex flex-col items-center text-sm font-medium text-slate-600 hover:text-slate-800"
            >
                <Edit className="w-6 h-6" />
                <span>Ajustes</span>
            </button>
        </div>
    </div>
);

// --- Página Principal del Editor ---
export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  // useParams returns route params in the App Router; handle string|array|undefined safely
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [isMobileEdit, setIsMobileEdit] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [newBlockId, setNewBlockId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [addComponentPanelOpen, setAddComponentPanelOpen] = useState(false);
  const [isAddComponentPanelOpen, setIsAddComponentPanelOpen] = useState(false);
  const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const editorFirstFocusRef = useRef<HTMLButtonElement | null>(null);
  const [isAdvancedEditingId, setIsAdvancedEditingId] = useState<number | null>(null);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'style'>('content');

  // Categorization and ordering for blocks (used in sidebars/panels)
  const categoryOrder = ['Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'] as const;
  const categorizedBlocks = React.useMemo(() => {
    return Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
      const category = (blockInfo as BlockConfig<BlockData> & { category?: string }).category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push({ key, ...(blockInfo as BlockConfig<BlockData>) });
      return acc;
    }, {} as Record<string, Array<{ key: string } & BlockConfig<BlockData>>>)
  }, []);

  // Canvas width helper (tailwind classes)
  const canvasWidthClass = previewMode === 'mobile' ? 'max-w-xs' : previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-4xl';

  // Derived object for the block currently being edited
  const editingBlock = editingBlockId !== null ? blocks.find(b => b.id === editingBlockId) ?? null : null;

  // Notifier helper using react-toastify
  const showNotification = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'error') toast.error(message);
    else if (type === 'info') toast.info(message);
    else toast.success(message);
  }, []);

  // --- Efectos y Cargas Iniciales ---
  const loadTenant = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTenant(data.tenant);
        const content = data.tenant.pages[0]?.content || '[]';
        // Asegurarse de parsear correctamente o inicializar vacío
        try {
          const parsedContent = JSON.parse(content);
          setBlocks(Array.isArray(parsedContent) ? parsedContent : []);
        } catch {
          setBlocks([]); // Si hay error al parsear, empezar con array vacío
        }
      } else { router.push('/dashboard/sites'); }
    } catch (error) {
      console.error('Error al cargar:', error);
      router.push('/dashboard/sites');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { loadTenant(); }, [loadTenant]);

  const saveTenant = useCallback(async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      setEditingBlockId(null); // Cerrar panel de edición antes de guardar
      await new Promise(resolve => setTimeout(resolve, 50)); // Pequeño delay
      const jsonContent = JSON.stringify(blocks);
      const updatedTenant = { 
        ...tenant, 
        pages: tenant.pages.map((page) => page.slug === '/' ? { ...page, content: jsonContent } : page ),
      };
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updatedTenant) });
      if (res.ok) {
        showNotification('Sitio guardado exitosamente');
      } else { throw new Error('Failed to save'); }
    } catch (error) {
      showNotification('Error al guardar el sitio', 'error');
    } finally {
      setSaving(false);
    }
  }, [blocks, id, showNotification, tenant]);

  // Funciones de manejo de bloques
  const addBlock = (blockType: BlockType, data: BlockData) => {
    const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data }; // + Math.random() para IDs más únicos
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setNewBlockId(newBlock.id); // Guardar ID para resalte
    setActiveBlockType(null);
    setAddComponentPanelOpen(false); // Cerrar panel móvil si está abierto
  };
  
  const updateBlockData = useCallback((blockId: number, newData: BlockData) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, data: newData } : b));
  }, []);

  const handleDataChange = useCallback((newData: BlockData) => {
    if (editingBlockId) {
      updateBlockData(editingBlockId, newData);
    }
  }, [editingBlockId, updateBlockData]);

  const updateBlockProperty = useCallback((blockId: number, key: string, value: unknown) => {
    setBlocks(prevBlocks => 
        prevBlocks.map(b => 
            b.id === blockId 
            ? { ...b, data: { ...b.data, [key]: value } } 
            : b
        )
    );
  }, []);

  const deleteBlock = (blockId: number) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (editingBlockId === blockId) setEditingBlockId(null);
  };
  
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  };
  
  // Helpers para aplicar cambios desde los editores internos (moved below so update functions exist)
  const applyEditorUpdate = useCallback((key: string, value: unknown) => {
    if (!editingBlockId) return;
    updateBlockProperty(editingBlockId, key, value);
  }, [editingBlockId, updateBlockProperty]);

  const replaceEditorData = useCallback((newData: BlockData) => {
    if (!editingBlockId) return;
    updateBlockData(editingBlockId, newData);
  }, [editingBlockId, updateBlockData]);

  // Efecto para scroll y resalte
  useEffect(() => {
    if (newBlockId && blockRefs.current[newBlockId]) {
        const blockElement = blockRefs.current[newBlockId];
        setTimeout(() => {
            blockElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); // Pequeño delay para asegurar que el DOM está listo

        const timer = setTimeout(() => {
            setNewBlockId(null); // Limpiar el ID después de la animación
        }, 1600); // Duración de animación + margen

        return () => clearTimeout(timer); // Limpieza al desmontar o si cambia newBlockId
    }
  }, [newBlockId]); 

  // Renderizado
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

  // Obtener el editor dinámico para el bloque en edición
  const activeBlock = editingBlock;
  const ActiveBlockConfig = activeBlock ? BLOCKS[activeBlock.type] : null;
  const ActiveEditor = ActiveBlockConfig?.editor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
  const ActiveStyleEditor = ActiveBlockConfig?.styleEditor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
  // Safely pick the icon component to avoid optional-chaining directly in JSX
  const ActiveIcon = ActiveBlockConfig?.icon as React.ElementType | undefined;

  return (
    <PreviewModeContext.Provider value={{ mode: previewMode, isMobile: previewMode === 'mobile', isTablet: previewMode === 'tablet', isDesktop: previewMode === 'desktop' }}>
      <>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex flex-col h-screen bg-slate-100 font-sans">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 z-30 shrink-0">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard/sites')} className="text-slate-500 hover:text-slate-800 text-xl">←</button>
              <div>
                <h1 className="font-semibold text-slate-800">{tenant?.name}</h1>
                <p className="text-xs text-slate-500">{tenant?.slug}.gestularia.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const isLocal = window.location.hostname === 'localhost' || window.location.hostname.endsWith('.localhost');
                  const url = isLocal
                    ? `http://${tenant?.slug}.localhost:3000`
                    : `https://${tenant?.slug}.gestularia.com`;
                  window.open(url, '_blank');
                }}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
              >
                Ir al sitio
              </button>
              <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Panel Lateral Desktop (CON FILTROS) */}
          <aside className="w-80 bg-white border-r border-slate-200 p-4 flex flex-col hidden md:flex">
              <h2 className="font-semibold text-slate-800 px-2 pb-2 flex-shrink-0">Componentes</h2>
              <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                  {['Todos', ...categoryOrder].map(category => (
                      <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                              "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors",
                              selectedCategory === category
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                      >
                          {category}
                      </button>
                  ))}
              </div>
              <div className="overflow-y-auto space-y-4">
                  {categoryOrder
                      .filter(category => selectedCategory === 'Todos' || selectedCategory === category)
                      .map(category => (
                      <div key={category}>
                          <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider px-2 mb-2">{category}</h3>
                          <div className="space-y-1">
                              {(categorizedBlocks[category] || []).map((blockInfo) => {
                                  const Icon = blockInfo.icon;
                                  return (
                                      <button key={blockInfo.key} onClick={() => setActiveBlockType(blockInfo.key as BlockType)} className="w-full p-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                                          <div className="flex items-center gap-3">
                                              <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} /></div>
                                              <div>
                                                  <p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p>
                                                  <p className="text-xs text-slate-500">{blockInfo.description}</p>
                                              </div>
                                          </div>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  ))}
              </div>
          </aside>

          {/* Lienzo Principal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              <div id="editor-canvas" className={cn("mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 min-h-[60vh] flex flex-col gap-0", canvasWidthClass)}>
                {blocks.map((block, index) => (
                  <BlockRenderer 
                      key={block.id} 
                      ref={el => { blockRefs.current[block.id] = el; }}
                      isHighlighted={block.id === newBlockId}
                      block={block} 
                      isEditing={editingBlockId === block.id} 
                      isMobileEdit={isMobileEdit}
                      onUpdate={(key, value) => updateBlockProperty(block.id, key, value)}
                      onDelete={() => deleteBlock(block.id)} 
                      onEdit={editingBlockId === null && isAdvancedEditingId === null 
                          ? () => {
                              // Determinar si es un bloque 'custom' (Avanzado)
                              if (block.type === 'header' && block.data.variant === 'custom') {
                                  setIsAdvancedEditingId(block.id);
                                  setEditingBlockId(block.id); // <--- AÑADIDO: ¡Esto activa 'activeBlock'!
                              } else {
                                  setEditingBlockId(block.id);
                              }
                          } 
                          : undefined}
                      onClose={() => setEditingBlockId(null)}
                      onMoveUp={editingBlockId === null && index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                      onMoveDown={editingBlockId === null && index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
                  />
                ))}
                {/* Botón de Adición al final del lienzo (Desktop/Tablet) */}
                {blocks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200/50">
                        <button
                            onClick={() => {
                                // En desktop/tablet, abrimos el modal de selección de variantes directamente
                                // sin necesidad de la experiencia móvil
                                setAddComponentPanelOpen(true);
                            }}
                            className="w-full bg-slate-100 text-slate-600 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Añadir Bloque
                        </button>
                    </div>
                )}
                {/* Placeholder si no hay bloques */}
                {blocks.length === 0 && (
                  <div className="text-center py-24 border-2 border-dashed rounded-lg">
                    <p className="text-5xl mb-4">🎨</p>
                    <p className="font-semibold text-slate-700 mb-4 text-lg">Tu lienzo está en blanco</p>
                    <button
                        onClick={() => {
                            // Abrir panel de adición según el dispositivo
                            setAddComponentPanelOpen(true);
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Añadir tu primer bloque
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Panel Modal para Añadir Bloque (variantes) */}
          {activeBlockType && <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />}
          {isAddComponentPanelOpen && previewMode === 'mobile' && (
          <MobileAddComponentPanel
            onClose={() => setAddComponentPanelOpen(false)}
            onSelectBlock={(type) => { setActiveBlockType(type); setAddComponentPanelOpen(false); }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
          {isAddComponentPanelOpen && (previewMode === 'desktop' || previewMode === 'tablet') && (
          <DesktopAddComponentPanel
            onClose={() => setAddComponentPanelOpen(false)}
            onSelectBlock={(type) => { setActiveBlockType(type); setAddComponentPanelOpen(false); }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        </main>

        {/* Barra de Herramientas Móvil (Edición/Preview) */}
        <MobileToolbar isEditing={isMobileEdit} onToggleEditing={setIsMobileEdit} />

        {/* Botón Flotante Añadir en Móvil (solo en modo edición) */}
        {isMobileEdit && (
          <div className="md:hidden fixed bottom-6 right-6 z-40">
              <button
                  onClick={() => setAddComponentPanelOpen(true)}
                  className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
              >
                  <PlusIcon className="w-7 h-7" />
              </button>
          </div>
        )}

        {/* Editor lateral / modal para editar bloque seleccionado */}
        {activeBlock && (
          <>
            {/* Desktop: right drawer */}
            <div className="hidden md:block">
              <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-slate-200 shadow-lg z-[60] p-4 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${ActiveBlockConfig?.theme.bg}`}>
                      {ActiveIcon && <ActiveIcon className={`w-6 h-6 ${ActiveBlockConfig?.theme.icon}`} />}
                    </div>
                    <div>
                      <h3 className="font-semibold">Editar {ActiveBlockConfig?.name}</h3>
                      <p className="text-xs text-slate-500">Bloque #{activeBlock.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button ref={editorFirstFocusRef} onClick={() => { setEditingBlockId(null); }} className="text-slate-500 hover:text-slate-800">Cerrar</button>
                  </div>
                </div>
                
                <div className="mb-4 border-b pb-2">
                  <nav className="flex gap-2">
                    <button onClick={() => setEditorTab('content')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'content' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Contenido</button>
                    <button onClick={() => setEditorTab('style')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'style' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Estilo</button>
                  </nav>
                </div>

                <div>
                  {editorTab === 'content' ? (
                    ActiveEditor ? (
                      <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                    ) : (
                      <p>No hay editor de contenido para este bloque ({activeBlock.type}).</p>
                    )
                  ) : editorTab === 'style' ? (
                    ActiveStyleEditor ? (
                      <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                    ) : (
                      <p>No hay editor de estilo para este bloque ({activeBlock.type}).</p>
                    )
                  ) : null}
                </div>
              </aside>
            </div>

            {/* Mobile: full screen modal when editing on small screens */}
            <Transition show={!!activeBlock} as={Fragment}>
              <div className="md:hidden">
                <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="fixed inset-0 bg-black/40 z-[50]" onClick={() => setEditingBlockId(null)} />
                </Transition.Child>

                <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-200" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-150" leaveFrom="translate-y-0" leaveTo="translate-y-full">
                  <div className="fixed inset-x-0 bottom-0 z-[60] h-[80vh] bg-white rounded-t-xl shadow-xl p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Editar {ActiveBlockConfig?.name}</h3>
                      <button onClick={() => setEditingBlockId(null)} className="text-slate-500">Cerrar</button>
                    </div>

                    <div className="mb-4 border-b pb-2">
                      <nav className="flex gap-2">
                        <button onClick={() => setEditorTab('content')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'content' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Contenido</button>
                        <button onClick={() => setEditorTab('style')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'style' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Estilo</button>
                      </nav>
                    </div>

                    <div>
                      {editorTab === 'content' ? (
                        ActiveEditor ? (
                          <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                        ) : (
                          <p>No hay editor de contenido para este bloque ({activeBlock.type}).</p>
                        )
                      ) : editorTab === 'style' ? (
                        ActiveStyleEditor ? (
                          <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                        ) : (
                          <p>No hay editor de estilo para este bloque ({activeBlock.type}).</p>
                        )
                      ) : null}
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Transition>
          </>
        )}

        {/* Renderizado Condicional del Editor */}
        {activeBlock && (
          <>
            {isAdvancedEditingId === activeBlock.id ? (
              <AdvancedEditorCanvas 
                block={activeBlock}
                onClose={() => setIsAdvancedEditingId(null)}
                // onSave utiliza la función handleDataChange que actualiza blocks, luego cierra el modo avanzado.
                onSave={(newData: BlockData) => { 
                  updateBlockData(activeBlock.id, newData);
                  setIsAdvancedEditingId(null); 
                  setEditingBlockId(null); // Asegurar que el editor normal también se cierre
                }}
              />
            ) : (
              <>
                {/* Desktop: right drawer (Editor de Contenido/Estilo Normal) */}
                <div className="hidden md:block">
                  <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-slate-200 shadow-lg z-[60] p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${ActiveBlockConfig?.theme.bg}`}>
                          {ActiveIcon && <ActiveIcon className={`w-6 h-6 ${ActiveBlockConfig?.theme.icon}`} />}
                        </div>
                        <div>
                          <h3 className="font-semibold">Editar {ActiveBlockConfig?.name}</h3>
                          <p className="text-xs text-slate-500">Bloque #{activeBlock.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button ref={editorFirstFocusRef} onClick={() => { setEditingBlockId(null); }} className="text-slate-500 hover:text-slate-800">Cerrar</button>
                      </div>
                    </div>
                    
                    <div className="mb-4 border-b pb-2">
                      <nav className="flex gap-2">
                        <button onClick={() => setEditorTab('content')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'content' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Contenido</button>
                        <button onClick={() => setEditorTab('style')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'style' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Estilo</button>
                      </nav>
                    </div>

                    <div>
                      {editorTab === 'content' ? (
                        ActiveEditor ? (
                          <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                        ) : (
                          <p>No hay editor de contenido para este bloque ({activeBlock.type}).</p>
                        )
                      ) : editorTab === 'style' ? (
                        ActiveStyleEditor ? (
                          <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                        ) : (
                          <p>No hay editor de estilo para este bloque ({activeBlock.type}).</p>
                        )
                      ) : null}
                    </div>
                  </aside>
                </div>

                {/* Mobile: full screen modal when editing on small screens (Editor Normal) */}
                <Transition show={!!activeBlock} as={Fragment}>
                  <div className="md:hidden">
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <div className="fixed inset-0 bg-black/40 z-[50]" onClick={() => setEditingBlockId(null)} />
                    </Transition.Child>

                    <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-200" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-150" leaveFrom="translate-y-0" leaveTo="translate-y-full">
                      <div className="fixed inset-x-0 bottom-0 z-[60] h-[80vh] bg-white rounded-t-xl shadow-xl p-4 overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Editar {ActiveBlockConfig?.name}</h3>
                          <button onClick={() => setEditingBlockId(null)} className="text-slate-500">Cerrar</button>
                        </div>

                        <div className="mb-4 border-b pb-2">
                          <nav className="flex gap-2">
                            <button onClick={() => setEditorTab('content')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'content' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Contenido</button>
                            <button onClick={() => setEditorTab('style')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'style' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Estilo</button>
                          </nav>
                        </div>

                        <div>
                          {editorTab === 'content' ? (
                            ActiveEditor ? (
                              <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                            ) : (
                              <p>No hay editor de contenido para este bloque ({activeBlock.type}).</p>
                            )
                          ) : editorTab === 'style' ? (
                            ActiveStyleEditor ? (
                              <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                            ) : (
                              <p>No hay editor de estilo para este bloque ({activeBlock.type}).</p>
                            )
                          ) : null}
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Transition>
              </>
            )}
          </>
        )}

      </div>
      </>
    </PreviewModeContext.Provider>
  );
}

// Stub for ActiveElementEditor used in mobile modal (keeps editor functional until full implementation)
function ActiveElementEditor() {
    return (
        <div className="p-2 text-sm text-slate-700">
            <p className="font-medium">Editor de Elemento Activo</p>
            <p className="text-xs text-slate-500">Selecciona un elemento en la lista para editar sus propiedades.</p>
        </div>
    );
}