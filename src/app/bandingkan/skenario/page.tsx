'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS } from '@/lib/data/seed';

export default function SkenarioBagaimanaJikaPage() {
  const router = useRouter();
  const { preferences, setPreferences, compareCartIds } = useApp();

  const [tempAnggaran, setTempAnggaran] = useState<number>(
    preferences.rentangAnggaranMax || 18000000
  );
  const [tempRelokasi, setTempRelokasi] = useState<boolean>(
    preferences.bersediaRelokasi ?? true
  );
  const [tempTinggal, setTempTinggal] = useState<
    'bersama_orang_tua' | 'kost' | 'asrama' | 'belum_tahu'
  >(preferences.rencanaTempatTinggal || 'kost');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const comparedMajors = SEED_MAJORS.filter((m) => compareCartIds.includes(m.id));

  const handleSaveToProfile = () => {
    setPreferences({
      ...preferences,
      rentangAnggaranMax: tempAnggaran,
      bersediaRelokasi: tempRelokasi,
      rencanaTempatTinggal: tempTinggal,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/bandingkan');
    }, 900);
  };

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Link href="/bandingkan" className="hover:text-primary transition-colors">
            Bandingkan
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-text-primary font-bold">Skenario &quot;Bagaimana Jika&quot;</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Skenario &quot;Bagaimana Jika&quot; (Sandbox Biaya &amp; Lokasi)
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Uji coba simulasi sementara tanpa langsung mengubah profil aslimu. Lihat jurusan mana yang tetap terjangkau jika anggaran atau preferensi tinggalmu disesuaikan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-text-primary border-b border-border-default pb-3">
              Parameter Eksperimen Sementara
            </h2>

            {/* Slider Anggaran */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Batas Anggaran UKT:</span>
                <span className="font-bold text-primary text-sm">
                  Rp {tempAnggaran.toLocaleString('id-ID')} / thn
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="40000000"
                step="1000000"
                value={tempAnggaran}
                onChange={(e) => setTempAnggaran(parseInt(e.target.value, 10))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-secondary">
                <span>Rp 5 Jt</span>
                <span>Rp 20 Jt</span>
                <span>Rp 40 Jt</span>
              </div>
            </div>

            {/* Relokasi Toggle */}
            <div className="space-y-2 pt-2 border-t border-border-default/60">
              <span className="text-xs font-semibold text-text-primary block">
                Wilayah Kuliah:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTempRelokasi(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    tempRelokasi
                      ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6]'
                      : 'border-border-default bg-surface-subtle text-text-secondary'
                  }`}
                >
                  Bisa Luar Kota
                </button>
                <button
                  type="button"
                  onClick={() => setTempRelokasi(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    !tempRelokasi
                      ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6]'
                      : 'border-border-default bg-surface-subtle text-text-secondary'
                  }`}
                >
                  Dalam Kota Saja
                </button>
              </div>
            </div>

            {/* Rencana Tinggal */}
            <div className="space-y-2 pt-2 border-t border-border-default/60">
              <span className="text-xs font-semibold text-text-primary block">
                Rencana Tempat Tinggal:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'kost', label: 'Kost Mandiri' },
                  { id: 'bersama_orang_tua', label: 'Bersama Ortu' },
                  { id: 'asrama', label: 'Asrama Kampus' },
                  { id: 'belum_tahu', label: 'Belum Tahu' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTempTinggal(item.id as any)}
                    className={`py-2 px-3 rounded-xl border font-semibold transition-all ${
                      tempTinggal === item.id
                        ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6]'
                        : 'border-border-default bg-surface-subtle text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border-default space-y-2">
              <Button
                size="md"
                variant="primary"
                className="w-full"
                onClick={handleSaveToProfile}
                icon="save"
              >
                {savedSuccess ? 'Tersimpan ke Profil!' : 'Simpan Sebagai Preferensi Profil'}
              </Button>
              <Link href="/bandingkan" className="w-full block">
                <Button size="md" variant="ghost" className="w-full">
                  Buang Perubahan (Kembali)
                </Button>
              </Link>
            </div>
          </div>

          {/* Real-time Impact Matrix (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <h2 className="text-base font-bold text-text-primary">
                Dampak Kelayakan pada Jurusan Terpilih
              </h2>
              <span className="text-xs text-text-secondary">Simulasi Real-time</span>
            </div>

            <div className="space-y-3">
              {comparedMajors.map((major) => {
                const isUnderBudget =
                  major.biayaPerTahun !== null && major.biayaPerTahun <= tempAnggaran;
                const isUnknown = major.biayaPerTahun === null;

                return (
                  <div
                    key={major.id}
                    className="p-4 rounded-xl border bg-surface-subtle border-border-default space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-text-primary">
                        {major.namaProdi} ({major.namaKampus})
                      </span>
                      {isUnknown ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                          Perlu Cek Kampus
                        </span>
                      ) : isUnderBudget ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-status-success-bg text-status-success-text text-[11px] font-bold">
                          ✓ Masuk Anggaran
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-status-warning-bg text-status-warning-text text-[11px] font-bold">
                          Melebihi Rp {(major.biayaPerTahun! - tempAnggaran).toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-text-secondary flex justify-between">
                      <span>Estimasi UKT Asli:</span>
                      <span className="font-semibold text-text-primary">
                        {major.biayaPerTahun
                          ? `Rp ${major.biayaPerTahun.toLocaleString('id-ID')}`
                          : 'Belum tersedia'}
                      </span>
                    </div>

                    <div className="text-xs text-text-secondary flex justify-between">
                      <span>Catatan Lokasi:</span>
                      <span>
                        {!tempRelokasi && major.kota.includes('Jawa Timur')
                          ? 'Perlu dipikirkan ulang karena di luar kota asal.'
                          : 'Sesuai dengan kesiapan tinggal.'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
