'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NexaloraLogo } from './NexaloraLogo';
import { LogoutModal } from './LogoutModal';

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const mainNavItems = [
    { label: 'Beranda', href: '/beranda', icon: 'home' },
    { label: 'Jelajah', href: '/jelajah', icon: 'explore' },
    { label: 'Simulasi', href: '/simulasi', icon: 'science' },
    { label: 'Rencana', href: '/rencana', icon: 'calendar_today' },
    { label: 'Profil', href: '/profil', icon: 'person' },
  ];

  const secondaryNavItems = [
    { label: 'Pengaturan', href: '/pengaturan', icon: 'settings' },
    { label: 'Bantuan & Batas', href: '/bantuan', icon: 'help_outline' },
  ];

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[220px] bg-white border-r border-border-default z-50 flex-col justify-between shadow-xs select-none">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="h-16 px-4 flex items-center border-b border-border-default">
            <Link href="/beranda">
              <NexaloraLogo size={32} showText={true} />
            </Link>
          </div>

          {/* Section 1: Menu Utama */}
          <div className="px-4 pt-4 pb-1">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
              MENU UTAMA
            </span>
          </div>
          <nav className="flex flex-col px-2.5 gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#5B5BD6] font-bold shadow-2xs'
                      : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#5B5BD6]' : 'text-text-secondary'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Section 2: Pengaturan */}
          <div className="px-4 pt-5 pb-1">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
              PENGATURAN
            </span>
          </div>
          <nav className="flex flex-col px-2.5 gap-1 mb-2">
            {secondaryNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#5B5BD6] font-bold shadow-2xs'
                      : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#5B5BD6]' : 'text-text-secondary'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Keluar Button in Sidebar */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 font-medium transition-all text-left"
            >
              <span className="material-symbols-outlined text-[19px] text-red-600">
                logout
              </span>
              <span>Keluar</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};
