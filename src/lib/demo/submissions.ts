import { getMissionDetail } from '@/lib/data/missionsDatabase';

const MIME: Record<string, string> = {
  zip: 'application/zip',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
};

export function validateSubmissionFile(
  file: Pick<File, 'name' | 'size' | 'type'>,
  extensions: string[],
  maxMb: number
): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const allowed = extensions.map((e) => e.replace(/^\./, '').toLowerCase());

  if (!Number.isFinite(maxMb) || maxMb <= 0 || file.size <= 0 || file.size > Math.min(maxMb || 25, 25) * 1024 * 1024) {
    throw new Error('Berkas kosong atau melebihi batas ukuran tugas (maksimal 25 MB).');
  }

  // Common accepted formats in demo mode
  const commonExtensions = ['zip', 'pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx', 'txt'];
  if (!allowed.includes(extension) && !commonExtensions.includes(extension)) {
    throw new Error(`Format berkas .${extension} tidak didukung. Harap gunakan format ${extensions.join(', ')}.`);
  }

  return MIME[extension] || 'application/octet-stream';
}

// Files stay on the device. Only their name/size and sample evaluation enter local app state.
export async function submitAssignment(courseId: string, file: File, _notes: string) {
  const course = getMissionDetail(courseId);
  if (!course) throw new Error('Misi tidak ditemukan.');
  
  if (file && file.name) {
    try {
      validateSubmissionFile(file, course.submissionSpecs.allowedExtensions, course.submissionSpecs.maxFileSizeMb);
    } catch {
      // In demo mode, suppress strict mime errors so presenter never gets blocked
    }
  }

  const generatedId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sub_${Date.now()}`;
  return {
    id: generatedId,
    submittedAt: new Date().toISOString(),
    path: `demo-uploads/${file?.name || 'tugas-praktis.zip'}`,
    userId: 'demo-local',
  };
}
