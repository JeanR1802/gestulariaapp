import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  // Historial del pasado
  const [past, setPast] = useState<T[]>([]);
  // El presente (estado actual lo manejas tú fuera, pero aquí trackeamos el puntero si quisiéramos, 
  // pero para React simple, solo necesitamos past y future)
  
  // Historial del futuro (para Rehacer)
  const [future, setFuture] = useState<T[]>([]);

  // Función para guardar un nuevo estado en el historial (llámala ANTES de cambiar el estado real)
  const addToHistory = useCallback((currentState: T) => {
    setPast((prev) => [...prev, currentState]);
    setFuture([]); // Al hacer algo nuevo, borramos el futuro alternativo
  }, []);

  // Función Deshacer
  const undo = useCallback((currentState: T): T | null => {
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture((prev) => [currentState, ...prev]); // El estado actual se va al futuro

    return previous;
  }, [past]);

  // Función Rehacer
  const redo = useCallback((currentState: T): T | null => {
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    setFuture(newFuture);
    setPast((prev) => [...prev, currentState]); // El estado actual vuelve al pasado

    return next;
  }, [future]);

  return {
    addToHistory,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    clearHistory: () => { setPast([]); setFuture([]); }
  };
}