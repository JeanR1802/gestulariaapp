import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ELEMENT_TYPES } from '../utils/elementHelpers';
import { StackElementType } from '@/app/components/editor/blocks/CustomStackElements';

interface EditorSidebarProps {
    onAddElementSelect: (type: StackElementType) => void;
}

export function EditorSidebar({ onAddElementSelect }: EditorSidebarProps) {
    return (
        <aside className="hidden md:flex w-96 bg-white border-r border-slate-200 transition-all duration-300">
            <div className="w-20 bg-slate-900 flex flex-col items-center py-6 gap-6 flex-shrink-0">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl w-full text-blue-400">
                    <div className="p-2 rounded-lg bg-blue-600/20">
                        <PlusIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium">Añadir</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-white">
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
            </div>
        </aside>
    );
}
