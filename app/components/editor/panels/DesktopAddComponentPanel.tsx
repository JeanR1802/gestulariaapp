import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { BLOCKS, BlockType, BlockData, BlockConfig } from '@/app/components/editor/blocks';

interface DesktopAddComponentPanelProps {
    onClose: () => void;
    onSelectBlock: (type: BlockType) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export function DesktopAddComponentPanel({ onClose, onSelectBlock, selectedCategory, setSelectedCategory }: DesktopAddComponentPanelProps) {
    const categorizedBlocks = Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
        const category = blockInfo.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ key, ...(blockInfo as BlockConfig) });
        return acc;
    }, {} as Record<string, Array<{ key: string } & BlockConfig>>);

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
                                                                <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme?.bg || 'bg-slate-100'}`}><Icon className={`w-7 h-7 ${blockInfo.theme?.icon || 'text-slate-600'}`} /></div>
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
