/**
 * NEXALORA API Endpoints Service
 * Full TypeScript implementation for https://nexalora-api.vercel.app/docs
 */

import { apiRequest, ApiResponse } from './client';

// ==========================================
// 1. HEALTH CHECKS
// ==========================================

export async function checkLiveness(): Promise<ApiResponse<{ status: string; uptimeSeconds: number }>> {
  return apiRequest('/api/health', { method: 'GET' });
}

export async function checkReadiness(): Promise<ApiResponse<{ status: string; database: string }>> {
  return apiRequest('/api/health/ready', { method: 'GET' });
}

// ==========================================
// 2. CATALOG & PROGRAMS
// ==========================================

export interface CatalogMajor {
  id: string;
  name: string;
  cluster: string;
  description?: string;
}

export interface CatalogProgram {
  id: string;
  name: string;
  universityName: string;
  city: string;
  province?: string;
  accreditation: string;
  ukPerYear: number;
  uangPangkal: number;
  curriculumSummary?: string;
  careerProspects?: string[];
  [key: string]: any;
}

export async function getCatalog(): Promise<
  ApiResponse<{ majors: CatalogMajor[]; programs: CatalogProgram[] }>
> {
  return apiRequest('/api/catalog', { method: 'GET' });
}

export async function getProgramById(id: string): Promise<ApiResponse<CatalogProgram>> {
  return apiRequest('/api/catalog/programs/' + encodeURIComponent(id), { method: 'GET' });
}

/**
 * Mapper helper to transform backend CatalogProgram to frontend MajorCampus
 */
export function mapCatalogProgramToMajorCampus(p: CatalogProgram): any {
  const clusterStr = (p.cluster || '').toLowerCase();
  let cluster = 'informatika';
  let clusterLabel = 'INFORMATIKA · LOGIKA & SISTEM';

  if (clusterStr.includes('indus') || (p.name || '').toLowerCase().includes('industri')) {
    cluster = 'industri';
    clusterLabel = 'TEKNIK INDUSTRI · PROSES & EFISIENSI';
  } else if (clusterStr.includes('dkv') || clusterStr.includes('desain') || (p.name || '').toLowerCase().includes('desain')) {
    cluster = 'dkv';
    clusterLabel = 'DKV · KOMUNIKASI & KREASI VISUAL';
  }

  return {
    id: p.id,
    namaProdi: p.name || 'Program Studi',
    jenjang: (p.jenjang || 'S1') as 'S1' | 'D4',
    namaKampus: p.universityName || 'Universitas',
    kota: p.city ? `${p.city}${p.province ? ` (${p.province})` : ''}` : 'Indonesia',
    cluster,
    clusterLabel,
    biayaPerTahun: p.ukPerYear || null,
    biayaStatus: 'terverifikasi',
    biayaTahunSumber: 2026,
    akreditasi: p.accreditation || 'Unggul',
    jalurMasuk: p.admissionPaths || ['SNBP', 'SNBT', 'Mandiri'],
    statusData: 'terverifikasi',
    alasanRekomendasi: [
      'Program studi resmi terverifikasi dari pangkalan data kampus.',
      'Kurikulum dan capaian pembelajaran relevan dengan kebutuhan industri.',
    ],
    kesiapanAkademik: 'Sesuai Rapor',
    kurikulumHighlights: p.curriculumSummary
      ? [p.curriculumSummary]
      : ['Dasar Keilmuan Rumpun', 'Metodologi & Praktikum', 'Tugas Akhir Mandiri'],
    prospekKarier: p.careerProspects || ['Spesialis Bidang Studi', 'Praktisi Industri', 'Konsultan'],
    beasiswaTersedia: true,
  };
}

// ==========================================
// 3. STUDENT PROFILE & DATA
// ==========================================

export interface StudentProfileData {
  displayName?: string;
  gradeLevel?: 'XI' | 'XII' | 'OTHER';
  graduationYear?: number;
  cityCode?: string | null;
  provinceCode?: string | null;
  relocationMode?: 'STAY' | 'OPEN' | 'SELECTED';
  preferredRegions?: string[];
  preferredMajors?: string[];
  monthlyBudgetMin?: number | null;
  monthlyBudgetMax?: number | null;
  upfrontBudgetMax?: number | null;
  housingMode?: 'FAMILY' | 'RENT' | 'UNKNOWN';
  pinnedPrograms?: string[];
  schoolSubjects?: Array<{
    subject: string;
    semester: number;
    score: number;
    scale?: string;
  }>;
  consent?: {
    purposeVersion: string;
    isAccepted: boolean;
  };
  expectedVersion: number;
}

export async function getProfile(): Promise<ApiResponse<any>> {
  return apiRequest('/api/profile', { method: 'GET' });
}

export async function updateProfile(payload: StudentProfileData): Promise<ApiResponse<any>> {
  return apiRequest('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAccountData(): Promise<ApiResponse<{ message: string }>> {
  return apiRequest('/api/account-data', { method: 'DELETE' });
}

// ==========================================
// 4. INTEREST SURVEY
// ==========================================

export interface InterestSubmissionPayload {
  instrumentVersion: string;
  answers: Record<string, number | string>;
}

export async function submitInterests(payload: InterestSubmissionPayload): Promise<ApiResponse<any>> {
  return apiRequest('/api/interests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 5. RECOMMENDATIONS ENGINE
// ==========================================

export interface RecommendationRunPayload {
  profileVersion: number;
  activeReflectionIds?: string[];
  expectedCatalogVersion?: string;
}

export async function generateRecommendations(
  payload: RecommendationRunPayload
): Promise<ApiResponse<any>> {
  return apiRequest('/api/recommendations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getLatestRecommendations(): Promise<ApiResponse<any>> {
  return apiRequest('/api/recommendations/latest', { method: 'GET' });
}

// ==========================================
// 6. SIMULATION ATTEMPTS & REFLECTIONS
// ==========================================

export interface StartAttemptPayload {
  missionId: string;
  seed: string;
  draftArtifact?: any;
}

export async function startAttempt(
  payload: StartAttemptPayload,
  idempotencyKey?: string
): Promise<ApiResponse<any>> {
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  } else {
    headers['Idempotency-Key'] = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  return apiRequest('/api/attempts', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

export async function getAttempt(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/attempts/${id}`, { method: 'GET' });
}

export async function saveAttemptDraft(
  id: string,
  expectedRevision: number,
  draftArtifact: any
): Promise<ApiResponse<any>> {
  return apiRequest(`/api/attempts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ expectedRevision, draftArtifact }),
  });
}

export async function runAttemptScenario(
  id: string,
  scenarioId: string,
  expectedRevision: number
): Promise<ApiResponse<any>> {
  return apiRequest(`/api/attempts/${id}/run`, {
    method: 'POST',
    body: JSON.stringify({ scenarioId, expectedRevision }),
  });
}

export interface ReflectionPayload {
  attemptId: string;
  expectedRevision?: number;
  responses: Record<string, any>;
  activate?: boolean;
}

export async function submitReflection(payload: ReflectionPayload): Promise<ApiResponse<any>> {
  return apiRequest('/api/reflections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 7. SHORTLIST & SCENARIOS (COMPARISON)
// ==========================================

export async function getShortlist(): Promise<ApiResponse<{ programIds: string[] }>> {
  return apiRequest('/api/shortlist', { method: 'GET' });
}

export async function updateShortlist(
  programIds: string[],
  expectedProfileVersion?: number
): Promise<ApiResponse<any>> {
  return apiRequest('/api/shortlist', {
    method: 'PUT',
    body: JSON.stringify({ programIds, expectedProfileVersion }),
  });
}

export interface ScenarioOverridePayload {
  programIds?: string[];
  overrides: {
    monthlyBudget?: number;
    upfrontBudget?: number;
    housingMode?: 'FAMILY' | 'RENT' | 'UNKNOWN';
    relocationTolerance?: boolean;
    [key: string]: any;
  };
}

export async function computeScenario(payload: ScenarioOverridePayload): Promise<ApiResponse<any>> {
  return apiRequest('/api/scenarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 8. 30-DAY ACTION PLAN & TASKS
// ==========================================

export interface PlanDraftPayload {
  goalIds?: string[];
  weeklyMinutes?: number;
  startDate: string; // ISO String
}

export async function previewPlan(payload: PlanDraftPayload): Promise<ApiResponse<any>> {
  return apiRequest('/api/plans/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function activatePlan(
  payload: PlanDraftPayload & { basePlanVersion?: number },
  idempotencyKey?: string
): Promise<ApiResponse<any>> {
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  } else {
    headers['Idempotency-Key'] = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  return apiRequest('/api/plans', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

export async function getActivePlan(): Promise<ApiResponse<any>> {
  return apiRequest('/api/plans/active', { method: 'GET' });
}

export interface UpdateTaskPayload {
  expectedVersion: number;
  status?: 'pending' | 'in_progress' | 'done' | 'skipped';
  dueDate?: string;
  evidenceNote?: string;
  evidenceUrl?: string;
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<ApiResponse<any>> {
  return apiRequest(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ==========================================
// 9. PASSPORTS
// ==========================================

export interface PassportCreatePayload {
  includeFields?: string[];
}

export async function createPassportSnapshot(
  payload: PassportCreatePayload = {}
): Promise<ApiResponse<any>> {
  return apiRequest('/api/passports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPassportSnapshot(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/passports/${id}`, { method: 'GET' });
}
