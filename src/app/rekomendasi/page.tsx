'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge, ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS } from '@/lib/data/seed';

export default function RekomendasiPage() {
  const {
    bookmarkedMajorIds,
    toggleBookmark,
    compareCartIds,
    toggleCompareCart,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rekomendasi' | 'tersemat'>('rekomendasi');
  const [filterMode, setFilterMode] = useState<'personal' | 'umum' | 'hitung_ulang'>('personal');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active highlighted evidence in right rail (UX-15 Panel Bukti)
  const [activeEvidence, setActiveEvidence] = useState<{
    programName: string;
    reason1: string;
    reason2: string;
    missionLog: string;
    studentReflection: string;
  }>({
    programName: 'Informatika — Universitas Contoh A',
    reason1: 'Skala 4/5 (15 Okt, 14.30) · Tertarik menyusun langkah logis dan otomasi alur secara mandiri.',
    reason2: 'Skala 5/5 (15 Okt, 14.31) · Tertantang memecahkan hambatan logika dalam penyelesaian tugas.',
    missionLog: 'Misi “Sortir Pesanan Kantin” selesai 12 menit. Pemahaman alur logika dinyatakan tuntas.',
    studentReflection: '“Saya suka melihat alur berjalan rapi tanpa eror. Ketika logika tepat, rasanya melegakan.”',
  });

  const [highlightPulse, setHighlightPulse] = useState(false);

  const handleSelectEvidence = (
    programName: string,
    reason1: string,
    reason2: string,
    missionLog: string,
    studentReflection: string
  ) => {
    setActiveEvidence({
      programName,
      reason1,
      reason2,
      missionLog,
      studentReflection,
    });
    setHighlightPulse(true);
    setTimeout(() => setHighlightPulse(false), 1200);

    // If mobile, scroll down to evidence panel
    const elem = document.getElementById('panel-bukti-widget');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleToggleCompare = (id: string) => {
    const res = toggleCompareCart(id);
    if (!res.success && res.reason) {
      alert(res.reason);
    }
  };

  const pinnedMajors = SEED_MAJORS.filter((m) => bookmarkedMajorIds.includes(m.id));

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Link href="/jelajah" className="hover:text-primary transition-colors">
            Jelajah
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-text-primary font-bold">Rekomendasi Studi</span>
        </nav>

        {/* Hero Gradient Header (UX-14 signature) */}
        <div className="bg-gradient-to-r from-[#4241bc] to-[#6E6EED] text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="relative z-10 flex flex-col items-start">
            <h1 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Rekomendasi Studi
            </h1>
            <p className="text-white/85 text-xs sm:text-sm max-w-2xl leading-relaxed mt-1.5">
              Disusun transparan dari kuesioner minat dan aktivitas coba-belajarmu.
            </p>
          </div>
        </div>

        {/* Primary Mode Segment Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('rekomendasi')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'rekomendasi'
                  ? 'bg-[#5B5BD6] text-white shadow-md ring-2 ring-[#5B5BD6]/25 font-bold border border-transparent'
                  : 'bg-white text-text-secondary hover:text-text-primary hover:bg-slate-50 border border-border-default font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Rekomendasi Personal</span>
              <span
                className={`px-2 py-0.5 text-[11px] rounded-full font-bold ${
                  activeTab === 'rekomendasi'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EEF2FF] text-[#5B5BD6]'
                }`}
              >
                Versi 2 Aktif
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tersemat')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'tersemat'
                  ? 'bg-[#5B5BD6] text-white shadow-md ring-2 ring-[#5B5BD6]/25 font-bold border border-transparent'
                  : 'bg-white text-text-secondary hover:text-text-primary hover:bg-slate-50 border border-border-default font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {activeTab === 'tersemat' ? 'bookmark' : 'bookmark_border'}
              </span>
              <span>Pilihan Tersemat</span>
              <span
                className={`px-2 py-0.5 text-[11px] rounded-full font-bold ${
                  activeTab === 'tersemat'
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-subtle text-text-secondary'
                }`}
              >
                {bookmarkedMajorIds.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon="history"
              onClick={() => setIsDrawerOpen(true)}
            >
              Riwayat Versi
            </Button>
            <Link href="/pengaturan">
              <Button variant="secondary" size="sm" icon="tune">
                Atur Kriteria
              </Button>
            </Link>
          </div>
        </div>

        {/* TAB 1: REKOMENDASI PERSONAL (UX-14 Main View) */}
        {activeTab === 'rekomendasi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT STREAM: Cards & Change Notifications (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Version 2 Update Notification Banner */}
              <div className="p-4 bg-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs border border-border-default">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-border-default flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      notifications_active
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-text-primary">
                        Usulan Pembaruan Rekomendasi
                      </span>
                      <span className="px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-800 text-[10px] font-bold">
                        Menunggu Konfirmasi
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-snug mt-1">
                      Usulan pembaruan tersedia berdasarkan refleksi tugas Informatika. Rekomendasi ini belum diterapkan ke akunmu.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  iconRight="arrow_forward"
                  onClick={() => setIsDrawerOpen(true)}
                  className="shrink-0"
                >
                  Tinjau Usulan Perubahan
                </Button>
              </div>

              {/* State Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => setFilterMode('personal')}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                    filterMode === 'personal'
                      ? 'bg-[#EEF2FF] border-2 border-[#5B5BD6] text-[#5B5BD6] font-bold shadow-2xs'
                      : 'bg-white border border-border-default text-text-secondary hover:text-text-primary hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>Rekomendasi Personal (Aktif)</span>
                </button>
                <button
                  onClick={() => setFilterMode('umum')}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                    filterMode === 'umum'
                      ? 'bg-[#EEF2FF] border-2 border-[#5B5BD6] text-[#5B5BD6] font-bold shadow-2xs'
                      : 'bg-white border border-border-default text-text-secondary hover:text-text-primary hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">public</span>
                  <span>Katalog Umum (Tanpa Urutan Personal)</span>
                </button>
                <button
                  onClick={() => setFilterMode('hitung_ulang')}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                    filterMode === 'hitung_ulang'
                      ? 'bg-[#EEF2FF] border-2 border-[#5B5BD6] text-[#5B5BD6] font-bold shadow-2xs'
                      : 'bg-white border border-border-default text-text-secondary hover:text-text-primary hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">sync</span>
                  <span>Perlu Dihitung Ulang</span>
                </button>
              </div>

              {/* RECOMMENDATION CARD 1: INFORMATIKA */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-border-default space-y-4 hover:shadow-card transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-default/70">
                  <div className="flex items-center gap-2">
                    <ClusterBadge cluster="informatika" />
                    <StatusBadge status="terverifikasi" label="Data contoh · Estimasi 2026" />
                  </div>
                  <div className="text-text-secondary text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">
                      task_alt
                    </span>
                    Log Belajar Siswa Terhubung
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                    Informatika — Universitas Contoh A
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-secondary">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[15px]">location_on</span>
                      Kota Contoh 1 (Jawa Barat)
                    </span>
                    <span>•</span>
                    <span>Sarjana Terapan / S1</span>
                    <span>•</span>
                    <span className="text-status-success-text font-bold">
                      Akreditasi Unggul (Contoh)
                    </span>
                  </div>
                </div>

                {/* 2 Alasan Berbasis Jawaban Nyata */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/60 space-y-2">
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Dua Alasan Berbasis Jawaban Nyata:
                  </div>
                  <ul className="space-y-1.5 text-xs text-text-primary">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                        quiz
                      </span>
                      <span>
                        <strong>Jawaban Minat #1:</strong> Nilai 5/5 pada ketertarikan menyusun langkah logis dan otomasi alur secara mandiri.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                        science
                      </span>
                      <span>
                        <strong>Refleksi Tugas Informatika:</strong> Menandai proses penyortiran pesanan &apos;menyenangkan&apos; dan merasa cocok dengan eksplorasi logika.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 3-Column Metrics (Signature UX-14 Pattern) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Minat Belajar
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Eksplorasi Aktif
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Suka logika alur dan pemecahan masalah sistem
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-text-secondary border-t border-border-default/60 mt-2">
                      Sumber: Refleksi Mandiri #1
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Kesiapan Akademik
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Fondasi Relevan
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Matematika (84) &amp; Informatika (88)
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-text-secondary border-t border-border-default/60 mt-2">
                      Rapor Semester 1–4 SMA
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Kelayakan Praktis
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Rp 18.500.000 / thn
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Kota Contoh 1 · Akses komuter
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-text-secondary border-t border-border-default/60 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">
                        verified
                      </span>
                      UKT Golongan 3 · Terverifikasi
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Link href="/jelajah/informatika-univ-a">
                      <Button size="sm" variant="primary">
                        Lihat Detail
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleCompare('informatika-univ-a')}
                      className={compareCartIds.includes('informatika-univ-a') ? 'border-primary text-primary bg-[#EEF2FF]' : ''}
                    >
                      {compareCartIds.includes('informatika-univ-a') ? '✓ Dibandingkan' : '+ Bandingkan'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleBookmark('informatika-univ-a')}
                      icon={bookmarkedMajorIds.includes('informatika-univ-a') ? 'bookmark_added' : 'bookmark_add'}
                      className={bookmarkedMajorIds.includes('informatika-univ-a') ? 'text-emerald-700 bg-status-success-bg border-emerald-300' : ''}
                    >
                      {bookmarkedMajorIds.includes('informatika-univ-a') ? 'Tersemat' : 'Sematkan'}
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      icon="visibility"
                      onClick={() =>
                        handleSelectEvidence(
                          'Informatika — Universitas Contoh A',
                          'Jawaban Minat #1: Nilai 5/5 pada penyusunan langkah terstruktur mandiri.',
                          'Jawaban Minat #4: Nilai 5/5 dalam rasa ingin tahu menyelesaikan logika tantangan.',
                          'Refleksi Tugas Informatika: Menyelesaikan simulasi sortir kantin dalam 12 menit.',
                          'Refleksi Tertulis: “Menyenangkan melihat alur berjalan tertib tanpa eror.”'
                        )
                      }
                    >
                      Lihat Bukti &amp; Alasan
                    </Button>
                  </div>
                </div>
              </div>

              {/* RECOMMENDATION CARD 2: TEKNIK INDUSTRI */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-border-default space-y-4 hover:shadow-card transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-default/70">
                  <div className="flex items-center gap-2">
                    <ClusterBadge cluster="industri" />
                    <StatusBadge status="perlu_diperiksa" label="Data contoh · Perlu diperiksa" />
                  </div>
                  <div className="text-text-secondary text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-amber-600">
                      hourglass_top
                    </span>
                    Simulasi 65% Terselesaikan
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                    Teknik Industri — Institut Contoh B
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-secondary">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[15px]">location_on</span>
                      Kota Contoh 2 (Jawa Timur)
                    </span>
                    <span>•</span>
                    <span>Sarjana (S1)</span>
                    <span>•</span>
                    <span className="text-status-warning-text font-bold">
                      Akreditasi A (Contoh)
                    </span>
                  </div>
                </div>

                {/* 2 Alasan Berbasis Jawaban Nyata */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/60 space-y-2">
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Dua Alasan Berbasis Jawaban Nyata:
                  </div>
                  <ul className="space-y-1.5 text-xs text-text-primary">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                        quiz
                      </span>
                      <span>
                        <strong>Jawaban Minat #3:</strong> Memilih ketertarikan tinggi pada pengaturan antrean dan efisiensi alur operasional.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                        science
                      </span>
                      <span>
                        <strong>Aktivitas Tugas Terbuka:</strong> Simulasi tata kelola antrean loket tersimpan sebagian (draft).
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 3-Column Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Minat Belajar
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Eksplorasi Menengah
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Tertarik tata kerja dan manajemen antrean
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-text-secondary border-t border-border-default/60 mt-2">
                      Progres Misi 65%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Kesiapan Akademik
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Perlu Penguatan
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Fisika (78) &amp; Statistika Dasar
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-amber-700 font-bold border-t border-border-default/60 mt-2">
                      Kesiapan: Menengah
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Kelayakan Praktis
                      </span>
                      <div className="mt-1 font-bold text-sm text-amber-800">
                        Rp 14–22 Juta / thn
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Kota Contoh 2 · Butuh estimasi kos
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-amber-700 font-bold border-t border-border-default/60 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        help_outline
                      </span>
                      Perlu diperiksa ke kampus
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Link href="/jelajah/teknik-industri-inst-b">
                      <Button size="sm" variant="primary">
                        Lihat Detail
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleCompare('teknik-industri-inst-b')}
                      className={compareCartIds.includes('teknik-industri-inst-b') ? 'border-primary text-primary bg-[#EEF2FF]' : ''}
                    >
                      {compareCartIds.includes('teknik-industri-inst-b') ? '✓ Dibandingkan' : '+ Bandingkan'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleBookmark('teknik-industri-inst-b')}
                      icon={bookmarkedMajorIds.includes('teknik-industri-inst-b') ? 'bookmark_added' : 'bookmark_add'}
                      className={bookmarkedMajorIds.includes('teknik-industri-inst-b') ? 'text-emerald-700 bg-status-success-bg border-emerald-300' : ''}
                    >
                      {bookmarkedMajorIds.includes('teknik-industri-inst-b') ? 'Tersemat' : 'Sematkan'}
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      icon="visibility"
                      onClick={() =>
                        handleSelectEvidence(
                          'Teknik Industri — Institut Contoh B',
                          'Jawaban Minat #3: Memilih opsi perbaikan tata alur kerja dan antrean.',
                          'Refleksi Modul: Memperhatikan pentingnya pengaturan waktu pelayanan.',
                          'Draft Simulasi: Tugas antrean loket tersimpan 65%.',
                          'Catatan Siswa: “Ingin mencoba kembali modul agar lebih paham simulasi riil.”'
                        )
                      }
                    >
                      Lihat Bukti &amp; Alasan
                    </Button>
                  </div>
                </div>
              </div>

              {/* RECOMMENDATION CARD 3: DKV */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-border-default space-y-4 hover:shadow-card transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-default/70">
                  <div className="flex items-center gap-2">
                    <ClusterBadge cluster="dkv" />
                    <StatusBadge status="sumber_lama" label="Data contoh · Belum simulasi" />
                  </div>
                  <div className="text-text-secondary text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      assignment_late
                    </span>
                    Survei Awal
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                    Desain Komunikasi Visual — Politeknik Contoh C
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-secondary">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[15px]">location_on</span>
                      Kota Contoh 1 (Jawa Barat)
                    </span>
                    <span>•</span>
                    <span>Diploma 4 (D4) Sarjana Terapan</span>
                    <span>•</span>
                    <span className="text-text-primary font-bold">
                      Akreditasi Baik Sekali (Contoh)
                    </span>
                  </div>
                </div>

                {/* 2 Alasan */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/60 space-y-2">
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Dua Alasan Berbasis Jawaban Nyata:
                  </div>
                  <ul className="space-y-1.5 text-xs text-text-primary">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                        quiz
                      </span>
                      <span>
                        <strong>Jawaban Minat #2:</strong> Memilih ketertarikan tinggi pada komunikasi visual, tata letak grafis, dan tipografi.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                        history_edu
                      </span>
                      <span>
                        <strong>Catatan Eksplorasi:</strong> Telah mengerjakan latihan ringkas; belum mencoba simulasi mini-kuliah poster menu.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 3-Column Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Minat Belajar
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Eksplorasi Awal
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Tertarik tata letak &amp; tipografi
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-text-secondary border-t border-border-default/60 mt-2">
                      Belum Uji Simulasi
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Kesiapan Akademik
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-primary">
                        Portofolio Mandiri
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Seni Budaya (88) &amp; B. Inggris (86)
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-text-secondary border-t border-border-default/60 mt-2">
                      Portofolio karya sekolah
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Kelayakan Praktis
                      </span>
                      <div className="mt-1 font-bold text-sm text-text-secondary">
                        Belum Tersedia
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                        Biaya perlengkapan studio belum diinput
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-amber-700 font-bold border-t border-border-default/60 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">info</span>
                      Perlu diperiksa ke kampus
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Link href="/jelajah/dkv-poltek-c">
                      <Button size="sm" variant="primary">
                        Lihat Detail
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleCompare('dkv-poltek-c')}
                      className={compareCartIds.includes('dkv-poltek-c') ? 'border-primary text-primary bg-[#EEF2FF]' : ''}
                    >
                      {compareCartIds.includes('dkv-poltek-c') ? '✓ Dibandingkan' : '+ Bandingkan'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleBookmark('dkv-poltek-c')}
                      icon={bookmarkedMajorIds.includes('dkv-poltek-c') ? 'bookmark_added' : 'bookmark_add'}
                      className={bookmarkedMajorIds.includes('dkv-poltek-c') ? 'text-emerald-700 bg-status-success-bg border-emerald-300' : ''}
                    >
                      {bookmarkedMajorIds.includes('dkv-poltek-c') ? 'Tersemat' : 'Sematkan'}
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      icon="visibility"
                      onClick={() =>
                        handleSelectEvidence(
                          'Desain Komunikasi Visual — Politeknik Contoh C',
                          'Jawaban Minat #2: Minat pada estetika tata letak dan tipografi visual.',
                          'Aktivitas Mandiri: Merancang mockup ringkas tanpa modul lab terstandar.',
                          'Status Simulasi: Belum memulai modul simulasi interaktif.',
                          'Catatan Siswa: “Ingin mencoba tugas praktikum DKV sebelum memutuskan pilihan.”'
                        )
                      }
                    >
                      Lihat Bukti &amp; Alasan
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL: Evidence Panel & Version Widget (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              {/* UX-15 PANEL BUKTI REKOMENDASI WIDGET */}
              <div
                id="panel-bukti-widget"
                className={`bg-white rounded-2xl p-5 shadow-xs border transition-all ${
                  highlightPulse ? 'border-primary ring-2 ring-primary/30' : 'border-border-default'
                }`}
              >
                <div className="flex items-center gap-2 pb-3 border-b border-border-default/60">
                  <span className="material-symbols-outlined text-[18px] text-[#5B5BD6]">
                    visibility
                  </span>
                  <span className="font-bold text-sm text-text-primary">
                    Panel Bukti &amp; Jejak Rekomendasi
                  </span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-surface-subtle border border-border-default/60 space-y-1">
                  <p className="font-bold text-xs text-text-primary">
                    {activeEvidence.programName}
                  </p>
                  <p className="text-[11px] text-text-secondary leading-snug">
                    Audit jejak transparansi berdasarkan jawaban dan refleksi yang kamu masukkan.
                  </p>
                </div>

                {/* Audit Trail List */}
                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-text-primary block">
                        Pertanyaan Minat Utama
                      </span>
                      <p className="text-text-secondary text-[11px] mt-0.5 leading-relaxed">
                        {activeEvidence.reason1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-text-primary block">
                        Konfirmasi Pilihan
                      </span>
                      <p className="text-text-secondary text-[11px] mt-0.5 leading-relaxed">
                        {activeEvidence.reason2}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-text-primary block">
                        Log Simulasi Misi
                      </span>
                      <p className="text-text-secondary text-[11px] mt-0.5 leading-relaxed">
                        {activeEvidence.missionLog}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-text-primary block">
                        Refleksi Kualitatif Siswa
                      </span>
                      <blockquote className="mt-1 p-2.5 rounded bg-surface-subtle text-text-secondary italic text-[11px] border-l-2 border-primary leading-relaxed">
                        {activeEvidence.studentReflection}
                      </blockquote>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-[#EEF2FF] flex items-center gap-2 text-[11px] text-[#4241bc]">
                  <span className="material-symbols-outlined text-[16px] shrink-0">
                    info
                  </span>
                  <span>Urutan rekomendasi dapat kamu sesuaikan kapan saja.</span>
                </div>
              </div>

              {/* UX-44 RIWAYAT VERSI TIMELINE WIDGET */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-border-default space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border-default/60">
                  <span className="material-symbols-outlined text-primary text-[19px]">
                    history_toggle_off
                  </span>
                  <span className="font-bold text-sm text-text-primary">
                    Riwayat Versi Rekomendasi
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
                  {/* Versi 2 */}
                  <div className="relative pl-3">
                    <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-primary">
                        Versi 2 (Aktif)
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-status-success-bg text-status-success-text text-[9px] font-bold">
                        TERKINI
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                      15 Okt 2026, 15.00 • Ditata ulang setelah Refleksi Misi Informatika selesai (+1 prodi naik relevansinya).
                    </p>
                  </div>

                  {/* Versi 1 */}
                  <div className="relative pl-3 pt-2">
                    <div className="absolute -left-[18px] top-3 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-text-secondary">
                        Versi 1 (Arsip)
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-subtle text-text-secondary text-[9px] font-bold">
                        AWAL
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                      15 Okt 2026, 14.35 • Hasil kuesioner eksplorasi minat awal.
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  icon="compare_arrows"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  Bandingkan Versi 1 &amp; 2
                </Button>
              </div>

              {/* UX-43 PILIHAN TERSEMAT MINI TRAY */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-border-default space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-default/60">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-[19px]">
                      push_pin
                    </span>
                    <span className="font-bold text-sm text-text-primary">
                      Pilihan Tersemat
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary font-bold text-[10px]">
                    {bookmarkedMajorIds.length} / 5
                  </span>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Prodi tersimpan disiapkan untuk perbandingan langsung dan diskusi bersama Guru BK atau orang tua.
                </p>

                <div className="space-y-2">
                  {pinnedMajors.map((major) => (
                    <div
                      key={major.id}
                      className="p-2.5 rounded-xl bg-surface-subtle border border-border-default/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-text-primary truncate block">
                          {major.namaProdi} • {major.namaKampus}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {major.clusterLabel}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">
                        check_circle
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab('tersemat')}
                  >
                    Kelola
                  </Button>
                  <Link href="/bandingkan" className="w-full">
                    <Button size="sm" variant="primary" className="w-full">
                      Bandingkan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UX-43 PILIHAN TERSEMAT DEDICATED LAYOUT */}
        {activeTab === 'tersemat' && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-border-default space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
              <div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  Daftar Program Studi Tersemat
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Fokuskan eksplorasi pada program studi yang telah kamu tandai relevan untuk dibahas dengan wali murid atau guru bimbingan konseling.
                </p>
              </div>
              <Link href="/bandingkan">
                <Button size="md" variant="primary" icon="balance">
                  Bandingkan Berdampingan ({compareCartIds.length}/3)
                </Button>
              </Link>
            </div>

            {pinnedMajors.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-[40px] text-text-secondary">
                  bookmark_border
                </span>
                <p className="text-sm font-bold text-text-primary mt-2">
                  Belum ada program studi yang disematkan
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Klik tombol Sematkan pada rekomendasi atau katalog untuk menyimpannya di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedMajors.map((major) => (
                  <div
                    key={major.id}
                    className="p-5 rounded-2xl bg-surface-subtle border border-border-default flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <ClusterBadge cluster={major.cluster} />
                        <button
                          onClick={() => toggleBookmark(major.id)}
                          className="text-text-secondary hover:text-red-600 transition-colors p-1"
                          title="Lepas Sematan"
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            bookmark_remove
                          </span>
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-text-primary">
                        {major.namaProdi} • {major.namaKampus}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Tersemat dalam preferensi eksplorasi mandirimu.
                      </p>

                      <div className="p-3 rounded-xl bg-white border border-border-default/60 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Estimasi Biaya:</span>
                          <span className="font-bold text-text-primary">
                            {major.biayaPerTahun
                              ? `Rp ${major.biayaPerTahun.toLocaleString('id-ID')} / thn`
                              : 'Perlu diperiksa'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Lokasi:</span>
                          <span className="text-text-primary">{major.kota}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link href={`/jelajah/${major.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          Detail Lengkap
                        </Button>
                      </Link>
                      <Link href={`/simulasi/misi-${major.cluster}`} className="w-full">
                        <Button variant="primary" size="sm" className="w-full">
                          Coba Simulasi
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* UX-44 SLIDE-OVER DRAWER: RIWAYAT VERSI DETAIL */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
            <div className="bg-white w-full max-w-lg h-full p-6 sm:p-7 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="space-y-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border-default">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Riwayat Versi
                    </span>
                    <h3 className="text-lg font-bold text-text-primary tracking-tight mt-0.5">
                      Perbandingan Versi Rekomendasi
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Setiap kali kamu menyelesaikan simulasi atau merevisi kuesioner minat mandiri, sistem mencatat versi baru sehingga kamu bisa melacak evolusi preferensimu secara transparan.
                </p>

                {/* Versi 2 Detail */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-primary">
                      Versi 2 (Aktif Saat Ini)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text text-[10px] font-bold">
                      15 Okt, 15.00
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Pemicu: Menyelesaikan simulasi mini-kuliah “Sortir Pesanan Kantin” (12 menit) dengan refleksi afektif sangat tinggi.
                  </p>
                  <div className="space-y-1 pt-1 text-xs">
                    <div className="text-text-primary flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">
                        north
                      </span>
                      <span>Informatika naik ke posisi #1 (sebelumnya #2)</span>
                    </div>
                    <div className="text-text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        horizontal_rule
                      </span>
                      <span>Teknik Industri bergeser ke posisi #2</span>
                    </div>
                  </div>
                </div>

                {/* Versi 1 Detail */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-border-default space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-text-secondary">
                      Versi 1 (Baseline Awal)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-text-secondary text-[10px] font-bold">
                      15 Okt, 14.35
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Pemicu: Kuesioner eksplorasi minat awal (pertanyaan survei umum).
                  </p>
                  <div className="text-xs text-text-secondary space-y-0.5 pt-1">
                    <div>• Posisi #1: Teknik Industri • Institut Contoh B</div>
                    <div>• Posisi #2: Informatika • Universitas Contoh A</div>
                    <div>• Posisi #3: DKV • Politeknik Contoh C</div>
                  </div>
                </div>

                {/* Transparency Principles */}
                <div className="p-3.5 rounded-xl bg-status-info-bg/50 border border-indigo-200 text-xs text-[#3730A3] space-y-1">
                  <span className="font-bold block">Prinsip Tanpa Vonis Permanen:</span>
                  <p className="leading-relaxed">
                    Jika kamu mencoba simulasi prodi lain (misal DKV atau Teknik Biomedis), urutan prodi akan disesuaikan kembali secara transparan tanpa mengunci masa depanmu.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border-default">
                <Button
                  size="md"
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Tutup &amp; Lanjutkan Eksplorasi
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
