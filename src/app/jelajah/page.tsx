'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge, ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS } from '@/lib/data/seed';
import { getCatalog, mapCatalogProgramToMajorCampus } from '@/lib/api/endpoints';

export default function JelajahPage() {
  const {
    bookmarkedMajorIds,
    toggleBookmark,
    compareCartIds,
    toggleCompareCart,
  } = useApp();

  const [majorsList, setMajorsList] = useState(SEED_MAJORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedAkreditasi, setSelectedAkreditasi] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    async function loadLiveCatalog() {
      try {
        const res = await getCatalog();
        if (
          isMounted &&
          res?.data?.programs &&
          Array.isArray(res.data.programs) &&
          res.data.programs.length > 0
        ) {
          const mapped = res.data.programs.map((p) => mapCatalogProgramToMajorCampus(p));
          setMajorsList(mapped);
        }
      } catch {
        // Graceful fallback to local seed data
      }
    }
    loadLiveCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMajors = majorsList.filter((m) => {
    const matchesSearch =
      m.namaProdi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.namaKampus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kota.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCluster = selectedCluster === 'all' || m.cluster === selectedCluster;
    const matchesAkreditasi = selectedAkreditasi === 'all' || m.akreditasi === selectedAkreditasi;

    return matchesSearch && matchesCluster && matchesAkreditasi;
  });

  const handleToggleCompare = (id: string) => {
    const res = toggleCompareCart(id);
    if (!res.success && res.reason) {
      alert(res.reason);
    }
  };

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Katalog Program Studi &amp; Kampus
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Telusuri program studi terverifikasi dengan data kurikulum dan estimasi biaya transparan.
            </p>
          </div>

          <Link href="/rekomendasi">
            <Button variant="secondary" size="md" icon="auto_awesome">
              Buka Rekomendasi Personal
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border-default shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-text-secondary text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Cari nama jurusan, kampus, atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-subtle rounded-xl h-11 pl-10 pr-4 text-xs sm:text-sm font-medium text-text-primary placeholder:text-text-secondary border border-border-default focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Akreditasi dropdown */}
            <select
              value={selectedAkreditasi}
              onChange={(e) => setSelectedAkreditasi(e.target.value)}
              className="h-11 px-3 rounded-xl bg-surface-subtle text-xs font-semibold text-text-primary border border-border-default focus:border-primary focus:outline-none w-full sm:w-auto"
            >
              <option value="all">Semua Akreditasi</option>
              <option value="Unggul">Unggul</option>
              <option value="A">A</option>
              <option value="Baik Sekali">Baik Sekali</option>
            </select>
          </div>

          {/* Cluster filter pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-default/60">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mr-1">
              Rumpun:
            </span>
            {[
              { id: 'all', label: 'Semua Rumpun' },
              { id: 'informatika', label: 'Informatika & Komputer' },
              { id: 'industri', label: 'Teknik Industri & Proses' },
              { id: 'dkv', label: 'DKV & Seni Visual' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCluster(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCluster === c.id
                    ? 'bg-[#5B5BD6] text-white shadow-xs'
                    : 'bg-surface-subtle text-text-secondary hover:text-text-primary border border-border-default'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        {filteredMajors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border-default p-12 text-center space-y-3 shadow-xs">
            <span className="material-symbols-outlined text-[44px] text-text-secondary">
              search_off
            </span>
            <h3 className="font-bold text-base text-text-primary">
              Tidak ada hasil yang cocok
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              Tidak ada program studi yang sesuai dengan kata kunci &quot;{searchQuery}&quot;. Ubah kata kunci atau reset filter untuk melihat katalog.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCluster('all');
                setSelectedAkreditasi('all');
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMajors.map((major) => {
              const isPinned = bookmarkedMajorIds.includes(major.id);
              const isCompared = compareCartIds.includes(major.id);

              return (
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
                      <h3 className="font-bold text-base text-text-primary leading-snug">
                        {major.namaProdi} ({major.jenjang})
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {major.namaKampus}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-default/60 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Lokasi:</span>
                        <span className="font-semibold text-text-primary">{major.kota}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Akreditasi:</span>
                        <span className="font-semibold text-text-primary">{major.akreditasi}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Biaya:</span>
                        <span className="font-semibold text-text-primary">
                          {major.biayaPerTahun
                            ? `Rp ${major.biayaPerTahun.toLocaleString('id-ID')}`
                            : 'Perlu diperiksa'}
                        </span>
                      </div>
                    </div>

                    {/* Prospek singkat */}
                    <div className="text-[11px] text-text-secondary leading-snug">
                      <span className="font-bold text-text-primary">Jalur masuk: </span>
                      {major.jalurMasuk.join(', ')}
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-border-default/60 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2 flex-1">
                      <Link href={`/jelajah/${major.id}`} className="flex-1">
                        <Button size="sm" variant="primary" className="w-full">
                          Detail
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className={isCompared ? 'bg-[#EEF2FF] border-primary text-primary' : ''}
                        onClick={() => handleToggleCompare(major.id)}
                      >
                        {isCompared ? '✓ Banding' : '+ Banding'}
                      </Button>
                    </div>

                    <button
                      onClick={() => toggleBookmark(major.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isPinned
                          ? 'bg-status-success-bg border-emerald-300 text-status-success-text'
                          : 'bg-white border-border-default text-text-secondary hover:text-text-primary'
                      }`}
                      title={isPinned ? 'Lepas Sematan' : 'Sematkan Prodi'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPinned ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
