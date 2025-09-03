'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BLOCKS, BlockType } from '@/app/components/editor/blocks'; // Importamos nuestro registro
import { BlockWrapper } from '@/app/components/editor/blocks/BlockWrapper'; // Importamos el marco

// ... (El resto de tus interfaces de tipos y hooks de estado)

export default function VisualEditor({ params }: { params: { id: string } }) {
  // ... (Toda la lógica de `useState`, `loadTenant`, `saveTenant`, etc., se mantiene igual)

  const addBlock = (blockType: BlockType) => {
    const newBlock = {
      id: Date.now(),
      type: blockType,
      data: BLOCKS[blockType].defaultData,
    };
    setBlocks([...blocks, newBlock]);
  };

  // ...

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* ... (El JSX del Header se mantiene igual) ... */}
      <main className="flex">
        {/* Sidebar */}
        <aside /* ... */>
          <h2 className="font-semibold text-slate-800">Agregar Bloques</h2>
          {Object.keys(BLOCKS).map((key) => {
            const blockKey = key as BlockType;
            const block = BLOCKS[blockKey];
            return (
              <button key={blockKey} onClick={() => addBlock(blockKey)} /* ... */>
                <span className="text-2xl">{block.icon}</span>
                <div>
                  <p className="font-medium text-sm text-slate-800">{block.name}</p>
                  <p className="text-xs text-slate-500">{block.description}</p>
                </div>
              </button>
            );
          })}
        </aside>
        
        {/* Canvas */}
        <div className="flex-1 overflow-y-auto" /* ... */>
          {blocks.map((block, index) => {
            const BlockComponent = BLOCKS[block.type as BlockType]?.renderer;
            if (!BlockComponent) return <div key={block.id}>Bloque no encontrado</div>;
            
            return (
              <BlockWrapper 
                key={block.id} 
                isEditing={editingBlockId === block.id} 
                onEdit={() => setEditingBlockId(block.id)}
                onDelete={() => deleteBlock(block.id)}
                // ... (onMoveUp, onMoveDown)
              >
                <BlockComponent data={block.data} />
              </BlockWrapper>
            );
          })}
        </div>
        
        {/* Edit Panel */}
        <div className={`fixed ... ${editingBlockId ? 'translate-x-0' : 'translate-x-full'}`}>
          {editingBlock && (() => {
            const EditorComponent = BLOCKS[editingBlock.type as BlockType]?.editor;
            if (!EditorComponent) return null;
            return <EditorComponent data={editingBlock.data} updateData={(key, value) => { /* ... lógica de update ... */ }} />;
          })()}
        </div>
      </main>
    </div>
  );
}