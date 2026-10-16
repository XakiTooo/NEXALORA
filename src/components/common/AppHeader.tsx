'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { NexaloraLogo } from './NexaloraLogo';
import { LogoutModal } from './LogoutModal';

export const AppHeader: React.FC = () => {
  const { userContext, compareCartIds, isDemoMode } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full bg-white border-b border-border-default shadow-xs flex items-center justify-between px-4 lg:px-6">
        {/* Mobile brand & search */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <NexaloraLogo size={28} showText={false} />
          </div>
          <div className="relative flex items-center w-64 sm:w-80 md:w-96">
            <span className="material-symbols-outlined absolute left-3 text-text-secondary text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Cari jurusan, kampus, atau karier..."
              className="w-full bg-surface-subtle rounded-xl h-10 pl-9 pr-4 text-xs font-medium text-text-primary placeholder:text-text-secondary border border-border-default focus:border-primary focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right widgets */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Demo indicator */}
          {isDemoMode && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-warning-bg text-status-warning-text text-[11px] font-semibold border border-amber-200">
              <span className="material-symbols-outlined text-[13px]">info</span>
              <span>Mode Demo</span>
            </div>
          )}

          {/* Compare Cart Counter */}
          <Link
            href="/bandingkan"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-semibold border border-border-default hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">balance</span>
            <span>Bandingkan ({compareCartIds.length}/3)</span>
          </Link>

          {/* User Profile Pill with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border-default hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-text-primary leading-tight">
                  {userContext.namaPanggilan}
                </span>
                <span className="text-[10px] font-medium text-text-secondary leading-tight mt-0.5">
                  Kelas {userContext.kelas} SMA
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-text-secondary">
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-border-default shadow-card py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                <div className="px-3.5 py-2 border-b border-border-default/60">
                  <span className="font-bold text-text-primary block truncate">
                    {userContext.namaPanggilan}
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Kelas {userContext.kelas} • Lulus {userContext.tahunKelulusan}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/profil"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-text-primary hover:bg-surface-subtle font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-text-secondary">
                      account_circle
                    </span>
                    <span>Hub Profil Siswa</span>
                  </Link>

                  <Link
                    href="/profil/paspor"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-text-primary hover:bg-surface-subtle font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-text-secondary">
                      description
                    </span>
                    <span>Paspor Belajar (PDF)</span>
                  </Link>

                  <Link
                    href="/pengaturan"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-text-primary hover:bg-surface-subtle font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-text-secondary">
                      settings
                    </span>
                    <span>Pengaturan Akun</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-border-default/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-600 hover:bg-red-50 font-semibold transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-red-600">
                      logout
                    </span>
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};
