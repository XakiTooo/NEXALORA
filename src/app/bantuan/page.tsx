'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/ui/Badge';

export default function BantuanPage() {
  return (
    <AppShell>
      <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">help_outline</span>
            Pusat Bantuan &amp; Batasan Produk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Prinsip Kejujuran, Etika, &amp; Batasan Produk
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Pahami batasan platform NEXALORA agar kamu dapat memanfaatkan hasil eksplorasi secara bijak dan proporsional.
          </p>
        </div>

        {/* 4 FAQ Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="text-base font-bold text-text-primary">
                Mengapa NEXALORA Tidak Menampilkan Skor Bakat atau Persentase Kecocokan?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary pl-10.5 leading-relaxed">
              Kami menolak memberikan vonis mutlak atas masa depan seorang siswa melalui tes pilihan ganda instan. Minat dan kemampuan berkembang seiring pengalaman nyata. Rekomendasi di NEXALORA disusun sebagai urutan awal untuk dieksplorasi, bukan ramalan kepastian takdir.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-base font-bold text-text-primary">
                Arti Label Verifikasi pada Data Biaya &amp; Kampus
              </h2>
            </div>
            <div className="pl-10.5 space-y-2.5 pt-1 text-xs">
              <div className="flex items-center gap-3">
                <StatusBadge status="terverifikasi" />
                <span className="text-text-secondary">
                  Data UKT dan akreditasi telah dicocokkan dengan sumber resmi Kemendikbudristek terbaru.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status="perlu_diperiksa" />
                <span className="text-text-secondary">
                  Data bersifat perkiraan sementara atau berasal dari laporan tahun sebelumnya; perlu konfirmasi langsung ke kampus tujuan.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status="belum_tersedia" />
                <span className="text-text-secondary">
                  Kampus belum mempublikasikan rincian biaya terbaru untuk program studi tersebut.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h2 className="text-base font-bold text-text-primary">
                Bagaimana Cara Menggunakan Paspor Belajar untuk Diskusi Guru BK?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary pl-10.5 leading-relaxed">
              Buka menu <Link href="/profil/paspor" className="text-primary font-bold hover:underline">Paspor Belajar</Link>, tentukan opsi privasi apakah ingin menyertakan nilai rapor atau tidak, lalu cetak/unduh PDF. Serahkan lembar snapshot ini kepada Guru Bimbingan Konseling (BK) di sekolahmu sebagai dasar konsultasi yang konkret.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h2 className="text-base font-bold text-text-primary">
                Cakupan Data Rumpun Studi di Fase MVP
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary pl-10.5 leading-relaxed">
              Pada versi v1.3 ini, modul mini-kuliah difokuskan pada 3 rumpun keilmuan percontohan: <strong>Informatika</strong> (Logika &amp; Komputasi), <strong>Teknik Industri</strong> (Proses &amp; Efisiensi), dan <strong>Desain Komunikasi Visual</strong> (Hierarki Visual). Katalog prodi lain akan ditambahkan secara bertahap.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
