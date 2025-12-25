"use client";

import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider, useSidebar } from '@/app/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardWrapperProps {
  children: React.ReactNode;
  userEmail?: string;
  isEditor: boolean;
}

function DashboardContent({ children, isEditor }: { children: React.ReactNode; isEditor: boolean }) {
  const { isExpanded } = useSidebar();

  return (
    <>
      {!isEditor && <DashboardSidebar />}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto", // allow main to scroll on mobile/touch
        !isEditor && "ml-20", // Móvil siempre compacto
        !isEditor && isExpanded && "lg:ml-64" // Desktop expandido
      )}>
        <div className={isEditor ? "flex-1" : "flex-1"}>
          {children}
        </div>
      </main>
    </>
  );
}

export function DashboardWrapper({ children, userEmail, isEditor }: DashboardWrapperProps) {
  const { theme } = useTheme();

  return (
    <SidebarProvider>
      <div
        className="dashboard-root flex h-screen overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: theme === 'light' ? '#F8FAFC' : '#0D1222',
          color: theme === 'light' ? '#0f172a' : '#ffffff'
        }}
      >
        <DashboardContent isEditor={isEditor}>
          {children}
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}
