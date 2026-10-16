'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MISSIONS } from '@/lib/data/seed';
import { fetchMissionsCatalog } from '@/lib/data/missionsDatabase';

export default function SimulasiIndexPage() {
  const { missionSubmissions } = useApp();
  const [missionsList, setMissionsList] = useState<any[]>(SEED_MISSIONS);

  useEffect(() => {
    let isMounted = true;
    async function loadMissions() {
      try {
        const live = await fetchMissionsCatalog();
        if (isMounted && live && live.length > 0) {
          setMissionsList(SEED_MISSIONS);
        }
      } catch {}
    }
    loadMissions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">school</span>
              Mini-Kuliah NEXALORA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Katalog Simulasi Mini-Kuliah
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Rasakan 15–20 menit cara belajar di tiap jurusan: pelajari materinya, kerjakan tugas kasus praktis, terima umpan balik berbasis rubrik, dan refleksikan minatmu.
            </p>
          </div>
        </div>

        {/* Info Banner Disclaimer PRD v1.3 */}
        <div className="p-4 rounded-xl bg-surface-subtle border border-border-default flex items-start gap-3 text-xs text-text-secondary">
          <span className="material-symbols-outlined text-[#5B5BD6] text-[20px] shrink-0 mt-0.5">
            info
          </span>
          <p className="leading-relaxed">
            <strong className="text-text-primary font-bold">Catatan Kejujuran Produk:</strong> Ini cuplikan aktivitas belajar pengantar, bukan gambaran lengkap seluruh perkuliahan 4 tahun. Tugas ini dirancang untuk menguji tipe cara berpikirmu, bukan untuk menilai bakat.
          </p>
        </div>

        {/* 3 Mission Cards (UX-41) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missionsList.map((misi) => {
            const submission = missionSubmissions[misi.id];
            const isCompleted = !!submission;

            return (
              <div
                key={misi.id}
                className="bg-white border border-border-default rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-card transition-shadow"
              >
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <ClusterBadge cluster={misi.cluster} />
                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-status-success-bg text-status-success-text text-[11px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Terkumpul
                      </span>
                    ) : (
                      <span className="text-text-secondary text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {misi.estimasiDurasiMenit} Menit
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
                      {misi.judul}
                    </h2>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                      {misi.subjudul}
                    </p>
                  </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-default/60 text-xs space-y-2">
                    <div>
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                        Model Pembelajaran
                      </span>
                      <span className="font-semibold text-text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#5B5BD6]">school</span>
                        Dicoding Academy Style (6 Silabus Modul)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                        Format Pengumpulan
                      </span>
                      <span className="font-semibold text-[#5B5BD6]">
                        Unggah Berkas (.ZIP, .PDF, .PNG)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto border-t border-border-default/60">
                  <Link href={`/simulasi/${misi.id}`} className="w-full block pt-4">
                    <Button
                      size="md"
                      variant={isCompleted ? 'secondary' : 'primary'}
                      className="w-full"
                      iconRight="arrow_forward"
                    >
                      {isCompleted ? 'Tinjau Hasil & Refleksi' : 'Mulai Mini-Kuliah'}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
