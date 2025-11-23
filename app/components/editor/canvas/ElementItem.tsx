import React, { useState } from 'react';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';

interface ElementItemProps {
    element: StackElement;
    index: number;
    total: number;
    onMove: (id: string, direction: 'up' | 'down') => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, data: Partial<StackElement['data']>) => void;
}

export function ElementItem({ element, index, total, onMove, onRemove, onUpdate }: ElementItemProps) {
    // Slots are structural and should not be editable/removed from the list
    if (element.type === 'slot') {
        return (
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 opacity-60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-700">Slot (estructural)</span>
                        {element.data.zone && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded uppercase font-bold">
                                {element.data.zone === 'left' ? 'IZQ' : element.data.zone === 'center' ? 'CEN' : 'DER'}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">No editable</span>
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-700">{getElementLabel(element.type)}</span>
                    {element.data.zone && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded uppercase font-bold">
                            {element.data.zone === 'left' ? 'IZQ' : element.data.zone === 'center' ? 'CEN' : 'DER'}
                        </span>
                    )}
                </div>
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
                    <div className="mb-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Zona</label>
                        <select
                            value={editData.zone || 'center'}
                            onChange={(e) => setEditData({ ...editData, zone: e.target.value as 'left' | 'center' | 'right' })}
                            className="w-full p-1 border rounded text-sm"
                        >
                            <option value="left">Izquierda</option>
                            <option value="center">Centro</option>
                            <option value="right">Derecha</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="text-xs px-2 py-1 bg-green-500 text-white rounded">Guardar</button>
                        <button onClick={handleCancel} className="text-xs px-2 py-1 bg-gray-500 text-white rounded">Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
