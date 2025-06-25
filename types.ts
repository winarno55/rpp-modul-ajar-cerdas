export interface LessonPlanInput {
  mataPelajaran: string;
  fase: string;
  kelas: string; // Bidang baru untuk kelas spesifik
  semester: string; // Bidang baru untuk semester
  materi: string;
  alokasiWaktu: string;
  tujuanPembelajaran: string;
}

export interface SectionContent {
  title: string;
  contentLines: string[];
  subSections?: SectionContent[];
}