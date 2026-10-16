'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { logout } = useApp();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Keluar dari NEXALORA?
            </h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Sesi akun di perangkat ini akan diakhiri. Riwayat draf dan data refleksi privat akan dibersihkan dari penyimpanan lokal peramban.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface-subtle border border-border-default text-xs text-text-secondary flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
            shield
          </span>
          <span>
            Jika kamu menggunakan komputer bersama di sekolah, keluar akun memastikan datamu tidak terbaca oleh siswa lain.
          </span>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-default">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirmLogout}
            icon="logout"
          >
            Ya, Keluar Akun
          </Button>
        </div>
      </div>
    </div>
  );
};
