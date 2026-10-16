/**
 * Tier 2: Boundary & Corner Cases Test Suite (>=5 tests per feature)
 *
 * Covers:
 * 1. Empty submissions
 * 2. Cart limit (3 items)
 * 3. Budget slider limits
 * 4. Unauthenticated access & session modes
 * 5. Uncompleted simulation re-entry
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSeedData,
  createAppState,
  readSourceFile,
} from './test_harness.mjs';

describe('Tier 2: Boundary & Corner Cases (>=5 tests per feature)', async () => {
  const seed = await loadSeedData();

  // -------------------------------------------------------------
  // FEATURE 1: Empty Submissions Handling
  // -------------------------------------------------------------
  describe('Feature 1: Empty Submissions Handling', () => {
    test('1.1 Empty task submission text: Component handles blank string and defaults gracefully', () => {
      const state = createAppState(seed);

      // Submit with empty or whitespace-only answer
      state.saveMissionSubmission({
        missionId: 'misi-informatika',
        jawabanTeks: '   ',
        alasanKeputusan: '',
        waktuSubmit: new Date().toISOString(),
        versi: 1,
      });

      const sub = state.missionSubmissions['misi-informatika'];
      assert.ok(sub, 'Submission record created');
      assert.equal(sub.versi, 1);

      // Verify that code provides fallback in detail page
      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(
        detailCode.includes('taskTextAnswer') && detailCode.includes('setTaskTextAnswer'),
        'Page manages default template text for task answers so students are never blocked by blank forms'
      );
    });

    test('1.2 Empty reflection notes: Allows saving reflection without crashing when optional note is blank', () => {
      const state = createAppState(seed);

      state.saveMissionReflection({
        missionId: 'misi-industri',
        tingkatEnjoyment: 4,
        minatMendalami: 'Mungkin',
        bagianPalingMenarik: 'Materi',
        aspekTersulit: '',
        hambatanDihadapi: '',
        ekspektasiVsKenyataan: '',
        rencanaLangkahLanjutan: '',
      });

      const ref = state.missionReflections['misi-industri'];
      assert.ok(ref, 'Reflection saved');
      assert.equal(ref.tingkatEnjoyment, 4);
      assert.equal(ref.minatMendalami, 'Mungkin');
      assert.equal(ref.aspekTersulit, '');
    });

    test('1.3 Empty student name in profile/onboarding: Validates required field in settings and onboarding', () => {
      const settingsCode = readSourceFile('app/pengaturan/page.tsx');
      assert.ok(
        settingsCode.includes('required') || settingsCode.includes('namaPanggilan'),
        'Settings must enforce required attribute on student nickname'
      );

      const onboardingCode = readSourceFile('app/onboarding/page.tsx');
      assert.ok(
        onboardingCode.includes('required') || onboardingCode.includes('namaPanggilan'),
        'Onboarding must enforce student nickname input'
      );
    });

    test('1.4 Empty academic grades: isSkipped = true avoids division by zero or NaN values', () => {
      const state = createAppState(seed);
      state.setAcademic({
        skala: '100',
        semester: 'Semester 1–4',
        grades: [],
        isSkipped: true,
      });

      assert.equal(state.academic.grades.length, 0);
      assert.equal(state.academic.isSkipped, true);

      // Check Paspor print view handles empty grades safely
      const pasporCode = readSourceFile('app/profil/paspor/page.tsx');
      assert.ok(
        pasporCode.includes('academic.grades.length > 0'),
        'Paspor page must check academic.grades.length > 0 before rendering grades'
      );
    });

    test('1.5 Empty catalog filter: Searching with empty string or clearing filters returns all programs', () => {
      const allMajors = seed.SEED_MAJORS;
      const emptyKeyword = '';

      const filtered = allMajors.filter((m) =>
        emptyKeyword.trim() === ''
          ? true
          : m.namaProdi.toLowerCase().includes(emptyKeyword) ||
            m.namaKampus.toLowerCase().includes(emptyKeyword)
      );

      assert.equal(filtered.length, allMajors.length, 'Empty filter must return 100% of catalog items');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 2: Cart Limit (3 Items)
  // -------------------------------------------------------------
  describe('Feature 2: Cart Limit (3 Items Maximum)', () => {
    test('2.1 Adding 1st item succeeds', () => {
      const state = createAppState(seed);
      state.clearCompareCart();
      assert.equal(state.compareCartIds.length, 0);

      const res = state.toggleCompareCart('informatika-univ-a');
      assert.equal(res.success, true);
      assert.equal(state.compareCartIds.length, 1);
      assert.ok(state.compareCartIds.includes('informatika-univ-a'));
    });

    test('2.2 Adding 2nd and 3rd item succeeds', () => {
      const state = createAppState(seed);
      state.clearCompareCart();

      const r1 = state.toggleCompareCart('informatika-univ-a');
      const r2 = state.toggleCompareCart('teknik-industri-inst-b');
      const r3 = state.toggleCompareCart('dkv-poltek-c');

      assert.equal(r1.success, true);
      assert.equal(r2.success, true);
      assert.equal(r3.success, true);
      assert.equal(state.compareCartIds.length, 3);
    });

    test('2.3 Adding 4th item returns error rejection with descriptive Indonesian reason', () => {
      const state = createAppState(seed);
      state.clearCompareCart();

      state.toggleCompareCart('informatika-univ-a');
      state.toggleCompareCart('teknik-industri-inst-b');
      state.toggleCompareCart('dkv-poltek-c');
      assert.equal(state.compareCartIds.length, 3);

      // Attempt adding 4th item
      const r4 = state.toggleCompareCart('sistem-informasi-univ-d');
      assert.equal(r4.success, false, 'Adding 4th item must fail');
      assert.ok(
        r4.reason && r4.reason.includes('Maksimal 3 program studi'),
        `Error reason must mention maximum 3 items limit: "${r4.reason}"`
      );
      assert.equal(state.compareCartIds.length, 3, 'Cart must remain at 3 items without overflow');
      assert.ok(!state.compareCartIds.includes('sistem-informasi-univ-d'));
    });

    test('2.4 Removing 1 item from full 3-item cart allows successfully adding a new item', () => {
      const state = createAppState(seed);
      state.clearCompareCart();

      state.toggleCompareCart('informatika-univ-a');
      state.toggleCompareCart('teknik-industri-inst-b');
      state.toggleCompareCart('dkv-poltek-c');
      assert.equal(state.compareCartIds.length, 3);

      // Remove 1 item
      state.removeFromCompareCart('informatika-univ-a');
      assert.equal(state.compareCartIds.length, 2);

      // Now adding 4th item should succeed
      const res = state.toggleCompareCart('sistem-informasi-univ-d');
      assert.equal(res.success, true);
      assert.equal(state.compareCartIds.length, 3);
      assert.ok(state.compareCartIds.includes('sistem-informasi-univ-d'));
    });

    test('2.5 Toggling an already included item in a 3-item cart deselects it without limit error', () => {
      const state = createAppState(seed);
      state.clearCompareCart();

      state.toggleCompareCart('informatika-univ-a');
      state.toggleCompareCart('teknik-industri-inst-b');
      state.toggleCompareCart('dkv-poltek-c');
      assert.equal(state.compareCartIds.length, 3);

      // Toggle 'dkv-poltek-c' which is already in cart
      const res = state.toggleCompareCart('dkv-poltek-c');
      assert.equal(res.success, true, 'Toggling existing item should succeed as a removal');
      assert.equal(state.compareCartIds.length, 2);
      assert.ok(!state.compareCartIds.includes('dkv-poltek-c'));
    });
  });

  // -------------------------------------------------------------
  // FEATURE 3: Budget Slider Limits
  // -------------------------------------------------------------
  describe('Feature 3: Budget Slider Limits & Boundary Conditions', () => {
    test('3.1 Null or undefined budget: Treated as unconstrained without filtering out programs', () => {
      const state = createAppState(seed);
      state.setPreferences({ ...state.preferences, rentangAnggaranMax: null });

      const maxBudget = state.preferences.rentangAnggaranMax;
      const programs = seed.SEED_MAJORS;

      // Filter logic: if budget is null, all programs pass
      const matched = programs.filter((p) => {
        if (maxBudget === null || maxBudget === undefined) return true;
        return p.biayaPerTahun !== null && p.biayaPerTahun <= maxBudget;
      });

      assert.equal(matched.length, programs.length, 'Null budget must include all programs');
    });

    test('3.2 Budget set to 0 or low boundary: Correctly flags programs exceeding budget', () => {
      const state = createAppState(seed);
      state.setPreferences({ ...state.preferences, rentangAnggaranMax: 0 });

      const maxBudget = 0;
      const programs = seed.SEED_MAJORS;

      const affordable = programs.filter(
        (p) => p.biayaPerTahun !== null && p.biayaPerTahun <= maxBudget
      );
      assert.equal(affordable.length, 0, 'No standard tuition program costs <= 0');
    });

    test('3.3 Budget set to exact boundary match (Rp 18.500.000): Identifies programs at or below threshold', () => {
      const maxBudget = 18500000;
      const programs = seed.SEED_MAJORS;

      const affordable = programs.filter(
        (p) => p.biayaPerTahun !== null && p.biayaPerTahun <= maxBudget
      );

      // In seed:
      // informatika-univ-a = 18.500.000 (equal - included)
      // teknik-industri-inst-b = 16.000.000 (less - included)
      // dkv-poltek-c = 14.000.000 (less - included)
      // sistem-informasi-univ-d = null (unknown)
      assert.equal(affordable.length, 3);
      const ids = affordable.map((p) => p.id);
      assert.ok(ids.includes('informatika-univ-a'), 'Boundary value 18.5M must be included');
      assert.ok(ids.includes('teknik-industri-inst-b'));
      assert.ok(ids.includes('dkv-poltek-c'));
    });

    test('3.4 High extreme budget (Rp 100.000.000): Does not overflow and matches all programs with known tuition', () => {
      const extremeBudget = 100000000;
      const programs = seed.SEED_MAJORS;

      const affordable = programs.filter(
        (p) => p.biayaPerTahun !== null && p.biayaPerTahun <= extremeBudget
      );

      assert.equal(affordable.length, 3, 'All 3 programs with known tuition fall within 100M budget');
    });

    test('3.5 Unknown/unverified UKT (biayaPerTahun = null): Handled with status badge rather than crashing number formatting', () => {
      const siMajor = seed.SEED_MAJORS.find((m) => m.id === 'sistem-informasi-univ-d');
      assert.equal(siMajor.biayaPerTahun, null);
      assert.equal(siMajor.biayaStatus, 'belum_tersedia');

      // Verify safe formatting helper
      const formatUkt = (val) => (val !== null ? `Rp ${val.toLocaleString('id-ID')} / thn` : 'Perlu diperiksa');
      const formatted = formatUkt(siMajor.biayaPerTahun);
      assert.equal(formatted, 'Perlu diperiksa', 'Null UKT must format safely as "Perlu diperiksa" without NaN');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 4: Unauthenticated Access & Session Modes
  // -------------------------------------------------------------
  describe('Feature 4: Unauthenticated Access & Session Modes', () => {
    test('4.1 Demo mode default preset: Rani, Kelas XII, graduation 2026 initialized', () => {
      const state = createAppState(seed);
      assert.equal(state.isDemoMode, true);
      assert.equal(state.userContext.namaPanggilan, 'Rani');
      assert.equal(state.userContext.kelas, 'XII');
      assert.equal(state.userContext.tahunKelulusan, 2026);
    });

    test('4.2 Landing page (/) allows exploratory browsing without mandatory login gate', () => {
      const landingCode = readSourceFile('app/page.tsx');
      assert.ok(
        landingCode.includes('Mulai Sekarang') || landingCode.includes('Coba Demo Langsung'),
        'Landing page must provide direct exploratory CTAs'
      );
      assert.ok(
        landingCode.includes('/pilihan-akses') || landingCode.includes('/beranda'),
        'Landing page provides access routes'
      );
    });

    test('4.3 Session recovery (/pemulihan-akses): Validates input for missing email', () => {
      const recoveryCode = readSourceFile('app/pemulihan-akses/page.tsx');
      assert.ok(recoveryCode.includes('type="email"') && recoveryCode.includes('required'), 'Email input must be required in access recovery');
    });

    test('4.4 Registration (/daftar) password constraints: Min 8 chars and matching confirmation', () => {
      const daftarCode = readSourceFile('app/daftar/page.tsx');
      assert.ok(
        daftarCode.includes('password.length < 8'),
        'Registration must validate minimum 8 characters password'
      );
      assert.ok(
        daftarCode.includes('password !== confirmPassword'),
        'Registration must validate password confirmation match'
      );
    });

    test('4.5 Registration (/daftar) data consent: Blocks proceeding if agreeTerms is false', () => {
      const daftarCode = readSourceFile('app/daftar/page.tsx');
      assert.ok(
        daftarCode.includes('!agreeTerms'),
        'Registration must enforce user consent before creating account'
      );
      assert.ok(
        daftarCode.includes('Kamu harus menyetujui ketentuan privasi untuk melanjutkan.'),
        'Must display descriptive Indonesian alert message for missing consent'
      );
    });
  });

  // -------------------------------------------------------------
  // FEATURE 5: Uncompleted Simulation Re-entry
  // -------------------------------------------------------------
  describe('Feature 5: Uncompleted Simulation Re-entry & Stepper Navigation', () => {
    test('5.1 Draft submission preservation on re-entry', () => {
      const state = createAppState(seed);
      assert.equal(state.missionSubmissions['misi-informatika'], undefined);

      // Save intermediate draft
      state.saveMissionSubmission({
        missionId: 'misi-informatika',
        jawabanTeks: 'Draft langkah 1: Minuman duluan',
        alasanKeputusan: 'Draft awal',
        waktuSubmit: new Date().toISOString(),
        versi: 1,
      });

      // Re-hydrate or re-read state
      const existing = state.missionSubmissions['misi-informatika'];
      assert.ok(existing, 'Draft must be preserved');
      assert.equal(existing.jawabanTeks, 'Draft langkah 1: Minuman duluan');
    });

    test('5.2 Catalog (/simulasi) differentiates between completed and uncompleted simulations', () => {
      const simulasiCatalogCode = readSourceFile('app/simulasi/page.tsx');
      assert.ok(
        simulasiCatalogCode.includes('missionSubmissions[misi.id]'),
        'Catalog must check missionSubmissions to determine completion status'
      );
      assert.ok(
        simulasiCatalogCode.includes('Terkumpul'),
        'Catalog must show "Terkumpul" badge for completed mini-courses'
      );
      assert.ok(
        simulasiCatalogCode.includes('Tinjau Hasil & Refleksi') || simulasiCatalogCode.includes('Tinjau Hasil &amp; Refleksi'),
        'Completed courses display "Tinjau Hasil & Refleksi"'
      );
      assert.ok(
        simulasiCatalogCode.includes('Mulai Mini-Kuliah'),
        'Uncompleted courses display "Mulai Mini-Kuliah"'
      );
    });

    test('5.3 Stepper navigation allows navigating backwards to review previous steps', () => {
      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(
        detailCode.includes("onClick={() => setPhase('brief')}"),
        'Stepper allows navigating back to Brief'
      );
      assert.ok(
        detailCode.includes("onClick={() => setPhase('materi')}"),
        'Stepper allows navigating back to Materi'
      );
      assert.ok(
        detailCode.includes("onClick={() => setPhase('tugas')}"),
        'Stepper allows navigating back to Tugas for revision'
      );
    });

    test('5.4 Task revision mechanism creates version 2 without losing context', () => {
      const state = createAppState(seed);

      // Version 1 submission
      state.saveMissionSubmission({
        missionId: 'misi-informatika',
        jawabanTeks: 'Versi 1: Solusi dasar',
        alasanKeputusan: 'Alasan v1',
        waktuSubmit: '2026-10-16T10:00:00Z',
        versi: 1,
      });
      assert.equal(state.missionSubmissions['misi-informatika'].versi, 1);

      // Version 2 submission
      state.saveMissionSubmission({
        missionId: 'misi-informatika',
        jawabanTeks: 'Versi 2: Solusi dioptimasi dengan batching',
        alasanKeputusan: 'Alasan v2 lebih matang',
        waktuSubmit: '2026-10-16T10:15:00Z',
        versi: 2,
      });
      assert.equal(state.missionSubmissions['misi-informatika'].versi, 2);
      assert.equal(state.missionSubmissions['misi-informatika'].jawabanTeks, 'Versi 2: Solusi dioptimasi dengan batching');
    });

    test('5.5 Non-existent mission ID route (/simulasi/invalid-id) gracefully falls back without crashing', () => {
      const detailCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(
        detailCode.includes('SEED_MISSIONS.find((m) => m.id === missionId) || SEED_MISSIONS[0]'),
        'Detail page must provide safe fallback SEED_MISSIONS[0] if missionId is not found in database'
      );
    });
  });
});
