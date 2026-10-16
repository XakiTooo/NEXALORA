'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { PlanTaskItem } from '@/types';

export default function RencanaPage() {
  const { planTasks, updateTaskStatus, updateTaskItem } = useApp();

  const [activeWeek, setActiveWeek] = useState<1 | 2 | 3 | 4>(1);
  const [editingTask, setEditingTask] = useState<PlanTaskItem | null>(null);

  const weekTasks = planTasks.filter((t) => t.mingguKe === activeWeek);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTaskItem(editingTask);
      setEditingTask(null);
    }
  };

  return (
    <AppShell>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B5BD6] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">calendar_today</span>
              Planner Mandiri 30 Hari
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Rencana Eksplorasi Studi 30 Hari
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Panduan tindakan nyata yang realistis untuk mempersiapkan keputusan jurusan kuliahmu secara bertahap bersama pihak sekolah dan orang tua.
            </p>
          </div>
        </div>

        {/* 4-Week Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { week: 1, title: 'Minggu 1', desc: 'Eksplorasi Awal & Misi' },
            { week: 2, title: 'Minggu 2', desc: 'Cek Biaya & Syarat' },
            { week: 3, title: 'Minggu 3', desc: 'Konsultasi Guru BK' },
            { week: 4, title: 'Minggu 4', desc: 'Finalisasi Pilihan' },
          ].map((item) => (
            <button
              key={item.week}
              onClick={() => setActiveWeek(item.week as any)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeWeek === item.week
                  ? 'border-[#5B5BD6] bg-[#EEF2FF] text-[#5B5BD6] shadow-xs'
                  : 'border-border-default bg-white text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="text-xs font-bold block">{item.title}</span>
              <span className="text-[11px] mt-0.5 block truncate opacity-85">
                {item.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Task List for Active Week (UX-33) */}
        <div className="bg-white rounded-2xl border border-border-default p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              Agenda Tugas Minggu ke-{activeWeek}
            </h2>
            <span className="text-xs text-text-secondary">
              {weekTasks.filter((t) => t.status === 'done').length} dari {weekTasks.length} selesai
            </span>
          </div>

          <div className="space-y-3">
            {weekTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border bg-surface-subtle border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.id,
                        task.status === 'done' ? 'todo' : 'done'
                      )
                    }
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      task.status === 'done'
                        ? 'bg-[#5B5BD6] border-[#5B5BD6] text-white'
                        : 'border-border-default bg-white text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </button>

                  <div className="space-y-1 min-w-0">
                    <span
                      className={`text-sm font-bold block ${
                        task.status === 'done'
                          ? 'line-through text-text-secondary'
                          : 'text-text-primary'
                      }`}
                    >
                      {task.judul}
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {task.deskripsi}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-text-secondary">
                      <span className="px-2 py-0.5 rounded bg-white border border-border-default font-semibold">
                        {task.kategori}
                      </span>
                      <span>•</span>
                      <span>Estimasi: {task.estimasiMenit} menit</span>
                      {task.buktiCatatan && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            Ada bukti catatan
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant="outline"
                    icon="edit"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit &amp; Bukti
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDIT MODAL / DRAWER (UX-34) */}
        {editingTask && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border-default">
                <h3 className="text-base font-bold text-text-primary">
                  Detail &amp; Bukti Tugas
                </h3>
                <button
                  onClick={() => setEditingTask(null)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5">
                <Input
                  label="Judul Tugas"
                  value={editingTask.judul}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, judul: e.target.value })
                  }
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary">
                    Deskripsi Tugas
                  </label>
                  <textarea
                    rows={2}
                    value={editingTask.deskripsi}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, deskripsi: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-surface-subtle text-xs text-text-primary border border-border-default focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary">
                    Catatan Bukti / Tautan Eksplorasi (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Misal: Sudah menanyakan biaya UKT ke kakak kelas alumni, atau tautan silabus resmi..."
                    value={editingTask.buktiCatatan || ''}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, buktiCatatan: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-surface-subtle text-xs text-text-primary border border-border-default focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-border-default">
                  <Button variant="ghost" size="sm" onClick={() => setEditingTask(null)}>
                    Batal
                  </Button>
                  <Button type="submit" size="sm" variant="primary">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
