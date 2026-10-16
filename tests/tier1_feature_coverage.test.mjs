/**
 * Tier 1: Feature Coverage Test Suite (>=5 tests per feature)
 *
 * Covers:
 * 1. Simulation workflow (UX-17 to UX-25)
 * 2. 22 App Router routes existence & integrity
 * 3. UX-14 3-Metric score grid & version drawer
 * 4. 4-point Logout system & shared-device sovereignty
 * 5. Complete JSON data sovereignty export
 */

import fs from 'node:fs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSeedData,
  createAppState,
  getAppRouterRoutes,
  readSourceFile,
} from './test_harness.mjs';

describe('Tier 1: Feature Coverage (>=5 tests per feature)', async () => {
  const seed = await loadSeedData();

  // -------------------------------------------------------------
  // FEATURE 1: Simulation Workflow (UX-17 to UX-25)
  // -------------------------------------------------------------
  describe('Feature 1: 5-Stage Mini-Course Simulation Workflow', () => {
    test('1.1 Stage 1 (Brief UX-17): Renders title, duration badge, learning objectives, and PRD disclaimer', () => {
      const missionInformatika = seed.SEED_MISSIONS.find((m) => m.id === 'misi-informatika');
      assert.ok(missionInformatika, 'Informatika mission must exist in seed');
      assert.equal(missionInformatika.cluster, 'informatika');
      assert.equal(missionInformatika.estimasiDurasiMenit, 20);
      assert.ok(missionInformatika.tujuanBelajar.length >= 3, 'Must have at least 3 learning objectives');

      // Check detail page code implementation contains disclaimer & objectives
      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(
        detailCode.includes('Ini cuplikan aktivitas belajar pengantar, bukan gambaran lengkap seluruh kurikulum'),
        'Stage 1 must contain mandatory PRD v1.3 disclaimer'
      );
      assert.ok(detailCode.includes('Tujuan Pembelajaran Singkat'), 'Must display learning objectives section');
      assert.ok(detailCode.includes('Format Tugas yang Akan Dikumpulkan'), 'Must show task submission format');
    });

    test('1.2 Stage 2 (Materi UX-18a): Provides multi-section reading with key takeaways and time estimates', () => {
      for (const m of seed.SEED_MISSIONS) {
        assert.ok(m.materiSections.length >= 2, `${m.id} must have at least 2 reading sections`);
        for (const sec of m.materiSections) {
          assert.ok(sec.judul.length > 5, 'Section title must be descriptive');
          assert.ok(sec.estimasiMenit >= 2, 'Section must have estimated minutes');
          assert.ok(sec.konten.length > 50, 'Section content must be substantial');
          assert.ok(sec.poinKunci.length >= 2, 'Section must highlight at least 2 key takeaways');
        }
      }
    });

    test('1.3 Stage 2 (Cek Pemahaman UX-18b): Ungraded quiz provides instant feedback without score penalty', () => {
      for (const m of seed.SEED_MISSIONS) {
        assert.ok(m.cekPemahaman.length >= 1, `${m.id} must have at least 1 comprehension check question`);
        for (const q of m.cekPemahaman) {
          assert.ok(q.pertanyaan.length > 10, 'Question text must be specified');
          assert.ok(q.pilihan.length >= 3, 'Must offer at least 3 choices');
          assert.ok(q.penjelasan.length > 15, 'Must provide immediate explanation/learning feedback');
        }
      }

      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(
        detailCode.includes('Cek Pemahaman Cepat (Bebas Tekanan & Tanpa Nilai)') ||
        detailCode.includes('Bebas Tekanan &amp; Tanpa Nilai'),
        'Cek Pemahaman must explicitly state it is pressure-free and unscored'
      );
      assert.ok(
        detailCode.includes('Tanpa Skor Ujian'),
        'Must display "Tanpa Skor Ujian" badge to eliminate test anxiety'
      );
    });

    test('1.4 Stage 3 (Tugas Praktis UX-19/20/21): Differentiates task format per cluster and exposes rubric criteria', () => {
      const mInfo = seed.SEED_MISSIONS.find((m) => m.id === 'misi-informatika');
      const mInd = seed.SEED_MISSIONS.find((m) => m.id === 'misi-industri');
      const mDkv = seed.SEED_MISSIONS.find((m) => m.id === 'misi-dkv');

      assert.ok(mInfo.formatTugas.includes('Tertulis'), 'Informatika format must be written logic steps');
      assert.ok(mInd.formatTugas.includes('Tabel'), 'Industri format must be tabular capacity analysis');
      assert.ok(mDkv.formatTugas.includes('Sketsa') || mDkv.formatTugas.includes('Keputusan Desain'), 'DKV format must be design decisions/sketch');

      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(detailCode.includes('Tuliskan Langkah Algoritma Bernomor'), 'Informatika UI has algorithm step input');
      assert.ok(detailCode.includes('Usulan Jumlah Petugas Loket'), 'Industri UI has counter staff options');
      assert.ok(detailCode.includes('Tuliskan 3 Keputusan Desain'), 'DKV UI has design decision input');
      assert.ok(detailCode.includes('Kriteria Rubrik Pembelajaran (3 Poin)'), 'Must preview 3 rubric criteria');
    });

    test('1.5 Stage 4 (Rubrik Feedback UX-22): Evaluates 3 qualitative criteria and presents strong model comparison', () => {
      for (const m of seed.SEED_MISSIONS) {
        assert.equal(m.rubrik.length, 3, `${m.id} rubric must contain exactly 3 criteria`);
        for (const r of m.rubrik) {
          assert.ok(r.kriteria, 'Rubric must have criteria title');
          assert.ok(r.catatanKualitatif, 'Rubric must have qualitative assessment note');
        }
        assert.ok(m.contohJawabanPembanding.contohKuat.length > 30, 'Must have exemplary student comparison answer');
        assert.ok(m.contohJawabanPembanding.catatanKenapaKuat.length > 20, 'Must explain why the answer is strong');
      }

      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(detailCode.includes('Contoh Jawaban Pembanding Mahasiswa'), 'Feedback phase displays student model answer');
      assert.ok(detailCode.includes('Revisi Tugas (Versi 2)'), 'Feedback phase provides revision action');
    });

    test('1.6 Stage 5 (Refleksi Pengalaman UX-24 & Pratinjau UX-25): Captures enjoyment, continuation interest, and previews recommendation impact', () => {
      const state = createAppState(seed);
      assert.equal(Object.keys(state.missionReflections).length, 0);

      // Save reflection
      state.saveMissionReflection({
        missionId: 'misi-informatika',
        tingkatEnjoyment: 5,
        minatMendalami: 'Ya',
        bagianPalingMenarik: 'Tugas Kasus',
        aspekTersulit: 'Menyeimbangkan trade-off kecepatan dan keadilan.',
        hambatanDihadapi: 'Tidak ada kendala teknis.',
        ekspektasiVsKenyataan: 'Lebih praktis dan menyenangkan dari bayangan awal.',
        rencanaLangkahLanjutan: 'Mencari prodi Informatika di kampus terdekat.',
      });

      assert.equal(state.missionReflections['misi-informatika'].tingkatEnjoyment, 5);
      assert.equal(state.missionReflections['misi-informatika'].minatMendalami, 'Ya');
      assert.equal(state.missionReflections['misi-informatika'].bagianPalingMenarik, 'Tugas Kasus');

      // Check UX-25 preview in code
      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(detailCode.includes('Pratinjau Dampak Rekomendasi'), 'Must have UX-25 recommendation impact preview');
      assert.ok(detailCode.includes('Sebelum Misi (Versi 1)'), 'Must show before comparison');
      assert.ok(detailCode.includes('Usulan Baru (Versi 2)'), 'Must show proposed Version 2 update');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 2: 22 App Router Routes Existence & Integrity
  // -------------------------------------------------------------
  describe('Feature 2: 22 App Router Routes Existence & Integrity', () => {
    const EXPECTED_22_ROUTES = [
      '/',
      '/_not-found',
      '/bandingkan',
      '/bandingkan/skenario',
      '/bantuan',
      '/beranda',
      '/daftar',
      '/jelajah',
      '/jelajah/[id]',
      '/karier',
      '/masuk',
      '/onboarding',
      '/pemulihan-akses',
      '/pengaturan',
      '/persetujuan-data',
      '/pilihan-akses',
      '/profil',
      '/profil/paspor',
      '/rekomendasi',
      '/rencana',
      '/simulasi',
      '/simulasi/[id]',
    ];

    test('2.1 Route inventory completeness: All 22 expected App Router routes exist in filesystem', () => {
      const actualRoutes = getAppRouterRoutes();
      assert.equal(actualRoutes.length, 22, `Expected exactly 22 routes, found ${actualRoutes.length}`);

      const actualRoutePaths = actualRoutes.map((r) => r.route.replace(/\\/g, '/')).sort();
      const expectedPaths = [...EXPECTED_22_ROUTES].sort();
      assert.deepEqual(actualRoutePaths, expectedPaths, 'All 22 route paths must match expected inventory');
    });

    test('2.2 Export integrity: Every route file has a valid default export component function', () => {
      const actualRoutes = getAppRouterRoutes();
      for (const route of actualRoutes) {
        const fileContent = fs.readFileSync(route.filePath, 'utf8');
        assert.ok(
          fileContent.includes('export default function') || fileContent.includes('export default'),
          `Route ${route.route} in ${route.filePath} must have a default export`
        );
      }
    });

    test('2.3 Dynamic route parameter validation: /simulasi/[id] and /jelajah/[id] handle parameters without crashing', () => {
      const simulasiDetailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(simulasiDetailCode.includes('useParams()'), 'Simulasi detail must read dynamic route params');
      assert.ok(simulasiDetailCode.includes('SEED_MISSIONS.find'), 'Must find mission by params id');
      assert.ok(simulasiDetailCode.includes('|| SEED_MISSIONS[0]'), 'Must provide safe fallback if id not matched');

      const jelajahDetailCode = readSourceFile('app/jelajah/[id]/page.tsx');
      assert.ok(jelajahDetailCode.includes('useParams()'), 'Jelajah detail must read dynamic route params');
      assert.ok(jelajahDetailCode.includes('SEED_MAJORS.find'), 'Must find major by params id');
      assert.ok(jelajahDetailCode.includes('|| SEED_MAJORS[0]'), 'Must provide safe fallback if id not matched');
    });

    test('2.4 AppShell & Layout integration: Core navigation layout components wrap main routes', () => {
      const berandaCode = readSourceFile('app/beranda/page.tsx');
      const jelajahCode = readSourceFile('app/jelajah/page.tsx');
      const rekomendasiCode = readSourceFile('app/rekomendasi/page.tsx');
      const rencanaCode = readSourceFile('app/rencana/page.tsx');
      const pasporCode = readSourceFile('app/profil/paspor/page.tsx');

      assert.ok(berandaCode.includes('<AppShell>'), 'Beranda must use AppShell');
      assert.ok(jelajahCode.includes('<AppShell>'), 'Jelajah must use AppShell');
      assert.ok(rekomendasiCode.includes('<AppShell>'), 'Rekomendasi must use AppShell');
      assert.ok(rencanaCode.includes('<AppShell>'), 'Rencana must use AppShell');
      assert.ok(pasporCode.includes('<AppShell>'), 'Paspor must use AppShell');
    });

    test('2.5 Error & 404 boundary integrity: not-found.tsx renders proper user recovery paths', () => {
      const notFoundCode = readSourceFile('app/not-found.tsx');
      assert.ok(notFoundCode.includes('404'), 'not-found.tsx must include 404 indicator');
      assert.ok(
        notFoundCode.includes('Kembali ke Beranda') || notFoundCode.includes('href="/beranda"') || notFoundCode.includes('href="/"'),
        'not-found.tsx must offer user navigation recovery back to home'
      );
    });

    test('2.6 Navigation links integrity: AppSidebar and AppHeader links resolve to valid routes', () => {
      const sidebarCode = readSourceFile('components/common/AppSidebar.tsx');
      const headerCode = readSourceFile('components/common/AppHeader.tsx');
      const validRoutes = EXPECTED_22_ROUTES;

      // Sidebar links
      const sidebarLinks = ['/beranda', '/jelajah', '/simulasi', '/rencana', '/profil', '/pengaturan', '/bantuan'];
      for (const link of sidebarLinks) {
        assert.ok(sidebarCode.includes(link), `AppSidebar must link to ${link}`);
        assert.ok(validRoutes.includes(link), `Sidebar link ${link} must exist in 22 routes`);
      }

      // Header links
      const headerLinks = ['/bandingkan', '/profil', '/profil/paspor', '/pengaturan'];
      for (const link of headerLinks) {
        assert.ok(headerCode.includes(link), `AppHeader must link to ${link}`);
        assert.ok(validRoutes.includes(link), `Header link ${link} must exist in 22 routes`);
      }
    });
  });

  // -------------------------------------------------------------
  // FEATURE 3: UX-14 3-Metric Score Grid & Version Drawer
  // -------------------------------------------------------------
  describe('Feature 3: UX-14 Master Benchmark Integrity', () => {
    test('3.1 3-Metric score grid presence on each major card (Minat Belajar, Kesiapan Akademik, Kelayakan Praktis)', () => {
      const rekomendasiCode = readSourceFile('app/rekomendasi/page.tsx');
      assert.ok(rekomendasiCode.includes('Minat Belajar'), 'UX-14 must display "Minat Belajar" metric');
      assert.ok(rekomendasiCode.includes('Kesiapan Akademik'), 'UX-14 must display "Kesiapan Akademik" metric');
      assert.ok(rekomendasiCode.includes('Kelayakan Praktis'), 'UX-14 must display "Kelayakan Praktis" metric');
    });

    test('3.2 Dual evidence bullets grounded in real student responses on each major card', () => {
      const rekomendasiCode = readSourceFile('app/rekomendasi/page.tsx');
      assert.ok(
        rekomendasiCode.includes('Dua Alasan Berbasis Jawaban Nyata:'),
        'Must display section heading "Dua Alasan Berbasis Jawaban Nyata:"'
      );
      assert.ok(rekomendasiCode.includes('Jawaban Minat #1:'), 'Card 1 must include survey response evidence bullet');
      assert.ok(rekomendasiCode.includes('Refleksi Tugas Informatika:'), 'Card 1 must include task reflection evidence bullet');
    });

    test('3.3 Versioning drawer (UX-44): Slide-over drawer comparing Versi 1 vs Versi 2 with timeline', () => {
      const rekomendasiCode = readSourceFile('app/rekomendasi/page.tsx');
      assert.ok(rekomendasiCode.includes('isDrawerOpen'), 'Drawer open state must be managed');
      assert.ok(rekomendasiCode.includes('Versi 2 (Aktif Saat Ini)') || rekomendasiCode.includes('Versi 2 (Aktif)'), 'Drawer must describe Version 2');
      assert.ok(rekomendasiCode.includes('Versi 1 (Baseline Awal)') || rekomendasiCode.includes('Versi 1 (Arsip)'), 'Drawer must describe Version 1');
      assert.ok(rekomendasiCode.includes('Prinsip Tanpa Vonis Permanen'), 'Must display non-binding exploratory disclaimer');
    });

    test('3.4 Evidence inspection panel (UX-15 Panel Bukti): Audit trail dynamically displays active program evidence', () => {
      const rekomendasiCode = readSourceFile('app/rekomendasi/page.tsx');
      assert.ok(rekomendasiCode.includes('panel-bukti-widget'), 'Panel Bukti container must exist');
      assert.ok(rekomendasiCode.includes('Pertanyaan Minat Utama'), 'Panel Bukti must show primary interest question');
      assert.ok(rekomendasiCode.includes('Log Simulasi Misi'), 'Panel Bukti must show simulation log');
      assert.ok(rekomendasiCode.includes('Refleksi Kualitatif Siswa'), 'Panel Bukti must show verbatim reflection');
    });

    test('3.5 Pinned majors tab (UX-43 Pilihan Tersemat): Synchronizes with bookmarkedMajorIds and shows counter', () => {
      const state = createAppState(seed);
      assert.deepEqual(state.bookmarkedMajorIds, ['informatika-univ-a']);

      // Toggle bookmark adds second prodi
      state.toggleBookmark('teknik-industri-inst-b');
      assert.equal(state.bookmarkedMajorIds.length, 2);
      assert.ok(state.bookmarkedMajorIds.includes('teknik-industri-inst-b'));

      // Toggle again removes it
      state.toggleBookmark('teknik-industri-inst-b');
      assert.equal(state.bookmarkedMajorIds.length, 1);
      assert.ok(!state.bookmarkedMajorIds.includes('teknik-industri-inst-b'));
    });

    test('3.6 Status badge verification flags: Correctly tags data reliability levels', () => {
      const m1 = seed.SEED_MAJORS.find((m) => m.id === 'informatika-univ-a');
      const m2 = seed.SEED_MAJORS.find((m) => m.id === 'teknik-industri-inst-b');
      const m3 = seed.SEED_MAJORS.find((m) => m.id === 'dkv-poltek-c');
      const m4 = seed.SEED_MAJORS.find((m) => m.id === 'sistem-informasi-univ-d');

      assert.equal(m1.biayaStatus, 'terverifikasi');
      assert.equal(m2.biayaStatus, 'perlu_diperiksa');
      assert.equal(m3.biayaStatus, 'sumber_lama');
      assert.equal(m4.biayaStatus, 'belum_tersedia');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 4: 4-Point Logout System (Session Lifecycle & Shared-Device Data Sovereignty)
  // -------------------------------------------------------------
  describe('Feature 4: 4-Point Logout System & Shared-Device Data Sovereignty', () => {
    test('4.1 Trigger 1: AppHeader profile dropdown contains logout modal trigger', () => {
      const headerCode = readSourceFile('components/common/AppHeader.tsx');
      assert.ok(headerCode.includes('showLogoutModal'), 'AppHeader must track logout modal state');
      assert.ok(headerCode.includes('setShowLogoutModal(true)'), 'AppHeader must open logout modal on action click');
      assert.ok(headerCode.includes('<LogoutModal'), 'AppHeader must mount LogoutModal');
    });

    test('4.2 Trigger 2: AppSidebar footer contains logout modal trigger', () => {
      const sidebarCode = readSourceFile('components/common/AppSidebar.tsx');
      assert.ok(sidebarCode.includes('showLogoutModal'), 'AppSidebar must track logout modal state');
      assert.ok(sidebarCode.includes('setShowLogoutModal(true)'), 'AppSidebar must open logout modal on action click');
      assert.ok(sidebarCode.includes('<LogoutModal'), 'AppSidebar must mount LogoutModal');
    });

    test('4.3 Trigger 3: Hub Profil (/profil) contains logout modal trigger', () => {
      const profilCode = readSourceFile('app/profil/page.tsx');
      assert.ok(profilCode.includes('showLogoutModal'), 'Profil page must track logout modal state');
      assert.ok(profilCode.includes('setShowLogoutModal(true)'), 'Profil page must open logout modal on action click');
      assert.ok(profilCode.includes('<LogoutModal'), 'Profil page must mount LogoutModal');
    });

    test('4.4 Trigger 4: Settings (/pengaturan) contains logout modal trigger', () => {
      const settingsCode = readSourceFile('app/pengaturan/page.tsx');
      assert.ok(settingsCode.includes('showLogoutModal'), 'Settings page must track logout modal state');
      assert.ok(settingsCode.includes('setShowLogoutModal(true)'), 'Settings page must open logout modal on action click');
      assert.ok(settingsCode.includes('<LogoutModal'), 'Settings page must mount LogoutModal');
    });

    test('4.5 LogoutModal behavior: Warns about shared school lab devices and directs to landing page', () => {
      const logoutModalCode = readSourceFile('components/common/LogoutModal.tsx');
      assert.ok(
        logoutModalCode.includes('Keluar dari NEXALORA?') || logoutModalCode.includes('Keluar dari CobaDulu?'),
        'Modal title must be clear'
      );
      assert.ok(
        logoutModalCode.includes('komputer bersama di sekolah') || logoutModalCode.includes('perpustakaan atau lab'),
        'Modal must explain shared-device school lab protection'
      );
      assert.ok(logoutModalCode.includes("router.push('/')"), 'Confirming logout must redirect to landing page (/)');
    });

    test('4.6 Storage purge verification: Storage is wiped and passport snapshots cleared on logout()', () => {
      const state = createAppState(seed);

      // Populate sensitive student state
      state.setUserContext({ namaPanggilan: 'Rani', kelas: 'XII', tahunKelulusan: 2026 });
      state.setPreferences({ domisili: 'Kota Bandung', bersediaRelokasi: false, rentangAnggaranMax: 15000000, rencanaTempatTinggal: 'kost' });
      state.addPassportSnapshot({
        id: 'snap-1',
        nomorSnapshot: 'SNAP-2026-RANI-01',
        tanggalDibuat: '2026-10-16',
        namaSiswa: 'Rani',
        kelas: 'XII',
        sertakanNilaiRapor: true,
        sertakanAnggaranBiaya: true,
        sertakanRefleksiSensitif: true,
        prodiTerpilih: ['informatika-univ-a'],
        misiSelesai: ['misi-informatika'],
        catatanDiskusiBK: 'Catatan konsultasi privat',
      });

      assert.equal(state.passportSnapshots.length, 1);
      assert.equal(state.userContext.namaPanggilan, 'Rani');

      // Execute logout
      state.logout();

      // Verify thorough wiping
      assert.equal(state.userContext.namaPanggilan, 'Siswa', 'Student personal name must be reset');
      assert.equal(state.preferences.domisili, '', 'Domisili must be cleared');
      assert.equal(state.passportSnapshots.length, 0, 'Passport snapshots must be wiped');
      assert.equal(Object.keys(state.missionSubmissions).length, 0, 'Submissions must be wiped');
      assert.equal(Object.keys(state.missionReflections).length, 0, 'Reflections must be wiped');
      assert.equal(state.bookmarkedMajorIds.length, 0, 'Bookmarks must be wiped');
      assert.equal(state.compareCartIds.length, 0, 'Compare cart must be wiped');
      assert.equal(state.localStorage.getItem('cobadulu_state_v1'), null, 'localStorage must be cleared');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 5: Complete JSON Data Sovereignty Export
  // -------------------------------------------------------------
  describe('Feature 5: Complete JSON Data Sovereignty Export', () => {
    test('5.1 Export schema completeness: Includes metadata and all domain state keys', () => {
      const state = createAppState(seed);
      const payload = state.generateExportPayload();

      const requiredKeys = [
        'metadata',
        'userContext',
        'preferences',
        'academic',
        'interestAnswers',
        'bookmarkedMajorIds',
        'compareCartIds',
        'missionSubmissions',
        'missionReflections',
        'passportSnapshots',
        'planTasks',
      ];

      for (const key of requiredKeys) {
        assert.ok(key in payload, `Export payload must contain ${key}`);
      }
    });

    test('5.2 Metadata verification: Includes platform identifier, ISO timestamp, and PRD version', () => {
      const state = createAppState(seed);
      const payload = state.generateExportPayload();

      assert.ok(
        payload.metadata.platform === 'NEXALORA Education Guidance Platform' || payload.metadata.platform === 'CobaDulu Education Guidance Platform',
        'Platform metadata must match brand'
      );
      assert.equal(payload.metadata.version, 'PRD v1.3');
      assert.ok(!isNaN(Date.parse(payload.metadata.exportDate)), 'exportDate must be a valid ISO string');
    });

    test('5.3 User context and preferences fidelity in exported JSON', () => {
      const state = createAppState(seed);
      state.setUserContext({ namaPanggilan: 'Budi', kelas: 'XI', tahunKelulusan: 2027 });
      state.setPreferences({ domisili: 'Surabaya', bersediaRelokasi: true, rentangAnggaranMax: 25000000, rencanaTempatTinggal: 'kost' });

      const payload = state.generateExportPayload();
      assert.equal(payload.userContext.namaPanggilan, 'Budi');
      assert.equal(payload.userContext.kelas, 'XI');
      assert.equal(payload.preferences.domisili, 'Surabaya');
      assert.equal(payload.preferences.rentangAnggaranMax, 25000000);
    });

    test('5.4 Plan tasks and task status preserved in export', () => {
      const state = createAppState(seed);
      state.updateTaskStatus('task-1', 'done');
      state.updateTaskStatus('task-2', 'doing');

      const payload = state.generateExportPayload();
      const task1 = payload.planTasks.find((t) => t.id === 'task-1');
      const task2 = payload.planTasks.find((t) => t.id === 'task-2');

      assert.equal(task1.status, 'done');
      assert.equal(task2.status, 'doing');
    });

    test('5.5 Valid serialization: Serializes cleanly without cyclic errors and parses back identically', () => {
      const state = createAppState(seed);
      const payload = state.generateExportPayload();

      const serialized = JSON.stringify(payload, null, 2);
      assert.ok(serialized.length > 500, 'Serialized JSON must contain structured content');

      const reParsed = JSON.parse(serialized);
      assert.deepEqual(reParsed, payload, 'Reparsed JSON must equal original export payload');
    });
  });
});
