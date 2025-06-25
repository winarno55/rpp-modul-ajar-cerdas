import React, { useState } from 'react';
import { LessonPlanInput } from '../types';
import { FASE_KURIKULUM, FASE_DESCRIPTIONS, SEMESTER_OPTIONS } from '../constants';

interface LessonPlanFormProps {
  onSubmit: (data: LessonPlanInput) => void;
  isLoading: boolean;
}

export const LessonPlanForm: React.FC<LessonPlanFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LessonPlanInput>({
    mataPelajaran: '',
    fase: FASE_KURIKULUM[0],
    kelas: '', // Inisialisasi field kelas
    semester: SEMESTER_OPTIONS[0], // Inisialisasi field semester
    materi: '',
    alokasiWaktu: '',
    tujuanPembelajaran: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100";
  const labelClass = "block mb-2 text-sm font-medium text-sky-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="mataPelajaran" className={labelClass}>Mata Pelajaran</label>
        <input type="text" name="mataPelajaran" id="mataPelajaran" value={formData.mataPelajaran} onChange={handleChange} className={inputClass} placeholder="cth: Bahasa Indonesia, Matematika" required />
      </div>

      <div>
        <label htmlFor="fase" className={labelClass}>Fase Kurikulum</label>
        <select name="fase" id="fase" value={formData.fase} onChange={handleChange} className={inputClass} required>
          {FASE_KURIKULUM.map(f => (
            <option key={f} value={f}>{FASE_DESCRIPTIONS[f]}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="kelas" className={labelClass}>Kelas</label>
        <input type="text" name="kelas" id="kelas" value={formData.kelas} onChange={handleChange} className={inputClass} placeholder="cth: 1, 7, X, XI" required />
      </div>

      <div>
        <label htmlFor="semester" className={labelClass}>Semester</label>
        <select name="semester" id="semester" value={formData.semester} onChange={handleChange} className={inputClass} required>
          {SEMESTER_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="materi" className={labelClass}>Materi / Topik Pembelajaran</label>
        <input type="text" name="materi" id="materi" value={formData.materi} onChange={handleChange} className={inputClass} placeholder="cth: Proklamasi Kemerdekaan, Sistem Pencernaan" required />
      </div>

      <div>
        <label htmlFor="alokasiWaktu" className={labelClass}>Alokasi Waktu</label>
        <input type="text" name="alokasiWaktu" id="alokasiWaktu" value={formData.alokasiWaktu} onChange={handleChange} className={inputClass} placeholder="cth: 2 x 45 menit, 3 JP" required />
      </div>

      <div>
        <label htmlFor="tujuanPembelajaran" className={labelClass}>Tujuan Pembelajaran (Awal)</label>
        <textarea name="tujuanPembelajaran" id="tujuanPembelajaran" value={formData.tujuanPembelajaran} onChange={handleChange} rows={4} className={inputClass} placeholder="Masukkan tujuan pembelajaran spesifik yang ingin dicapai siswa..." required />
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </>
        ) : (
          "Buat RPP/Modul Ajar"
        )}
      </button>
    </form>
  );
};