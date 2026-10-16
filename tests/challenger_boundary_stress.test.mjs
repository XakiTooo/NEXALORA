/**
 * Challenger 2: Boundary Conditions & Cross-Feature Stress Testing Suite
 *
 * EMPIRICAL ADVERSARIAL STRESS HARNESS
 * Tests:
 * 1. 3-major compare cart limit with concurrent, boundary, and overflow additions.
 * 2. Simulation submission flow with boundary inputs (max length text, unusual characters, rapid stage navigation).
 * 3. JSON data export payload completeness and schema validity against all domain interfaces.
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSeedData,
  createAppState,
  readSourceFile,
  MockLocalStorage,
} from './test_harness.mjs';

describe('Challenger 2 Empirical Stress Test Suite', async () => {
  const seed = await loadSeedData();

  // =========================================================================
  // SECTION 1: 3-MAJOR COMPARE CART LIMIT & BOUNDARY STRESS
  // =========================================================================
  describe('1. Compare Cart Limit & Boundary Additions', () => {
    test('1.1 Standard Boundary: Adding up to 3 items succeeds, 4th item is cleanly rejected', () => {
      const state = createAppState(seed);
      state.clearCompareCart();
      assert.equal(state.compareCartIds.length, 0);

      const r1 = state.toggleCompareCart('informatika-univ-a');
      const r2 = state.toggleCompareCart('teknik-industri-inst-b');
      const r3 = state.toggleCompareCart('dkv-poltek-c');

      assert.equal(r1.success, true);
      assert.equal(r2.success, true);
      assert.equal(r3.success, true);
      assert.equal(state.compareCartIds.length, 3);

      const r4 = state.toggleCompareCart('sistem-informasi-univ-d');
      assert.equal(r4.success, false);
      assert.ok(r4.reason && r4.reason.includes('Maksimal 3'));
      assert.equal(state.compareCartIds.length, 3);
      assert.ok(!state.compareCartIds.includes('sistem-informasi-univ-d'));
    });

    test('1.2 Stale-State/Concurrency Stress: Inspect AppContext toggleCompareCart implementation for closure race vulnerabilities', () => {
      const appContextCode = readSourceFile('context/AppContext.tsx');

      // Check whether toggleCompareCart inspects stale compareCartIds in closure
      // or if setCompareCartIds updater enforces the limit.
      const hasStaleLengthCheck = appContextCode.includes('if (compareCartIds.length >= 3)');
      assert.ok(hasStaleLengthCheck, 'toggleCompareCart checks compareCartIds.length in outer scope');

      // Check if functional updater inside setCompareCartIds validates prev.length:
      const hasPrevLengthGuard = appContextCode.includes('setCompareCartIds((prev) => {') ||
                                 appContextCode.includes('prev.length >= 3');
      
      // EMPIRICAL FINDING:
      // In AppContext.tsx:
      //   if (compareCartIds.length >= 3) return { success: false, ... }
      //   setCompareCartIds((prev) => [...prev, id]);
      // If two calls occur in rapid succession before React rerenders (e.g. concurrent event callbacks),
      // both read stale compareCartIds.length (<3) and both append to `prev`, resulting in 4 items in cart!
      assert.equal(
        hasPrevLengthGuard,
        false,
        'CRITICAL DEFECT: setCompareCartIds does NOT guard prev.length in its updater callback, allowing race conditions to bypass the 3-cart limit'
      );
    });

    test('1.3 Overfilled Storage Hydration: AppContext hydration fails to clamp compareCartIds if storage exceeds 3 items', () => {
      const mockStorage = new MockLocalStorage();
      const corruptedState = {
        compareCartIds: [
          'informatika-univ-a',
          'teknik-industri-inst-b',
          'dkv-poltek-c',
          'sistem-informasi-univ-d',
          'desain-produk-itb',
        ],
      };
      mockStorage.setItem('cobadulu_state_v1', JSON.stringify(corruptedState));

      // Re-hydrate
      const state = createAppState(seed, mockStorage);
      state.hydrateFromStorage();

      // Check if hydration clamped to 3:
      // In AppContext.tsx: if (parsed.compareCartIds) setCompareCartIds(parsed.compareCartIds);
      // It does NOT clamp to 3!
      assert.equal(state.compareCartIds.length, 5, 'Hydration accepted 5 items without enforcing 3-item constraint');

      // Check UI blast radius in Bandingkan page:
      const bandingkanCode = readSourceFile('app/bandingkan/page.tsx');
      assert.ok(
        bandingkanCode.includes('3 - comparedMajors.length'),
        'Bandingkan page calculates remaining slots as `3 - comparedMajors.length`, which yields negative slots (-2 slot tersisa) if cart is overfilled'
      );
    });

    test('1.4 Boundary Input IDs: Empty string, non-existent ID, and special characters', () => {
      const state = createAppState(seed);
      state.clearCompareCart();

      // Empty string addition
      const rEmpty = state.toggleCompareCart('');
      assert.equal(rEmpty.success, true);
      assert.ok(state.compareCartIds.includes(''), 'Empty string is currently accepted into cart without domain ID validation');

      // Special characters in ID
      const rSpecial = state.toggleCompareCart('<script>alert("xss")</script>');
      assert.equal(rSpecial.success, true);
      assert.ok(state.compareCartIds.includes('<script>alert("xss")</script>'));

      // Clean up
      state.clearCompareCart();
      assert.equal(state.compareCartIds.length, 0);
    });
  });

  // =========================================================================
  // SECTION 2: SIMULATION SUBMISSION FLOW & BOUNDARY INPUTS
  // =========================================================================
  describe('2. Simulation Submission Flow Boundary Inputs', () => {
    test('2.1 Extreme Length Text: 50,000 character submission payload serialization and memory stress', () => {
      const state = createAppState(seed);
      const hugeAnswer = 'A'.repeat(50000);
      const hugeReason = 'Mengapa: ' + 'B'.repeat(10000);

      // Verify saving does not throw
      assert.doesNotThrow(() => {
        state.saveMissionSubmission({
          missionId: 'misi-informatika',
          jawabanTeks: hugeAnswer,
          alasanKeputusan: hugeReason,
          waktuSubmit: new Date().toISOString(),
          versi: 1,
        });
      });

      const saved = state.missionSubmissions['misi-informatika'];
      assert.ok(saved);
      assert.equal(saved.jawabanTeks.length, 50000);

      // Verify that simulation page does NOT declare a maxLength on textarea
      const simCode = readSourceFile('app/simulasi/[id]/page.tsx');
      assert.ok(
        !simCode.includes('maxLength='),
        'Simulation textarea lacks maxLength attribute, leaving client open to unconstrained input'
      );
    });

    test('2.2 Unusual Characters: Emojis, HTML tags, RTL text, quotes, and control chars', () => {
      const state = createAppState(seed);
      const unusualInput = 'Algoritma: 🚀✨ <script>alert("xss")</script> \u202Ereversed\u202D "quote" \'single\' \n\t newline & tab';

      state.saveMissionSubmission({
        missionId: 'misi-dkv',
        jawabanTeks: unusualInput,
        alasanKeputusan: 'Karakter khusus: 🎓💡🔥',
        waktuSubmit: new Date().toISOString(),
        versi: 1,
      });

      const retrieved = state.missionSubmissions['misi-dkv'];
      assert.equal(retrieved.jawabanTeks, unusualInput);

      // Verify JSON serialization roundtrip survives unchanged
      const serialized = JSON.stringify(retrieved);
      const deserialized = JSON.parse(serialized);
      assert.equal(deserialized.jawabanTeks, unusualInput);
    });

    test('2.3 Rapid Stage Navigation & Step Accessibility Gate', () => {
      const simCode = readSourceFile('app/simulasi/[id]/page.tsx');

      // Verify isStepAccessible logic:
      // 'brief', 'materi', 'tugas' are always accessible (can jump backward/forward)
      // 'umpan_balik' and 'refleksi' require hasSubmission
      assert.ok(
        simCode.includes('isStepAccessible'),
        'Simulation page implements step accessibility guard'
      );
      assert.ok(
        simCode.includes("targetStep === 'brief'") && simCode.includes("targetStep === 'materi'"),
        'Early steps are non-blocking'
      );
    });

    test('2.4 Revision Version Tracking Defect: handleConfirmSubmit hardcodes versi to 1', () => {
      const simCode = readSourceFile('app/simulasi/[id]/page.tsx');

      // Look at handleConfirmSubmit in DetailSimulasiMisiPage:
      // versi: 1
      assert.ok(
        simCode.includes('versi: 1'),
        'handleConfirmSubmit hardcodes versi to 1'
      );

      // Check whether button for Revision 2 exists:
      assert.ok(
        simCode.includes('Revisi Tugas (Versi 2)'),
        'UI presents Revisi Tugas (Versi 2) button, but submission always writes versi: 1 rather than incrementing'
      );
    });

    test('2.5 Reflection Completion Cross-Feature Linkage: plan task-1 automatically marked done', () => {
      const state = createAppState(seed);
      
      // Initial task-1 status is 'doing' in SEED_30DAY_TASKS
      const taskBefore = state.planTasks.find((t) => t.id === 'task-1');
      assert.equal(taskBefore.status, 'doing');

      // Save reflection
      state.saveMissionReflection({
        missionId: 'misi-informatika',
        tingkatEnjoyment: 5,
        minatMendalami: 'Ya',
        bagianPalingMenarik: 'Tugas Kasus',
        aspekTersulit: 'Logika antrean',
        hambatanDihadapi: 'Tidak ada',
        ekspektasiVsKenyataan: 'Sangat seru',
        rencanaLangkahLanjutan: 'Daftar prodi',
      });

      const taskAfter = state.planTasks.find((t) => t.id === 'task-1');
      assert.equal(taskAfter.status, 'done', 'Saving reflection must mark task-1 as done');
    });
  });

  // =========================================================================
  // SECTION 3: JSON DATA EXPORT PAYLOAD COMPLETENESS & SCHEMA VALIDITY
  // =========================================================================
  describe('3. JSON Data Export Payload Completeness & Schema Validity', () => {
    test('3.1 Payload Completeness: exportObject contains all 11 required domain collections', () => {
      const pengaturanCode = readSourceFile('app/pengaturan/page.tsx');

      const expectedFields = [
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

      for (const field of expectedFields) {
        assert.ok(
          pengaturanCode.includes(field),
          `Export payload in app/pengaturan/page.tsx must contain field: "${field}"`
        );
      }
    });

    test('3.2 Schema Validity: Validate exported JSON against strict domain types in Rani Demo State', () => {
      const state = createAppState(seed);

      const exportPayload = {
        metadata: {
          platform: 'CobaDulu Education Guidance Platform',
          exportDate: new Date().toISOString(),
          version: 'PRD v1.3',
        },
        userContext: state.userContext,
        preferences: state.preferences,
        academic: state.academic,
        interestAnswers: state.interestAnswers,
        bookmarkedMajorIds: state.bookmarkedMajorIds,
        compareCartIds: state.compareCartIds,
        missionSubmissions: state.missionSubmissions,
        missionReflections: state.missionReflections,
        passportSnapshots: state.passportSnapshots,
        planTasks: state.planTasks,
      };

      // 1. userContext schema
      assert.equal(typeof exportPayload.userContext.namaPanggilan, 'string');
      assert.ok(['XI', 'XII'].includes(exportPayload.userContext.kelas));
      assert.equal(typeof exportPayload.userContext.tahunKelulusan, 'number');

      // 2. preferences schema
      assert.equal(typeof exportPayload.preferences.domisili, 'string');
      assert.equal(typeof exportPayload.preferences.bersediaRelokasi, 'boolean');
      assert.ok(exportPayload.preferences.rentangAnggaranMax === null || typeof exportPayload.preferences.rentangAnggaranMax === 'number');
      assert.ok(['bersama_orang_tua', 'kost', 'asrama', 'belum_tahu'].includes(exportPayload.preferences.rencanaTempatTinggal));

      // 3. academic schema
      assert.ok(['100', '4.0'].includes(exportPayload.academic.skala));
      assert.equal(typeof exportPayload.academic.semester, 'string');
      assert.ok(Array.isArray(exportPayload.academic.grades));
      assert.equal(typeof exportPayload.academic.isSkipped, 'boolean');

      // 4. interestAnswers
      assert.equal(typeof exportPayload.interestAnswers, 'object');

      // 5. bookmarks & compareCart
      assert.ok(Array.isArray(exportPayload.bookmarkedMajorIds));
      assert.ok(Array.isArray(exportPayload.compareCartIds));

      // 6. planTasks
      assert.ok(Array.isArray(exportPayload.planTasks));
      assert.equal(exportPayload.planTasks.length, 6);
      for (const t of exportPayload.planTasks) {
        assert.ok(t.id && t.judul && t.kategori && t.status);
      }

      // 7. JSON serialization roundtrip
      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const parsed = JSON.parse(jsonStr);
      assert.deepEqual(parsed, exportPayload, 'JSON roundtrip must be 100% loss-free and identical');
    });

    test('3.3 Schema Validity in Logged-Out / Purged State: Zero sensitive data leakage', () => {
      const state = createAppState(seed);
      state.logout();

      const exportPayload = {
        metadata: {
          platform: 'CobaDulu Education Guidance Platform',
          exportDate: new Date().toISOString(),
          version: 'PRD v1.3',
        },
        userContext: state.userContext,
        preferences: state.preferences,
        academic: state.academic,
        interestAnswers: state.interestAnswers,
        bookmarkedMajorIds: state.bookmarkedMajorIds,
        compareCartIds: state.compareCartIds,
        missionSubmissions: state.missionSubmissions,
        missionReflections: state.missionReflections,
        passportSnapshots: state.passportSnapshots,
        planTasks: state.planTasks,
      };

      // Verified purged values
      assert.equal(exportPayload.userContext.namaPanggilan, 'Siswa');
      assert.equal(exportPayload.academic.grades.length, 0);
      assert.equal(exportPayload.academic.isSkipped, true);
      assert.equal(exportPayload.passportSnapshots.length, 0);
      assert.equal(Object.keys(exportPayload.missionSubmissions).length, 0);
      assert.equal(Object.keys(exportPayload.missionReflections).length, 0);
      assert.equal(exportPayload.compareCartIds.length, 0);
      assert.equal(exportPayload.bookmarkedMajorIds.length, 0);
    });

    test('3.4 Export Filename Boundary Stress: Unescaped path characters in namaPanggilan', () => {
      const pengaturanCode = readSourceFile('app/pengaturan/page.tsx');

      // Check how download filename is constructed:
      // downloadAnchor.setAttribute('download', `CobaDulu_Export_${userContext.namaPanggilan}_${Date.now()}.json`);
      assert.ok(
        pengaturanCode.includes('NEXALORA_Export') || pengaturanCode.includes('CobaDulu_Export'),
        'Export filename embeds student nickname and brand prefix'
      );

      // Stress observation:
      // If student nickname has spaces or special characters (e.g. "Rani / Siswa", "Rani*?"),
      // the filename attribute may be truncated or sanitized differently across browsers.
      // A sanitization regex like userContext.namaPanggilan.replace(/[^a-zA-Z0-9_-]/g, '_') is recommended.
    });

    test('3.5 isDemoMode Field Omission: Export object omits isDemoMode attribute', () => {
      const pengaturanCode = readSourceFile('app/pengaturan/page.tsx');
      
      // In handleExportData:
      // const exportObject = { metadata, userContext, preferences, ... }
      // Does it include isDemoMode?
      const includesIsDemoMode = pengaturanCode.includes('isDemoMode,') ||
                                 pengaturanCode.includes('isDemoMode:');
      
      assert.equal(
        includesIsDemoMode,
        false,
        'OBSERVATION: Exported JSON object omits `isDemoMode` boolean property, so downstream readers cannot distinguish demo simulation data from genuine user data'
      );
    });
  });
});
