"use client";
import React, { useEffect, useRef, useState } from 'react';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { HeaderSlotZone } from './HeaderSlotZone';
import { getHeaderRows } from '../utils/headerHelpers';

interface HeaderPreviewProps {
    customElements: StackElement[];
    insertingType: StackElementType | null;
    onInsertElement: (row: number, zone: 'left' | 'center' | 'right') => void;
    onRemoveElement: (id: string) => void;
    onOpenAddPanel: () => void;
    rowMinHeight?: number;
    showRowDeleteInPreview?: boolean;
    mode?: 'fijo' | 'dinamico';
}

export function HeaderPreview({
    customElements,
    insertingType,
    onInsertElement,
    onRemoveElement,
    onOpenAddPanel,
    rowMinHeight = 90,
    showRowDeleteInPreview = false,
    mode = 'fijo'
}: HeaderPreviewProps) {
    // ========================================
    // CONFIGURACIÓN (Del HTML original)
    // ========================================
    const GAP = 10; // Espacio visual mínimo entre cajas
    const PADDING_CAJA = 20; // 10px left + 10px right padding

    // ========================================
    // ESTADO Y REFS
    // ========================================
    const [centerPositions, setCenterPositions] = useState<Record<number, number>>({});
    const [deniedRows, setDeniedRows] = useState<Record<number, boolean>>({});
    const rowRefs = useRef<Map<number, {
        container: HTMLElement | null;
        left: HTMLElement | null;
        center: HTMLElement | null;
        right: HTMLElement | null;
    }>>(new Map());

    const rows = getHeaderRows(customElements);

    // ========================================
    // FUNCIÓN: estimateWidthForType
    // ========================================
    const estimateWidthForType = (type: string): number => {
        switch (type) {
            case 'logo': return 140;
            case 'button': return 100;
            case 'link': return 90;
            case 'heading': return 160;
            case 'paragraph': return 140;
            case 'image': return 80;
            default: return 100;
        }
    };

    // ========================================
    // MOTOR DE POSICIONAMIENTO (EXACTO del HTML)
    // ========================================
    const actualizarLayout = () => {
        const nextCenterPositions: Record<number, number> = {};

        rowRefs.current.forEach((refs, rowIndex) => {
            if (!refs.container) return;

            const W_Total = refs.container.clientWidth;
            
            // Usar getContentWidth para obtener el ancho REAL del contenido
            const W_Izq = getContentWidth(refs.left);
            const W_Cen = getContentWidth(refs.center);
            const W_Der = getContentWidth(refs.right);

            // Posición ideal del centro (matemáticamente en el medio)
            const X_Centro_Ideal = (W_Total / 2) - (W_Cen / 2);
            let X_Centro_Final = X_Centro_Ideal;

            if (mode === 'dinamico') {
                // --- LÓGICA DE EMPUJE BILATERAL (Del HTML) ---
                const Limite_Izquierdo = W_Izq + GAP;
                const Limite_Derecho = (W_Total - W_Der) - GAP - W_Cen;
                X_Centro_Final = Math.max(Limite_Izquierdo, Math.min(X_Centro_Ideal, Limite_Derecho));
            }

            if (isFinite(X_Centro_Final) && W_Total > 0) {
                nextCenterPositions[rowIndex] = X_Centro_Final;
            }
        });

        setCenterPositions(nextCenterPositions);
    };

    // ========================================
    // HELPER: Medir ancho del contenido (sin padding)
    // ========================================
    const getContentWidth = (container: HTMLElement | null): number => {
        if (!container) return 0;
        
        // Obtener todos los elementos hijos [data-header-el]
        const children = Array.from(container.querySelectorAll('[data-header-el]')) as HTMLElement[];
        if (children.length === 0) return 0;
        
        // Sumar el ancho de cada hijo + gaps entre ellos
        const totalChildWidth = children.reduce((sum, child) => {
            return sum + (child.offsetWidth || 0);
        }, 0);
        
        // Gap entre elementos (8px en CSS del HTML)
        const totalGaps = Math.max(0, children.length - 1) * 8;
        
        return totalChildWidth + totalGaps;
    };

    // ========================================
    // VERIFICACIÓN: puedeInsertar (EXACTO del HTML)
    // ========================================
    const puedeInsertar = (rowIndex: number, zona: 'left' | 'center' | 'right', anchoNuevo: number): boolean => {
        const refs = rowRefs.current.get(rowIndex);
        if (!refs || !refs.container) {
            console.log('✅ Permitido: refs no disponibles aún');
            return true;
        }

        const W_Total = refs.container.clientWidth;
        if (!W_Total || W_Total <= 0) {
            console.log('✅ Permitido: W_Total no medido aún');
            return true;
        }

        // Anchos REALES del contenido (sin padding de contenedor)
        let W_Izq = getContentWidth(refs.left);
        let W_Cen = getContentWidth(refs.center);
        let W_Der = getContentWidth(refs.right);

        // Si la caja está vacía, offsetWidth es pequeño (solo padding)
        // El crecimiento real es solo el elemento + gap
        const W_Nuevo_Total = anchoNuevo + 8;

        if (zona === 'left') W_Izq += W_Nuevo_Total;
        if (zona === 'center') W_Cen += W_Nuevo_Total;
        if (zona === 'right') W_Der += W_Nuevo_Total;

        console.log('📊 Medidas actuales:', { W_Total, W_Izq, W_Cen, W_Der, zona, anchoNuevo });

        // --- VERIFICACIÓN MODO FIJO ---
        if (mode === 'fijo') {
            const Inicio_Centro = (W_Total / 2) - (W_Cen / 2);
            const Fin_Centro = (W_Total / 2) + (W_Cen / 2);

            console.log('📐 Centro calculado:', { Inicio_Centro, Fin_Centro });

            // Izquierda no puede tocar inicio centro
            if (W_Izq + GAP > Inicio_Centro) {
                console.log('❌ BLOQUEADO: Izquierda tocaría el centro', { 
                    W_Izq_nuevo: W_Izq, 
                    GAP, 
                    Inicio_Centro,
                    exceso: (W_Izq + GAP) - Inicio_Centro 
                });
                return false;
            }

            // Derecha no puede tocar fin centro
            if ((W_Total - W_Der - GAP) < Fin_Centro) {
                console.log('❌ BLOQUEADO: Derecha tocaría el centro', { 
                    W_Der_nuevo: W_Der,
                    inicio_derecha: W_Total - W_Der,
                    GAP,
                    Fin_Centro,
                    exceso: Fin_Centro - (W_Total - W_Der - GAP)
                });
                return false;
            }

            // Si insertamos en el centro, no puede crecer tanto que toque los lados
            if (zona === 'center') {
                if (Inicio_Centro < W_Izq + GAP) {
                    console.log('❌ BLOQUEADO: Centro tocaría izquierda', { 
                        Inicio_Centro, 
                        W_Izq, 
                        GAP,
                        exceso: (W_Izq + GAP) - Inicio_Centro
                    });
                    return false;
                }
                if (Fin_Centro > (W_Total - W_Der - GAP)) {
                    console.log('❌ BLOQUEADO: Centro tocaría derecha', { 
                        Fin_Centro, 
                        limite: W_Total - W_Der - GAP,
                        exceso: Fin_Centro - (W_Total - W_Der - GAP)
                    });
                    return false;
                }
            }
            
            console.log('✅ PERMITIDO: Hay espacio suficiente');
            return true;
        }

        // --- VERIFICACIÓN MODO DINÁMICO ---
        if (mode === 'dinamico') {
            const Espacio_Ocupado = W_Izq + W_Cen + W_Der + (GAP * 2);
            const permitido = Espacio_Ocupado <= W_Total;
            console.log(permitido ? '✅ PERMITIDO' : '❌ BLOQUEADO', { Espacio_Ocupado, W_Total });
            return permitido;
        }

        return false;
    };

    // ========================================
    // HANDLER: tryInsert
    // ========================================
    const tryInsert = (rowIndex: number, zone: 'left' | 'center' | 'right') => {
        const newElWidth = estimateWidthForType('logo');

        if (!puedeInsertar(rowIndex, zone, newElWidth)) {
            // Bloquear inserción: feedback visual
            setDeniedRows(prev => ({ ...prev, [rowIndex]: true }));
            setTimeout(() => {
                setDeniedRows(prev => {
                    const next = { ...prev };
                    delete next[rowIndex];
                    return next;
                });
            }, 400);
            console.log(`🚫 No hay espacio suficiente en zona ${zone.toUpperCase()}.`);
            return;
        }

        // Inserción permitida
        console.log(`✅ Insertando en zona ${zone.toUpperCase()}`);
        onInsertElement(rowIndex, zone);
    };

    // ========================================
    // EFFECT: Actualizar layout en cambios
    // ========================================
    useEffect(() => {
        actualizarLayout();

        const handleResize = () => actualizarLayout();
        window.addEventListener('resize', handleResize);

        const observer = new ResizeObserver(() => actualizarLayout());
        rowRefs.current.forEach((refs) => {
            if (refs.container) observer.observe(refs.container);
            if (refs.left) observer.observe(refs.left);
            if (refs.center) observer.observe(refs.center);
            if (refs.right) observer.observe(refs.right);
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [customElements, mode]);

    // ========================================
    // RENDER
    // ========================================

    // Si no hay filas, crear fila 0 vacía
    const displayRows = rows.length > 0 ? rows : [{ row: 0, slotMap: { left: [], center: [], right: [] }, activeZones: [] }];

    return (
        <div className="space-y-4">
            {displayRows.map((r) => {
                const rowIndex = r.row;
                const centerLeft = centerPositions[rowIndex];
                const isDenied = deniedRows[rowIndex];

                return (
                    <div
                        key={rowIndex}
                        data-row={rowIndex}
                        ref={(el) => {
                            const current = rowRefs.current.get(rowIndex) || { container: null, left: null, center: null, right: null };
                            current.container = el;
                            rowRefs.current.set(rowIndex, current);
                        }}
                        className="w-full border rounded-lg bg-white relative overflow-hidden shadow-sm transition-all"
                        style={{ minHeight: `${rowMinHeight}px` }}
                    >
                        {/* Overlay de error cuando se bloquea inserción */}
                        {isDenied && (
                            <div className="absolute inset-0 bg-red-50 opacity-50 pointer-events-none animate-pulse z-10" />
                        )}

                        {/* ZONA IZQUIERDA - Anclada a la izquierda (width: auto) */}
                        <div
                            data-zone="left"
                            ref={(el) => {
                                const current = rowRefs.current.get(rowIndex) || { container: null, left: null, center: null, right: null };
                                current.left = el;
                                rowRefs.current.set(rowIndex, current);
                            }}
                            className="absolute left-0 top-0 bottom-0 flex items-center box-border transition-all"
                            style={{
                                width: 'auto',
                                padding: '0 10px',
                                gap: '8px',
                                background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05), transparent)',
                                borderRight: '2px solid rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            <HeaderSlotZone
                                zone="left"
                                elements={r.slotMap.left || []}
                                slotClass=""
                                insertingType={insertingType}
                                onInsert={() => tryInsert(rowIndex, 'left')}
                                onRemove={onRemoveElement}
                                onOpenAdd={onOpenAddPanel}
                                rowOverflow={isDenied}
                            />
                        </div>

                        {/* ZONA CENTRO - Posicionada dinámicamente (width: auto) */}
                        <div
                            data-zone="center"
                            ref={(el) => {
                                const current = rowRefs.current.get(rowIndex) || { container: null, left: null, center: null, right: null };
                                current.center = el;
                                rowRefs.current.set(rowIndex, current);
                            }}
                            className="absolute top-0 bottom-0 flex items-center box-border justify-center transition-all duration-300"
                            style={{
                                width: 'auto',
                                padding: '0 10px',
                                gap: '8px',
                                left: centerLeft != null ? `${centerLeft}px` : '50%',
                                transform: centerLeft != null ? 'none' : 'translateX(-50%)',
                                background: 'rgba(220, 38, 38, 0.05)',
                                border: '2px solid rgba(220, 38, 38, 0.2)',
                                borderTop: 'none',
                                borderBottom: 'none'
                            }}
                        >
                            <HeaderSlotZone
                                zone="center"
                                elements={r.slotMap.center || []}
                                slotClass=""
                                insertingType={insertingType}
                                onInsert={() => tryInsert(rowIndex, 'center')}
                                onRemove={onRemoveElement}
                                onOpenAdd={onOpenAddPanel}
                                rowOverflow={isDenied}
                            />
                        </div>

                        {/* ZONA DERECHA - Anclada a la derecha (width: auto) */}
                        <div
                            data-zone="right"
                            ref={(el) => {
                                const current = rowRefs.current.get(rowIndex) || { container: null, left: null, center: null, right: null };
                                current.right = el;
                                rowRefs.current.set(rowIndex, current);
                            }}
                            className="absolute right-0 top-0 bottom-0 flex items-center box-border flex-row-reverse transition-all"
                            style={{
                                width: 'auto',
                                padding: '0 10px',
                                gap: '8px',
                                background: 'linear-gradient(-90deg, rgba(22, 163, 74, 0.05), transparent)',
                                borderLeft: '2px solid rgba(22, 163, 74, 0.2)'
                            }}
                        >
                            <HeaderSlotZone
                                zone="right"
                                elements={r.slotMap.right || []}
                                slotClass=""
                                insertingType={insertingType}
                                onInsert={() => tryInsert(rowIndex, 'right')}
                                onRemove={onRemoveElement}
                                onOpenAdd={onOpenAddPanel}
                                rowOverflow={isDenied}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
