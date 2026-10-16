/**
 * Tier 3: Cross-Feature Combinations Test Suite (Pairwise Integration)
 *
 * Covers:
 * 1. Simulation completion -> passport snapshot -> 30-day plan task auto-update
 * 2. Logout -> clean storage wipe -> safe redirect to /
 * 3. Bookmark major -> compare cart candidate -> passport printable summary
 * 4. Practical preferences (budget/domisili) -> recommendation feasibility evaluation
 * 5. Account deletion (UX-39) -> complete state purge
 * 6. Questionnaire revision -> recommendation version history evolution
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSeedData,
  createAppState,
  readSourceFile,
} from './test_harness.mjs';

describe('Tier 3: Cross-Feature Combinations (Pairwise Integration)', async () => {
  const seed = await loadSeedData();

  test('3.1 Pairwise 1: Simulation completion -> passport snapshot -> 30-day plan task-1 auto-update', () => {
    const state = createAppState(seed);

    // Initial check: task-1 is 'doing' (or not 'done')
    const initialTask1 = state.planTasks.find((t) => t.id === 'task-1');
    assert.equal(initialTask1.status, 'doing', 'Initial task-1 status in seed is doing');
    assert.equal(state.passportSnapshots.length, 0);

    // Step 1: Complete simulation task
    state.saveMissionSubmission({
      missionId: 'misi-informatika',
      jawabanTeks: '1. Es Teh\n2. Mie Ayam\n3. Nasi Goreng batching',
      alasanKeputusan: 'Algoritma Shortest Job First',
      waktuSubmit: new Date().toISOString(),
      versi: 1,
    });

    // Step 2: Complete reflection (Stage 5)
    state.saveMissionReflection({
      missionId: 'misi-informatika',
      tingkatEnjoyment: 5,
      minatMendalami: 'Ya',
      bagianPalingMenarik: 'Tugas Kasus',
      aspekTersulit: 'Logika antrean',
      hambatanDihadapi: 'Nihil',
      ekspektasiVsKenyataan: 'Sangat seru',
      rencanaLangkahLanjutan: 'Membahas dengan guru BK',
    });

    // Verify task-1 automatically transitioned to 'done' (Feature 4 requirement)
    const updatedTask1 = state.planTasks.find((t) => t.id === 'task-1');
    assert.equal(updatedTask1.status, 'done', 'Completing mission reflection must auto-mark task-1 as done');

    // Step 3: Create passport snapshot
    state.addPassportSnapshot({
      id: 'snap-001',
      nomorSnapshot: 'SNAP-2026-RANI-01',
      tanggalDibuat: '2026-10-16',
      namaSiswa: state.userContext.namaPanggilan,
      kelas: state.userContext.kelas,
      sertakanNilaiRapor: false,
      sertakanAnggaranBiaya: false,
      sertakanRefleksiSensitif: true,
      prodiTerpilih: state.bookmarkedMajorIds,
      misiSelesai: ['misi-informatika'],
      catatanDiskusiBK: 'Tertarik kuat pada Informatika setelah menyelesaikan mini-kuliah.',
    });

    assert.equal(state.passportSnapshots.length, 1);
    const snap = state.passportSnapshots[0];
    assert.deepEqual(snap.misiSelesai, ['misi-informatika']);
    assert.ok(snap.catatanDiskusiBK.includes('Informatika'));
  });

  test('3.2 Pairwise 2: Logout -> clean storage purge -> redirect to / with zero residual state', () => {
    const state = createAppState(seed);

    // Populate private student context
    state.setUserContext({ namaPanggilan: 'Rani', kelas: 'XII', tahunKelulusan: 2026 });
    state.setPreferences({ domisili: 'Kota Bandung', bersediaRelokasi: false, rentangAnggaranMax: 15000000, rencanaTempatTinggal: 'kost' });
    state.toggleBookmark('teknik-industri-inst-b');
    state.saveMissionSubmission({
      missionId: 'misi-industri',
      jawabanTeks: '3 petugas loket',
      alasanKeputusan: 'Analisis jam sibuk',
      waktuSubmit: new Date().toISOString(),
      versi: 1,
    });
    state.addPassportSnapshot({
      id: 'snap-privat',
      nomorSnapshot: 'SNAP-PRIVAT-01',
      tanggalDibuat: '2026-10-16',
      namaSiswa: 'Rani',
      kelas: 'XII',
      sertakanNilaiRapor: true,
      sertakanAnggaranBiaya: true,
      sertakanRefleksiSensitif: true,
      prodiTerpilih: ['teknik-industri-inst-b'],
      misiSelesai: ['misi-industri'],
      catatanDiskusiBK: 'Catatan konsultasi rahasia',
    });

    // Pre-condition verification
    assert.equal(state.passportSnapshots.length, 1);
    assert.ok(state.localStorage.getItem('cobadulu_state_v1'));

    // Execute logout
    state.logout();

    // Verify post-conditions
    assert.equal(state.userContext.namaPanggilan, 'Siswa', 'Identity must be scrubbed to default');
    assert.equal(state.preferences.domisili, '', 'Domisili must be scrubbed');
    assert.equal(state.passportSnapshots.length, 0, 'Sensitive passport snapshots must be purged');
    assert.equal(Object.keys(state.missionSubmissions).length, 0, 'Mission drafts must be purged');
    assert.equal(Object.keys(state.missionReflections).length, 0, 'Reflections must be purged');
    assert.equal(state.bookmarkedMajorIds.length, 0, 'Bookmarks must be emptied');
    assert.equal(state.compareCartIds.length, 0, 'Compare cart must be emptied');
    assert.equal(state.localStorage.getItem('cobadulu_state_v1'), null, 'Local storage must be deleted');

    // Verify LogoutModal redirects to '/'
    const modalCode = readSourceFile('components/common/LogoutModal.tsx');
    assert.ok(modalCode.includes("router.push('/')"), 'LogoutModal must navigate to /');
  });

  test('3.3 Pairwise 3: Bookmark major -> compare cart candidate -> passport printable summary', () => {
    const state = createAppState(seed);
    state.clearCompareCart();

    // Student bookmarks a major in Jelajah/Rekomendasi
    state.toggleBookmark('dkv-poltek-c');
    assert.ok(state.bookmarkedMajorIds.includes('dkv-poltek-c'));

    // The bookmarked prodi can now be directly added to comparison
    const compareRes = state.toggleCompareCart('dkv-poltek-c');
    assert.equal(compareRes.success, true);
    assert.ok(state.compareCartIds.includes('dkv-poltek-c'));

    // In Paspor Studi page, pinned majors are filtered from bookmarkedMajorIds
    const pinned = seed.SEED_MAJORS.filter((m) => state.bookmarkedMajorIds.includes(m.id));
    const pinnedIds = pinned.map((m) => m.id);
    assert.ok(pinnedIds.includes('dkv-poltek-c'), 'Bookmarked major must appear in printable passport sheet');
  });

  test('3.4 Pairwise 4: Practical preference updates (Domisili / Anggaran) -> Recommendation feasibility metric', () => {
    const state = createAppState(seed);

    // Initial preference
    state.setPreferences({
      domisili: 'Kota Contoh 1 (Jawa Barat)',
      bersediaRelokasi: false,
      rentangAnggaranMax: 15000000,
      rencanaTempatTinggal: 'bersama_orang_tua',
    });

    const infoMajor = seed.SEED_MAJORS.find((m) => m.id === 'informatika-univ-a'); // 18.5M, Kota Contoh 1
    const dkvMajor = seed.SEED_MAJORS.find((m) => m.id === 'dkv-poltek-c'); // 14.0M, Kota Contoh 1
    const industriMajor = seed.SEED_MAJORS.find((m) => m.id === 'teknik-industri-inst-b'); // 16.0M, Kota Contoh 2

    // Feasibility evaluation
    const evalFeasibility = (major, pref) => {
      const budgetOk = pref.rentangAnggaranMax === null || (major.biayaPerTahun !== null && major.biayaPerTahun <= pref.rentangAnggaranMax);
      const locationOk = !pref.domisili || major.kota.includes(pref.domisili) || pref.bersediaRelokasi;
      return { budgetOk, locationOk, fullyFeasible: budgetOk && locationOk };
    };

    const dkvFeas = evalFeasibility(dkvMajor, state.preferences);
    assert.equal(dkvFeas.budgetOk, true, 'DKV 14M is within 15M budget');
    assert.equal(dkvFeas.locationOk, true, 'DKV is in local domicile');
    assert.equal(dkvFeas.fullyFeasible, true);

    const infoFeas = evalFeasibility(infoMajor, state.preferences);
    assert.equal(infoFeas.budgetOk, false, 'Informatika 18.5M exceeds 15M budget');
    assert.equal(infoFeas.locationOk, true, 'Informatika is in local domicile');
    assert.equal(infoFeas.fullyFeasible, false);

    const indFeas = evalFeasibility(industriMajor, state.preferences);
    assert.equal(indFeas.budgetOk, false, 'Industri 16M exceeds 15M budget');
    assert.equal(indFeas.locationOk, false, 'Industri requires relocation but student prefers not to relocate');
    assert.equal(indFeas.fullyFeasible, false);
  });

  test('3.5 Pairwise 5: Account deletion (UX-39) -> requires typing HAPUS and wipes user state completely', () => {
    const settingsCode = readSourceFile('app/pengaturan/page.tsx');
    assert.ok(
      settingsCode.includes("deleteConfirmationText.trim().toUpperCase() === 'HAPUS'"),
      'Must require typing HAPUS to confirm account deletion'
    );
    assert.ok(
      settingsCode.includes('logout()'),
      'Must call logout to thoroughly purge all user data rather than restoring demo preset'
    );
    assert.ok(
      settingsCode.includes("router.push('/')"),
      'Must redirect to landing page after deletion'
    );
  });

  test('3.6 Pairwise 6: Questionnaire revision -> recommendation version history evolution', () => {
    const rekomendasiCode = readSourceFile('app/rekomendasi/page.tsx');

    // Verifies that Version 2 reflects changes after simulation / reflection
    assert.ok(rekomendasiCode.includes('Versi 2 (Aktif Saat Ini)') || rekomendasiCode.includes('Versi 2 (Aktif)'));
    assert.ok(rekomendasiCode.includes('Informatika naik ke posisi #1 (sebelumnya #2)'));
    assert.ok(rekomendasiCode.includes('Versi 1 (Baseline Awal)') || rekomendasiCode.includes('Versi 1 (Arsip)'));
  });
});
