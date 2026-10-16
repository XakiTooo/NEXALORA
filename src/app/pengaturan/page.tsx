'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoutModal } from '@/components/common/LogoutModal';
import { useApp } from '@/context/AppContext';
import { updateProfile, deleteAccountData } from '@/lib/api/endpoints';

export default function PengaturanPage() {
  const router = useRouter();
  const {
    isDemoMode,
    userContext,
    setUserContext,
    preferences,
    setPreferences,
    logout,
    academic,
    interestAnswers,
    bookmarkedMajorIds,
    compareCartIds,
    missionSubmissions,
    missionReflections,
    passportSnapshots,
    planTasks,
  } = useApp();

  const [namaPanggilan, setNamaPanggilan] = useState(userContext.namaPanggilan);
  const [kelas, setKelas] = useState<'XI' | 'XII'>(userContext.kelas);
  const [tahunKelulusan, setTahunKelulusan] = useState(userContext.tahunKelulusan);
  const [domisili, setDomisili] = useState(preferences.domisili);
  const [anggaran, setAnggaran] = useState(preferences.rentangAnggaranMax?.toString() || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserContext({
      ...userContext,
      namaPanggilan,
      kelas,
      tahunKelulusan,
    });
    setPreferences({
      ...preferences,
      domisili,
      rentangAnggaranMax: anggaran ? parseInt(anggaran, 10) : null,
    });
    // Asynchronous backend profile sync
    updateProfile({
      displayName: namaPanggilan,
      gradeLevel: kelas === 'XI' ? 'XI' : 'XII',
      graduationYear: tahunKelulusan,
      relocationMode: preferences.bersediaRelokasi ? 'OPEN' : 'STAY',
      monthlyBudgetMax: anggaran ? parseInt(anggaran, 10) : null,
      expectedVersion: 1,
    }).catch(() => {});

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportObject = {
        metadata: {
          platform: 'NEXALORA Education Guidance Platform',
          exportDate: new Date().toISOString(),
          version: 'PRD v1.3',
        },
        isDemoMode,
        userContext,
        preferences,
        academic,
        interestAnswers,
        bookmarkedMajorIds,
        compareCartIds,
        missionSubmissions,
        missionReflections,
        passportSnapshots,
        planTasks,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      const sanitizedNamaPanggilan = userContext.namaPanggilan.replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `NEXALORA_Export_${sanitizedNamaPanggilan}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
    }, 600);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() === 'HAPUS') {
      deleteAccountData().catch(() => {});
      logout();
      setShowDeleteModal(false);
      router.push('/');
    }
  };

  return (
    <AppShell>
      <div className="max-w-[900px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">settings</span>
            Pengaturan Akun &amp; Data
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Pengaturan Profil &amp; Privasi
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Sesuaikan data pribadimu, unduh arsip data eksplorasi, atau kelola penghapusan akun.
          </p>
        </div>

        {/* Section 1: Ubah Konteks Profil */}
        <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              Informasi Konteks Siswa
            </h2>
            {savedSuccess && (
              <span className="text-xs text-status-success-text font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Tersimpan!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Panggilan"
                value={namaPanggilan}
                onChange={(e) => setNamaPanggilan(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-text-primary block">
                  Tingkat Kelas
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-[10px] bg-surface-subtle text-sm text-text-primary border border-border-default focus:border-primary focus:outline-none"
                >
                  <option value="XI">Kelas XI (11) SMA</option>
                  <option value="XII">Kelas XII (12) SMA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kota Domisili"
                value={domisili}
                onChange={(e) => setDomisili(e.target.value)}
              />

              <Input
                label="Batas Anggaran UKT / Tahun (Rp)"
                type="number"
                placeholder="Misal: 20000000"
                value={anggaran}
                onChange={(e) => setAnggaran(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="md" variant="primary">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>

        {/* Section 2: Ekspor Data Pribadi (UX-48) */}
        <div id="ekspor" className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-default">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              file_download
            </span>
            <h2 className="text-base font-bold text-text-primary">
              Ekspor Data Pribadi
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Sesuai prinsip kedaulatan data siswa, kamu berhak mengunduh seluruh salinan riwayat eksplorasi, draf tugas mini-kuliah, dan preferensi tersimpan dalam format berkas JSON terstandar.
          </p>

          <Button
            size="md"
            variant="outline"
            icon="download"
            isLoading={isExporting}
            onClick={handleExportData}
          >
            Unduh Arsip Data Lengkap (.JSON)
          </Button>
        </div>

        {/* Section: Sesi & Keluar Akun */}
        <div className="bg-white rounded-2xl border border-border-default p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-default">
            <span className="material-symbols-outlined text-text-secondary text-[20px]">
              logout
            </span>
            <h2 className="text-base font-bold text-text-primary">
              Sesi Masuk &amp; Keamanan Perangkat
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Jika kamu menggunakan komputer perpustakaan atau lab sekolah, akhiri sesi untuk membersihkan data formulir dan preferensi agar tidak dapat diakses orang lain.
          </p>

          <Button
            size="md"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            icon="logout"
            onClick={() => setShowLogoutModal(true)}
          >
            Keluar dari Akun
          </Button>
        </div>

        {/* Section 3: Zona Bahaya / Hapus Akun */}
        <div className="bg-white rounded-2xl border border-red-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-red-100">
            <span className="material-symbols-outlined text-red-600 text-[20px]">
              warning
            </span>
            <h2 className="text-base font-bold text-red-900">
              Penghapusan Akun &amp; Data Siswa
            </h2>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Menghapus akun akan membersihkan seluruh riwayat refleksi, paspor belajar, dan preferensi studi yang tersimpan di perangkat ini secara permanen. Aksi ini tidak dapat dibatalkan.
          </p>

          <Button
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
            icon="delete"
            onClick={() => setShowDeleteModal(true)}
          >
            Hapus Akun &amp; Data Pribadi
          </Button>
        </div>

        {/* DELETE MODAL CONFIRMATION (UX-39) */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Konfirmasi Penghapusan Akun
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Ketik kata <strong className="text-red-700">HAPUS</strong> di bawah ini untuk mengonfirmasi penghapusan permanen.
                  </p>
                </div>
              </div>

              <Input
                placeholder="Ketik HAPUS"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
              />

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border-default">
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
                  Batal
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={deleteConfirmationText.trim().toUpperCase() !== 'HAPUS'}
                  onClick={handleDeleteAccount}
                >
                  Hapus Permanen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </AppShell>
  );
}
