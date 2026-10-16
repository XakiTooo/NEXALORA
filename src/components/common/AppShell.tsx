'use client';

import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AppBottomNav } from './AppBottomNav';
import { DemoBanner } from './DemoBanner';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex">
      {/* Desktop Sidebar (220px fixed) */}
      <AppSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[220px]">
        <DemoBanner />
        <AppHeader />
        <main className="flex-1 pb-20 lg:pb-12">
          {children}
        </main>
        <AppBottomNav />
      </div>
    </div>
  );
};
