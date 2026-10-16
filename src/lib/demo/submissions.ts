import { DATABASE_MISSIONS } from '@/lib/data/missionsDatabase';
const MIME: Record<string, string> = {
  zip: 'application/zip', pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
export function validateSubmissionFile(file: Pick<File, 'name' | 'size' | 'type'>, extensions: string[], maxMb: number): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!MIME[extension] || !extensions.map(e => e.replace(/^\./, '').toLowerCase()).includes(extension))
    throw new Error('Format berkas tidak didukung untuk tugas ini.');
  if (!Number.isFinite(maxMb) || maxMb <= 0 || file.size <= 0 || file.size > Math.min(maxMb, 25) * 1024 * 1024)
    throw new Error('Berkas kosong atau melebihi batas ukuran tugas (maksimal 25 MB).');
  if (file.type && file.type !== MIME[extension] && !(extension === 'zip' && file.type === 'application/x-zip-compressed') && file.type !== 'application/octet-stream')
    throw new Error('Jenis berkas tidak sesuai dengan ekstensinya.');
  return MIME[extension];
}

// Files stay on the device. Only their name/size and sample evaluation enter local app state.
export async function submitAssignment(courseId: string, file: File, _notes: string) {
  const course = DATABASE_MISSIONS[courseId];
  if (!course) throw new Error('Misi tidak ditemukan.');
  validateSubmissionFile(file, course.submissionSpecs.allowedExtensions, course.submissionSpecs.maxFileSizeMb);
  return { id: crypto.randomUUID(), submittedAt: new Date().toISOString(), path: '', userId: 'demo-local' };
}
