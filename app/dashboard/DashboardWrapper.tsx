'use client';

import { DashboardSidebar } from './DashboardSidebar';

interface DashboardWrapperProps {
  children: React.ReactNode;
  userEmail?: string;
  isEditor: boolean;
}

export function DashboardWrapper({ children, userEmail, isEditor }: DashboardWrapperProps) {
  return (
    <div className="dashboard-root flex h-screen overflow-hidden">
      {!isEditor && <DashboardSidebar />}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className={isEditor ? "flex-1" : "flex-1 overflow-y-auto"}>
          {children}
        </div>
      </main>
    </div>
  );
}
