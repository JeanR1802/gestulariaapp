import React from 'react';
import { PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ELEMENT_TYPES } from '../utils/elementHelpers';
import { StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { cn } from '@/lib/utils';

interface EditorSidebarProps {
    onAddElementSelect: (type: StackElementType) => void;
    onToggleProperties?: () => void;
    showProperties?: boolean;
    headerMode?: 'fijo' | 'dinamico';
    onModeChange?: (mode: 'fijo' | 'dinamico') => void;
    onShowElements?: () => void;
}

export function EditorSidebar({ onAddElementSelect, onToggleProperties, showProperties, headerMode = 'fijo', onModeChange, onShowElements }: EditorSidebarProps) {
    return (
        <aside className="hidden md:flex w-96 bg-white border-r border-slate-200 transition-all duration-300">
            <div className="w-20 bg-slate-900 flex flex-col items-center py-4 gap-4 flex-shrink-0">
                {/* Badge 'Añadir' ahora es un botón que fuerza la vista de elementos; añade efecto hover */}
                <button
                    onClick={() => onShowElements && onShowElements()}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full focus:outline-none transform transition-colors ${showProperties ? 'opacity-70' : 'opacity-100 hover:bg-slate-800/30 hover:scale-105'}`}
                    title="Mostrar elementos"
                >
                    <div className="p-2 rounded-lg bg-blue-600/20 group-hover:bg-blue-600 transition-colors">
                        <PlusIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Añadir</span>
                </button>

                {/* Botón de Propiedades con icono mejorado y etiqueta debajo */}
                <div className="w-full flex flex-col items-center">
                    <button
                        onClick={() => onToggleProperties && onToggleProperties()}
                        className={`p-2 rounded-md text-[12px] flex items-center justify-center transition-colors ${showProperties ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        title="Propiedades del Header"
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                    </button>
                    <span className="text-[11px] text-slate-300 mt-1">Propiedades</span>
                </div>

            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {showProperties ? (
                    <div className="p-5 border-b border-slate-100 bg-white">
                        <h3 className="font-bold text-slate-800 text-lg">Propiedades</h3>
                        <p className="text-sm text-slate-500 mt-1">Ajusta el modo de posicionamiento del header.</p>

                        <div className="mt-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onModeChange && onModeChange('fijo')}
                                    className={cn(
                                        "flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                                        headerMode === 'fijo' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                                    )}
                                >
                                    <div className="flex flex-col items-center text-xs">
                                        <span>🔒</span>
                                        <span>Modo Fijo</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => onModeChange && onModeChange('dinamico')}
                                    className={cn(
                                        "flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                                        headerMode === 'dinamico' ? 'bg-green-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:border-green-300'
                                    )}
                                >
                                    <div className="flex flex-col items-center text-xs">
                                        <span>↔️</span>
                                        <span>Modo Dinámico</span>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-3 text-xs text-slate-600">
                                {headerMode === 'fijo' ? (
                                    <p><strong>Modo Fijo:</strong> El centro permanece centrado; los laterales no lo tocan.</p>
                                ) : (
                                    <p><strong>Modo Dinámico:</strong> El centro se mueve si los laterales lo empujan.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-5 border-b border-slate-100 bg-white">
                            <h3 className="font-bold text-slate-800 text-lg">Añadir Elemento</h3>
                            <p className="text-sm text-slate-500 mt-1">Elige un componente para insertar.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                            <div className="grid grid-cols-1 gap-3">
                                {ELEMENT_TYPES.filter(et => et.type === 'logo').map((et) => (
                                    <button
                                        key={et.type}
                                        onClick={() => onAddElementSelect(et.type)}
                                        className="flex items-start gap-4 p-4 text-left bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                    >
                                        <span className="text-2xl bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">{et.icon}</span>
                                        <div>
                                            <span className="block font-bold text-slate-800">{et.label}</span>
                                            <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{et.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
             </div>
         </aside>
     );
 }
