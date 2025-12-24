'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type VisibleWidgets = {
  income: boolean;
  aiStats: boolean;
  goals: boolean;
  topProducts: boolean;
  funnel: boolean;
  quickAccess: boolean;
};

type DashboardCustomizationContextType = {
  visibleWidgets: VisibleWidgets;
  setVisibleWidgets: (v: VisibleWidgets) => void;
  openModal: () => void;
  closeModal: () => void;
  modalOpen: boolean;
};

const defaultVisible: VisibleWidgets = {
  income: true,
  aiStats: true,
  goals: true,
  topProducts: true,
  funnel: true,
  quickAccess: true,
};

const DashboardCustomizationContext = createContext<DashboardCustomizationContextType | undefined>(undefined);

export function DashboardCustomizationProvider({ children }: { children: ReactNode }) {
  const [visibleWidgets, setVisibleWidgets] = useState<VisibleWidgets>(defaultVisible);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboard-visible-widgets');
      if (raw) {
        setVisibleWidgets(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dashboard-visible-widgets', JSON.stringify(visibleWidgets));
    } catch (e) {}
  }, [visibleWidgets]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <DashboardCustomizationContext.Provider value={{ visibleWidgets, setVisibleWidgets, openModal, closeModal, modalOpen }}>
      {children}
    </DashboardCustomizationContext.Provider>
  );
}

export function useDashboardCustomization() {
  const ctx = useContext(DashboardCustomizationContext);
  if (!ctx) throw new Error('useDashboardCustomization must be used inside DashboardCustomizationProvider');
  return ctx;
}
