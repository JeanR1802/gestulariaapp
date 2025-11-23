import React from 'react';
import { AlignJustify, Settings, Edit, Plus } from 'lucide-react';

interface AdvancedMobileToolbarProps {
    onOpenPanel: (group: 'elements' | 'styles' | 'settings') => void;
    onAddElement: () => void;
    isEditing: boolean;
}

export const AdvancedMobileToolbar: React.FC<AdvancedMobileToolbarProps> = ({ onOpenPanel, onAddElement, isEditing }) => {
    if (!isEditing) return null; // only show toolbar while editing

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl p-3" data-testid="mobile-toolbar">
            <div className="flex justify-around items-center max-w-md mx-auto relative">
                <button
                    onClick={() => {
                        console.debug('[AdvancedMobileToolbar] open elements panel');
                        onOpenPanel('elements');
                    }}
                    className="flex flex-col items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    data-testid="btn-open-elements"
                >
                    <AlignJustify className="w-6 h-6" />
                    <span>Elementos</span>
                </button>
                <button
                    onClick={() => {
                        console.debug('[AdvancedMobileToolbar] open styles panel');
                        onOpenPanel('styles');
                    }}
                    className="flex flex-col items-center text-sm font-medium text-slate-600 hover:text-slate-800"
                    data-testid="btn-open-styles"
                >
                    <Settings className="w-6 h-6" />
                    <span>Estilos</span>
                </button>
                <button
                    onClick={() => {
                        console.debug('[AdvancedMobileToolbar] open settings panel');
                        onOpenPanel('settings');
                    }}
                    className="flex flex-col items-center text-sm font-medium text-slate-600 hover:text-slate-800"
                    data-testid="btn-open-settings"
                >
                    <Edit className="w-6 h-6" />
                    <span>Ajustes</span>
                </button>

                {/* Add element quick action */}
                <button
                    onClick={() => {
                        console.debug('[AdvancedMobileToolbar] add element');
                        try {
                            onAddElement();
                        } catch (err) {
                            console.error('[AdvancedMobileToolbar] onAddElement error', err);
                        }
                    }}
                    className="absolute -top-6 right-4 bg-blue-600 text-white rounded-full p-2 shadow-lg"
                    aria-label="Agregar elemento"
                    data-testid="btn-add-element"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
