'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AppBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', href: '/beranda', icon: 'home' },
    { label: 'Jelajah', href: '/jelajah', icon: 'explore' },
    { label: 'Simulasi', href: '/simulasi', icon: 'science' },
    { label: 'Rencana', href: '/rencana', icon: 'calendar_today' },
    { label: 'Profil', href: '/profil', icon: 'person' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border-default z-50 flex items-center justify-around px-2 shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 transition-all ${
              isActive
                ? 'text-[#5B5BD6] font-bold'
                : 'text-text-secondary hover:text-text-primary font-medium'
            }`}
          >
            <div className={`p-1 rounded-full ${isActive ? 'bg-[#EEF2FF]' : ''}`}>
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
