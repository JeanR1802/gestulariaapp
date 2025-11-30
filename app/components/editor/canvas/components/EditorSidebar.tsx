import React, { useMemo, useState } from 'react';
import { PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ELEMENT_TYPES } from '../utils/elementHelpers';
import { StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';
import { StackElement } from '@/app/components/editor/blocks/CustomStackElements';

interface EditorSidebarProps {
    onAddElementSelect: (type: StackElementType) => void;
    onToggleProperties?: () => void;
    showProperties?: boolean;
    headerMode?: 'fijo' | 'dinamico';
    onModeChange?: (mode: 'fijo' | 'dinamico') => void;
    onShowElements?: () => void;
    // New props for active element editing
    activeElementId?: string;
    elements?: StackElement[];
    onUpdateElement?: (id: string, data: Partial<StackElement['data']>) => void;
    // Header padding controls
    headerPaddingLeft?: number;
    headerPaddingRight?: number;
    onUpdateHeaderPadding?: (left?: number | null, right?: number | null) => void;
    // Maximum padding available based on current header content
    maxPaddingAvailable?: number;
    // Individual limits for each side to prevent slot overlap
    maxPaddingLeft?: number;
    maxPaddingRight?: number;
}

export function EditorSidebar({ onAddElementSelect, onToggleProperties, showProperties, headerMode = 'fijo', onModeChange, onShowElements, activeElementId, elements = [], onUpdateElement, headerPaddingLeft, headerPaddingRight, onUpdateHeaderPadding, maxPaddingAvailable, maxPaddingLeft, maxPaddingRight }: EditorSidebarProps) {
    const { theme, palette } = useTheme();
    const c = colorPalettes[palette][theme];
    const isLight = theme === 'light';

    // Use a slightly darker turquoise tone for the left rail in light mode
    const accentDark = c.button?.primary?.hover || c.accent.primary;
    const leftRailBg = isLight ? accentDark : c.bg.primary;
    const leftRailIconBg = isLight ? `${accentDark}20` : `${c.accent.primary}12`;
    const leftRailTextColor = isLight ? '#FFFFFF' : c.accent.primary;

    // When the content container is white (we force it), choose readable text colors.
    const contentText = isLight ? c.text.primary : colorPalettes[palette].light.text.primary;
    const contentSecondary = isLight ? c.text.secondary : colorPalettes[palette].light.text.secondary;

    // Active element state for the simple editor
    const activeElement = useMemo(() => elements.find(e => e.id === activeElementId), [elements, activeElementId]);
    const [editContent, setEditContent] = useState(activeElement ? (activeElement.data as any).content || '' : '');
    const [editImageUrl, setEditImageUrl] = useState(activeElement ? (activeElement.data as any).imageUrl || '' : '');
    const [editWidth, setEditWidth] = useState<number | string>(activeElement ? ((activeElement.data as any).width ?? (activeElement.data as any).height ?? 1) : 1);

    // Keep inputs in sync when activeElement changes
    React.useEffect(() => {
        setEditContent(activeElement ? (activeElement.data as any).content || '' : '');
        setEditImageUrl(activeElement ? (activeElement.data as any).imageUrl || '' : '');
        setEditWidth(activeElement ? ((activeElement.data as any).width ?? (activeElement.data as any).height ?? 1) : 1);
    }, [activeElementId, activeElement]);
    
    // Header padding local inputs when editing header properties
     const [localPaddingLeft, setLocalPaddingLeft] = useState<number | ''>(headerPaddingLeft ?? '');
     const [localPaddingRight, setLocalPaddingRight] = useState<number | ''>(headerPaddingRight ?? '');

    // Track previous prop values to avoid overwriting user input during typing
    const prevHeaderPadLeftRef = React.useRef<number | undefined>(headerPaddingLeft);
    const prevHeaderPadRightRef = React.useRef<number | undefined>(headerPaddingRight);
    // Track which input was edited last to prioritize clamping behavior
    const lastEditedRef = React.useRef<'left' | 'right' | null>(null);
    // Refs for input elements to detect focus and avoid overwriting while typing
    const leftInputRef = React.useRef<HTMLInputElement | null>(null);
    const rightInputRef = React.useRef<HTMLInputElement | null>(null);
 
     React.useEffect(() => {
         // Only sync when the incoming prop actually changed (prevents clobbering while user types)
        if (headerPaddingLeft !== prevHeaderPadLeftRef.current) {
            // don't overwrite if user is focused on the left input
            if (document.activeElement !== leftInputRef.current) {
                setLocalPaddingLeft(headerPaddingLeft ?? '');
            }
            prevHeaderPadLeftRef.current = headerPaddingLeft;
        }
        if (headerPaddingRight !== prevHeaderPadRightRef.current) {
            // don't overwrite if user is focused on the right input
            if (document.activeElement !== rightInputRef.current) {
                setLocalPaddingRight(headerPaddingRight ?? '');
            }
            prevHeaderPadRightRef.current = headerPaddingRight;
        }
     }, [headerPaddingLeft, headerPaddingRight]);

    const handleSaveElement = () => {
        if (!activeElementId || !onUpdateElement) return;
        if (activeElement && activeElement.type === 'spacer') {
            const w = Number(editWidth) || 0;
            onUpdateElement(activeElementId, { width: w });
        } else {
            onUpdateElement(activeElementId, { content: editContent, imageUrl: editImageUrl });
        }
    };

    return (
        <aside className="hidden md:flex w-96 transition-all duration-300" style={{ backgroundColor: isLight ? c.bg.primary : c.bg.secondary }}>
            <div className="w-20 flex flex-col items-center py-4 gap-4 flex-shrink-0" style={{ backgroundColor: leftRailBg }}>
                {/* Badge 'Añadir' ahora es un botón que fuerza la vista de elementos; añade efecto hover */}
                <button
                    onClick={() => onShowElements && onShowElements()}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full focus:outline-none transform transition-colors ${showProperties ? 'opacity-70' : 'opacity-100'}`}
                    title="Mostrar elementos"
                    style={{ color: leftRailTextColor }}
                >
                    <div className="p-2 rounded-lg transition-colors" style={{ backgroundColor: leftRailIconBg }}>
                        <PlusIcon className="w-6 h-6" style={{ color: leftRailTextColor }} />
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: leftRailTextColor }}>Añadir</span>
                </button>

                {/* Botón de Propiedades con icono mejorado y etiqueta debajo */}
                <div className="w-full flex flex-col items-center">
                    <button
                        onClick={() => onToggleProperties && onToggleProperties()}
                        className={`p-2 rounded-md text-[12px] flex items-center justify-center transition-colors`}
                        title="Propiedades del Header"
                        style={{ backgroundColor: showProperties ? c.accent.primary : 'transparent', color: showProperties ? (c.button?.primary?.text || '#FFFFFF') : leftRailTextColor, border: showProperties ? 'none' : `1px solid ${leftRailIconBg}` }}
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                    </button>
                    <span className="text-[11px] mt-1" style={{ color: leftRailTextColor }}>Propiedades</span>
                </div>

            </div>

            {/* Main content container: light gray surface with soft turquoise inset border and shadow */}
            <div
                className="flex-1 flex flex-col overflow-hidden"
                style={{
                    backgroundColor: '#F7FAFC',
                    boxShadow: `inset 0 0 0 1px ${c.accent.glow}, 0 8px 24px rgba(2,12,12,0.04)`,
                }}
            >
                 {showProperties ? (
                    <div className="p-5" style={{ backgroundColor: 'transparent' }}>
                        {/* If an active element is selected, show element properties editor */}
                        {activeElement ? (
                            <div>
                                <h3 className="font-bold text-lg" style={{ color: contentText }}>Propiedades del Elemento</h3>
                                <p className="text-sm" style={{ color: contentSecondary, marginTop: 4 }}>Edita las propiedades del elemento seleccionado.</p>

                                <div className="mt-4 space-y-3">
                                    {activeElement.type === 'spacer' ? (
                                        <>
                                            <label className="text-xs font-medium" style={{ color: contentText }}>Ancho (px)</label>
                                            <input
                                                type="number"
                                                value={String(editWidth)}
                                                onChange={(e) => setEditWidth(e.target.value)}
                                                className="w-full p-2 rounded-md border"
                                                style={{ backgroundColor: '#FFFFFF', color: contentText, borderColor: c.border.primary }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <label className="text-xs font-medium" style={{ color: contentText }}>Texto / Contenido</label>
                                            <input
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full p-2 rounded-md border"
                                                style={{ backgroundColor: '#FFFFFF', color: contentText, borderColor: c.border.primary }}
                                            />

                                            <label className="text-xs font-medium" style={{ color: contentText }}>URL de imagen (opcional)</label>
                                            <input
                                                value={editImageUrl}
                                                onChange={(e) => setEditImageUrl(e.target.value)}
                                                className="w-full p-2 rounded-md border"
                                                style={{ backgroundColor: '#FFFFFF', color: contentText, borderColor: c.border.primary }}
                                            />
                                        </>
                                    )}

                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleSaveElement} className="px-3 py-2 rounded-lg text-white" style={{ backgroundColor: c.accent.primary }}>Guardar</button>
                                        <button onClick={() => { if (onToggleProperties) onToggleProperties(); }} className="px-3 py-2 rounded-lg border" style={{ color: contentText, borderColor: c.border.secondary, backgroundColor: '#FFFFFF' }}>Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg" style={{ color: contentText }}>Propiedades</h3>
                                <p className="text-sm" style={{ color: contentSecondary, marginTop: 4 }}>Ajusta el modo de posicionamiento del header.</p>

                                <div className="mt-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onModeChange && onModeChange('fijo')}
                                            className={cn(
                                                "flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                                                headerMode === 'fijo' ? '' : ''
                                            )}
                                            style={headerMode === 'fijo' ? { backgroundColor: c.accent.primary, color: c.button?.primary?.text || '#FFFFFF' } : { backgroundColor: '#F8FAFC', color: contentText, border: `1px solid ${c.border.secondary}` }}
                                        >
                                            <div className="flex flex-col items-center text-xs">
                                                <span>🔒</span>
                                                <span>Modo Fijo</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => onModeChange && onModeChange('dinamico')}
                                            className={cn(
                                                "flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                                                headerMode === 'dinamico' ? '' : ''
                                            )}
                                            style={headerMode === 'dinamico' ? { backgroundColor: c.accent.primary, color: c.button?.primary?.text || '#FFFFFF' } : { backgroundColor: '#F8FAFC', color: contentText, border: `1px solid ${c.border.secondary}` }}
                                        >
                                            <div className="flex flex-col items-center text-xs">
                                                <span>↔️</span>
                                                <span>Modo Dinámico</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="mt-3 text-xs" style={{ color: contentSecondary }}>
                                        {headerMode === 'fijo' ? (
                                            <p><strong style={{ color: contentText }}>Modo Fijo:</strong> El centro permanece centrado; los laterales no lo tocan.</p>
                                        ) : (
                                            <p><strong style={{ color: contentText }}>Modo Dinámico:</strong> El centro se mueve si los laterales lo empujan.</p>
                                        )}
                                    </div>

                                    {/* Header padding controls */}
                                    <div className="mt-4 border-t pt-3">
                                        <h4 className="text-sm font-semibold" style={{ color: contentText }}>Padding del Header</h4>
                                        <p className="text-xs" style={{ color: contentSecondary }}>Define el padding izquierdo/derecho (px) que se aplicará al header en la vista previa.</p>
                                        
                                        {/* Indicador de espacio disponible */}
                                        {typeof maxPaddingAvailable === 'number' && (
                                            <div className="mt-2 p-3 rounded-lg border" style={{ backgroundColor: maxPaddingAvailable > 50 ? '#f0fdf4' : maxPaddingAvailable > 20 ? '#fef9c3' : '#fef2f2', borderColor: maxPaddingAvailable > 50 ? '#86efac' : maxPaddingAvailable > 20 ? '#fde047' : '#fca5a5' }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>
                                                        {maxPaddingAvailable > 50 ? '✅ Espacio disponible:' : maxPaddingAvailable > 20 ? '⚠️ Espacio limitado:' : '🚫 Espacio mínimo:'}
                                                    </span>
                                                    <span className="text-sm font-bold" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>
                                                        {Math.floor(maxPaddingAvailable)}px total
                                                    </span>
                                                </div>
                                                
                                                {/* Individual limits */}
                                                {(typeof maxPaddingLeft === 'number' || typeof maxPaddingRight === 'number') && (
                                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                                        {typeof maxPaddingLeft === 'number' && (
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                                                <div className="text-[10px] font-medium opacity-70" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>Límite Izq.</div>
                                                                <div className="text-sm font-bold" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>{Math.floor(maxPaddingLeft)}px</div>
                                                            </div>
                                                        )}
                                                        {typeof maxPaddingRight === 'number' && (
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                                                <div className="text-[10px] font-medium opacity-70" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>Límite Der.</div>
                                                                <div className="text-sm font-bold" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>{Math.floor(maxPaddingRight)}px</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <p className="text-xs" style={{ color: maxPaddingAvailable > 50 ? '#16a34a' : maxPaddingAvailable > 20 ? '#ca8a04' : '#dc2626' }}>
                                                    {maxPaddingAvailable > 50 
                                                        ? 'Puedes añadir más padding sin problemas. Los slots no se sobrepondrán.' 
                                                        : maxPaddingAvailable > 20 
                                                            ? 'Espacio limitado. Cada lado tiene su límite para evitar que los slots se toquen.' 
                                                            : 'Espacio muy limitado. Los slots están cerca del centro. Reduce elementos o padding.'}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="mt-2 flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs font-medium mb-1 block" style={{ color: contentSecondary }}>
                                                    Izquierdo
                                                    {typeof maxPaddingLeft === 'number' && (
                                                        <span className="ml-1 text-[10px] opacity-70">(máx: {maxPaddingLeft}px)</span>
                                                    )}
                                                </label>
                                                <input 
                                                    type="number" 
                                                    value={String(localPaddingLeft ?? '')} 
                                                    ref={leftInputRef}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        if (raw === '') { setLocalPaddingLeft(''); lastEditedRef.current = 'left'; return; }
                                                        let num = Math.max(0, Number(raw));
                                                        // Respect individual limit for left side
                                                        if (typeof maxPaddingLeft === 'number') {
                                                            num = Math.min(num, Math.max(0, Math.floor(maxPaddingLeft)));
                                                        }
                                                        setLocalPaddingLeft(num);
                                                        lastEditedRef.current = 'left';
                                                    }} 
                                                    placeholder="0" 
                                                    min="0"
                                                    max={maxPaddingLeft}
                                                    className="w-full p-2 rounded-md border" 
                                                    style={{ backgroundColor: '#FFFFFF', color: contentText, borderColor: c.border.primary }} 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-medium mb-1 block" style={{ color: contentSecondary }}>
                                                    Derecho
                                                    {typeof maxPaddingRight === 'number' && (
                                                        <span className="ml-1 text-[10px] opacity-70">(máx: {maxPaddingRight}px)</span>
                                                    )}
                                                </label>
                                                <input 
                                                    type="number" 
                                                    value={String(localPaddingRight ?? '')} 
                                                    ref={rightInputRef}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        if (raw === '') { setLocalPaddingRight(''); lastEditedRef.current = 'right'; return; }
                                                        let num = Math.max(0, Number(raw));
                                                        // Respect individual limit for right side
                                                        if (typeof maxPaddingRight === 'number') {
                                                            num = Math.min(num, Math.max(0, Math.floor(maxPaddingRight)));
                                                        }
                                                        setLocalPaddingRight(num);
                                                        lastEditedRef.current = 'right';
                                                    }} 
                                                    placeholder="0"
                                                    min="0"
                                                    max={maxPaddingRight}
                                                    className="w-full p-2 rounded-md border" 
                                                    style={{ backgroundColor: '#FFFFFF', color: contentText, borderColor: c.border.primary }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button 
                                                onClick={() => { 
                                                    if (onUpdateHeaderPadding) {
                                                        // Prepare numeric values (null if empty)
                                                        let left = localPaddingLeft === '' ? null : Number(localPaddingLeft);
                                                        let right = localPaddingRight === '' ? null : Number(localPaddingRight);

                                                        // Pre-clamp to available limits to avoid resetting when overshooting
                                                        // FIRST: respect individual side limits (prevents slot overlap)
                                                        const maxL = typeof maxPaddingLeft === 'number' ? Math.max(0, Math.floor(maxPaddingLeft)) : Infinity;
                                                        const maxR = typeof maxPaddingRight === 'number' ? Math.max(0, Math.floor(maxPaddingRight)) : Infinity;
                                                        const maxTotal = typeof maxPaddingAvailable === 'number' ? Math.max(0, Math.floor(maxPaddingAvailable)) : Infinity;

                                                        let l = left ?? 0;
                                                        let r = right ?? 0;

                                                        // Clamp each side to its individual limit first
                                                        l = Math.min(l, maxL);
                                                        r = Math.min(r, maxR);

                                                        // Then check if total exceeds and adjust
                                                        if (l + r > maxTotal) {
                                                            if (lastEditedRef.current === 'left') {
                                                                // User changed left - try to preserve it, reduce right
                                                                const clampedL = Math.min(l, maxL, maxTotal);
                                                                const clampedR = Math.min(r, maxR, Math.max(0, maxTotal - clampedL));
                                                                left = clampedL;
                                                                right = clampedR;
                                                            } else if (lastEditedRef.current === 'right') {
                                                                // User changed right - try to preserve it, reduce left
                                                                const clampedR = Math.min(r, maxR, maxTotal);
                                                                const clampedL = Math.min(l, maxL, Math.max(0, maxTotal - clampedR));
                                                                left = clampedL;
                                                                right = clampedR;
                                                            } else {
                                                                // default: preserve left, clamp right
                                                                const clampedL = Math.min(l, maxL, maxTotal);
                                                                const clampedR = Math.min(r, maxR, Math.max(0, maxTotal - clampedL));
                                                                left = clampedL;
                                                                right = clampedR;
                                                            }
                                                        } else {
                                                            // Within limits, use clamped values
                                                            left = l;
                                                            right = r;
                                                        }

                                                        // Sync local inputs to clamped numeric values so UI doesn't reset
                                                        setLocalPaddingLeft(left === null ? '' : left);
                                                        setLocalPaddingRight(right === null ? '' : right);

                                                        onUpdateHeaderPadding(left, right);
                                                    }
                                                }} 
                                                className="flex-1 px-3 py-2 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity" 
                                                style={{ backgroundColor: c.accent.primary }}
                                            >
                                                Aplicar Padding
                                            </button>
                                            <button 
                                                onClick={() => { 
                                                    setLocalPaddingLeft(0); 
                                                    setLocalPaddingRight(0); 
                                                    if (onUpdateHeaderPadding) onUpdateHeaderPadding(0, 0); 
                                                }} 
                                                className="px-3 py-2 rounded-lg border font-medium text-sm hover:bg-gray-50 transition-colors" 
                                                style={{ color: contentText, borderColor: c.border.secondary, backgroundColor: '#FFFFFF' }}
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mostrar espacio máximo disponible para padding */}
                                    {maxPaddingAvailable !== undefined && (
                                        <div className="mt-4 text-xs" style={{ color: contentSecondary }}>
                                            <p><strong style={{ color: contentText }}>Espacio máximo para padding:</strong> {maxPaddingAvailable}px</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="p-5" style={{ backgroundColor: 'transparent' }}>
                            <h3 className="font-bold text-lg" style={{ color: contentText }}>Añadir Elemento</h3>
                            <p className="text-sm" style={{ color: contentSecondary, marginTop: 4 }}>Elige un componente para insertar.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'transparent' }}>
                             <div className="grid grid-cols-1 gap-3">
                                {ELEMENT_TYPES.map((et) => (
                                     <button
                                         key={et.type}
                                         onClick={() => onAddElementSelect(et.type)}
                                         className="flex items-start gap-4 p-4 text-left rounded-xl transition-all group"
                                         style={{ backgroundColor: '#FFFFFF', border: `1px solid ${c.border.primary}`, boxShadow: '0 6px 18px rgba(2,12,12,0.06)' }}
                                       >
                                          <span className="text-2xl p-3 rounded-lg transition-colors" style={{ backgroundColor: `${c.accent.primary}12`, color: c.accent.primary }}>{et.icon}</span>
                                          <div>
                                              <span className="block font-bold" style={{ color: contentText }}>{et.label}</span>
                                              <span className="block text-xs mt-1 leading-relaxed" style={{ color: contentSecondary }}>{et.desc}</span>
                                          </div>
                                       </button>
                                  ))}
                               </div>
                           </div>
                       </>
                   )}
               </div>
           </aside>
       );
   }
