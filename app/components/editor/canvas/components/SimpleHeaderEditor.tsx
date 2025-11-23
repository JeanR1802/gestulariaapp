"use client";
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { StackElement } from '@/app/components/editor/blocks/CustomStackElements';

interface SimpleHeaderEditorProps {
    elements: StackElement[];
    onAddElement: (zone: 'left' | 'center' | 'right') => void;
    onRemoveElement: (id: string) => void;
    mode?: 'fijo' | 'dinamico';
}

export function SimpleHeaderEditor({ 
    elements, 
    onAddElement, 
    onRemoveElement,
    mode = 'fijo' 
}: SimpleHeaderEditorProps) {
    
    // =========================================
    // CONFIGURACIÓN (Del HTML)
    // =========================================
    const GAP = 10;
    const PADDING_CAJA = 20;
    
    // =========================================
    // REFS
    // =========================================
    const headerRef = useRef<HTMLDivElement>(null);
    const grupoIzqRef = useRef<HTMLDivElement>(null);
    const grupoCenRef = useRef<HTMLDivElement>(null);
    const grupoDerRef = useRef<HTMLDivElement>(null);
    
    // =========================================
    // ESTADO
    // =========================================
    const [message, setMessage] = useState<string>('Haz clic en una zona para insertar un logo');
    const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
    
    // Actualizar mensaje cuando cambie el modo
    useEffect(() => {
        if (mode === 'fijo') {
            setMessage('🔒 Modo Fijo: El centro permanece centrado. Los laterales no pueden tocarlo.');
        } else {
            setMessage('↔️ Modo Dinámico: El centro se mueve si los laterales lo empujan.');
        }
        setMessageType('info');
    }, [mode]);
    
    // Agrupar elementos por zona
    const leftElements = elements.filter(el => (el.data as any)?.zone === 'left');
    const centerElements = elements.filter(el => (el.data as any)?.zone === 'center');
    const rightElements = elements.filter(el => (el.data as any)?.zone === 'right');
    
    // =========================================
    // FUNCIÓN: estimateWidthForType
    // =========================================
    const estimateWidthForType = (type: string): number => {
        switch (type) {
            case 'logo': return 140;
            case 'button': return 100;
            case 'link': return 90;
            default: return 100;
        }
    };
    
    // =========================================
    // MOTOR DE POSICIONAMIENTO (Del HTML)
    // =========================================
    const actualizarLayout = () => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) return;
        
        const W_Total = headerRef.current.clientWidth;
        const W_Izq = grupoIzqRef.current.offsetWidth;
        const W_Cen = grupoCenRef.current.offsetWidth;
        const W_Der = grupoDerRef.current.offsetWidth;
        
        // Posición ideal del centro
        const X_Centro_Ideal = (W_Total / 2) - (W_Cen / 2);
        let X_Centro_Final = X_Centro_Ideal;
        
        if (mode === 'dinamico') {
            const Limite_Izquierdo = W_Izq + GAP;
            const Limite_Derecho = (W_Total - W_Der) - GAP - W_Cen;
            X_Centro_Final = Math.max(Limite_Izquierdo, Math.min(X_Centro_Ideal, Limite_Derecho));
        }
        
        // Aplicar posición
        grupoCenRef.current.style.left = `${X_Centro_Final}px`;
        
        console.log('📊 Layout actualizado:', { W_Total, W_Izq, W_Cen, W_Der, X_Centro_Final });
    };
    
    // =========================================
    // VERIFICACIÓN: puedeInsertar (Del HTML)
    // =========================================
    const puedeInsertar = (zona: 'left' | 'center' | 'right', anchoNuevo: number): boolean => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) {
            return true; // Permitir si refs no están listas
        }
        
        const W_Total = headerRef.current.clientWidth;
        let W_Izq = grupoIzqRef.current.offsetWidth;
        let W_Cen = grupoCenRef.current.offsetWidth;
        let W_Der = grupoDerRef.current.offsetWidth;
        
        const W_Nuevo_Total = anchoNuevo + 8;
        
        if (zona === 'left') W_Izq += W_Nuevo_Total;
        if (zona === 'center') W_Cen += W_Nuevo_Total;
        if (zona === 'right') W_Der += W_Nuevo_Total;
        
        console.log('🔍 Verificando inserción:', { zona, W_Total, W_Izq, W_Cen, W_Der });
        
        // MODO FIJO
        if (mode === 'fijo') {
            const Inicio_Centro = (W_Total / 2) - (W_Cen / 2);
            const Fin_Centro = (W_Total / 2) + (W_Cen / 2);
            
            // Izquierda no puede tocar inicio centro
            if (W_Izq + GAP > Inicio_Centro) {
                console.log('❌ Bloqueado: Izquierda tocaría el centro');
                return false;
            }
            
            // Derecha no puede tocar fin centro
            if ((W_Total - W_Der - GAP) < Fin_Centro) {
                console.log('❌ Bloqueado: Derecha tocaría el centro');
                return false;
            }
            
            // Si insertamos en centro, verificar que no toque lados
            if (zona === 'center') {
                if (Inicio_Centro < W_Izq + GAP) {
                    console.log('❌ Bloqueado: Centro tocaría izquierda');
                    return false;
                }
                if (Fin_Centro > (W_Total - W_Der - GAP)) {
                    console.log('❌ Bloqueado: Centro tocaría derecha');
                    return false;
                }
            }
            
            return true;
        }
        
        // MODO DINÁMICO
        if (mode === 'dinamico') {
            const Espacio_Ocupado = W_Izq + W_Cen + W_Der + (GAP * 2);
            return Espacio_Ocupado <= W_Total;
        }
        
        return false;
    };
    
    // =========================================
    // HANDLER: intentarInsertar
    // =========================================
    const intentarInsertar = (zona: 'left' | 'center' | 'right') => {
        const anchoNuevo = estimateWidthForType('logo');
        
        if (!puedeInsertar(zona, anchoNuevo)) {
            setMessage(`🚫 No hay espacio suficiente en zona ${zona.toUpperCase()}.`);
            setMessageType('error');
            return;
        }
        
        onAddElement(zona);
        setMessage('✅ Elemento agregado correctamente.');
        setMessageType('success');
        
        // Recalcular layout después de insertar
        setTimeout(() => actualizarLayout(), 50);
    };
    
    // =========================================
    // EFFECT: Actualizar layout en cambios
    // =========================================
    useEffect(() => {
        // Forzar actualización cuando cambie el modo o los elementos
        const timer = setTimeout(() => {
            actualizarLayout();
        }, 10);
        
        const handleResize = () => actualizarLayout();
        window.addEventListener('resize', handleResize);
        
        // Observer para detectar cambios en el DOM
        const observer = new MutationObserver(() => {
            actualizarLayout();
        });
        
        if (headerRef.current) {
            observer.observe(headerRef.current, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [elements, mode]);
    
    // =========================================
    // RENDER
    // =========================================
    return (
        <div className="space-y-4">
            {/* Badge del Modo Actual */}
            <div className="flex items-center justify-between">
                <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
                    mode === 'fijo' 
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                )}>
                    <span>{mode === 'fijo' ? '🔒' : '↔️'}</span>
                    <span>Modo {mode === 'fijo' ? 'Fijo' : 'Dinámico'} Activo</span>
                </div>
            </div>

            {/* Mensaje del sistema */}
            <div className={`text-center p-3 rounded-lg transition-all ${
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
                <p className="text-sm font-medium">{message}</p>
            </div>
            
            {/* Header Container (El Lienzo) */}
            <div 
                ref={headerRef}
                className="relative w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden"
                style={{ height: '90px' }}
            >
                {/* Grupo Izquierdo */}
                <div
                    ref={grupoIzqRef}
                    className="absolute left-0 h-full flex items-center gap-2 transition-all"
                    style={{
                        padding: '0 10px',
                        background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05), transparent)',
                        borderRight: '2px solid rgba(37, 99, 235, 0.2)',
                        cursor: 'pointer'
                    }}
                    onClick={() => intentarInsertar('left')}
                >
                    {leftElements.map((el, idx) => (
                        <div 
                            key={el.id}
                            className="h-11 w-[140px] bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md relative group"
                        >
                            Logo {idx + 1}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(el.id);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {leftElements.length === 0 && (
                        <div className="text-xs text-blue-400 font-medium">Zona Izquierda</div>
                    )}
                </div>
                
                {/* Grupo Centro */}
                <div
                    ref={grupoCenRef}
                    className="absolute h-full flex items-center gap-2 justify-center transition-all duration-300 ease-out"
                    style={{
                        padding: '0 10px',
                        background: mode === 'dinamico' 
                            ? 'rgba(220, 38, 38, 0.08)' 
                            : 'rgba(220, 38, 38, 0.05)',
                        border: mode === 'dinamico'
                            ? '2px solid rgba(220, 38, 38, 0.4)'
                            : '2px solid rgba(220, 38, 38, 0.2)',
                        borderTop: 'none',
                        borderBottom: 'none',
                        cursor: 'pointer',
                        boxShadow: mode === 'dinamico' ? '0 0 12px rgba(220, 38, 38, 0.15)' : 'none'
                    }}
                    onClick={() => intentarInsertar('center')}
                >
                    {centerElements.map((el, idx) => (
                        <div 
                            key={el.id}
                            className="h-11 w-[140px] bg-red-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md relative group"
                        >
                            Logo {idx + 1}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(el.id);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {centerElements.length === 0 && (
                        <div className="text-xs text-red-400 font-medium">Zona Centro</div>
                    )}
                </div>
                
                {/* Grupo Derecho */}
                <div
                    ref={grupoDerRef}
                    className="absolute right-0 h-full flex items-center gap-2 flex-row-reverse transition-all"
                    style={{
                        padding: '0 10px',
                        background: 'linear-gradient(-90deg, rgba(22, 163, 74, 0.05), transparent)',
                        borderLeft: '2px solid rgba(22, 163, 74, 0.2)',
                        cursor: 'pointer'
                    }}
                    onClick={() => intentarInsertar('right')}
                >
                    {rightElements.map((el, idx) => (
                        <div 
                            key={el.id}
                            className="h-11 w-[140px] bg-green-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md relative group"
                        >
                            Logo {idx + 1}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(el.id);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {rightElements.length === 0 && (
                        <div className="text-xs text-green-400 font-medium">Zona Derecha</div>
                    )}
                </div>
            </div>
            
            {/* Debug Info */}
            <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded">
                Modo: <span className="font-bold">{mode.toUpperCase()}</span> | 
                Elementos: {elements.length} (Izq: {leftElements.length}, Cen: {centerElements.length}, Der: {rightElements.length})
            </div>
        </div>
    );
}
