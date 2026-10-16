/**
 * CobaDulu Test Harness & Domain Utilities
 * Provides seed data loading, state store simulation, filesystem route inspection,
 * mock localStorage, and validation helpers for Tiers 1-4 test suites.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * In-memory Mock LocalStorage
 */
export class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  get length() {
    return this.store.size;
  }

  key(index) {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }
}

/**
 * Transpiles and loads SEED data from src/lib/data/seed.ts
 */
let cachedSeedData = null;

export async function loadSeedData() {
  if (cachedSeedData) return cachedSeedData;

  const seedFilePath = path.join(PROJECT_ROOT, 'src', 'lib', 'data', 'seed.ts');
  const rawCode = fs.readFileSync(seedFilePath, 'utf8');

  // Transpile TypeScript to ES Module, stripping types
  const transpiled = ts.transpileModule(rawCode, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  const moduleUrl = 'data:text/javascript,' + encodeURIComponent(transpiled.outputText);
  const seedModule = await import(moduleUrl);

  cachedSeedData = {
    SEED_INTEREST_QUESTIONS: seedModule.SEED_INTEREST_QUESTIONS,
    SEED_MAJORS: seedModule.SEED_MAJORS,
    SEED_MISSIONS: seedModule.SEED_MISSIONS,
    SEED_CAREERS: seedModule.SEED_CAREERS,
    SEED_30DAY_TASKS: seedModule.SEED_30DAY_TASKS,
    DEMO_PRESET_RANI: seedModule.DEMO_PRESET_RANI,
  };

  return cachedSeedData;
}

/**
 * Creates an AppState machine faithfully modeling AppContext.tsx
 */
export function createAppState(seedData, customLocalStorage = null) {
  const localStorage = customLocalStorage || new MockLocalStorage();
  const STORAGE_KEY = 'cobadulu_state_v1';

  // State properties
  let isDemoMode = true;
  let userContext = JSON.parse(JSON.stringify(seedData.DEMO_PRESET_RANI.context));
  let preferences = JSON.parse(JSON.stringify(seedData.DEMO_PRESET_RANI.preferences));
  let academic = JSON.parse(JSON.stringify(seedData.DEMO_PRESET_RANI.academic));
  let interestAnswers = { 1: 5, 2: 4, 3: 3 };
  let bookmarkedMajorIds = ['informatika-univ-a'];
  let compareCartIds = ['informatika-univ-a', 'teknik-industri-inst-b'];
  let missionSubmissions = {};
  let missionReflections = {};
  let planTasks = JSON.parse(JSON.stringify(seedData.SEED_30DAY_TASKS));
  let passportSnapshots = [];

  const syncToStorage = () => {
    try {
      const stateToSave = {
        isDemoMode,
        userContext,
        preferences,
        academic,
        interestAnswers,
        bookmarkedMajorIds,
        compareCartIds,
        missionSubmissions,
        missionReflections,
        planTasks,
        passportSnapshots,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  };

  const hydrateFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userContext) userContext = parsed.userContext;
        if (parsed.preferences) preferences = parsed.preferences;
        if (parsed.academic) academic = parsed.academic;
        if (parsed.interestAnswers) interestAnswers = parsed.interestAnswers;
        if (parsed.bookmarkedMajorIds) bookmarkedMajorIds = parsed.bookmarkedMajorIds;
        if (parsed.compareCartIds) compareCartIds = parsed.compareCartIds;
        if (parsed.missionSubmissions) missionSubmissions = parsed.missionSubmissions;
        if (parsed.missionReflections) missionReflections = parsed.missionReflections;
        if (parsed.planTasks) planTasks = parsed.planTasks;
        if (parsed.passportSnapshots) passportSnapshots = parsed.passportSnapshots;
        if (typeof parsed.isDemoMode === 'boolean') isDemoMode = parsed.isDemoMode;
      }
    } catch {
      // ignore
    }
  };

  const toggleBookmark = (id) => {
    if (bookmarkedMajorIds.includes(id)) {
      bookmarkedMajorIds = bookmarkedMajorIds.filter((item) => item !== id);
    } else {
      bookmarkedMajorIds = [...bookmarkedMajorIds, id];
    }
    syncToStorage();
  };

  const toggleCompareCart = (id) => {
    if (compareCartIds.includes(id)) {
      compareCartIds = compareCartIds.filter((item) => item !== id);
      syncToStorage();
      return { success: true };
    }
    if (compareCartIds.length >= 3) {
      return {
        success: false,
        reason: 'Maksimal 3 program studi dapat dibandingkan secara bersamaan. Hapus salah satu terlebih dahulu.',
      };
    }
    compareCartIds = [...compareCartIds, id];
    syncToStorage();
    return { success: true };
  };

  const removeFromCompareCart = (id) => {
    compareCartIds = compareCartIds.filter((item) => item !== id);
    syncToStorage();
  };

  const clearCompareCart = () => {
    compareCartIds = [];
    syncToStorage();
  };

  const saveMissionSubmission = (sub) => {
    missionSubmissions = {
      ...missionSubmissions,
      [sub.missionId]: sub,
    };
    syncToStorage();
  };

  const saveMissionReflection = (ref) => {
    missionReflections = {
      ...missionReflections,
      [ref.missionId]: ref,
    };
    // Auto-update task-1 in 30-day plan when mission completed (PROJECT.md R1 Feature 4)
    planTasks = planTasks.map((t) => (t.id === 'task-1' ? { ...t, status: 'done' } : t));
    syncToStorage();
  };

  const updateTaskStatus = (taskId, status) => {
    planTasks = planTasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    syncToStorage();
  };

  const addPassportSnapshot = (snapshot) => {
    passportSnapshots = [snapshot, ...passportSnapshots];
    syncToStorage();
  };

  const resetDemoData = () => {
    userContext = JSON.parse(JSON.stringify(seedData.DEMO_PRESET_RANI.context));
    preferences = JSON.parse(JSON.stringify(seedData.DEMO_PRESET_RANI.preferences));
    academic = JSON.parse(JSON.stringify(seedData.DEMO_PRESET_RANI.academic));
    interestAnswers = { 1: 5, 2: 4, 3: 3 };
    bookmarkedMajorIds = ['informatika-univ-a'];
    compareCartIds = ['informatika-univ-a', 'teknik-industri-inst-b'];
    missionSubmissions = {};
    missionReflections = {};
    planTasks = JSON.parse(JSON.stringify(seedData.SEED_30DAY_TASKS));
    passportSnapshots = [];
    isDemoMode = true;
    localStorage.removeItem(STORAGE_KEY);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    userContext = {
      namaPanggilan: 'Siswa',
      kelas: 'XII',
      tahunKelulusan: 2026,
    };
    preferences = {
      domisili: '',
      bersediaRelokasi: true,
      rentangAnggaranMax: null,
      rencanaTempatTinggal: 'belum_tahu',
    };
    academic = {
      skala: '100',
      semester: 'Semester 1–4',
      grades: [],
      isSkipped: true,
    };
    interestAnswers = {};
    bookmarkedMajorIds = [];
    compareCartIds = [];
    missionSubmissions = {};
    missionReflections = {};
    passportSnapshots = [];
    planTasks = JSON.parse(JSON.stringify(seedData.SEED_30DAY_TASKS));
    isDemoMode = true;
  };

  const generateExportPayload = () => {
    return {
      metadata: {
        platform: 'NEXALORA Education Guidance Platform',
        exportDate: new Date().toISOString(),
        version: 'PRD v1.3',
      },
      userContext,
      preferences,
      academic,
      interestAnswers,
      bookmarkedMajorIds,
      compareCartIds,
      missionSubmissions,
      missionReflections,
      passportSnapshots,
      planTasks,
    };
  };

  return {
    get isDemoMode() { return isDemoMode; },
    get userContext() { return userContext; },
    setUserContext: (val) => { userContext = typeof val === 'function' ? val(userContext) : val; syncToStorage(); },
    get preferences() { return preferences; },
    setPreferences: (val) => { preferences = typeof val === 'function' ? val(preferences) : val; syncToStorage(); },
    get academic() { return academic; },
    setAcademic: (val) => { academic = typeof val === 'function' ? val(academic) : val; syncToStorage(); },
    get interestAnswers() { return interestAnswers; },
    get bookmarkedMajorIds() { return bookmarkedMajorIds; },
    get compareCartIds() { return compareCartIds; },
    get missionSubmissions() { return missionSubmissions; },
    get missionReflections() { return missionReflections; },
    get planTasks() { return planTasks; },
    get passportSnapshots() { return passportSnapshots; },
    get localStorage() { return localStorage; },
    toggleBookmark,
    toggleCompareCart,
    removeFromCompareCart,
    clearCompareCart,
    saveMissionSubmission,
    saveMissionReflection,
    updateTaskStatus,
    addPassportSnapshot,
    resetDemoData,
    logout,
    syncToStorage,
    hydrateFromStorage,
    generateExportPayload,
  };
}

/**
 * Returns all 22 App Router routes in src/app
 */
export function getAppRouterRoutes() {
  const appDir = path.join(PROJECT_ROOT, 'src', 'app');
  const routes = [];

  function scan(dir, baseRoute = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), `${baseRoute}/${entry.name}`);
      } else if (entry.name === 'page.tsx') {
        routes.push({
          route: baseRoute === '' ? '/' : baseRoute,
          filePath: path.join(dir, entry.name),
          type: 'page',
        });
      } else if (entry.name === 'not-found.tsx') {
        routes.push({
          route: '/_not-found',
          filePath: path.join(dir, entry.name),
          type: 'not-found',
        });
      }
    }
  }

  scan(appDir);
  return routes;
}

/**
 * Reads any source file from src/
 */
export function readSourceFile(relativePath) {
  const fullPath = path.join(PROJECT_ROOT, 'src', relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}
