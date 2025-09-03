'use client';
import { useState, useEffect, useCallback, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';

// --- Definiciones de Tipos ---
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<Block>) => void; onClose: () => void; }

// --- Iconos ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default function VisualEditor({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const router = useRouter();

  useEffect(() => { setIsMounted(true); }, []);

  // ... (Aquí va toda la lógica de loadTenant, saveTenant, addBlock, etc. que ya funcionaba)
  // Por brevedad, se omite. El único cambio está en la función EditPanel.

  const editingBlock = blocks.find(b => b.id === editingBlockId);

  if (!isMounted) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
        {/* Aquí va todo el JSX del componente VisualEditor que ya funcionaba */}
        {/* El cambio importante está en la función EditPanel de abajo */}
    </div>
  );
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
    if (!block) return null;
    const blockConfig = BLOCKS[block.type as BlockType];
    if (!blockConfig) return null;
    const EditorComponent = blockConfig.editor;

    // CORRECCIÓN: Se reemplaza 'any' por 'unknown' para que sea seguro a nivel de tipos.
    const updateData = (key: string, value: unknown) => {
        onUpdate({ data: { ...block.data, [key]: value } as BlockData });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <EditIcon/>
                        <h3 className="text-lg font-semibold text-slate-800">Editar {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">×</button>
                </div>
            </div>
            <div className="p-4 space-y-5 overflow-y-auto flex-1">
                <EditorComponent data={block.data} updateData={updateData} />
            </div>
        </div>
    );
}