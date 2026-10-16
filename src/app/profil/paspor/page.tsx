'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { Button } from '@/components/ui/Button';
import { ClusterBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS, SEED_MISSIONS } from '@/lib/data/seed';

export default function PasporPage() {
  const {
    userContext,
    preferences,
    academic,
    bookmarkedMajorIds,
    missionReflections,
    missionSubmissions,
    passportSnapshots,
    addPassportSnapshot,
  } = useApp();

  // UX-36 Privacy Options
  const [includeGrades, setIncludeGrades] = useState(false);
  const [includeBudget, setIncludeBudget] = useState(false);
  const [includeReflectionNotes, setIncludeReflectionNotes] = useState(true);

  // View: 'preview' (UX-35/36) | 'snapshot' (UX-37)
  const [isSnapshotView, setIsSnapshotView] = useState(false);
  const [activeSnapshotNumber, setActiveSnapshotNumber] = useState('');

  const pinnedMajors = SEED_MAJORS.filter((m) => bookmarkedMajorIds.includes(m.id));

  const completedMissionIds = Object.keys(missionSubmissions).filter(
    id => missionSubmissions[id].statusKelulusan === 'lulus'
  );

  const handleCreateSnapshot = () => {
    const snapId = `snap-${Date.now()}`;
    const snapNumber = `SNAP-2026-${(userContext.namaPanggilan || 'SISWA').toUpperCase()}-${String(Date.now()).slice(-4)}`;
    setActiveSnapshotNumber(snapNumber);

    addPassportSnapshot({
      id: snapId,
      nomorSnapshot: snapNumber,
      tanggalDibuat: new Date().toISOString(),
      namaSiswa: userContext.namaPanggilan,
      kelas: `Kelas ${userContext.kelas} SMA`,
      sekolah: undefined,
      sertakanNilaiRapor: includeGrades,
      sertakanAnggaranBiaya: includeBudget,
      sertakanRefleksiSensitif: includeReflectionNotes,
      prodiTerpilih: pinnedMajors.map((m) => `${m.namaProdi} - ${m.namaKampus}`),
      misiSelesai: completedMissionIds.map((mId) => {
        const m = SEED_MISSIONS.find((sm) => sm.id === mId);
        return m ? m.judul : mId;
      }),
      catatanDiskusiBK: '',
    });

    setIsSnapshotView(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-text-secondary print:hidden">
          <Link href="/profil" className="hover:text-primary transition-colors">
            Hub Profil
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-text-primary font-bold">Paspor Studi &amp; Karier</span>
        </nav>

        {!isSnapshotView ? (
          /* UX-35 & UX-36: PREVIEW & PRIVACY OPTIONS */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Dokumen Pendamping BK
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Pratinjau Paspor Studi &amp; Karier
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
                  Dokumen ringkas satu lembar yang memuat pilihan jurusan, refleksi mini-kuliah, dan batasan produk yang siap dicetak untuk konsultasi bersama Guru BK atau orang tua.
                </p>
              </div>

              <Button
                size="lg"
                variant="primary"
                icon="print"
                onClick={handleCreateSnapshot}
              >
                Buat Snapshot Siap Cetak
              </Button>
            </div>

            {/* OPSI PRIVASI PASPOR */}
            <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border-default">
                <span className="material-symbols-outlined text-[#5B5BD6] text-[20px]">
                  shield
                </span>
                <h2 className="text-base font-bold text-text-primary">
                  Opsi Privasi Paspor
                </h2>
              </div>

              <div className="p-3.5 rounded-xl bg-status-warning-bg/60 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
                  warning
                </span>
                <p className="leading-relaxed">
                  <strong>Peringatan Privasi:</strong> File PDF yang sudah kamu unduh atau cetak tidak dapat ditarik kembali dari penerima. Tentukan informasi mana yang nyaman kamu bagikan.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle border border-border-default cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGrades}
                    onChange={(e) => setIncludeGrades(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B5BD6] accent-[#5B5BD6] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text-primary block">
                      Sertakan Nilai Rapor Rinci
                    </span>
                    <span className="text-text-secondary">
                      Default: disembunyikan untuk menjaga privasi nilai akademikmu.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle border border-border-default cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBudget}
                    onChange={(e) => setIncludeBudget(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B5BD6] accent-[#5B5BD6] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text-primary block">
                      Sertakan Perkiraan Anggaran Biaya Keluarga
                    </span>
                    <span className="text-text-secondary">
                      Default: disembunyikan agar data keuangan keluarga tetap aman.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle border border-border-default cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeReflectionNotes}
                    onChange={(e) => setIncludeReflectionNotes(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B5BD6] accent-[#5B5BD6] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text-primary block">
                      Sertakan Catatan Refleksi Afektif Mini-Kuliah
                    </span>
                    <span className="text-text-secondary">
                      Membantu Guru BK memahami apa yang kamu sukai atau keluhkan saat coba belajar.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border-default">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">
                    Paspor Eksplorasi: {userContext.namaPanggilan}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Kelas {userContext.kelas} SMA • Lulus {userContext.tahunKelulusan}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-subtle border border-border-default text-xs font-semibold text-text-secondary">
                  Draf Pratinjau
                </span>
              </div>

              {/* Pinned Majors Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Program Studi yang Sedang Dipertimbangkan:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pinnedMajors.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-xl bg-surface-subtle border border-border-default text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <ClusterBadge cluster={m.cluster} />
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {m.akreditasi}
                        </span>
                      </div>
                      <span className="font-bold text-text-primary block text-sm mt-1">
                        {m.namaProdi} • {m.namaKampus}
                      </span>
                      <span className="text-text-secondary block">
                        Lokasi: {m.kota}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini-Course Reflections Summary in Preview */}
              <div className="space-y-3 pt-3 border-t border-border-default">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Refleksi Simulasi Mini-Kuliah Terselesaikan ({completedMissionIds.length}):
                </h4>
                {completedMissionIds.length === 0 ? (
                  <p className="text-xs text-text-secondary italic">
                    Belum ada simulasi yang diselesaikan. Selesaikan simulasi di menu Simulasi untuk merekam refleksi di sini.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {completedMissionIds.map((mId) => {
                      const m = SEED_MISSIONS.find((sm) => sm.id === mId);
                      const ref = missionReflections[mId];
                      return (
                        <div key={mId} className="p-3 rounded-xl bg-surface-subtle border border-border-default text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold text-text-primary block">
                              {m?.judul || mId}
                            </span>
                            <span className="text-text-secondary text-[11px]">
                              {ref?.ekspektasiVsKenyataan || 'Refleksi pengalaman tersimpan'}
                            </span>
                          </div>
                          {ref?.tingkatEnjoyment && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-primary font-bold text-[11px]">
                              {ref.tingkatEnjoyment}/5 ★
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Saved Snapshots History */}
              {passportSnapshots.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-border-default">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Riwayat Snapshot Tersimpan ({passportSnapshots.length}):
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {passportSnapshots.slice(0, 3).map((snap) => (
                      <span key={snap.id} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {snap.nomorSnapshot} ({new Date(snap.tanggalDibuat).toLocaleDateString('id-ID')})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* UX-37: PASPOR SNAPSHOT SIAP CETAK (PDF / PRINT VIEW) */
          <div className="space-y-6">
            <div className="flex items-center justify-between print:hidden">
              <Button
                variant="outline"
                size="sm"
                icon="arrow_back"
                onClick={() => setIsSnapshotView(false)}
              >
                Kembali ke Pengaturan Privasi
              </Button>

              <Button size="md" variant="primary" icon="print" onClick={handlePrint}>
                Cetak / Simpan PDF Sekarang
              </Button>
            </div>

            {/* A4 Clean Printable Sheet */}
            <div className="bg-white rounded-2xl border border-border-default p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
              {/* Sheet Header */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#5B5BD6]">
                      NEXALORA • Paspor Studi &amp; Karier Siswa
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Snapshot Eksplorasi Mandiri
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Dokumen pendamping konsultasi pemilihan program studi bersama Guru BK dan Orang Tua.
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono">
                  <div className="font-bold text-slate-900">
                    NO: {activeSnapshotNumber || passportSnapshots[0]?.nomorSnapshot || `SNAP-2026-${(userContext.namaPanggilan || 'SISWA').toUpperCase()}-01`}
                  </div>
                  <div>Dibuat: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>

              {/* Student Bio */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Nama Siswa:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{userContext.namaPanggilan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tingkat Kelas:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">Kelas {userContext.kelas} SMA</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tahun Kelulusan:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{userContext.tahunKelulusan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Domisili Asal:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{preferences.domisili || 'Indonesia'}</span>
                </div>
              </div>

              {/* Section 1: Program Studi Pilihan & Alasan */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                  1. Program Studi yang Dipertimbangkan (Pilihan Tersemat)
                </h2>
                <div className="space-y-3">
                  {pinnedMajors.map((m, idx) => (
                    <div key={m.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {m.namaProdi} ({m.jenjang}) — {m.namaKampus}
                        </span>
                        <span className="text-slate-600 font-medium">Akreditasi: {m.akreditasi}</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Lokasi: {m.kota} • Jalur: {m.jalurMasuk.join(', ')}
                      </p>
                      {includeBudget && (
                        <p className="text-xs text-slate-800 font-semibold">
                          Estimasi UKT: {m.biayaPerTahun ? `Rp ${m.biayaPerTahun.toLocaleString('id-ID')} / thn` : 'Perlu diperiksa'}
                        </p>
                      )}
                      <div className="text-[11px] text-slate-600 pt-1">
                        <strong>Alasan Relevan:</strong> {m.alasanRekomendasi[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Refleksi Mini-Kuliah */}
              {includeReflectionNotes && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                    2. Catatan Refleksi Pengalaman Belajar (Mini-Kuliah)
                  </h2>
                  {completedMissionIds.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
                      <p className="font-semibold text-slate-800">
                        Belum Ada Riwayat Refleksi Mini-Kuliah
                      </p>
                      <p>
                        Siswa belum menyelesaikan simulasi mini-kuliah praktis. Dokumen paspor ini dirancang untuk memuat refleksi 15–20 menit dari simulasi di menu <em>Simulasi</em> agar siswa dapat merasakan secara nyata alur berpikir di jurusan terkait tanpa vonis tes kepribadian instan. Setelah simulasi diselesaikan, skor kesenangan dan catatan refleksi akan otomatis tertera di bagian ini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedMissionIds.map((mId) => {
                        const m = SEED_MISSIONS.find((sm) => sm.id === mId);
                        const ref = missionReflections[mId];
                        const sub = missionSubmissions[mId];
                        const dateStr = sub?.waktuSubmit
                          ? new Date(sub.waktuSubmit).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Sesi Ini';

                        const note =
                          (ref as any)?.catatanRefleksi ||
                          ref?.ekspektasiVsKenyataan ||
                          'Siswa telah menyelesaikan pengerjaan tugas simulasi dan merefleksikan minat belajarnya.';

                        return (
                          <div
                            key={mId}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {m?.judul || mId}
                                </span>
                                {m && (
                                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {m.cluster.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {dateStr}
                                </span>
                                {ref?.tingkatEnjoyment && (
                                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-[#5B5BD6] font-bold text-[11px]">
                                    Skor Kesenangan: {ref.tingkatEnjoyment} / 5
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                              <span className="font-semibold text-slate-900 block mb-0.5">
                                Catatan Refleksi Pengalaman:
                              </span>
                              <p>{note}</p>
                            </div>

                            {ref && (
                              <div className="flex flex-wrap gap-4 text-[11px] text-slate-600 pt-0.5">
                                <span>
                                  Minat Mendalami: <strong className="text-slate-800">{ref.minatMendalami}</strong>
                                </span>
                                <span>
                                  Fokus Favorit: <strong className="text-slate-800">{ref.bagianPalingMenarik}</strong>
                                </span>
                                {ref.aspekTersulit && (
                                  <span>
                                    Aspek Menantang: <strong className="text-slate-800">{ref.aspekTersulit}</strong>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Section 3: Rapor Akademik (Optional Privacy) */}
              {includeGrades && academic.grades.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                    3. Riwayat Akademik Terlampir
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs">
                    {academic.grades.map((g, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">{g.mataPelajaran}:</span>
                        <span className="font-bold text-slate-900 text-sm">{g.nilai}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4: Batasan & Prinsip Kejujuran */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block">Batasan &amp; Disclaimer Resmi NEXALORA:</span>
                <p>
                  Dokumen paspor ini bukan bukti penerimaan perguruan tinggi dan bukan hasil diagnosis bakat psikotes formal. Dokumen ini dirancang sebagai bahan diskusi reflektif mandiri antara siswa, wali murid, dan Guru Bimbingan Konseling (BK).
                </p>
              </div>

              {/* Signature Blocks for BK and Parents */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
                <div className="flex flex-col items-center">
                  <span className="text-slate-500">Siswa Bersangkutan,</span>
                  <div className="h-16" />
                  <span className="font-bold text-slate-900 border-t border-slate-400 px-8 pt-1">
                    {userContext.namaPanggilan}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-slate-500">Guru Pembimbing BK / Orang Tua,</span>
                  <div className="h-16" />
                  <span className="font-bold text-slate-900 border-t border-slate-400 px-8 pt-1">
                    ( .................................................... )
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
