'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useApp } from '@/context/AppContext';

export default function MasukPage() {
  const router = useRouter();
  const { setUserContext, setIsDemoMode, resetDemoData, logout } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    variant: 'error' | 'warning';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);

    if (!email || !password) {
      setAlertInfo({
        variant: 'error',
        message: 'Mohon masukkan email dan kata sandi.',
      });
      return;
    }

    if (password.length < 6) {
      setAlertInfo({
        variant: 'error',
        message: 'Kata sandi minimal 6 karakter.',
      });
      return;
    }

    setIsLoading(true);

    try {
      await logout();
      localStorage.setItem('nexalora_remember_session', String(rememberMe));

      // Otentikasi Sesi Siswa (Mode Demo/Dummy Auth)
      setIsDemoMode(true);
      const rawName = email.split('@')[0];
      const capitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1).replace(/[._-]/g, ' ');
      setUserContext({
        namaPanggilan: capitalized,
        kelas: 'XII',
        tahunKelulusan: 2026,
      });
      localStorage.setItem('nexalora_active_user', JSON.stringify({ email, nickname: capitalized }));
      router.push('/beranda');
    } catch (error) {
      setAlertInfo({
        variant: 'error',
        message: error instanceof Error ? error.message : 'Gagal masuk. Coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginRani = () => {
    resetDemoData();
    setIsDemoMode(true);
    localStorage.setItem('nexalora_active_user', JSON.stringify({ email: 'rani.putri@contoh.sch.id', nickname: 'Rani' }));
    router.push('/beranda');
  };

  const handleQuickLoginDimas = () => {
    logout();
    setIsDemoMode(true);
    setUserContext({ namaPanggilan: 'Dimas', kelas: 'XI', tahunKelulusan: 2027 });
    localStorage.setItem('nexalora_active_user', JSON.stringify({ email: 'dimas@contoh.sch.id', nickname: 'Dimas' }));
    router.push('/beranda');
  };

  const handleDemoOnboarding = () => {
    logout();
    setIsDemoMode(true);
    setUserContext({ namaPanggilan: 'Siswa Baru', kelas: 'XII', tahunKelulusan: 2026 });
    localStorage.setItem('nexalora_active_user', JSON.stringify({ email: 'siswa.baru@sekolah.sch.id', nickname: 'Siswa Baru' }));
    router.push('/onboarding');
  };

  const handleFillDemoForm = () => {
    setEmail('siswa.demo@nexalora.id');
    setPassword('demo123456');
  };

  return (
    <div className="bg-canvas min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-2xs sticky top-0 z-50 border-b border-border-default/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NexaloraLogo size={32} showText={true} />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/bantuan"
              className="hidden sm:inline-flex items-center text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] mr-1">
                help_outline
              </span>
              Bantuan
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </header>

      {/* Main Card Content */}
      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
          {/* Main Card Container */}
          <div className="w-full bg-white rounded-[16px] border border-border-default/80 p-6 sm:p-7 shadow-sm flex flex-col">
            {/* Brand Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#5B5BD6] flex items-center justify-center mb-3 shadow-xs">
                <span className="material-symbols-outlined text-white text-[22px]">
                  lock_open
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Masuk ke Akun Siswa
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Lanjutkan eksplorasi jurusan dan simulasi belajarmu
              </p>
            </div>

            {/* Demo Notice Banner with Auto-fill helper */}
            <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-start gap-2.5 text-xs text-indigo-950">
              <span className="material-symbols-outlined text-[#5B5BD6] text-[18px] shrink-0 mt-0.5">
                verified
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-indigo-950">Mode Demo Aktif</span>
                  <button
                    type="button"
                    onClick={handleFillDemoForm}
                    className="text-[11px] font-bold text-[#5B5BD6] hover:underline shrink-0"
                  >
                    Isi Otomatis
                  </button>
                </div>
                <p className="text-[11px] text-indigo-800 leading-snug mt-0.5">
                  Bisa masuk dengan email apa saja, atau langsung pilih akun contoh di bawah.
                </p>
              </div>
            </div>

            {/* Error / Alert banner */}
            {alertInfo && (
              <div className="mb-4">
                <Alert
                  variant={alertInfo.variant}
                  title={alertInfo.variant === 'error' ? 'Gagal Masuk' : 'Peringatan'}
                  description={alertInfo.message}
                />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Alamat Email Siswa
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama.kamu@sekolah.sch.id"
                  required
                  icon="mail"
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                    Kata Sandi
                  </label>
                  <Link
                    href="/pemulihan-akses"
                    className="text-[11px] font-semibold text-[#5B5BD6] hover:underline"
                  >
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akunmu"
                    required
                    icon="lock"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border-default text-[#5B5BD6] focus:ring-[#5B5BD6]"
                  />
                  <span className="text-xs text-text-secondary">Ingat sesi di perangkat ini</span>
                </label>
              </div>

              {/* CTA Button */}
              <div className="pt-1.5 space-y-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  iconRight="arrow_forward"
                  className="w-full bg-[#5B5BD6] hover:bg-[#4F46E5] text-white font-bold"
                >
                  Masuk Sekarang
                </Button>

                {/* Quick Presets for Demo / Testing */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Akses Cepat Mode Demo
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleQuickLoginRani}
                      className="px-2 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="font-bold">Siswi Rani (XII)</span>
                      <span className="text-[10px] text-indigo-700">Data Lengkap</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickLoginDimas}
                      className="px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="font-bold">Siswa Dimas (XI)</span>
                      <span className="text-[10px] text-slate-500">Eksplorasi Awal</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoOnboarding}
                    className="w-full mt-2 py-1.5 px-2 rounded-lg border border-dashed border-slate-300 hover:border-[#5B5BD6] hover:bg-indigo-50/30 text-slate-600 hover:text-[#5B5BD6] text-[11px] font-semibold transition-all text-center"
                  >
                    + Coba Alur Onboarding Siswa Baru
                  </button>
                </div>
              </div>
            </form>

            {/* Bottom Card Navigation */}
            <div className="mt-5 pt-4 text-center border-t border-border-default/80 flex flex-col sm:flex-row items-center justify-center gap-1 text-xs">
              <span className="text-text-secondary">Belum punya akun NEXALORA?</span>
              <Link
                href="/daftar"
                className="font-bold text-[#5B5BD6] hover:underline inline-flex items-center gap-0.5"
              >
                Buat akun baru
                <span className="material-symbols-outlined text-[15px]">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          {/* Micro Privacy Assurance */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-text-secondary px-2 text-center">
            <span className="material-symbols-outlined text-text-secondary text-[16px] shrink-0">
              shield
            </span>
            <p className="text-[11px] leading-tight text-text-secondary">
              Data akun tersimpan sesuai kebijakan privasi untuk pendampingan pemilihan jurusan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-4 border-t border-border-default">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              verified_user
            </span>
            <span>Data privat tersimpan aman tanpa pelacakan iklan komersial.</span>
          </div>
          <p>© 2026 NEXALORA. Dirancang untuk eksplorasi mandiri siswa SMA.</p>
        </div>
      </footer>
    </div>
  );
}
