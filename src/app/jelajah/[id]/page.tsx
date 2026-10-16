'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge, ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS } from '@/lib/data/seed';
import { getProgramById, mapCatalogProgramToMajorCampus } from '@/lib/api/endpoints';

export default function DetailProdiPage() {
  const params = useParams();
  const majorId = params.id as string;

  const {
    bookmarkedMajorIds,
    toggleBookmark,
    compareCartIds,
    toggleCompareCart,
  } = useApp();

  const [major, setMajor] = useState(() => {
    return SEED_MAJORS.find((m) => m.id === majorId) || SEED_MAJORS[0];
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveProgram() {
      try {
        const res = await getProgramById(majorId);
        if (isMounted && res?.data?.id) {
          setMajor(mapCatalogProgramToMajorCampus(res.data));
        }
      } catch {
        // Fallback to local seed
      }
    }
    fetchLiveProgram();
    return () => {
      isMounted = false;
    };
  }, [majorId]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'kurikulum' | 'bantuan' | 'karier'>('ringkasan');

  const isPinned = bookmarkedMajorIds.includes(major.id);
  const isCompared = compareCartIds.includes(major.id);

  const handleToggleCompare = () => {
    const res = toggleCompareCart(major.id);
    if (!res.success && res.reason) {
      alert(res.reason);
    }
  };

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Link href="/jelajah" className="hover:text-primary transition-colors">
            Katalog Jelajah
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-text-primary font-bold">{major.namaProdi}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClusterBadge cluster={major.cluster} />
                <StatusBadge status={major.statusData} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {major.namaProdi} ({major.jenjang})
              </h1>
              <p className="text-sm font-semibold text-text-secondary">
                {major.namaKampus} • {major.kota}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={handleToggleCompare}
                className={isCompared ? 'bg-[#EEF2FF] border-primary text-primary' : ''}
              >
                {isCompared ? '✓ Sedang Dibandingkan' : '+ Bandingkan'}
              </Button>

              <Button
                variant="outline"
                size="md"
                icon={isPinned ? 'bookmark_added' : 'bookmark_add'}
                onClick={() => toggleBookmark(major.id)}
                className={isPinned ? 'bg-status-success-bg border-emerald-300 text-status-success-text' : ''}
              >
                {isPinned ? 'Disematkan' : 'Sematkan'}
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-default/60">
            <div className="p-3 rounded-xl bg-surface-subtle">
              <span className="text-[10px] font-bold text-text-secondary uppercase">
                Akreditasi
              </span>
              <p className="font-bold text-sm text-text-primary mt-0.5">
                {major.akreditasi}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle">
              <span className="text-[10px] font-bold text-text-secondary uppercase">
                Estimasi UKT / Tahun
              </span>
              <p className="font-bold text-sm text-text-primary mt-0.5">
                {major.biayaPerTahun
                  ? `Rp ${major.biayaPerTahun.toLocaleString('id-ID')}`
                  : 'Perlu diperiksa'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle">
              <span className="text-[10px] font-bold text-text-secondary uppercase">
                Kesiapan Akademik
              </span>
              <p className="font-bold text-sm text-text-primary mt-0.5">
                {major.kesiapanAkademik}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle">
              <span className="text-[10px] font-bold text-text-secondary uppercase">
                Tahun Data
              </span>
              <p className="font-bold text-sm text-text-primary mt-0.5">
                {major.biayaTahunSumber} (Contoh)
              </p>
            </div>
          </div>
        </div>

        {/* Detail Tabs (UX-16 + UX-28 Kurikulum + UX-29 Bantuan) */}
        <div className="flex items-center gap-2 border-b border-border-default pb-2">
          {[
            { id: 'ringkasan', label: 'Ringkasan & Biaya', icon: 'info' },
            { id: 'kurikulum', label: 'Kurikulum & Mata Kuliah', icon: 'menu_book' },
            { id: 'bantuan', label: 'Bantuan Pendidikan & Beasiswa', icon: 'payments' },
            { id: 'karier', label: 'Prospek Karier', icon: 'work_outline' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-white text-primary shadow-xs border border-border-default'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Ringkasan & Biaya */}
        {activeTab === 'ringkasan' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-text-primary">
                  Alasan &amp; Relevansi Eksplorasi
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                  {major.alasanRekomendasi.map((alasan, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[#5B5BD6] text-[18px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span className="leading-relaxed">{alasan}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-text-primary">
                  Jalur Masuk Resmi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {major.jalurMasuk.map((jalur, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-surface-subtle border border-border-default text-xs font-semibold text-text-primary"
                    >
                      {jalur}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border-default p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-text-primary">
                  Rasakan Cara Belajarnya
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Coba mini-kuliah 15–20 menit untuk menguji apakah kamu menikmati tipe masalah yang dipelajari di jurusan ini.
                </p>
                <Link href={`/simulasi/misi-${major.cluster}`} className="block pt-1">
                  <Button size="sm" variant="primary" className="w-full">
                    Mulai Mini-Kuliah
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kurikulum & Mata Kuliah (UX-28) */}
        {activeTab === 'kurikulum' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Struktur Kurikulum &amp; Mata Kuliah Kunci
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Data kurikulum resmi tingkat sarjana/diploma untuk memberikan gambaran mata kuliah nyata.
              </p>
            </div>

            <div className="space-y-3">
              {major.kurikulumHighlights.map((mk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white border border-border-default text-primary flex items-center justify-center font-bold text-xs shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-text-primary">
                      {mk}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Mata Kuliah Inti
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bantuan Pendidikan & Beasiswa (UX-29) */}
        {activeTab === 'bantuan' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Peluang Bantuan Biaya &amp; Beasiswa
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Informasi skema pembiayaan pendidikan yang tersedia untuk kampus ini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-default space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-status-success-bg text-status-success-text text-[11px] font-bold">
                  Terbuka Setiap Tahun
                </span>
                <h3 className="font-bold text-base text-text-primary">
                  KIP-Kuliah (Kemendikbudristek)
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Pembebasan biaya kuliah penuh ditambah bantuan biaya hidup bulanan untuk siswa pemegang KIP/KKS.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-default space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold">
                  Prestasi &amp; Mitra
                </span>
                <h3 className="font-bold text-base text-text-primary">
                  Beasiswa Mitra Industri / Kampus
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Potongan biaya SPP/UKT untuk mahasiswa berprestasi akademik dan kejuaraan tingkat provinsi/nasional.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Prospek Karier */}
        {activeTab === 'karier' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Arah Karier yang Dibangun
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Peran pekerjaan riil yang memanfaatkan keahlian dari program studi ini.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {major.prospekKarier.map((karier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#5B5BD6] text-[20px]">
                      work
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-text-primary">
                      {karier}
                    </span>
                  </div>
                  <Link href="/karier" className="text-xs font-bold text-primary hover:underline">
                    Eksplorasi
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
