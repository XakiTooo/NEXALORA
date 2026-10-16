'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserContext,
  PracticalPreferences,
  AcademicRecord,
  TaskSubmission,
  MissionReflection,
  PlanTaskItem,
  PassportSnapshot,
} from '@/types';
import {
  SEED_30DAY_TASKS,
  DEMO_PRESET_RANI,
} from '@/lib/data/seed';
import { setStoredToken } from '@/lib/api/client';

interface AppContextType {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  resetDemoData: () => void;
  logout: () => Promise<void>;

  userContext: UserContext;
  setUserContext: React.Dispatch<React.SetStateAction<UserContext>>;

  preferences: PracticalPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<PracticalPreferences>>;

  academic: AcademicRecord;
  setAcademic: React.Dispatch<React.SetStateAction<AcademicRecord>>;

  interestAnswers: Record<number, number | 'belum_tahu' | 'lewati'>;
  setAnswer: (questionId: number, val: number | 'belum_tahu' | 'lewati') => void;

  bookmarkedMajorIds: string[];
  toggleBookmark: (id: string) => void;

  compareCartIds: string[];
  toggleCompareCart: (id: string) => { success: boolean; reason?: string };
  removeFromCompareCart: (id: string) => void;
  clearCompareCart: () => void;

  missionSubmissions: Record<string, TaskSubmission>;
  saveMissionSubmission: (sub: TaskSubmission) => void;

  missionReflections: Record<string, MissionReflection>;
  saveMissionReflection: (ref: MissionReflection) => void;

  planTasks: PlanTaskItem[];
  updateTaskStatus: (taskId: string, status: PlanTaskItem['status']) => void;
  updateTaskItem: (task: PlanTaskItem) => void;

  passportSnapshots: PassportSnapshot[];
  addPassportSnapshot: (snapshot: PassportSnapshot) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [userContext, setUserContext] = useState<UserContext>({ namaPanggilan: '', kelas: 'XII', tahunKelulusan: 2026 });
  const [preferences, setPreferences] = useState<PracticalPreferences>({ domisili: '', bersediaRelokasi: false, rentangAnggaranMax: null, rencanaTempatTinggal: 'belum_tahu' });
  const [academic, setAcademic] = useState<AcademicRecord>({ skala: '100', semester: 'Semester 1–4', grades: [], isSkipped: false });
  
  const [interestAnswers, setInterestAnswers] = useState<Record<number, number | 'belum_tahu' | 'lewati'>>({});

  const [bookmarkedMajorIds, setBookmarkedMajorIds] = useState<string[]>([]);
  const [compareCartIds, setCompareCartIds] = useState<string[]>([]);
  const [missionSubmissions, setMissionSubmissions] = useState<Record<string, TaskSubmission>>({});
  const [missionReflections, setMissionReflections] = useState<Record<string, MissionReflection>>({});
  const [planTasks, setPlanTasks] = useState<PlanTaskItem[]>(SEED_30DAY_TASKS);
  const [passportSnapshots, setPassportSnapshots] = useState<PassportSnapshot[]>([]);

  const isHydratedRef = useRef<boolean>(false);
  const isLoggedOutRef = useRef<boolean>(false);

  // Hydrate from localStorage if client-side
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexalora_demo_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userContext) setUserContext(parsed.userContext);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.academic) setAcademic(parsed.academic);
        if (parsed.interestAnswers) setInterestAnswers(parsed.interestAnswers);
        if (parsed.bookmarkedMajorIds) setBookmarkedMajorIds(parsed.bookmarkedMajorIds);
        if (Array.isArray(parsed.compareCartIds)) setCompareCartIds(parsed.compareCartIds.slice(0, 3));
        if (parsed.missionSubmissions) setMissionSubmissions(parsed.missionSubmissions);
        if (parsed.missionReflections) setMissionReflections(parsed.missionReflections);
        if (parsed.planTasks) setPlanTasks(parsed.planTasks);
        if (parsed.passportSnapshots) setPassportSnapshots(parsed.passportSnapshots);
        if (typeof parsed.isDemoMode === 'boolean') setIsDemoMode(parsed.isDemoMode);
      }
    } catch {
      // LocalStorage not available or parse error
    } finally {
      isHydratedRef.current = true;
    }
  }, []);


  // Sync to localStorage
  useEffect(() => {
    if (!isHydratedRef.current) return;
    if (isLoggedOutRef.current) {
      try {
        localStorage.removeItem('nexalora_demo_state_v1');
      } catch {
        // Ignore
      }
      return;
    }

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
      localStorage.setItem('nexalora_demo_state_v1', JSON.stringify(stateToSave));
    } catch {
      // Ignore write errors
    }
  }, [
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
  ]);

  const resumeSync = () => {
    if (isLoggedOutRef.current) {
      isLoggedOutRef.current = false;
    }
  };

  const resetDemoData = () => {
    isLoggedOutRef.current = false;
    setUserContext(DEMO_PRESET_RANI.context);
    setPreferences(DEMO_PRESET_RANI.preferences);
    setAcademic(DEMO_PRESET_RANI.academic);
    setInterestAnswers({ 1: 5, 2: 4, 3: 3 });
    setBookmarkedMajorIds(['informatika-univ-a']);
    setCompareCartIds(['informatika-univ-a', 'teknik-industri-inst-b']);
    setMissionSubmissions({});
    setMissionReflections({});
    setPassportSnapshots([]);
    setPlanTasks(SEED_30DAY_TASKS);
    setIsDemoMode(true);
    try {
      localStorage.removeItem('nexalora_demo_state_v1');
    } catch {
      // Ignore
    }
  };

  const clearStudentState = () => {
    isLoggedOutRef.current = true;
    window.dispatchEvent(new Event('nexalora:logout'));
    try {
      localStorage.removeItem('nexalora_demo_state_v1');
      localStorage.removeItem('nexalora_demo_state_owner');
      setStoredToken(null);
    } catch {
      // Ignore
    }
    setPassportSnapshots([]);
    setUserContext({
      namaPanggilan: 'Siswa',
      kelas: 'XII',
      tahunKelulusan: 2026,
    });
    setPreferences({
      domisili: '',
      bersediaRelokasi: true,
      rentangAnggaranMax: null,
      rencanaTempatTinggal: 'belum_tahu',
    });
    setAcademic({
      skala: '100',
      semester: 'Semester 1–4',
      grades: [],
      isSkipped: true,
    });
    setInterestAnswers({});
    setBookmarkedMajorIds([]);
    setCompareCartIds([]);
    setMissionSubmissions({});
    setMissionReflections({});
    setPlanTasks(SEED_30DAY_TASKS);
    setIsDemoMode(true);
  };

  const logout = async () => {
    clearStudentState();
  };

  const setAnswer = (questionId: number, val: number | 'belum_tahu' | 'lewati') => {
    resumeSync();
    setInterestAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const toggleBookmark = (id: string) => {
    resumeSync();
    setBookmarkedMajorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompareCart = (id: string): { success: boolean; reason?: string } => {
    resumeSync();
    if (compareCartIds.includes(id)) {
      setCompareCartIds((prev) => prev.filter((item) => item !== id));
      return { success: true };
    }
    if (compareCartIds.length >= 3) {
      return {
        success: false,
        reason: 'Maksimal 3 program studi dapat dibandingkan secara bersamaan. Hapus salah satu terlebih dahulu.',
      };
    }
    setCompareCartIds((prev) => (prev.length >= 3 || prev.includes(id) ? prev : [...prev, id]));
    return { success: true };
  };

  const removeFromCompareCart = (id: string) => {
    resumeSync();
    setCompareCartIds((prev) => prev.filter((item) => item !== id));
  };

  const clearCompareCart = () => {
    resumeSync();
    setCompareCartIds([]);
  };

  const saveMissionSubmission = (sub: TaskSubmission) => {
    resumeSync();
    setMissionSubmissions((prev) => ({
      ...prev,
      [sub.missionId]: sub,
    }));
  };

  const saveMissionReflection = (ref: MissionReflection) => {
    resumeSync();
    setMissionReflections((prev) => ({
      ...prev,
      [ref.missionId]: ref,
    }));
  };

  const updateTaskStatus = (taskId: string, status: PlanTaskItem['status']) => {
    resumeSync();
    setPlanTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const updateTaskItem = (task: PlanTaskItem) => {
    resumeSync();
    setPlanTasks((prev) =>
      prev.map((t) => (t.id === task.id ? task : t))
    );
  };

  const addPassportSnapshot = (snapshot: PassportSnapshot) => {
    resumeSync();
    setPassportSnapshots((prev) => [snapshot, ...prev]);
  };

  const handleSetUserContext: React.Dispatch<React.SetStateAction<UserContext>> = (value) => {
    resumeSync();
    setUserContext(value);
  };

  const handleSetPreferences: React.Dispatch<React.SetStateAction<PracticalPreferences>> = (value) => {
    resumeSync();
    setPreferences(value);
  };

  const handleSetAcademic: React.Dispatch<React.SetStateAction<AcademicRecord>> = (value) => {
    resumeSync();
    setAcademic(value);
  };

  const handleSetIsDemoMode = (val: boolean) => {
    resumeSync();
    setIsDemoMode(val);
  };

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode: handleSetIsDemoMode,
        resetDemoData,
        logout,
        userContext,
        setUserContext: handleSetUserContext,
        preferences,
        setPreferences: handleSetPreferences,
        academic,
        setAcademic: handleSetAcademic,
        interestAnswers,
        setAnswer,
        bookmarkedMajorIds,
        toggleBookmark,
        compareCartIds,
        toggleCompareCart,
        removeFromCompareCart,
        clearCompareCart,
        missionSubmissions,
        saveMissionSubmission,
        missionReflections,
        saveMissionReflection,
        planTasks,
        updateTaskStatus,
        updateTaskItem,
        passportSnapshots,
        addPassportSnapshot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
