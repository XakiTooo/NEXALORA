'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, resetDemoData } = useApp();



  return (
    <div className="w-full bg-[#FEF3C7] border-b border-amber-200 text-[#92400E] px-4 py-2.5 flex items-center justify-between text-xs font-medium z-30 transition-all">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0">
          info
        </span>
        <span className="font-semibold text-amber-900">Mode Demo:</span>
        <span className="hidden sm:inline text-amber-800">
          Data contoh • Progres disimpan di browser ini.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={resetDemoData}
          className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-amber-900 font-semibold border border-amber-300 transition-colors shadow-2xs"
        >
          Reset Demo
        </button>
        <Link
          href="/daftar"
          className="px-3 py-1 rounded-lg bg-[#5B5BD6] hover:bg-[#4F46E5] text-white font-semibold transition-colors shadow-2xs"
        >
          Mulai Sesi Baru
        </Link>
      </div>
    </div>
  );
};
