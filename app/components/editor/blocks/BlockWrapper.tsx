// app/components/editor/blocks/BlockWrapper.tsx (CORREGIDO)
'use client';
import React from 'react';
import { BLOCKS, BlockType } from './index';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// --- INICIO DE LA CORRECCIÓN ---
// Añadimos las propiedades que faltaban a la interfaz
interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  blockId: number; // Propiedad que faltaba
  blockType: BlockType; // Propiedad que faltaba
}
// --- FIN DE LA CORRECCIÓN ---

export const BlockWrapper = ({ children, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, blockId, blockType }: BlockWrapperProps) => {
  const blockConfig = BLOCKS[blockType];
  if (!blockConfig) return <div className="p-4 bg-red-100 text-red-700 rounded">Error: Configuración de bloque no encontrada para el tipo &apos;{blockType}&apos;.</div>;
  
  const IconComponent = blockConfig.icon;

  if (isEditing) {
    return (
      <div className="relative ring-2 ring-blue-500 rounded-lg">
        {children}
      </div>
    );
  }

  return (
    <div className="relative rounded-lg transition-all mb-4 group">
      <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg flex items-center justify-center">
         <button onClick={onEdit} className="bg-white/90 text-gray-800 font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
            <PencilSquareIcon className="w-5 h-5" />
            Editar Bloque
         </button>
      </div>

      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         {onMoveUp && <button onClick={onMoveUp} className="w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white"><ArrowUpIcon className="w-4 h-4 text-gray-600" /></button>}
         {onMoveDown && <button onClick={onMoveDown} className="w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white"><ArrowDownIcon className="w-4 h-4 text-gray-600" /></button>}
         <button onClick={onDelete} className="w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-500 group/trash"><TrashIcon className="w-4 h-4 text-gray-700 group-hover/trash:text-white" /></button>
      </div>
      
      <div className="border border-gray-200 rounded-lg pointer-events-none">
        <div className={`px-4 py-2 border-b flex items-center gap-3 ${blockConfig.theme.bg}`}>
          <IconComponent className={`w-5 h-5 ${blockConfig.theme.icon}`} />
          <span className="text-sm font-semibold text-gray-700">{blockConfig.name}</span>
        </div>
        
        <div className="bg-white rounded-b-lg">
           <div className="opacity-70 scale-95">{children}</div>
        </div>
      </div>
    </div>
  );
};