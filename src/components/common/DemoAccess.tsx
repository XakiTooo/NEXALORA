'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { NexaloraLogo } from './NexaloraLogo';
import { Button } from '@/components/ui/Button';
export function DemoAccess({ onboarding = false }: { onboarding?: boolean }) {
  const router = useRouter();
  const app = useApp();
  const [name, setName] = useState('');
  const start = async (preset: boolean) => {
    await app.logout();
    app.resetDemoData();
    app.setIsDemoMode(true);
    if (!preset) {
      app.setUserContext({ namaPanggilan: name.trim() || 'Siswa Demo', kelas: 'XII', tahunKelulusan: 2026 });
      app.setAcademic({ skala: '100', semester: 'Semester 1–4', grades: [], isSkipped: false });
      app.setPreferences({ domisili: '', bersediaRelokasi: false, rentangAnggaranMax: null, rencanaTempatTinggal: 'belum_tahu' });
    }
    router.push(preset ? '/beranda' : '/onboarding');
  };
  return <main className="min-h-screen bg-canvas flex items-center justify-center px-5 py-12">
    <div className="w-full max-w-md rounded-2xl border border-border-default bg-white p-7 shadow-sm space-y-6">
      <Link href="/"><NexaloraLogo size={32} showText /></Link>
      <div><p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Versi Demo</p>
      <h1 className="text-2xl font-bold text-slate-900">{onboarding ? 'Mulai perjalanan studimu' : 'Masuk ke sesi demo'}</h1>
      <p className="text-sm text-slate-600 mt-3">Tidak perlu akun, email, atau kata sandi. Progres hanya tersimpan di browser ini.</p></div>
      <form onSubmit={e => { e.preventDefault(); void start(false); }} className="space-y-4">
        <label className="block text-sm font-semibold text-slate-800">Nama panggilan
          <input value={name} onChange={e => setName(e.target.value)} maxLength={50} placeholder="Nama untuk sesi demo" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal" />
        </label>
        <Button type="submit" className="w-full">Mulai dari onboarding</Button>
      </form>
      <Button variant="outline" className="w-full" onClick={() => void start(true)}>Gunakan profil contoh Rani</Button>
      <Link href="/jelajah" className="block text-center text-sm font-semibold text-indigo-700">Langsung jelajahi jurusan</Link>
    </div>
  </main>;
}
