'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { Button } from '@/components/ui/Button';
import { LogoutModal } from '@/components/common/LogoutModal';
import { useApp } from '@/context/AppContext';

export default function ProfilHubPage() {
  const { userContext, preferences, academic, bookmarkedMajorIds } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">person</span>
              Hub Profil Siswa
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Profil &amp; Kontrol Data Mandiri
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Kelola informasi konteks, buat snapshot paspor belajar untuk diskusi, atau atur ekspor datamu.
            </p>
          </div>
        </div>

        {/* User Identity Card */}
        <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4241bc] to-[#6E6EED] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
              {userContext.namaPanggilan.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-text-primary">
                  {userContext.namaPanggilan}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold">
                  Kelas {userContext.kelas} SMA
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Kelulusan: {userContext.tahunKelulusan} • Domisili: {preferences.domisili || 'Belum diisi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/profil/paspor">
              <Button size="md" variant="primary" icon="description">
                Buka Paspor Belajar (PDF)
              </Button>
            </Link>
            <Button
              size="md"
              variant="outline"
              icon="logout"
              onClick={() => setShowLogoutModal(true)}
              className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
            >
              Keluar
            </Button>
          </div>
        </div>

        {/* 3 Core Section Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Section 1: Paspor Belajar */}
          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
              <h3 className="font-bold text-base text-text-primary">
                Paspor Studi &amp; Karier
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Dokumen ringkas satu lembar berisi pilihan jurusan, refleksi mini-kuliah, dan catatan diskusi untuk Guru BK atau orang tua.
              </p>
            </div>
            <Link href="/profil/paspor" className="w-full">
              <Button size="sm" variant="secondary" className="w-full" iconRight="arrow_forward">
                Buat Snapshot Baru
              </Button>
            </Link>
          </div>

          {/* Section 2: Pengaturan Akun & Privasi */}
          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">settings</span>
              </div>
              <h3 className="font-bold text-base text-text-primary">
                Pengaturan Akun &amp; Kriteria
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ubah nama panggilan, sesuaikan preferensi domisili &amp; batas biaya, atau kelola persetujuan data pribadi.
              </p>
            </div>
            <Link href="/pengaturan" className="w-full">
              <Button size="sm" variant="outline" className="w-full" iconRight="arrow_forward">
                Buka Pengaturan
              </Button>
            </Link>
          </div>

          {/* Section 3: Ekspor & Hapus Data */}
          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">download</span>
              </div>
              <h3 className="font-bold text-base text-text-primary">
                Ekspor Salinan Data Pribadi
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Unduh seluruh data refleksi dan jawaban minat dalam format arsip terstruktur yang dapat kamu simpan mandiri.
              </p>
            </div>
            <Link href="/pengaturan#ekspor" className="w-full">
              <Button size="sm" variant="outline" className="w-full" iconRight="arrow_forward">
                Ekspor Data
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Details */}
        <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-text-primary border-b border-border-default pb-2">
            Status Kelengkapan Profil
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-subtle">
              <span className="text-text-secondary block">Jurusan Tersemat:</span>
              <span className="font-bold text-text-primary text-sm mt-0.5 block">
                {bookmarkedMajorIds.length} Program Studi
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-subtle">
              <span className="text-text-secondary block">Kesiapan Rapor:</span>
              <span className="font-bold text-text-primary text-sm mt-0.5 block">
                {academic.grades.length > 0 ? `${academic.grades.length} Mapel Terisi` : 'Dilewati'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-subtle">
              <span className="text-text-secondary block">Batas Anggaran:</span>
              <span className="font-bold text-text-primary text-sm mt-0.5 block">
                {preferences.rentangAnggaranMax
                  ? `Rp ${preferences.rentangAnggaranMax.toLocaleString('id-ID')} / thn`
                  : 'Fleksibel'}
              </span>
            </div>
          </div>
        </div>

        {/* Session & Logout Banner */}
        <div className="bg-surface-subtle rounded-2xl border border-border-default p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-border-default text-text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">devices</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                Sesi Perangkat Bersama (Sekolah / Lab)
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Pastikan keluar dari sesi setelah selesai menggunakan komputer sekolah agar privasi catatanmu terlindungi.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            icon="logout"
            onClick={() => setShowLogoutModal(true)}
            className="shrink-0 text-red-600 border-red-200 hover:bg-red-50"
          >
            Keluar dari Akun
          </Button>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </AppShell>
  );
}
