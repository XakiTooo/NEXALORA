'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NexaloraLogo } from '@/components/common/NexaloraLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useApp } from '@/context/AppContext';

export default function DaftarPage() {
  const router = useRouter();
  const { logout, setIsDemoMode, setUserContext, resetDemoData } = useApp();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const submittingRef = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || successMsg) return;
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Kata sandi minimal harus 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Kamu harus menyetujui ketentuan privasi untuk melanjutkan.');
      return;
    }

    submittingRef.current = true;
    setIsLoading(true);
    try {
      await logout();

      // Buat sesi siswa riil berdasarkan input pendaftaran (Mode Demo/Dummy Auth)
      setIsDemoMode(true);
      const rawName = email.split('@')[0];
      const capitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1).replace(/[._-]/g, ' ');
      setUserContext({
        namaPanggilan: capitalized,
        kelas: 'XII',
        tahunKelulusan: 2026,
      });
      localStorage.setItem('nexalora_active_user', JSON.stringify({ email, nickname: capitalized }));
      router.push('/onboarding');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Pendaftaran gagal. Coba lagi.');
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleFillDemoForm = () => {
    setEmail('siswa.baru@sekolah.sch.id');
    setPassword('nexalora2026');
    setConfirmPassword('nexalora2026');
    setAgreeTerms(true);
  };

  const handleSkipToOnboarding = () => {
    logout();
    setIsDemoMode(true);
    setUserContext({ namaPanggilan: 'Siswa Baru', kelas: 'XII', tahunKelulusan: 2026 });
    localStorage.setItem('nexalora_active_user', JSON.stringify({ email: 'siswa.baru@sekolah.sch.id', nickname: 'Siswa Baru' }));
    router.push('/onboarding');
  };

  const handleQuickDemoRani = () => {
    resetDemoData();
    setIsDemoMode(true);
    localStorage.setItem('nexalora_active_user', JSON.stringify({ email: 'rani.putri@contoh.sch.id', nickname: 'Rani' }));
    router.push('/beranda');
  };

  return (
    <div className="bg-canvas min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-2xs sticky top-0 z-50 border-b border-border-default/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <NexaloraLogo size={32} showText={true} />
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold text-text-secondary">
            <Link href="/" className="hover:text-text-primary inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[460px] mx-auto flex flex-col items-center">
          <div className="w-full bg-white rounded-[16px] border border-border-default/80 p-6 sm:p-7 shadow-xs flex flex-col">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#5B5BD6] flex items-center justify-center mb-3 shadow-xs">
                <span className="material-symbols-outlined text-white text-[22px]">
                  person_add
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Buat Akun Siswa Baru
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Mulai eksplorasi jurusan dan simulasi belajarmu di NEXALORA
              </p>
            </div>

            {/* Demo Notice Banner with Auto-fill helper */}
            <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-start gap-2.5 text-xs text-indigo-950">
              <span className="material-symbols-outlined text-[#5B5BD6] text-[18px] shrink-0 mt-0.5">
                verified
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-indigo-950">Pendaftaran Mode Demo</span>
                  <button
                    type="button"
                    onClick={handleFillDemoForm}
                    className="text-[11px] font-bold text-[#5B5BD6] hover:underline shrink-0"
                  >
                    Isi Otomatis
                  </button>
                </div>
                <p className="text-[11px] text-indigo-800 leading-snug mt-0.5">
                  Daftar instan tanpa aktivasi email sungguhan, atau gunakan opsi coba demo langsung di bawah.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4">
                <Alert variant="error" title="Pendaftaran Belum Lengkap" description={errorMsg} />
              </div>
            )}

            {successMsg && (
              <div className="mb-4">
                <Alert variant="success" title="Pendaftaran Berhasil" description={successMsg} />
              </div>
            )}

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
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Kata Sandi (Minimal 8 Karakter)
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter unik"
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

              <div>
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                  Konfirmasi Kata Sandi
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
                  required
                  icon="lock_reset"
                  className="w-full"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-border-default text-[#5B5BD6] focus:ring-[#5B5BD6]"
                  />
                  <span className="text-xs text-text-secondary leading-snug">
                    Saya menyetujui{' '}
                    <Link href="/persetujuan-data" className="text-[#5B5BD6] font-semibold hover:underline">
                      Ketentuan Privasi Data Siswa
                    </Link>{' '}
                    untuk bimbingan studi.
                  </span>
                </label>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  iconRight="arrow_forward"
                  className="w-full bg-[#5B5BD6] hover:bg-[#4F46E5] text-white font-bold"
                >
                  Daftar &amp; Lanjut ke Onboarding
                </Button>

                {/* Quick Demo Options */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Atau Coba Demo Langsung
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSkipToOnboarding}
                      className="px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="font-bold">Onboarding Demo</span>
                      <span className="text-[10px] text-slate-500">Mulai dari Tahap 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickDemoRani}
                      className="px-2 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="font-bold">Akun Rani (XII)</span>
                      <span className="text-[10px] text-indigo-700">Langsung Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-5 pt-4 text-center border-t border-border-default/80 flex flex-col sm:flex-row items-center justify-center gap-1 text-xs">
              <span className="text-text-secondary">Sudah memiliki akun?</span>
              <Link href="/masuk" className="font-bold text-[#5B5BD6] hover:underline inline-flex items-center gap-0.5">
                Masuk ke akunmu
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white py-4 border-t border-border-default">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-text-secondary">
          <p>© 2026 NEXALORA. Platform Eksplorasi &amp; Simulasi Jurusan Siswa.</p>
        </div>
      </footer>
    </div>
  );
}
