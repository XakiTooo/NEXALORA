'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ClusterBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS } from '@/lib/data/seed';

export default function BerandaPage() {
  const {
    userContext,
    bookmarkedMajorIds,
    compareCartIds,
    toggleCompareCart,
    planTasks,
    updateTaskStatus,
  } = useApp();

  const handleToggleCompare = (id: string) => {
    const res = toggleCompareCart(id);
    if (!res.success && res.reason) {
      alert(res.reason);
    }
  };

  const activeWeeklyTasks = planTasks.filter((t) => t.mingguKe === 1);

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* 2-Column Asymmetric Dashboard Grid (70% Left Stream / 30% Right Rail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Stream (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Signature Hero Action Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4241bc] to-[#6E6EED] p-6 sm:p-7 shadow-xs text-white">
              <div className="relative z-10 max-w-xl flex flex-col items-start">
                <span className="text-white/80 font-bold text-[11px] uppercase tracking-wider mb-1">
                  Eksplorasi Studi Mandiri Siswa
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  Selamat Datang di NEXALORA, {userContext.namaPanggilan}!
                </h1>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed mt-2 mb-5">
                  Mulai langkah pertamamu dengan mencoba simulasi mini-kuliah 15–20 menit tanpa takut salah atau vonis bakat.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/simulasi">
                    <Button variant="white" size="md">
                      Pilih Misi Pertama
                    </Button>
                  </Link>
                  <Link href="/rekomendasi">
                    <Button
                      variant="ghost"
                      size="md"
                      className="text-white hover:bg-white/10"
                      iconRight="arrow_forward"
                    >
                      Buka Rekomendasi Personal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* 4-Card Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
              {/* Card 1: Misi Dicoba */}
              <div className="bg-white border border-border-default rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[120px]">
                <div className="flex items-start justify-between gap-1 w-full">
                  <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider truncate">
                    MISI DICOBA
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">science</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xl font-bold text-text-primary tracking-tight">
                    1 / 3 Misi
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Informatika aktif
                  </p>
                </div>
              </div>

              {/* Card 2: Pilihan Tersemat */}
              <div className="bg-white border border-border-default rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[120px]">
                <div className="flex items-start justify-between gap-1 w-full">
                  <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider truncate">
                    TERSEMAT
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">bookmark</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xl font-bold text-text-primary tracking-tight">
                    {bookmarkedMajorIds.length} Prodi
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Siap didiskusikan
                  </p>
                </div>
              </div>

              {/* Card 3: Rencana 30 Hari */}
              <div className="bg-white border border-border-default rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[120px]">
                <div className="flex items-start justify-between gap-1 w-full">
                  <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider truncate">
                    RENCANA 30 HARI
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xl font-bold text-text-primary tracking-tight">
                    {planTasks.filter((t) => t.status === 'done').length} / {planTasks.length} Tugas
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Minggu ke-1 aktif
                  </p>
                </div>
              </div>

              {/* Card 4: Progres Profil */}
              <div className="bg-white border border-border-default rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[120px]">
                <div className="flex items-start justify-between gap-1 w-full">
                  <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider truncate">
                    PROGRES PROFIL
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle text-emerald-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xl font-bold text-text-primary tracking-tight">
                    3 / 4 Langkah
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Konteks lengkap
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal "Lanjutkan Draft" Card */}
            <div className="bg-white border border-border-default rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#EEF2FF] text-[#5B5BD6] border border-indigo-100 flex items-center justify-center shadow-2xs">
                  <span className="material-symbols-outlined text-[24px]">play_circle</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <ClusterBadge cluster="informatika" />
                    <span className="text-[11px] font-semibold text-text-secondary">
                      Estimasi 15–20 Menit
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-text-primary truncate">
                    Misi Informatika: Menyortir Pesanan Kantin
                  </h3>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    Status: Draft tersimpan otomatis • Uji alur logika antrean
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <Link href="/simulasi/misi-informatika">
                  <Button size="md" variant="primary" iconRight="arrow_forward">
                    Lanjutkan Misi
                  </Button>
                </Link>
              </div>
            </div>

            {/* Rekomendasi Pilihan CobaDulu Preview (UX-14 Style) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-text-primary leading-tight">
                    Rekomendasi Studi Teratas Untukmu
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Disusun berdasarkan kuesioner eksplorasi minat mandirimu.
                  </p>
                </div>
                <Link href="/rekomendasi" className="text-xs font-bold text-primary hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEED_MAJORS.slice(0, 2).map((major) => (
                  <div
                    key={major.id}
                    className="bg-white border border-border-default rounded-2xl overflow-hidden shadow-xs hover:shadow-card transition-shadow flex flex-col justify-between"
                  >
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <ClusterBadge cluster={major.cluster} />
                        <StatusBadge status={major.statusData} />
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-text-primary leading-snug">
                          {major.namaProdi} ({major.jenjang})
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {major.namaKampus} • {major.kota}
                        </p>
                      </div>

                      {/* 3 Metric Rows */}
                      <div className="p-3 rounded-xl bg-surface-subtle border border-border-default/60 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Minat:</span>
                          <span className="font-semibold text-text-primary">
                            {major.clusterLabel.split('·')[1]?.trim() || 'Logika'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Kesiapan:</span>
                          <span className="font-semibold text-text-primary">
                            {major.kesiapanAkademik}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Estimasi Biaya:</span>
                          <span className="font-semibold text-text-primary">
                            {major.biayaPerTahun
                              ? `Rp ${major.biayaPerTahun.toLocaleString('id-ID')} / thn`
                              : 'Perlu diperiksa'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-border-default/60 flex items-center gap-2 mt-auto">
                      <Link href={`/jelajah/${major.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          Detail
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleToggleCompare(major.id)}
                      >
                        {compareCartIds.includes(major.id) ? '✓ Terpilih' : '+ Bandingkan'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contextual Widgets (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* 1. Priority Action Callout Card */}
            <div className="bg-[#EEF2FF] border border-indigo-100 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[#5B5BD6] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                    LANGKAH PRIORITAS
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary mt-0.5">
                    Selesaikan 1 Misi Simulasi
                  </h3>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Rekomendasi yang paling akurat disusun setelah kamu merasakan langsung studi kasus mini-kuliah.
              </p>
              <Link href="/simulasi" className="block pt-1">
                <Button size="sm" variant="primary" className="w-full">
                  Pilih Misi Mini-Kuliah
                </Button>
              </Link>
            </div>

            {/* 2. Progres Rencana 30 Hari Widget */}
            <div className="bg-white border border-border-default rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border-default/60">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                    Tugas Minggu Ini
                  </h4>
                  <p className="text-[11px] text-text-secondary">Rencana Eksplorasi 30 Hari</p>
                </div>
                <Link href="/rencana" className="text-xs font-bold text-primary hover:underline">
                  Buka Agenda
                </Link>
              </div>

              <div className="space-y-2">
                {activeWeeklyTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-border-default bg-surface-subtle flex items-start justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            task.status === 'done' ? 'todo' : 'done'
                          )
                        }
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          task.status === 'done'
                            ? 'bg-[#5B5BD6] border-[#5B5BD6] text-white'
                            : 'border-border-default bg-white text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      </button>
                      <div className="min-w-0">
                        <span
                          className={`text-xs block font-semibold truncate ${
                            task.status === 'done'
                              ? 'line-through text-text-secondary'
                              : 'text-text-primary'
                          }`}
                        >
                          {task.judul}
                        </span>
                        <span className="text-[10px] text-text-secondary">
                          {task.kategori} • {task.estimasiMenit} menit
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Slot Keranjang Bandingkan */}
            <div className="bg-white border border-border-default rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border-default/60">
                <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                  Keranjang Bandingkan
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary text-[11px] font-bold">
                  {compareCartIds.length} / 3
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Pilih hingga 3 program studi untuk dibandingkan kurikulum dan estimasi biayanya berdampingan.
              </p>

              <Link href="/bandingkan" className="block pt-1">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  disabled={compareCartIds.length === 0}
                  icon="balance"
                >
                  Buka Matriks ({compareCartIds.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
