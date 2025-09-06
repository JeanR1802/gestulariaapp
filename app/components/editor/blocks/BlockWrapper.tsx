// app/components/editor/blocks/BlockWrapper.tsx (CORREGIDO)
'use client';
import React from 'react';
import { BlockType } from './index';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  blockId: number;
  blockType: BlockType;
}

export const BlockWrapper = ({ children, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockWrapperProps) => {
  // Si el bloque está en modo edición, solo mostramos un anillo azul alrededor.
  if (isEditing) {
    return (
      <div className="relative ring-2 ring-blue-500 rounded-lg">
        {children}
      </div>
    );
  }

  // Si no está en modo edición, mostramos el bloque normal
  // con los controles que aparecen al pasar el ratón.
  return (
    <div className="relative rounded-lg transition-all mb-4 group">
      {/* Controles de Acción (Arriba/Abajo/Eliminar) */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         {onMoveUp && <button onClick={onMoveUp} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white"><ArrowUpIcon className="w-5 h-5 text-gray-700" /></button>}
         {onMoveDown && <button onClick={onMoveDown} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white"><ArrowDownIcon className="w-5 h-5 text-gray-700" /></button>}
         <button onClick={onDelete} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-500 group/trash"><TrashIcon className="w-5 h-5 text-gray-700 group-hover/trash:text-white" /></button>
      </div>
      
      {/* Botón central para editar que aparece al pasar el ratón */}
      <div 
        onClick={onEdit}
        className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg flex items-center justify-center cursor-pointer"
      >
         <div className="bg-white/90 text-gray-800 font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform group-hover:scale-100 scale-90 transition-transform">
            <PencilSquareIcon className="w-5 h-5" />
            Editar Bloque
         </div>
      </div>
      
      {/* Aquí se renderiza el bloque real, sin ninguna etiqueta ni cabecera adicional */}
      {children}
    </div>
  );
};