import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeaderElementRenderer } from './HeaderElementRenderer';

interface HeaderSlotZoneProps {
    zone: 'left' | 'center' | 'right';
    elements: StackElement[];
    slotClass: string;
    insertingType: StackElementType | null;
    onInsert: () => void;
    onRemove: (id: string) => void;
    onOpenAdd: () => void;
    rowOverflow?: boolean;
}

export function HeaderSlotZone({
    zone,
    elements,
    slotClass,
    insertingType,
    onInsert,
    onRemove,
    onOpenAdd,
    rowOverflow = false
}: HeaderSlotZoneProps) {
    // Alineación interna según la zona
    const innerJustify = zone === 'left' ? 'justify-start' : zone === 'right' ? 'justify-end' : 'justify-center';

    return (
        <div
            data-zone={zone}
            className={cn(
                `flex items-center gap-2 transition-all relative ${innerJustify}`,
                {
                    'cursor-pointer hover:bg-green-50/20': insertingType,
                    'outline outline-2 outline-dashed outline-green-400': insertingType && elements.length === 0,
                }
            )}
            onClick={() => {
                if (insertingType) {
                    onInsert();
                } else if (!insertingType && elements.length === 0) {
                    onOpenAdd();
                }
            }}
        >
            {/* Mensaje cuando el slot está vacío y se está insertando */}
            {elements.length === 0 && insertingType && (
                <div className="flex flex-col items-center justify-center px-3 py-4 rounded-lg border border-dashed border-green-300 bg-green-50 text-green-700 transition-all">
                    <PlusIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Clic para insertar</span>
                </div>
            )}
            
            {/* Mensaje de bloqueo cuando hay overflow */}
            {rowOverflow && insertingType && (
                <div className="absolute -top-6 left-0 text-[10px] text-red-600 bg-red-100 px-2 py-1 rounded whitespace-nowrap z-20">
                    ⚠️ Sin espacio
                </div>
            )}

            {/* Renderizar elementos */}
            {elements.map((element) => (
                <div key={element.id} data-header-el className="flex-shrink-0">
                    <HeaderElementRenderer
                        element={element}
                        onRemove={onRemove}
                    />
                </div>
            ))}
        </div>
    );
}
