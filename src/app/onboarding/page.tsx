'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { SEED_INTEREST_QUESTIONS } from '@/lib/data/seed';
import { submitInterests, updateProfile } from '@/lib/api/endpoints';

export default function OnboardingPage() {
  const router = useRouter();
  const {
    userContext,
    setUserContext,
    setPreferences,
    setAcademic,
    setAnswer,
    setIsDemoMode,
  } = useApp();

  // Step 1: Konteks (UX-07), Step 2: Preferensi (UX-08), Step 3: Akademik (UX-09), Step 4: Minat (UX-10), Step 5: Ringkasan (UX-11)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // UX-07 state: Clean empty defaults or prefill from userContext
  const [namaPanggilan, setNamaPanggilan] = useState(userContext.namaPanggilan || '');
  const [kelas, setKelas] = useState<'XI' | 'XII'>((userContext.kelas as 'XI' | 'XII') || 'XII');
  const [tahunKelulusan, setTahunKelulusan] = useState(userContext.tahunKelulusan || 2026);

  React.useEffect(() => {
    if (userContext.namaPanggilan && !namaPanggilan) {
      setNamaPanggilan(userContext.namaPanggilan);
    }
    if (userContext.kelas) {
      setKelas(userContext.kelas as 'XI' | 'XII');
    }
    if (userContext.tahunKelulusan) {
      setTahunKelulusan(userContext.tahunKelulusan);
    }
  }, [userContext]);

  // UX-08 state: Clean empty defaults
  const [domisili, setDomisili] = useState('');
  const [bersediaRelokasi, setBersediaRelokasi] = useState(true);
  const [rentangAnggaranMax, setRentangAnggaranMax] = useState<string>('20000000');
  const [rencanaTempatTinggal, setRencanaTempatTinggal] = useState<
    'bersama_orang_tua' | 'kost' | 'asrama' | 'belum_tahu'
  >('belum_tahu');

  // UX-09 state: Clean empty defaults
  const [mathGrade, setMathGrade] = useState('');
  const [indoGrade, setIndoGrade] = useState('');
  const [engGrade, setEngGrade] = useState('');

  // UX-10 state: Real student interest answers
  const [localAnswers, setLocalAnswers] = useState<Record<number, number | 'belum_tahu' | 'lewati'>>({});

  const handleSetQuestionAnswer = (qId: number, val: number | 'belum_tahu' | 'lewati') => {
    setLocalAnswers((prev) => ({ ...prev, [qId]: val }));
    setAnswer(qId, val);
  };

  // Next handlers
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPanggilan.trim()) return;
    setUserContext({
      namaPanggilan: namaPanggilan.trim(),
      kelas,
      tahunKelulusan,
    });
    setStep(2);
  };

  const handleStep2Next = () => {
    setPreferences({
      domisili: domisili.trim() || 'Indonesia',
      bersediaRelokasi,
      rentangAnggaranMax: rentangAnggaranMax ? parseInt(rentangAnggaranMax, 10) : null,
      rencanaTempatTinggal,
    });
    setStep(3);
  };

  const handleStep2Skip = () => {
    setPreferences({
      domisili: '',
      bersediaRelokasi: true,
      rentangAnggaranMax: null,
      rencanaTempatTinggal: 'belum_tahu',
    });
    setStep(3);
  };

  const handleStep3Next = () => {
    const grades = [];
    if (mathGrade) grades.push({ mataPelajaran: 'Matematika', nilai: parseInt(mathGrade, 10) || 80 });
    if (indoGrade) grades.push({ mataPelajaran: 'Bahasa Indonesia', nilai: parseInt(indoGrade, 10) || 85 });
    if (engGrade) grades.push({ mataPelajaran: 'Bahasa Inggris', nilai: parseInt(engGrade, 10) || 80 });

    setAcademic({
      skala: '100',
      semester: 'Semester 1–4',
      grades,
      isSkipped: grades.length === 0,
    });
    setStep(4);
  };

  const handleStep3Skip = () => {
    setAcademic({
      skala: '100',
      semester: 'Semester 1–4',
      grades: [],
      isSkipped: true,
    });
    setStep(4);
  };

  const handleFinishOnboarding = () => {
    setIsDemoMode(true);
    // Fire asynchronous background sync to backend API (graceful fallback if unauthenticated)
    submitInterests({
      instrumentVersion: '1.3',
      answers: localAnswers,
    }).catch(() => {});

    updateProfile({
      displayName: namaPanggilan || 'Siswa',
      gradeLevel: kelas,
      graduationYear: tahunKelulusan,
      relocationMode: bersediaRelokasi ? 'OPEN' : 'STAY',
      monthlyBudgetMax: rentangAnggaranMax ? parseInt(rentangAnggaranMax, 10) : null,
      expectedVersion: 1,
    }).catch(() => {});

    router.push('/rekomendasi');
  };

  // Dynamic cluster evaluation for Step 5
  const getClusterResult = (cluster: 'informatika' | 'dkv' | 'industri') => {
    const questions = SEED_INTEREST_QUESTIONS.filter((q) => q.cluster === cluster);
    let totalScore = 0;
    let count = 0;

    for (const q of questions) {
      const val = localAnswers[q.id];
      if (typeof val === 'number') {
        totalScore += val;
        count++;
      }
    }

    const avg = count > 0 ? totalScore / count : 0;
    let level = 'Eksplorasi Terbuka';
    let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';

    if (avg >= 4.0) {
      level = 'Kecenderungan Tinggi';
      badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    } else if (avg >= 2.5) {
      level = 'Kecenderungan Moderat';
      badgeClass = 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }

    return { avg, level, badgeClass };
  };

  const answeredCount = Object.keys(localAnswers).length;

  return (
    <div className="bg-canvas min-h-screen flex flex-col justify-between">
      {/* Top Header with Responsive Step Stepper */}
      <header className="w-full bg-white border-b border-border-default/70 sticky top-0 z-50 shadow-2xs">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <NexaloraLogo size={32} showText={true} />
          </Link>

          {/* Desktop/Tablet 5-Stage Step Indicators */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {[
              { num: 1, label: 'Konteks' },
              { num: 2, label: 'Preferensi' },
              { num: 3, label: 'Akademik' },
              { num: 4, label: 'Minat' },
              { num: 5, label: 'Ringkasan' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all ${
                    step === s.num
                      ? 'bg-[#5B5BD6] text-white shadow-xs'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-surface-subtle text-text-secondary border border-border-default'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span
                  className={`font-semibold ${
                    step === s.num
                      ? 'text-[#5B5BD6]'
                      : step > s.num
                      ? 'text-text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {s.label}
                </span>
                {s.num < 5 && <span className="text-border-default mx-1">›</span>}
              </div>
            ))}
          </div>

          {/* Mobile Step Badge */}
          <div className="flex sm:hidden items-center gap-2">
            <span className="text-xs font-bold text-[#5B5BD6] bg-[#EEF2FF] px-2.5 py-1 rounded-full">
              Langkah {step} dari 5
            </span>
          </div>
        </div>
      </header>

      {/* Main Wizard Form */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* STEP 1: UX-07 Konteks Siswa */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                Langkah 01 • Konteks Awal Siswa
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                Halo! Siapa nama panggilanmu?
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Konteks ini membantu menyesuaikan linimasa persiapan kuliah dan sapaan personalmu.
              </p>
            </div>

            <form onSubmit={handleStep1Next} className="space-y-5">
              <Input
                label="Nama Panggilan"
                placeholder="Misal: Dimas, Rani, Bayu..."
                required
                value={namaPanggilan}
                onChange={(e) => setNamaPanggilan(e.target.value)}
              />

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                  Kelas Saat Ini di Sekolah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setKelas('XI');
                      setTahunKelulusan(2027);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                      kelas === 'XI'
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] ring-2 ring-[#5B5BD6]/20'
                        : 'border-border-default bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-bold">Kelas XI (11) SMA/SMK</span>
                      <span className="text-xs opacity-80 mt-0.5 block">
                        Target Lulus Tahun 2027
                      </span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        kelas === 'XI'
                          ? 'border-[#5B5BD6] bg-[#5B5BD6] text-white'
                          : 'border-border-default bg-white'
                      }`}
                    >
                      {kelas === 'XI' && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKelas('XII');
                      setTahunKelulusan(2026);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                      kelas === 'XII'
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] ring-2 ring-[#5B5BD6]/20'
                        : 'border-border-default bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-bold">Kelas XII (12) SMA/SMK</span>
                      <span className="text-xs opacity-80 mt-0.5 block">
                        Target Lulus Tahun 2026
                      </span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        kelas === 'XII'
                          ? 'border-[#5B5BD6] bg-[#5B5BD6] text-white'
                          : 'border-border-default bg-white'
                      }`}
                    >
                      {kelas === 'XII' && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!namaPanggilan.trim()}
                  iconRight="arrow_forward"
                >
                  Lanjut ke Preferensi
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: UX-08 Preferensi Praktis */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                  Langkah 02 • Preferensi Praktis
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                  Preferensi Biaya &amp; Wilayah Kuliah
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Bagian ini opsional dan bisa disesuaikan lagi kapan saja di pengaturan akun.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStep2Skip}
                className="text-xs font-semibold text-text-secondary hover:text-primary underline shrink-0 mt-1"
              >
                Lewati Langkah Ini
              </button>
            </div>

            <div className="space-y-5">
              <Input
                label="Kota / Daerah Domisili Saat Ini"
                placeholder="Misal: Bandung, Surabaya, Medan, Jakarta..."
                value={domisili}
                onChange={(e) => setDomisili(e.target.value)}
              />

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                  Apakah Bersedia Kuliah Merantau ke Luar Kota?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBersediaRelokasi(true)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      bersediaRelokasi
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold'
                        : 'border-border-default bg-surface-subtle text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>✓ Ya, Terbuka Merantau</span>
                    <span className="text-[11px] opacity-75 font-normal">Lintas Provinsi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBersediaRelokasi(false)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      !bersediaRelokasi
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold'
                        : 'border-border-default bg-surface-subtle text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>Prioritaskan Kampus Dekat Rumah</span>
                    <span className="text-[11px] opacity-75 font-normal">Satu Kota</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                  Perkiraan Rentang Anggaran UKT Kuliah per Tahun
                </label>
                <select
                  value={rentangAnggaranMax}
                  onChange={(e) => setRentangAnggaranMax(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-surface-subtle text-xs sm:text-sm text-text-primary border border-border-default focus:border-primary focus:outline-none"
                >
                  <option value="10000000">Hingga Rp 10.000.000 / tahun (KIP Kuliah / UKT 1–2)</option>
                  <option value="20000000">Hingga Rp 20.000.000 / tahun (UKT Reguler Menengah)</option>
                  <option value="35000000">Hingga Rp 35.000.000 / tahun (UKT Mandiri / Swasta)</option>
                  <option value="999999999">Fleksibel / Belum Ditentukan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                  Rencana Tempat Tinggal Saat Kuliah
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'bersama_orang_tua', label: 'Rumah Keluarga', icon: 'home' },
                    { id: 'kost', label: 'Kost Mandiri', icon: 'apartment' },
                    { id: 'asrama', label: 'Asrama Kampus', icon: 'domain' },
                    { id: 'belum_tahu', label: 'Belum Tahu', icon: 'help_outline' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRencanaTempatTinggal(opt.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        rencanaTempatTinggal === opt.id
                          ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold shadow-2xs'
                          : 'border-border-default bg-surface-subtle text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border-default">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button size="lg" onClick={handleStep2Next} iconRight="arrow_forward">
                  Lanjut ke Riwayat Akademik
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: UX-09 Riwayat Akademik */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                  Langkah 03 • Riwayat Nilai Akademik
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                  Gambaran Nilai Rapor (Opsional)
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Nilai ini dipakai untuk mengecek prasyarat jurusan dasar, bukan untuk menyeleksi atau mendiskualifikasi dirimu.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStep3Skip}
                className="text-xs font-semibold text-text-secondary hover:text-primary underline shrink-0 mt-1"
              >
                Lewati Langkah Ini
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Nilai Matematika"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Misal: 85"
                  value={mathGrade}
                  onChange={(e) => setMathGrade(e.target.value)}
                />
                <Input
                  label="Bahasa Indonesia"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Misal: 88"
                  value={indoGrade}
                  onChange={(e) => setIndoGrade(e.target.value)}
                />
                <Input
                  label="Bahasa Inggris"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Misal: 82"
                  value={engGrade}
                  onChange={(e) => setEngGrade(e.target.value)}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-status-info-bg/40 border border-indigo-100 text-xs text-[#3730A3] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                  lock
                </span>
                <p className="leading-relaxed">
                  <strong>Privasi Siswa:</strong> Rincian nilai ini hanya tersimpan di perangkatmu dan dapat disembunyikan kapan saja saat kamu mengekspor atau mencetak Paspor Belajar.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border-default">
                <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                  Kembali
                </Button>
                <Button size="lg" onClick={handleStep3Next} iconRight="arrow_forward">
                  Lanjut ke Kuesioner Minat
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: UX-10 Pertanyaan Minat */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-default/60 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                  Langkah 04 • Asesmen Eksplorasi Minat
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                  Eksplorasi Minat &amp; Gaya Berpikir
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Tidak ada jawaban benar/salah. Skala 1 (Kurang Tertarik) hingga 5 (Sangat Tertarik).
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-xs font-bold shrink-0 self-start sm:self-center">
                {answeredCount} dari {SEED_INTEREST_QUESTIONS.length} Terjawab
              </div>
            </div>

            <div className="space-y-5">
              {SEED_INTEREST_QUESTIONS.map((q) => {
                const currentVal = localAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-2xl bg-surface-subtle border border-border-default space-y-3.5"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                        {q.kategori}
                      </span>
                      <h3 className="text-sm font-bold text-text-primary leading-snug">
                        {q.pertanyaan}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {q.subteks}
                      </p>
                    </div>

                    {/* Scale Selector (1-5, Belum Tahu, Lewati) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleSetQuestionAnswer(q.id, num)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                            currentVal === num
                              ? 'bg-[#5B5BD6] text-white shadow-sm ring-2 ring-[#5B5BD6]/20'
                              : 'bg-white border border-border-default text-text-secondary hover:text-text-primary hover:bg-slate-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleSetQuestionAnswer(q.id, 'belum_tahu')}
                        className={`px-3.5 h-10 rounded-xl text-xs font-semibold transition-all ${
                          currentVal === 'belum_tahu'
                            ? 'bg-[#5B5BD6] text-white shadow-sm'
                            : 'bg-white border border-border-default text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Belum tahu
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetQuestionAnswer(q.id, 'lewati')}
                        className={`px-3 h-10 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary ml-auto`}
                      >
                        Lewati
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex items-center justify-between border-t border-border-default">
                <Button variant="ghost" size="md" onClick={() => setStep(3)}>
                  Kembali
                </Button>
                <Button size="lg" onClick={() => setStep(5)} iconRight="arrow_forward">
                  Lihat Ringkasan Minat
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: UX-11 Ringkasan Minat */}
        {step === 5 && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                Langkah 05 • Ringkasan Minat Awal Siswa
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                Kecenderungan Minat Awalmu
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Data ini menjadi dasar awal rekomendasi personalmu. Rekomendasi akan semakin akurat saat kamu mencoba simulasi mini-kuliah di langkah selanjutnya.
              </p>
            </div>

            {/* Dynamic Results Grid */}
            <div className="space-y-3.5">
              {[
                {
                  cluster: 'informatika' as const,
                  title: 'Logika & Sistem Komputasi',
                  desc: 'Menata alur instruksi terstruktur, pemecahan masalah algoritma, dan otomasi alur tugas.',
                  pill: 'Teknik Informatika, Sistem Informasi, Sains Data',
                  res: getClusterResult('informatika'),
                },
                {
                  cluster: 'dkv' as const,
                  title: 'Komunikasi Visual & Kreasi',
                  desc: 'Menyampaikan pesan melalui kejelasan tata letak, tipografi fungsional, dan estetika media.',
                  pill: 'Desain Komunikasi Visual (DKV), Desain Produk',
                  res: getClusterResult('dkv'),
                },
                {
                  cluster: 'industri' as const,
                  title: 'Optimasi Proses & Efisiensi Sistem',
                  desc: 'Mengurangi pemborosan, mengurai antrean layanan, dan merencanakan alokasi sumber daya.',
                  pill: 'Teknik Industri, Manajemen Operasional',
                  res: getClusterResult('industri'),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl border border-border-default bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-text-primary block">
                      {item.title}
                    </span>
                    <p className="text-xs text-text-secondary leading-snug">{item.desc}</p>
                    <span className="text-[11px] font-semibold text-text-secondary inline-block pt-1">
                      Rumpun terkait: <span className="text-text-primary">{item.pill}</span>
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 self-start sm:self-center ${item.res.badgeClass}`}
                  >
                    {item.res.level}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-border-default text-xs text-text-secondary flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#5B5BD6] shrink-0 mt-0.5">
                auto_awesome
              </span>
              <p className="leading-relaxed">
                Rekomendasi di halaman berikutnya bukan vonis final, melainkan titik tolak eksplorasi mandiri yang dapat kamu sesuaikan kapan pun melalui simulasi dan pengaturan preferensi.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-default">
              <Button variant="ghost" size="md" onClick={() => setStep(4)}>
                Ubah Jawaban
              </Button>
              <Button
                size="lg"
                variant="primary"
                onClick={handleFinishOnboarding}
                iconRight="arrow_forward"
              >
                Buka Rekomendasi Personal
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-4 border-t border-border-default text-center text-xs text-text-secondary">
        <p>© 2026 NEXALORA. Platform eksplorasi studi &amp; karier mandiri siswa SMA.</p>
      </footer>
    </div>
  );
}
