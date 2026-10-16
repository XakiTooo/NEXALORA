'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MISSIONS } from '@/lib/data/seed';
import { DATABASE_MISSIONS, fetchMissionDetail, FullMissionDetail } from '@/lib/data/missionsDatabase';
import { submitReflection } from '@/lib/api/endpoints';
import { submitAssignment, validateSubmissionFile } from '@/lib/demo/submissions';

export default function DetailSimulasiMisiPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.id as string;

  const {
    saveMissionSubmission,
    saveMissionReflection,
    missionSubmissions,
    missionReflections,
    updateTaskStatus,
  } = useApp();

  // Benchmark seed fallback
  const mission = SEED_MISSIONS.find((m) => m.id === missionId) || SEED_MISSIONS[0];

  // Load detailed relational database records for Dicoding curriculum parity
  const [dbDetail, setDbDetail] = useState<FullMissionDetail>(
    DATABASE_MISSIONS[missionId] || DATABASE_MISSIONS['misi-if-kantin']
  );

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const live = await fetchMissionDetail(mission.id);
        if (isMounted && live) {
          setDbDetail(live);
        }
      } catch {}
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [mission.id]);

  // Steps: 'brief' (UX-17) | 'materi' (UX-18) | 'tugas' (UX-19/20/21) | 'umpan_balik' (UX-22) | 'refleksi' (UX-24) | 'pratinjau' (UX-25)
  const [phase, setPhase] = useState<'brief' | 'materi' | 'tugas' | 'umpan_balik' | 'refleksi' | 'pratinjau'>('brief');

  // Materi Section & Quiz
  const [activeMateriIndex, setActiveMateriIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Dicoding File Upload Submission State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeFormatted: string;
    type: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const operationRef = useRef(0);
  useEffect(() => {
    const reset = () => { operationRef.current++; setSelectedFile(null); setUploadedFile(null); };
    window.addEventListener('nexalora:logout', reset);
    return () => { operationRef.current++; window.removeEventListener('nexalora:logout', reset); };
  }, [missionId]);
  const [studentNotes, setStudentNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Task Form State per cluster
  const [taskTextAnswer, setTaskTextAnswer] = useState('');
  const [designDecisions, setDesignDecisions] = useState('');
  const [industryStaffChoice, setIndustryStaffChoice] = useState('3');
  const [industryRiskNote, setIndustryRiskNote] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Reflection State (UX-24)
  const [enjoyment, setEnjoyment] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [interestContinue, setInterestContinue] = useState<'Ya' | 'Mungkin' | 'Ragu' | 'Tidak'>('Ya');
  const [mostInteresting, setMostInteresting] = useState<'Materi' | 'Tugas Kasus'>('Tugas Kasus');
  const [reflectionNote, setReflectionNote] = useState('');

  // Hydrate previously saved student inputs on mount
  useEffect(() => {
    const existingSubmission = missionSubmissions[mission.id];
    if (existingSubmission) {
      if (mission.cluster === 'informatika' && existingSubmission.jawabanTeks) {
        setTaskTextAnswer(existingSubmission.jawabanTeks);
      } else if (mission.cluster === 'dkv' && existingSubmission.jawabanTeks) {
        setDesignDecisions(existingSubmission.jawabanTeks);
      }
      if (existingSubmission.pilihanOpsi) {
        setIndustryStaffChoice(existingSubmission.pilihanOpsi);
      }
      if (existingSubmission.resikoAtauKompromi) {
        setIndustryRiskNote(existingSubmission.resikoAtauKompromi);
      }
      if (existingSubmission.fileName) {
        setUploadedFile({
          name: existingSubmission.fileName,
          sizeFormatted: existingSubmission.fileSizeFormatted || 'Ukuran tidak tersedia',
          type: 'application/zip',
        });
      }
      if (existingSubmission.catatanSiswa) {
        setStudentNotes(existingSubmission.catatanSiswa);
      }
    }

    const existingReflection = missionReflections[mission.id];
    if (existingReflection) {
      setEnjoyment(existingReflection.tingkatEnjoyment);
      setInterestContinue(existingReflection.minatMendalami);
      setMostInteresting(existingReflection.bagianPalingMenarik);
      if (existingReflection.ekspektasiVsKenyataan) {
        setReflectionNote(existingReflection.ekspektasiVsKenyataan);
      }
    }
  }, [mission.id, mission.cluster, missionSubmissions, missionReflections]);

  const hasSubmission = Boolean(missionSubmissions[mission.id]);
  const hasReflection = Boolean(missionReflections[mission.id]);

  const isStepAccessible = (targetStep: 'brief' | 'materi' | 'tugas' | 'umpan_balik' | 'refleksi') => {
    if (targetStep === 'brief') return true;
    if (targetStep === 'materi') return true;
    if (targetStep === 'tugas') return true;
    if (targetStep === 'umpan_balik') {
      return hasSubmission || phase === 'umpan_balik' || phase === 'refleksi' || phase === 'pratinjau';
    }
    if (targetStep === 'refleksi') {
      return hasReflection || hasSubmission || phase === 'refleksi' || phase === 'pratinjau';
    }
    return false;
  };

  // Handle Drag & Drop File Upload
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (submittingRef.current) return;
    setUploadError(null);
    try {
      validateSubmissionFile(file, dbDetail.submissionSpecs.allowedExtensions, dbDetail.submissionSpecs.maxFileSizeMb);
      setSelectedFile(file);
      setUploadedFile({ name: file.name, sizeFormatted: (file.size / 1024 / 1024).toFixed(2) + ' MB', type: file.type });
    } catch (error) {
      setSelectedFile(null); setUploadedFile(null);
      setUploadError(error instanceof Error ? error.message : 'Berkas tidak valid.');
    }
  };

  const handleUseDemoFile = () => {
    const defaultName =
      mission.cluster === 'informatika'
        ? 'solusi-algoritma-kantin.zip'
        : mission.cluster === 'dkv'
        ? 'desain-poster-kampus.pdf'
        : 'analisis-kapasitas-loket.xlsx';
    const dummyBlob = new Blob(['Simulasi Tugas Praktis NEXALORA Demo'], { type: 'application/zip' });
    const dummyFile = new File([dummyBlob], defaultName, { type: 'application/zip' });
    setSelectedFile(dummyFile);
    setUploadedFile({
      name: dummyFile.name,
      sizeFormatted: '1.42 MB',
      type: 'application/zip',
    });
    setUploadError(null);
  };

  const handleConfirmSubmit = async () => {
    if (submittingRef.current) return;
    let fileToSubmit = selectedFile;
    if (!fileToSubmit) {
      const defaultName =
        mission.cluster === 'informatika'
          ? 'solusi-algoritma-kantin.zip'
          : mission.cluster === 'dkv'
          ? 'desain-poster-kampus.pdf'
          : 'analisis-kapasitas-loket.xlsx';
      const dummyBlob = new Blob(['Simulasi Tugas Praktis NEXALORA Demo'], { type: 'application/zip' });
      fileToSubmit = new File([dummyBlob], defaultName, { type: 'application/zip' });
      setSelectedFile(fileToSubmit);
      setUploadedFile({
        name: fileToSubmit.name,
        sizeFormatted: '1.42 MB',
        type: 'application/zip',
      });
    }

    const operation = operationRef.current;
    submittingRef.current = true;
    setIsUploading(true);
    setShowConfirmModal(false);
    setUploadError(null);
    try {
      const notes = studentNotes || taskTextAnswer || designDecisions || industryRiskNote || 'Tugas simulasi diselesaikan.';
      const result = await submitAssignment(mission.id, fileToSubmit, notes);
      if (operation !== operationRef.current) return;
      saveMissionSubmission({
        missionId: mission.id,
        jawabanTeks:
          mission.cluster === 'informatika'
            ? taskTextAnswer || '1. Terima pesanan\n2. Prioritaskan pesanan cepat (SJF)\n3. Terapkan mekanisme penuaan prioritas (aging)'
            : designDecisions || '1. Hierarki visual terstruktur\n2. Kontras warna tinggi\n3. Ruang negatif proporsional',
        pilihanOpsi: mission.cluster === 'industri' ? industryStaffChoice : undefined,
        alasanKeputusan: studentNotes || 'Optimasi alur untuk keseimbangan efisiensi dan keadilan antrean.',
        resikoAtauKompromi: industryRiskNote || 'Kompromi biaya staf saat jam sibuk terbayar dengan kepuasan pelanggan.',
        waktuSubmit: result.submittedAt,
        versi: (missionSubmissions[mission.id]?.versi || 0) + 1,
        fileName: fileToSubmit.name,
        fileSizeFormatted: uploadedFile?.sizeFormatted || '1.42 MB',
        fileUrl: result.path,
        catatanSiswa: studentNotes || 'Solusi praktis siap dievaluasi.',
        statusKelulusan: 'lulus',
        bintangReview: 5,
        feedbackReviewer:
          'Luar biasa! Solusi memenuhi seluruh kriteria rubrik dengan analisis terstruktur dan pemahaman mendalam tentang trade-off sistem.',
      });
      setSelectedFile(null);
      setPhase('umpan_balik');
    } catch (error) {
      if (operation === operationRef.current) setUploadError(error instanceof Error ? error.message : 'Pengumpulan gagal. Silakan coba lagi.');
    } finally {
      submittingRef.current = false;
      if (operation === operationRef.current) setIsUploading(false);
    }
  };

  const handleSaveReflection = () => {
    saveMissionReflection({
      missionId: mission.id,
      tingkatEnjoyment: enjoyment,
      minatMendalami: interestContinue,
      bagianPalingMenarik: mostInteresting,
      aspekTersulit: 'Menyeimbangkan trade-off kecepatan dan keadilan.',
      hambatanDihadapi: 'Tidak ada kendala teknis.',
      ekspektasiVsKenyataan: reflectionNote || 'Lebih praktis dan tidak sesulit bayangan awal.',
      rencanaLangkahLanjutan: 'Mencari prodi terkait di katalog.',
    });

    submitReflection({
      attemptId: `att_${mission.id}_${Date.now()}`,
      responses: {
        enjoyment,
        interestContinue,
        mostInteresting,
        reflectionNote: reflectionNote || 'Lebih praktis dan tidak sesulit bayangan awal.',
      },
      activate: true,
    }).catch(() => {});

    updateTaskStatus('task-1', 'done');
    setPhase('pratinjau');
  };

  return (
    <AppShell>
      <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Stepper Navigation & Dicoding Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-default/80">
          <nav className="flex items-center gap-2 text-xs font-medium text-text-secondary">
            <Link href="/simulasi" className="hover:text-primary transition-colors">
              Simulasi Misi
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-text-primary font-bold">{mission.judul}</span>
          </nav>

          {/* Stepper Pills */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setPhase('brief')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phase === 'brief'
                  ? 'bg-[#5B5BD6] text-white shadow-2xs'
                  : 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-[#EEF2FF] cursor-pointer'
              }`}
            >
              1. Brief
            </button>
            <button
              type="button"
              onClick={() => setPhase('materi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phase === 'materi'
                  ? 'bg-[#5B5BD6] text-white shadow-2xs'
                  : 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-[#EEF2FF] cursor-pointer'
              }`}
            >
              2. Materi &amp; Cek Paham
            </button>
            <button
              type="button"
              onClick={() => setPhase('tugas')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phase === 'tugas'
                  ? 'bg-[#5B5BD6] text-white shadow-2xs'
                  : 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-[#EEF2FF] cursor-pointer'
              }`}
            >
              3. Tugas
            </button>
            <button
              type="button"
              disabled={!isStepAccessible('umpan_balik')}
              onClick={() => isStepAccessible('umpan_balik') && setPhase('umpan_balik')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phase === 'umpan_balik'
                  ? 'bg-[#5B5BD6] text-white shadow-2xs'
                  : isStepAccessible('umpan_balik')
                  ? 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-[#EEF2FF] cursor-pointer'
                  : 'bg-surface-subtle/50 text-text-secondary/40 cursor-not-allowed'
              }`}
            >
              4. Rubrik
            </button>
            <button
              type="button"
              disabled={!isStepAccessible('refleksi')}
              onClick={() => isStepAccessible('refleksi') && setPhase('refleksi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                phase === 'refleksi' || phase === 'pratinjau'
                  ? 'bg-[#5B5BD6] text-white shadow-2xs'
                  : isStepAccessible('refleksi')
                  ? 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-[#EEF2FF] cursor-pointer'
                  : 'bg-surface-subtle/50 text-text-secondary/40 cursor-not-allowed'
              }`}
            >
              5. Refleksi
            </button>
          </div>
        </div>

        {/* =========================================================================
            FASE 1: BRIEF MISI (UX-17) & SILABUS DICODING
        ========================================================================= */}
        {phase === 'brief' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClusterBadge cluster={mission.cluster} />
                <span className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  {mission.estimasiDurasiMenit} Menit
                </span>
                <span className="text-xs font-bold text-[#5B5BD6] bg-[#EEF2FF] px-2 py-0.5 rounded-md">
                  Dicoding Academy Model
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {mission.judul}
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                {mission.deskripsiSingkat}
              </p>
            </div>

            {/* Mandatory Brief Disclaimer PRD v1.3 */}
            <div className="p-4 rounded-xl bg-status-warning-bg/60 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
                info
              </span>
              <p className="leading-relaxed">
                <strong>Catatan Penting:</strong> Ini cuplikan aktivitas belajar pengantar, bukan gambaran lengkap seluruh kurikulum jurusan selama 4 tahun.
              </p>
            </div>

            {/* Tujuan Pembelajaran Singkat */}
            <div className="p-5 rounded-2xl bg-surface-subtle border border-border-default space-y-3">
              <h3 className="text-sm font-bold text-text-primary">
                Tujuan Pembelajaran Singkat:
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                {mission.tujuanBelajar.map((tujuan, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{tujuan}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Format Tugas yang Akan Dikumpulkan */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-text-primary block">
                Format Tugas yang Akan Dikumpulkan:
              </span>
              <p className="text-text-secondary">
                {mission.formatTugas} • Unggah Berkas Proyek (.ZIP, .PDF, .PNG) atau catatan teknis keputusan solusi.
              </p>
            </div>

            {/* Silabus 6 Modul Dicoding Classroom */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
                Silabus Modul Mini-Kuliah (Gaya Dicoding Classroom):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(dbDetail.dicodingModules || []).map((mod, mIdx) => (
                  <div
                    key={mod.id || mIdx}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800">
                      {mod.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold shrink-0">
                      {mod.durationMinutes} mnt
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-border-default">
              <Button size="lg" onClick={() => setPhase('materi')} iconRight="arrow_forward">
                Mulai Masuk Kelas Belajar
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            FASE 2: MATERI BELAJAR (UX-18a) & CEK PEMAHAMAN (UX-18b)
        ========================================================================= */}
        {phase === 'materi' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                  Langkah 2 • Bacaan Pengantar &amp; Studi Kasus
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                  {mission.judul}
                </h2>
              </div>
              <span className="text-xs text-text-secondary">
                Bagian {activeMateriIndex + 1} dari {mission.materiSections.length}
              </span>
            </div>

            {/* Section Content */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-primary">
                    {mission.materiSections[activeMateriIndex]?.judul}
                  </h3>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {mission.materiSections[activeMateriIndex]?.estimasiMenit} Menit Baca
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {mission.materiSections[activeMateriIndex]?.konten}
                </p>

                {/* Key Takeaways */}
                <div className="pt-2 border-t border-border-default/60">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1.5">
                    Poin Kunci:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.materiSections[activeMateriIndex]?.poinKunci.map((poin, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2.5 py-1 rounded-md bg-white border border-border-default text-[11px] text-text-primary font-medium"
                      >
                        {poin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation between reading slides */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={activeMateriIndex === 0}
                  onClick={() => setActiveMateriIndex(activeMateriIndex - 1)}
                  icon="arrow_back"
                >
                  Bagian Sebelumnya
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={activeMateriIndex === mission.materiSections.length - 1}
                  onClick={() => setActiveMateriIndex(activeMateriIndex + 1)}
                  iconRight="arrow_forward"
                >
                  Bagian Berikutnya
                </Button>
              </div>
            </div>

            {/* Cek Pemahaman Cepat (Bebas Tekanan & Tanpa Nilai) */}
            <div className="pt-4 border-t border-border-default space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text-primary">
                    Cek Pemahaman Cepat (Bebas Tekanan &amp; Tanpa Nilai)
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Latihan mandiri untuk merefleksikan bacaan di atas. Setiap opsi dilengkapi pembahasan rasional.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-status-info-bg text-status-info-text text-[11px] font-bold">
                  Tanpa Skor Ujian
                </span>
              </div>

              {/* Questions list */}
              {mission.cekPemahaman.map((cek, cIdx) => {
                const selected = quizAnswers[cek.id];
                const dbQ = dbDetail.quizQuestions?.[cIdx];

                return (
                  <div key={cek.id} className="space-y-2 bg-white p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs sm:text-sm font-semibold text-text-primary">
                      {cek.pertanyaan}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {cek.pilihan.map((pil, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, [cek.id]: idx });
                            setShowQuizResult(true);
                          }}
                          className={`w-full p-2.5 rounded-lg text-left text-xs transition-all border ${
                            selected === idx
                              ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold'
                              : 'border-border-default hover:bg-slate-50 text-text-secondary'
                          }`}
                        >
                          {pil}
                        </button>
                      ))}
                    </div>

                    {/* In-depth option explanation rationale */}
                    {showQuizResult && selected !== undefined && (
                      <div className="pt-2 text-xs text-indigo-900 bg-indigo-50 p-3 rounded-xl space-y-1.5 border border-indigo-200">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                            lightbulb
                          </span>
                          <p className="font-semibold">
                            {dbQ?.opsiRationales?.[selected] || cek.penjelasan}
                          </p>
                        </div>
                        <p className="text-[11px] text-indigo-800/90 pl-6 border-t border-indigo-200/60 pt-1">
                          {cek.penjelasan}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-default">
              <Button variant="ghost" size="md" onClick={() => setPhase('brief')}>
                Kembali ke Brief
              </Button>
              <Button size="lg" onClick={() => setPhase('tugas')} iconRight="arrow_forward">
                Lanjut ke Pengerjaan Tugas
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            FASE 3: PENGERJAAN TUGAS PRAKTIS (UX-19/20/21) & DICODING FILE UPLOAD
        ========================================================================= */}
        {phase === 'tugas' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                Langkah 3 • Pengerjaan Tugas Nyata
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                {mission.judul}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Kerjakan tugas kasus nyata di bawah ini, unggah berkas proyek, dan tambahkan penjelasan keputusanmu.
              </p>
            </div>

            {/* Rubrik Kriteria Pembelajaran (3 Poin) */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-default space-y-2">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                Kriteria Rubrik Pembelajaran (3 Poin):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {mission.rubrik.map((r) => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-white border border-border-default text-xs">
                    <span className="font-bold text-text-primary block">{r.kriteria}</span>
                    <span className="text-[11px] text-text-secondary mt-0.5 block leading-snug">
                      {r.deskripsi}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DICODING DRAG & DROP FILE UPLOAD AREA */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-indigo-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#5B5BD6] text-[18px]">
                      cloud_upload
                    </span>
                    Unggah Berkas Tugas Submission (Gaya Dicoding)
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Format: {dbDetail.submissionSpecs.allowedExtensions.join(', ')} • Maksimal {Math.min(dbDetail.submissionSpecs.maxFileSizeMb, 25)} MB
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#5B5BD6] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
                  Dicoding Submission Parity
                </span>
              </div>

              {!uploadedFile ? (
                <div className="space-y-3">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 sm:p-7 rounded-xl border border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragOver
                        ? 'border-[#5B5BD6] bg-[#EEF2FF]/70'
                        : 'border-slate-300 hover:border-[#5B5BD6] bg-white'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept={dbDetail.submissionSpecs.allowedExtensions.join(',')}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">upload_file</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Klik untuk memilih berkas dari perangkatmu atau tarik ke sini
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Demo: berkas tetap di perangkat; hanya nama dan ukuran yang dicatat.
                    </p>
                    {isUploading && (
                      <span className="text-xs text-[#5B5BD6] font-bold animate-pulse">
                        Sedang memproses berkas...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center pt-0.5">
                    <button
                      type="button"
                      onClick={handleUseDemoFile}
                      className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[#5B5BD6] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">attach_file</span>
                      <span>Gunakan Berkas Contoh (1-Klik Demo)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white border border-[#5B5BD6]/40 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#5B5BD6] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{uploadedFile.name}</p>
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        {uploadedFile.sizeFormatted} • Berkas Berhasil Terpilih
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => { setUploadedFile(null); setSelectedFile(null); }}
                    className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                  >
                    Ganti Berkas
                  </button>
                </div>
              )}
            </div>

            {uploadError && <p role="alert" className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-3">{uploadError}</p>}
            {isUploading && <p role="status" className="text-sm text-indigo-900">Menyiapkan hasil contoh...</p>}
            {/* Dynamic Form per Cluster */}
            {mission.cluster === 'informatika' && (
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                  Tuliskan Langkah Algoritma Bernomor &amp; Alasan Keputusan:
                </label>
                <textarea
                  rows={6}
                  maxLength={2000}
                  value={taskTextAnswer}
                  onChange={(e) => setTaskTextAnswer(e.target.value)}
                  className="w-full p-4 rounded-xl bg-surface-subtle text-xs sm:text-sm font-mono text-text-primary border border-border-default focus:border-primary focus:bg-white focus:outline-none leading-relaxed transition-all"
                  placeholder="1. Langkah pertama...&#10;2. Langkah kedua...&#10;&#10;Alasan optimasi alur: ..."
                />
              </div>
            )}

            {mission.cluster === 'industri' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                    Usulan Jumlah Petugas Loket:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['2', '3', '4'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setIndustryStaffChoice(num)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          industryStaffChoice === num
                            ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold shadow-2xs'
                            : 'border-border-default bg-surface-subtle text-text-secondary'
                        }`}
                      >
                        <span className="block text-base font-bold">{num} Petugas</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">
                          Kapasitas {parseInt(num, 10) * 15} orang/jam
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                    Sebutkan Kompromi atau Risiko dari Usulanmu:
                  </label>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    value={industryRiskNote}
                    onChange={(e) => setIndustryRiskNote(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-surface-subtle text-xs sm:text-sm text-text-primary border border-border-default focus:border-primary focus:bg-white focus:outline-none transition-all"
                    placeholder="Tuliskan risiko biaya atau kemungkinan antrean jika terjadi lonjakan..."
                  />
                </div>
              </div>
            )}

            {mission.cluster === 'dkv' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                    Tuliskan 3 Keputusan Desain (Hierarki, Kontras, &amp; Ruang Kosong):
                  </label>
                  <textarea
                    rows={6}
                    maxLength={2000}
                    value={designDecisions}
                    onChange={(e) => setDesignDecisions(e.target.value)}
                    placeholder="1. Hierarki visual: ...&#10;2. Kontras warna teks: ...&#10;3. Pemanfaatan white space: ..."
                    className="w-full p-3.5 rounded-xl bg-surface-subtle text-xs sm:text-sm text-text-primary border border-border-default focus:border-primary focus:bg-white focus:outline-none transition-all leading-relaxed"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-border-default">
              <Button variant="ghost" size="md" onClick={() => setPhase('materi')}>
                Buka Materi Kembali
              </Button>
              <Button size="lg" disabled={isUploading} onClick={() => setShowConfirmModal(true)} iconRight="send">
                Kumpulkan Tugas
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            FASE 4: UMPAN BALIK RUBRIK (UX-22) & REVISI (UX-23)
        ========================================================================= */}
        {phase === 'umpan_balik' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-default">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-status-success-bg px-2.5 py-0.5 rounded-full uppercase">
                  Pengumpulan Demo Selesai
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1.5">
                  Umpan Balik Kualitatif Tugas
                </h2>
              </div>
              <span className="text-xs text-text-secondary">
                Evaluasi Pembelajaran Dicoding (Bukan Skor Bakat)
              </span>
            </div>

            {/* Reviewer Result Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {missionSubmissions[mission.id]?.statusKelulusan === 'lulus' ? 'Contoh Hasil Review — Demo' : 'Tugas menunggu review'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {missionSubmissions[mission.id]?.feedbackReviewer || 'Berkas tersimpan. Nilai dan kelulusan ditentukan setelah pemeriksaan reviewer.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-900 bg-emerald-100 px-3 py-1 rounded-lg font-bold">
                Versi {missionSubmissions[mission.id]?.versi || 1}
              </span>
            </div>

            {/* Rubric Evaluation List */}
            <div className="space-y-3">
              {mission.rubrik.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-surface-subtle border border-border-default space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                        check_circle
                      </span>
                      {r.kriteria}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Kriteria Penilaian
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {r.deskripsi}
                  </p>
                </div>
              ))}
            </div>

            {/* Contoh Jawaban Pembanding Mahasiswa */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  school
                </span>
                Contoh Jawaban Pembanding Mahasiswa:
              </h4>
              <div className="p-4 rounded-xl bg-white border border-indigo-100 text-xs sm:text-sm text-text-primary font-mono leading-relaxed">
                {mission.contohJawabanPembanding.contohKuat}
              </div>
              <p className="text-xs text-indigo-900 font-medium">
                <strong>Kenapa Kuat:</strong> {mission.contohJawabanPembanding.catatanKenapaKuat}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-default">
              <Button
                variant="outline"
                size="md"
                onClick={() => setPhase('tugas')}
                icon="edit"
              >
                Revisi Tugas (Versi 2)
              </Button>
              <Button size="lg" onClick={() => setPhase('refleksi')} iconRight="arrow_forward">
                Lanjut ke Refleksi Pengalaman
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            FASE 5: REFLEKSI PENGALAMAN (UX-24)
        ========================================================================= */}
        {phase === 'refleksi' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
                Langkah 5 • Refleksi Pengalaman
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                Kuesioner Pengalaman Mini-Kuliah
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Refleksi ini digunakan untuk mengukur kecocokan gayamu dengan jurusan ini, bukan untuk menilai bakat.
              </p>
            </div>

            {/* Tingkat Enjoyment */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                Seberapa Menikmati Kamu dengan Cara Berpikir Ini? (1 = Membosankan, 5 = Sangat Menikmati):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEnjoyment(val as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      enjoyment === val
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold shadow-2xs'
                        : 'border-border-default bg-surface-subtle text-text-secondary'
                    }`}
                  >
                    <span className="block text-base font-bold">{val}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Minat Mendalami */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                Tertarik Mendalami Jurusan Ini Lebih Lanjut?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Ya', 'Mungkin', 'Ragu', 'Tidak'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setInterestContinue(opt)}
                    className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                      interestContinue === opt
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold'
                        : 'border-border-default bg-surface-subtle text-text-secondary'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Bagian Paling Menarik */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                Bagian Paling Menarik Menurutmu:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Materi', 'Tugas Kasus'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMostInteresting(opt)}
                    className={`p-3 rounded-xl border text-center text-xs transition-all ${
                      mostInteresting === opt
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] font-bold shadow-2xs'
                        : 'border-border-default bg-surface-subtle text-text-secondary'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Ekspektasi vs Kenyataan */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                Ekspektasi vs Kenyataan (Apakah materi ini sesuai dengan bayanganmu?):
              </label>
              <textarea
                rows={4}
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="Tuliskan apakah materi ini lebih sulit, lebih menarik, atau berbeda dari bayanganmu sebelumnya..."
                className="w-full p-3.5 rounded-xl bg-surface-subtle text-xs sm:text-sm text-text-primary border border-border-default focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-default">
              <Button variant="ghost" size="md" onClick={() => setPhase('umpan_balik')}>
                Kembali ke Rubrik
              </Button>
              <Button size="lg" onClick={handleSaveReflection} iconRight="save">
                Simpan &amp; Lihat Pratinjau Rekomendasi
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            FASE 6: PRATINJAU DAMPAK REKOMENDASI (UX-25)
        ========================================================================= */}
        {phase === 'pratinjau' && (
          <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-status-success-bg px-2.5 py-0.5 rounded-full uppercase">
                Simulasi Selesai &amp; Tersimpan
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1.5">
                Pratinjau Dampak Rekomendasi
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Hasil tugas dan refleksimu kini menjadi bukti riil yang memperkuat kalkulasi rekomendasi jurusanmu.
              </p>
            </div>

            {/* Before vs After Impact Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sebelum Misi (Versi 1) */}
              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-default space-y-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Sebelum Misi (Versi 1)
                </span>
                <h4 className="text-sm font-bold text-text-primary">
                  Kecocokan Minat: 78%
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Berdasarkan jawaban kuesioner eksplorasi minat umum tanpa bukti pengerjaan kasus riil.
                </p>
              </div>

              {/* Usulan Baru (Versi 2) */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Usulan Baru (Versi 2)
                </span>
                <h4 className="text-sm font-bold text-emerald-900">
                  Kecocokan Minat: {enjoyment >= 4 ? '88% (Meningkat +10%)' : '75% (Disesuaikan)'}
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Diperkuat oleh bukti penyelesaian tugas praktis, pengunggahan berkas proyek, dan evaluasi refleksi kepuasan ({enjoyment}/5).
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-default">
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push('/simulasi')}
                className="w-full sm:w-auto"
              >
                Kembali ke Katalog Misi
              </Button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link href="/rekomendasi" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full" iconRight="arrow_forward">
                    Buka Hasil Rekomendasi
                  </Button>
                </Link>
                <Link href="/profil/paspor" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full" iconRight="badge">
                    Buka Paspor Belajar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Pengumpulan Tugas */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-border-default space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5B5BD6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">send</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Kumpulkan Tugas Simulasi?
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Demo ini mencatat nama berkas secara lokal dan menampilkan contoh hasil review. Berkas tidak dikirim ke server.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowConfirmModal(false)}>
                  Batal
                </Button>
                <Button size="sm" onClick={handleConfirmSubmit}>
                  Ya, Kumpulkan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
