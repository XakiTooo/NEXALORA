'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge, ClusterBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { SEED_MAJORS } from '@/lib/data/seed';

export default function BandingkanPage() {
  const { compareCartIds, removeFromCompareCart, clearCompareCart } = useApp();

  const comparedMajors = SEED_MAJORS.filter((m) => compareCartIds.includes(m.id));

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">balance</span>
              Matriks Komparasi Obyektif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Bandingkan Program Studi Pilihan
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Tinjau perbedaan kurikulum, biaya UKT riil, dan akreditasi secara berdampingan tanpa persentase kecocokan semu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {comparedMajors.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCompareCart}>
                Kosongkan Slot
              </Button>
            )}
            <Link href="/bandingkan/skenario">
              <Button size="sm" variant="primary" icon="tune">
                Uji Skenario &quot;Bagaimana Jika&quot;
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {comparedMajors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border-default p-12 text-center space-y-4 shadow-xs">
            <span className="material-symbols-outlined text-[48px] text-text-secondary">
              balance
            </span>
            <h3 className="font-bold text-lg text-text-primary">
              Keranjang Bandingkan Masih Kosong
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
              Pilih tombol &quot;+ Bandingkan&quot; di katalog atau rekomendasi untuk membandingkan hingga 3 jurusan secara berdampingan.
            </p>
            <Link href="/jelajah">
              <Button size="md" variant="primary">
                Buka Katalog Program Studi
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border-default shadow-xs overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border-default bg-surface-subtle">
                  <th className="p-4 text-left font-bold text-text-secondary w-48 min-w-[160px]">
                    Kriteria / Jurusan
                  </th>
                  {comparedMajors.map((major) => (
                    <th key={major.id} className="p-4 text-left min-w-[240px] max-w-[280px]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <ClusterBadge cluster={major.cluster} />
                          <h3 className="font-bold text-sm sm:text-base text-text-primary mt-1">
                            {major.namaProdi}
                          </h3>
                          <p className="text-xs text-text-secondary">
                            {major.namaKampus}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCompareCart(major.id)}
                          className="text-text-secondary hover:text-red-600 p-1"
                          title="Hapus dari perbandingan"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </th>
                  ))}
                  {comparedMajors.length < 3 && (
                    <th className="p-4 text-center min-w-[200px] border-l border-dashed border-border-default bg-slate-50/50">
                      <Link href="/jelajah" className="text-xs font-bold text-primary hover:underline">
                        + Tambah Jurusan ({Math.max(0, 3 - comparedMajors.length)} slot tersisa)
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {/* Row 1: Akreditasi */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50">
                    Akreditasi
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4 font-semibold text-text-primary">
                      {major.akreditasi}
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>

                {/* Row 2: Status Verifikasi Data */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50">
                    Status Data
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4">
                      <StatusBadge status={major.statusData} />
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>

                {/* Row 3: Biaya UKT per Tahun */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50">
                    Estimasi UKT / Tahun
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4">
                      <span className="font-bold text-text-primary block">
                        {major.biayaPerTahun
                          ? `Rp ${major.biayaPerTahun.toLocaleString('id-ID')}`
                          : 'Perlu diperiksa'}
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        Sumber data: {major.biayaTahunSumber} (Contoh)
                      </span>
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>

                {/* Row 4: Lokasi */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50">
                    Lokasi Kampus
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4 text-text-primary">
                      {major.kota}
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>

                {/* Row 5: Kurikulum Kunci */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50 align-top">
                    Mata Kuliah Utama
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4 align-top">
                      <ul className="space-y-1 text-xs text-text-secondary">
                        {major.kurikulumHighlights.map((k, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{k}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>

                {/* Row 6: Prospek Karier */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50 align-top">
                    Prospek Karier
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4 align-top text-xs text-text-secondary">
                      {major.prospekKarier.join(', ')}
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>

                {/* Row 7: Actions */}
                <tr>
                  <td className="p-4 font-bold text-text-secondary bg-surface-subtle/50">
                    Aksi Lanjutan
                  </td>
                  {comparedMajors.map((major) => (
                    <td key={major.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/jelajah/${major.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            Detail
                          </Button>
                        </Link>
                        <Link href={`/simulasi/misi-${major.cluster}`} className="flex-1">
                          <Button size="sm" variant="primary" className="w-full">
                            Coba Misi
                          </Button>
                        </Link>
                      </div>
                    </td>
                  ))}
                  {comparedMajors.length < 3 && <td className="bg-slate-50/30" />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
