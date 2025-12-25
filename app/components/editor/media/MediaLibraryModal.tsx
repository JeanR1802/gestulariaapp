'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Upload, Image as ImageIcon, Trash2, Check, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// IMÁGENES MOCK (Simulando tu base de datos)
const MOCK_GALLERY = [
    { id: 1, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80', name: 'Reloj.jpg' },
    { id: 2, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80', name: 'Audifonos.jpg' },
    { id: 3, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80', name: 'Sneakers.jpg' },
    { id: 4, url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80', name: 'Polaroid.jpg' },
    { id: 5, url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=500&q=80', name: 'Sneakers_Black.jpg' },
];

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Simulación de subida
    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setActiveTab('library');
            // Aquí agregarías la lógica real de subida
        }, 1500);
    };

    const handleSelectConfirm = () => {
        if (selectedImage) {
            onSelect(selectedImage);
            onClose();
        }
    };

    const filteredImages = MOCK_GALLERY.filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[300]" onClose={onClose}>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 flex flex-col h-[600px]">
                                
                                {/* Header */}
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-900">Galería Multimedia</h3>
                                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Tabs & Content Container */}
                                <div className="flex flex-1 overflow-hidden">
                                    
                                    {/* Sidebar Tabs */}
                                    <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2">
                                        <button 
                                            onClick={() => setActiveTab('library')}
                                            className={cn("text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all", activeTab === 'library' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            <ImageIcon className="w-4 h-4" /> Biblioteca
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('upload')}
                                            className={cn("text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all", activeTab === 'upload' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            <Upload className="w-4 h-4" /> Subir Nuevo
                                        </button>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                                        
                                        {/* VIEW: LIBRARY */}
                                        {activeTab === 'library' && (
                                            <div className="flex-1 flex flex-col h-full">
                                                {/* Search Bar */}
                                                <div className="p-4 border-b border-slate-100">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Buscar archivos..." 
                                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Grid */}
                                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                        {filteredImages.map((img) => (
                                                            <div 
                                                                key={img.id}
                                                                onClick={() => setSelectedImage(img.url)}
                                                                className={cn(
                                                                    "group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                                                                    selectedImage === img.url ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent hover:border-slate-200"
                                                                )}
                                                            >
                                                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                                                
                                                                {/* Hover Overlay */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                                    <p className="text-[10px] text-white truncate w-full font-medium">{img.name}</p>
                                                                </div>

                                                                {/* Selected Indicator */}
                                                                {selectedImage === img.url && (
                                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in">
                                                                        <Check className="w-3 h-3" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Footer Action */}
                                                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                                                    <p className="text-xs text-slate-400">
                                                        {selectedImage ? '1 seleccionado' : 'Selecciona una imagen'}
                                                    </p>
                                                    <button 
                                                        onClick={handleSelectConfirm}
                                                        disabled={!selectedImage}
                                                        className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                                                    >
                                                        Usar Imagen
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* VIEW: UPLOAD */}
                                        {activeTab === 'upload' && (
                                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                                                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                                                    {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
                                                </div>
                                                
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                                    {isUploading ? 'Subiendo archivos...' : 'Arrastra y suelta aquí'}
                                                </h3>
                                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                                                    Soporta JPG, PNG y WebP. Máximo 5MB por archivo.
                                                </p>

                                                <button 
                                                    onClick={handleUpload}
                                                    disabled={isUploading}
                                                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl"
                                                >
                                                    Seleccionar Archivos
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}