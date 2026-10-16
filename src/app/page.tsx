'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';
import { ClusterBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { setIsDemoMode, resetDemoData } = useApp();

  const handleStartDemo = () => {
    resetDemoData();
    setIsDemoMode(true);
    router.push('/beranda');
  };

  return (
    <div className="bg-canvas min-h-screen flex flex-col">
      {/* Sticky Landing Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-default/70 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <NexaloraLogo size={32} showText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-text-secondary">
            <a href="#cara-kerja" className="hover:text-text-primary transition-colors">
              Cara Kerja
            </a>
            <a href="#mini-kuliah" className="hover:text-text-primary transition-colors">
              Simulasi Misi
            </a>
            <a href="#batasan-produk" className="hover:text-text-primary transition-colors">
              Prinsip & Batasan
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/masuk"
              className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-2 transition-colors"
            >
              Masuk
            </Link>
            <Link href="/pilihan-akses">
              <Button size="sm" variant="primary">
                Mulai
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24 border-b border-border-default/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col items-start gap-5">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-border-default text-text-secondary shadow-2xs text-[11px] font-bold tracking-wider uppercase">
                  Eksplorasi Jurusan & Karier SMA (Kelas XI & XII)
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                  Rasakan belajarnya.{' '}
                  <span className="text-[#5B5BD6] block mt-1">
                    Pertimbangkan pilihannya.
                  </span>
                  <span className="block mt-1 text-slate-800">
                    Rencanakan langkah berikutnya.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-text-secondary max-w-xl leading-relaxed">
                  Bantu temukan jurusan kuliah yang tepat lewat cuplikan simulasi mini-kuliah nyata, perbandingan biaya dan kurikulum transparan, tanpa tes kepribadian instan dan tanpa vonis bakat.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/pilihan-akses">
                    <Button size="lg" iconRight="arrow_forward">
                      Mulai Sekarang
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    icon="play_arrow"
                    onClick={handleStartDemo}
                  >
                    Coba Demo Langsung
                  </Button>
                </div>

                {/* Assurance pills */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 text-xs font-medium text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                      verified_user
                    </span>
                    <span>Bebas Risiko</span>
                  </div>
                  <span className="text-border-default">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">
                      psychology_alt
                    </span>
                    <span>Tanpa Skor Bakat</span>
                  </div>
                  <span className="text-border-default">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#5B5BD6] text-[18px]">
                      lock
                    </span>
                    <span>Data Privat Tersimpan</span>
                  </div>
                </div>
              </div>

              {/* Right Column Preview Card */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-indigo-100 blur-3xl opacity-70 pointer-events-none" />

                <div className="relative bg-white rounded-2xl shadow-card border border-border-default p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-border-default/60 pb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Thumbnail Banner */}
                  <div className="rounded-xl overflow-hidden bg-slate-900 relative aspect-16/10 flex flex-col justify-end p-4 shadow-2xs">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                    <div className="relative z-10 text-white flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <ClusterBadge cluster="informatika" />
                        <span className="text-[11px] text-slate-300">
                          Estimasi: 15–20 Menit
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-white leading-snug">
                        Menyortir Pesanan Kantin
                      </h3>
                      <p className="text-xs text-slate-300">
                        Uji alur logika algoritma penyajian tanpa butuh coding.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          rule
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-primary">
                          Uji Pola Pikir Mahasiswa
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          Format mini-kuliah terstruktur dan ramah pemula
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleStartDemo}
                      className="text-[#5B5BD6] hover:text-[#4F46E5] p-1"
                      title="Coba Misi Ini"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        play_circle
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CARA KERJA DALAM 4 LANGKAH NYATA */}
        <section id="cara-kerja" className="w-full bg-white py-16 sm:py-20 border-b border-border-default/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-[#5B5BD6] font-bold text-[11px] uppercase tracking-wider">
                Metodologi Eksplorasi Aman
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Cara Kerja NEXALORA dalam 4 Langkah Nyata
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Langkah bertahap terstruktur yang menghormati ritme belajarmu tanpa membebankan tes kepribadian instan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  step: 'LANGKAH 01',
                  title: '1. Kenali Minat',
                  desc: 'Jawab pertanyaan eksplorasi tanpa rasa cemas, tanpa jawaban benar atau salah.',
                  icon: 'explore',
                  pill: 'Bebas rasa cemas',
                },
                {
                  step: 'LANGKAH 02',
                  title: '2. Coba Mini-Kuliah',
                  desc: 'Rasakan 15–20 menit tugas pengantar jurusan nyata (Informatika, Teknik Industri, DKV).',
                  icon: 'school',
                  pill: 'Format adaptif',
                },
                {
                  step: 'LANGKAH 03',
                  title: '3. Bandingkan Pilihan',
                  desc: 'Tinjau kurikulum, estimasi biaya UKT riil, dan akreditasi secara berdampingan.',
                  icon: 'compare_arrows',
                  pill: 'Transparan & objektif',
                },
                {
                  step: 'LANGKAH 04',
                  title: '4. Susun Rencana',
                  desc: 'Ambil langkah konkrit 30 hari untuk persiapan mandiri dan diskusi bersama BK/orang tua.',
                  icon: 'calendar_month',
                  pill: 'Rencana siap unduh',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-canvas border border-border-default shadow-xs flex flex-col justify-between gap-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border-default text-[#5B5BD6] flex items-center justify-center shadow-2xs">
                        <span className="material-symbols-outlined text-[20px]">
                          {item.icon}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-text-secondary tracking-wider">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border-default/60 flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[15px]">
                      check_circle
                    </span>
                    <span>{item.pill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: 3 CONTOH CUPLIKAN MINI-KULIAH */}
        <section id="mini-kuliah" className="w-full py-16 sm:py-20 border-b border-border-default/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col gap-2 max-w-2xl">
                <span className="text-[#5B5BD6] font-bold text-[11px] uppercase tracking-wider">
                  Mini-Kuliah Langsung
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  3 Contoh Cuplikan Mini-Kuliah (15–20 Menit)
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Uji bagaimana mahasiswa memecahkan masalah harian di bidangnya masing-masing sebelum memutuskan mengambil jurusan tersebut.
                </p>
              </div>
              <Link href="/simulasi" className="self-start sm:self-auto">
                <Button variant="secondary" size="sm" iconRight="arrow_forward">
                  Lihat Semua Katalog Misi
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  cluster: 'informatika' as const,
                  title: 'Menyortir Pesanan Kantin',
                  desc: 'Uji logika menyortir antrean pesanan makanan jam sibuk secara efisien.',
                  format: 'Langkah Algoritma Logis',
                  req: 'Pemula (Nol Coding)',
                  time: '15–20 Menit',
                  href: '/simulasi/misi-informatika',
                },
                {
                  cluster: 'industri' as const,
                  title: 'Mengatur Petugas Loket',
                  desc: 'Optimalkan rasio petugas dan waktu tunggu antrean tanpa pemborosan kapasitas.',
                  format: 'Tabel Antrean & Layanan',
                  req: 'Aritmatika Dasar SMA',
                  time: '20–25 Menit',
                  href: '/simulasi/misi-industri',
                },
                {
                  cluster: 'dkv' as const,
                  title: 'Merancang Menu Ramah Baca',
                  desc: 'Eksplorasi kontras WCAG, hierarki tipe, dan keterbacaan menu dari jarak 2 meter.',
                  format: 'Sketsa Poster Hierarki',
                  req: 'Bukan Ujian Portofolio',
                  time: '15–20 Menit',
                  href: '/simulasi/misi-dkv',
                },
              ].map((misi, i) => (
                <div
                  key={i}
                  className="bg-white border border-border-default rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-card transition-shadow"
                >
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <ClusterBadge cluster={misi.cluster} />
                      <span className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          schedule
                        </span>
                        {misi.time}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-text-primary leading-snug">
                        {misi.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        {misi.desc}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-default/60 flex flex-col gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Format Tugas:</span>
                        <span className="font-semibold text-text-primary">
                          {misi.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Prasyarat:</span>
                        <span className="font-semibold text-emerald-700">
                          {misi.req}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link href={misi.href} className="w-full">
                      <Button variant="secondary" size="md" className="w-full" iconRight="arrow_forward">
                        Coba Misi Ini
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: TRANSPARANSI & BATASAN PRODUK */}
        <section id="batasan-produk" className="w-full bg-white py-16 sm:py-20 border-b border-border-default/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-surface-container-low p-6 sm:p-10 border border-border-default relative overflow-hidden">
              <div className="flex flex-col gap-6 max-w-3xl">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-border-default text-text-secondary text-[11px] font-bold uppercase tracking-wider w-fit">
                  Etika &amp; Batasan NEXALORA
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Prinsip Kejujuran Data &amp; Batasan Rekomendasi
                </h2>

                <div className="p-4 rounded-xl bg-white border border-amber-200 text-amber-900 shadow-2xs flex items-start gap-3 text-xs sm:text-sm font-semibold">
                  <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">
                    info
                  </span>
                  <p className="leading-relaxed">
                    “Rekomendasi membantu eksplorasi, bukan memutuskan masa depanmu. Kami tidak menyediakan skor bakat, tes IQ instan, atau persentase kecocokan semu.”
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-white border border-border-default flex flex-col gap-1.5">
                    <span className="font-bold text-text-primary">
                      Ruang Eksperimen Aman
                    </span>
                    <p className="text-text-secondary leading-relaxed">
                      NEXALORA dirancang sebagai ruang uji coba tanpa tekanan akademis. Nilai atau kesulitan pada tugas simulasi tidak menjadi vonis negatif.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-border-default flex flex-col gap-1.5">
                    <span className="font-bold text-text-primary">
                      Keputusan Bersama Guru BK & Orang Tua
                    </span>
                    <p className="text-text-secondary leading-relaxed">
                      Semua hasil simulasi dirangkum ke dalam Paspor Studi yang dapat diunduh untuk bahan diskusi nyata bersama pihak sekolah dan keluarga.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="w-full py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#4241bc] to-[#6E6EED] text-white p-8 sm:p-12 shadow-card flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2 text-center lg:text-left max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Siap Menemukan Jalur Kuliahmu Sendiri?
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  Coba langsung simulasi dalam 2 menit tanpa perlu membuat akun, atau daftar akun untuk menyimpan riwayat progres dan membuat paspor belajarmu.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <Link href="/pilihan-akses">
                  <Button size="lg" variant="white" iconRight="arrow_forward">
                    Mulai Sekarang
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  icon="play_arrow"
                  onClick={handleStartDemo}
                >
                  Coba Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Landing Footer */}
      <footer className="w-full bg-white border-t border-border-default py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary text-center sm:text-left">
          <div className="flex items-center gap-2">
            <NexaloraLogo size={24} showText={true} />
            <span className="text-border-default">|</span>
            <span>Platform Eksplorasi Studi Mandiri Siswa SMA (Kelas XI & XII)</span>
          </div>
          <p>© 2026 NEXALORA. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
