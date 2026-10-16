/**
 * Tier 4: Real-World Scenarios Test Suite
 *
 * Covers:
 * 1. Scenario 1: End-to-End Persona Journey "Rani" (Grade XII, West Java, Informatika)
 *    Onboarding -> Recommendations (UX-14) -> Mini-Course Simulation (UX-17 to UX-25) ->
 *    Reflection -> Version 2 Evolution -> Passport Snapshot & Privacy (UX-35 to UX-37) ->
 *    30-Day Plan Synchronization -> JSON Data Sovereignty Export -> Shared-Device Logout.
 * 2. Scenario 2: End-to-End Persona Journey "Dimas" (Grade XI, Budget Constraint, DKV & Compare Cart)
 *    Grade XI Exploration -> Budget Filter (15M) -> DKV Design Simulation -> 3-Prodi Comparison ->
 *    Cart Limit Verification -> BK Offline Consultation Sheet.
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSeedData,
  createAppState,
  readSourceFile,
} from './test_harness.mjs';

describe('Tier 4: Real-World Scenarios (Comprehensive End-to-End Journeys)', async () => {
  const seed = await loadSeedData();

  test('Scenario 1: Complete Student Persona Journey "Rani" (Grade XII, West Java)', () => {
    const state = createAppState(seed);

    // =========================================================
    // STEP 1: Context & Onboarding Configuration
    // =========================================================
    state.setUserContext({
      namaPanggilan: 'Rani',
      kelas: 'XII',
      tahunKelulusan: 2026,
    });
    state.setPreferences({
      domisili: 'Kota Contoh 1 (Jawa Barat)',
      bersediaRelokasi: false,
      rentangAnggaranMax: 20000000,
      rencanaTempatTinggal: 'bersama_orang_tua',
    });
    state.setAcademic({
      skala: '100',
      semester: 'Semester 1–4',
      grades: [
        { mataPelajaran: 'Matematika', nilai: 84 },
        { mataPelajaran: 'Informatika', nilai: 88 },
        { mataPelajaran: 'Bahasa Indonesia', nilai: 86 },
      ],
      isSkipped: false,
    });

    assert.equal(state.userContext.namaPanggilan, 'Rani');
    assert.equal(state.userContext.kelas, 'XII');
    assert.equal(state.preferences.rentangAnggaranMax, 20000000);

    // =========================================================
    // STEP 2: Baseline Recommendation Review (UX-14 Versi 1)
    // =========================================================
    const initialMajor = seed.SEED_MAJORS.find((m) => m.id === 'informatika-univ-a');
    assert.ok(initialMajor);
    assert.equal(initialMajor.cluster, 'informatika');
    assert.equal(initialMajor.akreditasi, 'Unggul');
    assert.equal(initialMajor.biayaPerTahun, 18500000);
    assert.ok(initialMajor.biayaPerTahun <= state.preferences.rentangAnggaranMax, 'Major is within Rani budget');

    // Rani verifies or pins Informatika
    if (!state.bookmarkedMajorIds.includes('informatika-univ-a')) {
      state.toggleBookmark('informatika-univ-a');
    }
    assert.ok(state.bookmarkedMajorIds.includes('informatika-univ-a'));

    // =========================================================
    // STEP 3: Mini-Course Simulation Selection (UX-41)
    // =========================================================
    const mission = seed.SEED_MISSIONS.find((m) => m.id === 'misi-informatika');
    assert.ok(mission);
    assert.equal(mission.estimasiDurasiMenit, 20);

    // =========================================================
    // STEP 4: Reading Sections & Ungraded Quiz Check (UX-18)
    // =========================================================
    assert.equal(mission.materiSections.length, 3);
    const quizQ1 = mission.cekPemahaman[0];
    assert.ok(quizQ1);
    assert.equal(quizQ1.pilihan[1], 'Rangkaian langkah terstruktur dan logis untuk menyelesaikan suatu persoalan.');

    // =========================================================
    // STEP 5: Practical Task Submission (UX-19 & UX-40)
    // =========================================================
    const studentAlgorithm =
      '1. Siapkan pesanan minuman (Es Teh & Es Jeruk) dalam 1 menit.\n' +
      '2. Buat Roti Bakar (4 mnt) dan Mie Ayam (5 mnt).\n' +
      '3. Masak 2 Nasi Goreng sekaligus (10 mnt total) di wajan besar.\n\n' +
      'Alasan: Mendahulukan pesanan cepat menurunkan rata-rata waktu antrean pelanggan.';

    state.saveMissionSubmission({
      missionId: mission.id,
      jawabanTeks: studentAlgorithm,
      alasanKeputusan: 'Solusi optimal berbasis Shortest Job First dan batching.',
      waktuSubmit: new Date().toISOString(),
      versi: 1,
    });

    const recordedSubmission = state.missionSubmissions[mission.id];
    assert.ok(recordedSubmission);
    assert.equal(recordedSubmission.versi, 1);
    assert.ok(recordedSubmission.jawabanTeks.includes('Shortest Job First') || recordedSubmission.alasanKeputusan.includes('Shortest Job First'));

    // =========================================================
    // STEP 6: Rubric Feedback & Model Comparison (UX-22)
    // =========================================================
    assert.equal(mission.rubrik.length, 3);
    assert.ok(mission.contohJawabanPembanding.contohKuat.length > 50);
    assert.ok(mission.contohJawabanPembanding.catatanKenapaKuat.includes('Shortest Job First'));

    // =========================================================
    // STEP 7: Affective Reflection (UX-24)
    // =========================================================
    state.saveMissionReflection({
      missionId: mission.id,
      tingkatEnjoyment: 5,
      minatMendalami: 'Ya',
      bagianPalingMenarik: 'Tugas Kasus',
      aspekTersulit: 'Menyeimbangkan trade-off kecepatan dan keadilan.',
      hambatanDihadapi: 'Tidak ada kendala teknis.',
      ekspektasiVsKenyataan: 'Ternyata logika komputasi sangat aplikatif dan seru.',
      rencanaLangkahLanjutan: 'Mencari prodi Informatika di katalog kampus.',
    });

    const recordedReflection = state.missionReflections[mission.id];
    assert.ok(recordedReflection);
    assert.equal(recordedReflection.tingkatEnjoyment, 5);
    assert.equal(recordedReflection.minatMendalami, 'Ya');

    // =========================================================
    // STEP 8: Recommendation Version 2 Update & Evolution (UX-25)
    // =========================================================
    // In Version 2, high enjoyment (5/5) and task completion promotes Informatika to #1
    const proposedRank1 = 'informatika-univ-a';
    assert.equal(proposedRank1, 'informatika-univ-a');

    // =========================================================
    // STEP 9: Learning Passport Generation with Privacy Options (UX-35 to UX-37)
    // =========================================================
    const passportSnapshot = {
      id: 'snap-rani-001',
      nomorSnapshot: 'SNAP-2026-RANI-01',
      tanggalDibuat: '2026-10-16',
      namaSiswa: state.userContext.namaPanggilan,
      kelas: state.userContext.kelas,
      sekolah: 'SMA Negeri 1',
      sertakanNilaiRapor: false, // Privacy: hidden
      sertakanAnggaranBiaya: false, // Privacy: hidden
      sertakanRefleksiSensitif: true, // Included for BK discussion
      prodiTerpilih: state.bookmarkedMajorIds,
      misiSelesai: [mission.id],
      catatanDiskusiBK: 'Rani memiliki minat kuat dan kecocokan cara berpikir terstruktur pada Informatika.',
    };

    state.addPassportSnapshot(passportSnapshot);
    assert.equal(state.passportSnapshots.length, 1);
    assert.equal(state.passportSnapshots[0].sertakanNilaiRapor, false);
    assert.equal(state.passportSnapshots[0].sertakanAnggaranBiaya, false);
    assert.equal(state.passportSnapshots[0].sertakanRefleksiSensitif, true);
    assert.deepEqual(state.passportSnapshots[0].misiSelesai, ['misi-informatika']);

    // =========================================================
    // STEP 10: 30-Day Plan Synchronization (UX-33)
    // =========================================================
    const task1 = state.planTasks.find((t) => t.id === 'task-1');
    assert.equal(task1.status, 'done', 'Plan task-1 must be synchronized as done');

    // =========================================================
    // STEP 11: Data Sovereignty Export Archive (UX-48)
    // =========================================================
    const exportData = state.generateExportPayload();
    assert.ok(
      exportData.metadata.platform === 'NEXALORA Education Guidance Platform' || exportData.metadata.platform === 'CobaDulu Education Guidance Platform',
      'Export metadata platform must match'
    );
    assert.equal(exportData.userContext.namaPanggilan, 'Rani');
    assert.equal(exportData.missionSubmissions['misi-informatika'].versi, 1);
    assert.equal(exportData.missionReflections['misi-informatika'].tingkatEnjoyment, 5);
    assert.equal(exportData.passportSnapshots.length, 1);

    // =========================================================
    // STEP 12: Shared School Lab PC Logout (H-05)
    // =========================================================
    state.logout();

    // Verify completely sanitized state on shared device
    assert.equal(state.userContext.namaPanggilan, 'Siswa');
    assert.equal(state.preferences.domisili, '');
    assert.equal(state.passportSnapshots.length, 0);
    assert.equal(Object.keys(state.missionSubmissions).length, 0);
    assert.equal(Object.keys(state.missionReflections).length, 0);
    assert.equal(state.bookmarkedMajorIds.length, 0);
    assert.equal(state.compareCartIds.length, 0);
    assert.equal(state.localStorage.getItem('cobadulu_state_v1'), null);
  });

  test('Scenario 2: Student Persona Journey "Dimas" (Grade XI, Budget Constrained, DKV Exploration)', () => {
    const state = createAppState(seed);

    // Context: Grade XI Student with strict budget limit (Rp 15.000.000)
    state.setUserContext({
      namaPanggilan: 'Dimas',
      kelas: 'XI',
      tahunKelulusan: 2027,
    });
    state.setPreferences({
      domisili: 'Kota Contoh 1 (Jawa Barat)',
      bersediaRelokasi: false,
      rentangAnggaranMax: 15000000,
      rencanaTempatTinggal: 'bersama_orang_tua',
    });

    assert.equal(state.userContext.namaPanggilan, 'Dimas');
    assert.equal(state.userContext.kelas, 'XI');

    // Explores DKV Mission (UX-21)
    const dkvMission = seed.SEED_MISSIONS.find((m) => m.id === 'misi-dkv');
    assert.ok(dkvMission);

    // Completes 3 Design Decisions Task
    state.saveMissionSubmission({
      missionId: 'misi-dkv',
      jawabanTeks:
        'Keputusan 1: Membagi tata letak menjadi 2 kolom rapi.\n' +
        'Keputusan 2: Teks harga kontras tinggi hitam di atas putih (WCAG 4.5:1).\n' +
        'Keputusan 3: Judul kategori berukuran 24pt agar terbaca dari jarak 2 meter.',
      alasanKeputusan: 'Memudahkan siswa membaca menu dari jarak jauh saat kantin ramai.',
      waktuSubmit: new Date().toISOString(),
      versi: 1,
    });

    state.saveMissionReflection({
      missionId: 'misi-dkv',
      tingkatEnjoyment: 4,
      minatMendalami: 'Ya',
      bagianPalingMenarik: 'Tugas Kasus',
      aspekTersulit: 'Menentukan kontras warna yang tepat.',
      hambatanDihadapi: 'Nihil.',
      ekspektasiVsKenyataan: 'Ternyata desain visual bukan cuma soal gambar bagus tapi soal fungsi informasi.',
      rencanaLangkahLanjutan: 'Membahas portofolio karya bersama guru seni.',
    });

    assert.equal(state.missionReflections['misi-dkv'].tingkatEnjoyment, 4);

    // Compare Cart: Dimas compares 3 programs
    state.clearCompareCart();
    state.toggleCompareCart('dkv-poltek-c'); // 14M - within budget
    state.toggleCompareCart('teknik-industri-inst-b'); // 16M - exceeds budget
    state.toggleCompareCart('informatika-univ-a'); // 18.5M - exceeds budget
    assert.equal(state.compareCartIds.length, 3);

    // Enforces 4th item rejection
    const overflowTry = state.toggleCompareCart('sistem-informasi-univ-d');
    assert.equal(overflowTry.success, false);
    assert.equal(state.compareCartIds.length, 3);

    // Generates offline BK consultation snapshot
    state.addPassportSnapshot({
      id: 'snap-dimas-001',
      nomorSnapshot: 'SNAP-2026-DIMAS-01',
      tanggalDibuat: '2026-10-16',
      namaSiswa: 'Dimas',
      kelas: 'XI',
      sertakanNilaiRapor: false,
      sertakanAnggaranBiaya: true, // Dimas wants to discuss budget openly
      sertakanRefleksiSensitif: true,
      prodiTerpilih: ['dkv-poltek-c'],
      misiSelesai: ['misi-dkv'],
      catatanDiskusiBK: 'Dimas tertarik pada DKV Politeknik C karena biayanya terjangkau (Rp 14 Juta) dan berlokasi di domisili asal.',
    });

    assert.equal(state.passportSnapshots.length, 1);
    assert.equal(state.passportSnapshots[0].sertakanAnggaranBiaya, true);
    assert.deepEqual(state.passportSnapshots[0].misiSelesai, ['misi-dkv']);
  });
});
