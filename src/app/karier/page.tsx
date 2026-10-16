'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SEED_CAREERS } from '@/lib/data/seed';
import { CareerRole } from '@/types';

export default function KarierPage() {
  const [selectedCareer, setSelectedCareer] = useState<CareerRole>(SEED_CAREERS[0]);
  const [savedRoleMessage, setSavedRoleMessage] = useState(false);

  const handleSelectRole = () => {
    setSavedRoleMessage(true);
    setTimeout(() => setSavedRoleMessage(false), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">work_outline</span>
            Eksplorasi Peran Karier Nyata
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Eksplorasi Detail Karier
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Pahami aktivitas harian dan keluaran karya nyata di industri sebelum mengunci jurusan kuliahmu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Career Cards (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
              Daftar Peran Karier Terverifikasi:
            </span>
            {SEED_CAREERS.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCareer(c)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCareer.id === c.id
                    ? 'border-[#5B5BD6] bg-white shadow-card ring-2 ring-primary/20'
                    : 'border-border-default bg-white hover:bg-surface-subtle shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <ClusterBadge cluster={c.cluster} />
                  {selectedCareer.id === c.id && (
                    <span className="w-2 h-2 rounded-full bg-[#5B5BD6]" />
                  )}
                </div>
                <h3 className="font-bold text-sm text-text-primary leading-snug">
                  {c.namaPeran}
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {c.deskripsi}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Detail Peran (UX-31) (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
              <div>
                <ClusterBadge cluster={selectedCareer.cluster} />
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1.5">
                  {selectedCareer.namaPeran}
                </h2>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSelectRole}
                icon="bookmark_add"
              >
                {savedRoleMessage ? 'Tersimpan Sementara!' : 'Pilih Peran Sementara'}
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {selectedCareer.deskripsi}
            </p>

            {/* Aktivitas Harian */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary">
                Aktivitas Harian:
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                {selectedCareer.aktivitasHarian.map((act, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#5B5BD6] text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contoh Hasil Karya */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-default space-y-2">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                Contoh Karya yang Dihasilkan:
              </span>
              <ul className="space-y-1.5 text-xs text-text-primary">
                {selectedCareer.contohHasilKarya.map((karya, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                      deployed_code
                    </span>
                    <span>{karya}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latihan Pemula */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-[#3730A3] space-y-1">
              <span className="font-bold block">Eksperimen Mandiri Siswa SMA:</span>
              <p className="leading-relaxed">{selectedCareer.latihanPemula}</p>
            </div>

            {/* Prodi Terkait */}
            <div className="pt-2 border-t border-border-default flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-text-secondary">
                Program Studi Kuliah Terkait:
              </span>
              {selectedCareer.rekomendasiProdiTerkait.map((prodi, i) => (
                <Link key={i} href="/jelajah">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-subtle border border-border-default text-xs font-bold text-primary hover:bg-surface-container transition-colors">
                    {prodi}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
