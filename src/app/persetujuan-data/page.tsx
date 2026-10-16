'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';

export default function PersetujuanDataPage() {
  const router = useRouter();

  const [consents, setConsents] = useState({
    dataUsage: true,
    noCommercial: true,
    userControl: true,
  });

  const allChecked = consents.dataUsage && consents.noCommercial && consents.userControl;

  const handleContinue = () => {
    if (allChecked) {
      router.push('/onboarding');
    }
  };

  return (
    <div className="bg-canvas min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-2xs sticky top-0 z-50 border-b border-border-default/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <NexaloraLogo size={32} showText={true} />
          </Link>
          <Link href="/pilihan-akses" className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">close</span>
            Batal
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-border-default p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#5B5BD6] flex items-center justify-center mb-3 shadow-2xs">
              <span className="material-symbols-outlined text-[26px]">
                verified_user
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#5B5BD6] uppercase tracking-wider">
              Transparansi &amp; Privasi Siswa
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
              Bagaimana NEXALORA Menjaga Datamu
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
              Sebelum mulai mengisi konteks dan minat, pastikan kamu memahami bagaimana data refleksi belajarmu dikelola.
            </p>
          </div>

          {/* Core Principles */}
          <div className="space-y-3.5">
            <label className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-subtle border border-border-default hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={consents.dataUsage}
                onChange={(e) => setConsents({ ...consents, dataUsage: e.target.checked })}
                className="w-4 h-4 rounded text-[#5B5BD6] accent-[#5B5BD6] mt-0.5 cursor-pointer shrink-0"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-text-primary block">
                  1. Data Hanya Digunakan untuk Rekomendasi &amp; Paspor Belajar
                </span>
                <p className="text-text-secondary leading-relaxed">
                  Informasi kelas, preferensi domisili, nilai rapor, dan refleksi tugas simulasi hanya dipakai untuk menampilkan urutan jurusan yang relevan bagi dirimu sendiri.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-subtle border border-border-default hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={consents.noCommercial}
                onChange={(e) => setConsents({ ...consents, noCommercial: e.target.checked })}
                className="w-4 h-4 rounded text-[#5B5BD6] accent-[#5B5BD6] mt-0.5 cursor-pointer shrink-0"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-text-primary block">
                  2. Tanpa Iklan Komersial &amp; Tanpa Penjualan Data
                </span>
                <p className="text-text-secondary leading-relaxed">
                  NEXALORA tidak melacak perilakumu untuk keperluan periklanan pihak ketiga atau bimbingan belajar komersial mana pun.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-subtle border border-border-default hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={consents.userControl}
                onChange={(e) => setConsents({ ...consents, userControl: e.target.checked })}
                className="w-4 h-4 rounded text-[#5B5BD6] accent-[#5B5BD6] mt-0.5 cursor-pointer shrink-0"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-text-primary block">
                  3. Kendali Penuh di Tanganmu (Ekspor, Sembunyikan, atau Hapus)
                </span>
                <p className="text-text-secondary leading-relaxed">
                  Kamu berhak menyembunyikan rincian nilai di Paspor PDF yang dicetak, mengunduh seluruh salinan datamu (ekspor berkas JSON/PDF), atau menghapus akun secara permanen kapan pun.
                </p>
              </div>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link href="/pilihan-akses">
              <Button variant="ghost" size="md">
                Batal &amp; Kembali
              </Button>
            </Link>

            <Button
              size="lg"
              variant="primary"
              disabled={!allChecked}
              onClick={handleContinue}
              iconRight="arrow_forward"
            >
              Setujui &amp; Mulai Pengenalan Diri
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-4 border-t border-border-default text-center text-xs text-text-secondary">
        <p>© 2026 NEXALORA. Dirancang untuk eksplorasi mandiri siswa SMA.</p>
      </footer>
    </div>
  );
}
