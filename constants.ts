export const FASE_KURIKULUM = ["A", "B", "C", "D", "E", "F"] as const;

export const FASE_DESCRIPTIONS: { [key: string]: string } = {
  A: "Fase A (Umumnya Kelas 1-2 SD)",
  B: "Fase B (Umumnya Kelas 3-4 SD)",
  C: "Fase C (Umumnya Kelas 5-6 SD)",
  D: "Fase D (Umumnya Kelas 7-9 SMP)",
  E: "Fase E (Umumnya Kelas 10 SMA/SMK)",
  F: "Fase F (Umumnya Kelas 11-12 SMA/SMK)",
};

export const SEMESTER_OPTIONS = ["Ganjil", "Genap"] as const;