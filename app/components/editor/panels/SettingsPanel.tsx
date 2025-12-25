'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Globe, Search, Save, ImageIcon, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    siteData: any; // Aquí vendría tu tipo Tenant completo
    onSave: (data: any) => void;
}

export function SettingsPanel({ isOpen, onClose, siteData, onSave }: SettingsPanelProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social'>('general');
    const [formData, setFormData] = useState({
        name: siteData?.name || '',
        slug: siteData?.slug || '',
        title: siteData?.seo?.title || '',
        description: siteData?.seo?.description || '',
        favicon: '', // Futuro
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[200]" onClose={onClose}>
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 flex flex-col md:flex-row h-[600px] md:h-[500px]">
                                
                                {/* SIDEBAR DEL MODAL */}
                                <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col">
                                    <h3 className="text-lg font-black text-slate-900 mb-6">Configuración</h3>
                                    
                                    <nav className="space-y-2 flex-1">
                                        <button onClick={() => setActiveTab('general')} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all", activeTab === 'general' ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}>
                                            <Layout className="w-4 h-4" /> General
                                        </button>
                                        <button onClick={() => setActiveTab('seo')} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all", activeTab === 'seo' ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}>
                                            <Search className="w-4 h-4" /> SEO & Google
                                        </button>
                                        <button onClick={() => setActiveTab('social')} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all", activeTab === 'social' ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}>
                                            <Globe className="w-4 h-4" /> Social Share
                                        </button>
                                    </nav>

                                    <div className="pt-6 mt-auto border-t border-slate-200/50">
                                        <p className="text-[10px] text-slate-400 text-center">ID del Sitio: {siteData?.id || '---'}</p>
                                    </div>
                                </div>

                                {/* CONTENIDO DEL MODAL */}
                                <div className="flex-1 flex flex-col min-w-0 bg-white">
                                    {/* Header Móvil (Cerrar) */}
                                    <div className="flex justify-end p-4 md:absolute md:top-2 md:right-2">
                                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 pt-2 md:pt-8">
                                        
                                        {/* TAB: GENERAL */}
                                        {activeTab === 'general' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 mb-1">Información General</h2>
                                                    <p className="text-sm text-slate-500">Datos básicos de tu negocio.</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nombre del Proyecto</label>
                                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Ej: Mi Tienda" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subdominio</label>
                                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                                            <span className="pl-4 pr-1 text-sm text-slate-400 font-medium">gestularia.com/</span>
                                                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="flex-1 p-3 bg-transparent border-none text-sm font-bold text-slate-900 focus:outline-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB: SEO */}
                                        {activeTab === 'seo' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 mb-1">SEO & Búsqueda</h2>
                                                    <p className="text-sm text-slate-500">Así aparecerás en Google.</p>
                                                </div>

                                                {/* Preview de Google */}
                                                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-slate-800 font-medium">gestularia.com</span>
                                                            <span className="text-[10px] text-slate-400">https://gestularia.com/{formData.slug}</span>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-lg text-blue-600 hover:underline cursor-pointer truncate font-medium">{formData.title || 'Título de tu Página'}</h4>
                                                    <p className="text-sm text-slate-600 line-clamp-2">{formData.description || 'Descripción de tu sitio web para que los clientes sepan qué ofreces...'}</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Título de la Página (Meta Title)</label>
                                                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ej: Moda Urbana | Las mejores ofertas" />
                                                        <p className="text-[10px] text-right mt-1 text-slate-400">{formData.title.length}/60 caracteres</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Descripción (Meta Description)</label>
                                                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Breve descripción de tu negocio..." />
                                                        <p className="text-[10px] text-right mt-1 text-slate-400">{formData.description.length}/160 caracteres</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB: SOCIAL */}
                                        {activeTab === 'social' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 mb-1">Redes Sociales</h2>
                                                    <p className="text-sm text-slate-500">Imagen al compartir en WhatsApp/Facebook.</p>
                                                </div>

                                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
                                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <ImageIcon className="w-8 h-8" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700">Subir Imagen Social (OG Image)</p>
                                                    <p className="text-xs text-slate-400 mt-1">Recomendado: 1200 x 630 px</p>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Footer Botones */}
                                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                                        <button onClick={handleSave} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 hover:scale-105 transition-all">
                                            <Save className="w-4 h-4" /> Guardar Cambios
                                        </button>
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