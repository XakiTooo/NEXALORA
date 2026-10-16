'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';

export default function PilihanAksesPage() {
  const router = useRouter();
  const { resetDemoData, setIsDemoMode } = useApp();

  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [demoError, setDemoError] = useState(false);

  const handleStartDemo = () => {
    setIsLoadingDemo(true);
    setDemoError(false);
    resetDemoData();
    setIsDemoMode(true);
    router.push('/beranda');
  };

  return (
    <div className="bg-canvas min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 mb-2 border-b border-border-default/60">
        <Link href="/">
          <NexaloraLogo size={32} showText={true} />
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-secondary hidden sm:inline">Sudah punya akun?</span>
          <Link
            href="/masuk"
            className="font-bold text-[#5B5BD6] hover:underline px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-default transition-colors"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center py-4">
        <div className="flex flex-col items-center text-center max-w-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2">
            Pilih Cara Kamu Mengeksplorasi NEXALORA
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl">
            Coba langsung fitur utama menggunakan profil contoh, atau buat akun pribadi untuk menyimpan progres eksplorasimu.
          </p>
        </div>

        {/* 2 Comparison Cards (UX-02) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8 items-stretch">
          {/* Card 1: Mode Demo */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-[16px] bg-white border border-border-default shadow-xs hover:shadow-card transition-all h-full">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-surface-subtle text-text-secondary text-[11px] font-bold tracking-wider uppercase">
                  Mode Demo
                </span>
                <span className="text-[11px] text-text-secondary font-medium">
                  Tanpa registrasi
                </span>
              </div>

              <h2 className="text-xl font-bold text-text-primary mb-2">
                Coba Instan Tanpa Buat Akun
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mb-5 leading-relaxed">
                Eksplorasi bebas tanpa perlu mendaftar atau mengisi formulir data pribadi.
              </p>

              <div className="flex flex-col gap-3 mb-6 text-xs text-text-primary">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-status-success-text text-[14px]">
                      check
                    </span>
                  </span>
                  <span>Menggunakan profil sintetis contoh (Rani Kelas XII / Dimas Kelas XI)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-status-success-text text-[14px]">
                      check
                    </span>
                  </span>
                  <span>Akses 3 mini-kuliah belajar (Informatika, Teknik Industri, DKV)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-status-success-text text-[14px]">
                      check
                    </span>
                  </span>
                  <span>Uji komparasi 3 jurusan dan simulasi skenario secara langsung</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col pt-4 mt-auto border-t border-border-default/60">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-status-warning-bg border border-amber-200 text-amber-900 mb-4 text-xs">
                <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
                  info
                </span>
                <p className="leading-snug">
                  <strong>Catatan:</strong> Data dan simulasi di mode demo bersifat sementara dan tidak tersimpan saat sesi peramban direset.
                </p>
              </div>

              {demoError ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-status-error-bg text-status-error-text text-xs border border-red-200 flex items-center justify-between">
                    <span>Gagal memuat sesi demo. Periksa koneksi internetmu.</span>
                    <button
                      onClick={handleStartDemo}
                      className="underline font-bold hover:no-underline"
                    >
                      Coba lagi
                    </button>
                  </div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleStartDemo}
                    icon="refresh"
                  >
                    Muat Ulang Demo
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoadingDemo}
                  iconRight="arrow_forward"
                  onClick={handleStartDemo}
                >
                  Coba Demo
                </Button>
              )}
            </div>
          </div>

          {/* Card 2: Akun Pribadi */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-[16px] bg-white border border-border-default shadow-xs hover:shadow-card transition-all h-full">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold tracking-wider uppercase">
                  Akun Pribadi
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  Direkomendasikan
                </span>
              </div>

              <h2 className="text-xl font-bold text-text-primary mb-2">
                Simpan Progres &amp; Bangun Paspor
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mb-5 leading-relaxed">
                Untuk siswa yang ingin menyimpan seluruh riwayat refleksi belajar dan rencana 30 hari.
              </p>

              <div className="flex flex-col gap-3 mb-6 text-xs text-text-primary">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-status-success-text text-[14px]">
                      check
                    </span>
                  </span>
                  <span>Menyimpan progres refleksi misi dan draf eksplorasi secara aman</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-status-success-text text-[14px]">
                      check
                    </span>
                  </span>
                  <span>Kendali privasi penuh dengan opsi sembunyikan nilai atau anggaran</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-status-success-text text-[14px]">
                      check
                    </span>
                  </span>
                  <span>Unduh ringkasan Paspor Belajar siap cetak untuk diskusi Guru BK</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col pt-4 mt-auto border-t border-border-default/60">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-subtle border border-border-default/80 text-text-secondary mb-4 text-xs">
                <span className="material-symbols-outlined text-text-secondary text-[18px] shrink-0 mt-0.5">
                  shield
                </span>
                <p className="leading-snug">
                  Data dilindungi prinsip perlindungan data pribadi dan hanya disimpan atas persetujuan sadarmu.
                </p>
              </div>

              <Link href="/daftar" className="w-full">
                <Button size="lg" variant="primary" className="w-full" icon="person_add">
                  Buat Akun Baru
                </Button>
              </Link>

              <div className="text-center mt-3 text-xs text-text-secondary">
                <span>Sudah punya akun? </span>
                <Link href="/masuk" className="font-bold text-[#5B5BD6] hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Micro reassurance banner */}
        <div className="w-full max-w-2xl flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-white border border-border-default shadow-2xs text-xs text-text-secondary text-center sm:text-left">
          <span className="material-symbols-outlined text-[#5B5BD6] text-[20px] shrink-0">
            verified_user
          </span>
          <p>
            Kerahasiaan data refleksi belajar terjamin sepenuhnya. NEXALORA tidak menjual atau membagikan datamu kepada pihak ketiga.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 text-center text-xs text-text-secondary">
        <p>© 2026 NEXALORA. Dirancang untuk eksplorasi mandiri siswa SMA.</p>
      </footer>
    </div>
  );
}
