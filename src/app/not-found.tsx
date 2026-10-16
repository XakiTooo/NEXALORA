'use client';

import React from 'react';
import Link from 'next/link';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="bg-canvas min-h-screen flex flex-col justify-between">
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-border-default/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <NexaloraLogo size={32} showText={true} />
          </Link>
          <Link href="/beranda" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
            Ke Beranda
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border-default p-8 sm:p-12 max-w-lg w-full text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center mx-auto shadow-2xs">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
            Galat 404 • Konten Belum Terbit
          </span>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Halaman atau konten program studi yang kamu tuju belum terbit atau tautan telah dipindahkan.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <Link href="/beranda">
              <Button size="md" variant="primary" icon="home">
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/jelajah">
              <Button size="md" variant="outline" icon="explore">
                Katalog Jelajah
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white py-4 border-t border-border-default text-center text-xs text-text-secondary">
        <p>© 2026 NEXALORA. Dirancang untuk eksplorasi mandiri siswa SMA.</p>
      </footer>
    </div>
  );
}
