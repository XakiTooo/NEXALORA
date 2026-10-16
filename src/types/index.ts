// CobaDulu Domain Types matching PRD v1.3

export type VerificationStatus = 'terverifikasi' | 'perlu_diperiksa' | 'belum_tersedia' | 'sumber_lama';

export type DisciplineCluster = 'informatika' | 'industri' | 'dkv';

export interface UserContext {
  namaPanggilan: string;
  kelas: 'XI' | 'XII';
  tahunKelulusan: number;
}

export interface PracticalPreferences {
  domisili: string;
  bersediaRelokasi: boolean;
  rentangAnggaranMax: number | null; // e.g. 20_000_000
  rencanaTempatTinggal: 'bersama_orang_tua' | 'kost' | 'asrama' | 'belum_tahu';
}

export interface AcademicGrade {
  mataPelajaran: string;
  nilai: number;
}

export interface AcademicRecord {
  skala: '100' | '4.0';
  semester: string;
  grades: AcademicGrade[];
  isSkipped: boolean;
}

export interface InterestAnswer {
  questionId: number;
  skor: number | 'belum_tahu' | 'lewati'; // 1-5, belum_tahu, lewati
}

export interface InterestDimension {
  id: string;
  label: string;
  cluster: DisciplineCluster;
  description: string;
  skorRataRata: number;
  levelKecenderungan: 'Tinggi' | 'Moderat' | 'Eksplorasi';
}

export interface MajorCampus {
  id: string;
  namaProdi: string;
  jenjang: 'S1' | 'D4';
  namaKampus: string;
  kota: string;
  cluster: DisciplineCluster;
  clusterLabel: string;
  biayaPerTahun: number | null; // null if unknown
  biayaStatus: VerificationStatus;
  biayaTahunSumber: number;
  akreditasi: 'Unggul' | 'A' | 'Baik Sekali' | 'B' | 'Belum tersedia';
  jalurMasuk: string[];
  statusData: VerificationStatus;
  alasanRekomendasi: [string, string];
  kesiapanAkademik: 'Sesuai Rapor' | 'Perlu Penguatan' | 'Belum Diisi';
  kurikulumHighlights: string[];
  prospekKarier: string[];
  beasiswaTersedia: boolean;
  imageUrl?: string;
}

// Mini-Kuliah Misi v1.3
export interface MiniLectureSection {
  id: string;
  judul: string;
  estimasiMenit: number;
  konten: string;
  poinKunci: string[];
}

export interface ComprehensionQuestion {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  penjelasan: string;
}

export interface RubricCriterion {
  id: string;
  kriteria: string;
  deskripsi: string;
  status: 'Tercakup Baik' | 'Perlu Diperkuat' | 'Belum Terlihat';
  catatanKualitatif: string;
}

export interface Mission {
  id: string;
  cluster: DisciplineCluster;
  judul: string;
  subjudul: string;
  deskripsiSingkat: string;
  estimasiDurasiMenit: number; // 20-30 menit
  tujuanBelajar: string[];
  formatTugas: string;
  materiSections: MiniLectureSection[];
  cekPemahaman: ComprehensionQuestion[];
  rubrik: RubricCriterion[];
  contohJawabanPembanding: {
    contohKuat: string;
    catatanKenapaKuat: string;
  };
}

export interface TaskSubmission {
  missionId: string;
  jawabanTeks?: string;
  sketsaUrlOrFileName?: string;
  pilihanOpsi?: string;
  alasanKeputusan: string;
  resikoAtauKompromi?: string;
  waktuSubmit: string;
  versi: number;
  fileName?: string;
  fileSizeFormatted?: string;
  fileUrl?: string;
  catatanSiswa?: string;
  statusKelulusan?: 'draft' | 'menunggu_review' | 'lulus' | 'perlu_revisi';
  bintangReview?: number;
  feedbackReviewer?: string;
}

export interface MissionFeedback {
  missionId: string;
  status: 'Terkumpul';
  kriteriaEvaluasi: RubricCriterion[];
  komentarUmum: string;
  saranPerbaikan: string;
  contohPembanding: string;
}

export interface MissionReflection {
  missionId: string;
  tingkatEnjoyment: 1 | 2 | 3 | 4 | 5;
  minatMendalami: 'Ya' | 'Mungkin' | 'Ragu' | 'Tidak';
  bagianPalingMenarik: 'Materi' | 'Tugas Kasus';
  aspekTersulit: string;
  hambatanDihadapi: string;
  ekspektasiVsKenyataan: string;
  rencanaLangkahLanjutan: string;
}

export interface PlanTaskItem {
  id: string;
  mingguKe: 1 | 2 | 3 | 4;
  judul: string;
  deskripsi: string;
  estimasiMenit: number;
  tenggatHariKe: number;
  kategori: 'Eksplorasi' | 'Diskusi' | 'Akademik' | 'Administrasi';
  status: 'todo' | 'doing' | 'done' | 'skipped' | 'overdue';
  buktiCatatan?: string;
  buktiTautan?: string;
}

export interface CareerRole {
  id: string;
  namaPeran: string;
  cluster: DisciplineCluster;
  deskripsi: string;
  aktivitasHarian: string[];
  contohHasilKarya: string[];
  skillUtama: string[];
  latihanPemula: string;
  rekomendasiProdiTerkait: string[];
}

export interface PassportSnapshot {
  id: string;
  nomorSnapshot: string;
  tanggalDibuat: string;
  namaSiswa: string;
  kelas: string;
  sekolah?: string;
  sertakanNilaiRapor: boolean;
  sertakanAnggaranBiaya: boolean;
  sertakanRefleksiSensitif: boolean;
  prodiTerpilih: string[];
  misiSelesai: string[];
  catatanDiskusiBK: string;
}
