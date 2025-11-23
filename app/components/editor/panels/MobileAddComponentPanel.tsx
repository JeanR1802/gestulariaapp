import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { BLOCKS, BlockType, BlockData, BlockConfig } from '@/app/components/editor/blocks';

interface MobileAddComponentPanelProps {
    onClose: () => void;
    onSelectBlock: (type: BlockType) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export function MobileAddComponentPanel({ onClose, onSelectBlock, selectedCategory, setSelectedCategory }: MobileAddComponentPanelProps) {
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
