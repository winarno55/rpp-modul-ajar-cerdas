import { LessonPlanInput } from '../types';

export const generateLessonPlanPrompt = (input: LessonPlanInput): string => {
  const { mataPelajaran, fase, kelas, semester, materi, alokasiWaktu, tujuanPembelajaran } = input;

  // IMPORTANT: Ensure no backticks are escaped in the outer template literal delimiters.
  // Inner literal backticks, if needed inside the string content, MUST be escaped (e.g., \\\`command\\\`).
  // However, this prompt doesn't use inner literal backticks.

  return `Anda adalah seorang ahli pengembangan kurikulum dan desainer instruksional yang sangat berpengalaman, memiliki pemahaman mendalam tentang pembelajaran modern dan Kurikulum Merdeka. Tugas Anda adalah membantu guru membuat Rencana Pelaksanaan Pembelajaran (RPP) atau Modul Ajar yang komprehensif, efektif, dan sesuai dengan prinsip Mindful Learning, Meaningful Learning, dan Joyful Learning.

Berdasarkan input berikut:
Mata Pelajaran: ${mataPelajaran}
Fase: ${fase}
Kelas: ${kelas}
Semester: ${semester}
Materi: ${materi}
Alokasi Waktu (Input Pengguna): ${alokasiWaktu}
Tujuan Pembelajaran Awal: ${tujuanPembelajaran}

CATATAN PENTING UNTUK INTERPRETASI ALOKASI WAKTU:
Anda HARUS secara cerdas menginterpretasikan input "Alokasi Waktu" pengguna (${alokasiWaktu}) berdasarkan Fase yang dipilih. Durasi standar 1 Jam Pelajaran (JP) adalah sebagai berikut:
- Fase A, B, C (Umumnya SD/MI): 1 JP = 35 menit.
- Fase D (Umumnya SMP/MTs): 1 JP = 40 menit.
- Fase E, F (Umumnya SMA/SMK/MA): 1 JP = 45 menit.
Contoh: Jika input "Alokasi Waktu" adalah "2 JP" dan Fase adalah "A", maka total durasi adalah 70 menit. Jika Fase adalah "D" untuk "2 JP", maka total durasi adalah 80 menit.
Pastikan total durasi rincian kegiatan dalam "Langkah-Langkah Kegiatan Pembelajaran" (Pendahuluan, Inti, Penutup) secara akurat mencerminkan total alokasi waktu yang telah diinterpretasikan dengan benar ini.

Hasilkan RPP/Modul Ajar dengan struktur dan konten berikut. Pastikan output rapi dan terorganisir, siap untuk disalin ke dokumen (misalnya DOCX/PDF). Gunakan Bahasa Indonesia yang baik dan benar.

[JUDUL RPP/MODUL AJAR: Buat judul yang menarik dan sesuai dengan Materi (${materi}), Kelas (${kelas}), dan Semester (${semester})]

A. INFORMASI UMUM
   Mata Pelajaran         : ${mataPelajaran}
   Fase                   : ${fase}
   Kelas                  : ${kelas}
   Semester               : ${semester}
   Materi                 : ${materi}
   Alokasi Waktu          : ${alokasiWaktu} [AI: Tampilkan juga hasil interpretasi total menit berdasarkan Fase di sini. Contoh: "2 JP (Total 70 menit untuk Fase A)" atau "120 menit (Total 120 menit)"]

B. TUJUAN PEMBELAJARAN
   [Kembangkan tujuan pembelajaran awal (${tujuanPembelajaran}) menjadi lebih rinci dan operasional. Pastikan tujuan tersebut SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Jika input tujuan awal sudah spesifik, kembangkan sedikit dengan menambahkan aspek implementasi atau kedalaman pemahaman.]

C. ASESMEN PEMBELAJARAN
   [Rancang rencana asesmen yang relevan dan proporsional untuk secara langsung mengukur pencapaian Tujuan Pembelajaran yang telah dirumuskan di Bagian B.
    - Sebutkan jenis asesmen (diagnostik, formatif, sumatif).
    - Berikan contoh konkret bentuk asesmen (misal: observasi partisipasi, tes tulis pilihan ganda/esai singkat, presentasi hasil diskusi kelompok, penugasan proyek sederhana, unjuk kerja).
    - Jelaskan secara singkat instrumen yang bisa digunakan untuk masing-masing bentuk asesmen (misal: lembar observasi, soal tes, rubrik presentasi, rubrik proyek).]

D. LANGKAH-LANGKAH KEGIATAN PEMBELAJARAN
   [PENTING: Seluruh langkah pembelajaran yang dirancang harus secara aktif berfungsi sebagai alat untuk mewujudkan Tujuan Pembelajaran yang telah ditetapkan di Bagian B. Selain itu, semua kegiatan harus disesuaikan dengan tingkat perkembangan siswa untuk Kelas (${kelas}), tidak terlalu sulit ataupun terlalu mudah. DURASI SETIAP BAGIAN (PENDAHULUAN, INTI, PENUTUP) HARUS KONSISTEN DENGAN INTERPRETASI CERDAS ALOKASI WAKTU TOTAL YANG TELAH DIJELASKAN DI CATATAN PENTING SEBELUMNYA.]

   1. Pendahuluan (Durasi: sekitar 10-15% dari total menit yang telah diinterpretasikan dengan benar dari input ${alokasiWaktu})
      [Rincikan langkah-langkah pendahuluan:
       - Pembukaan: Salam, doa, presensi.
       - Apersepsi (Meaningful Learning): Kaitkan materi yang akan dipelajari dengan pengetahuan awal siswa atau pengalaman sehari-hari. Contoh: "Anak-anak, siapa yang pernah...?", "Minggu lalu kita belajar tentang..., hari ini kita akan melanjutkan ke...".
       - Motivasi (Joyful Learning): Sampaikan manfaat mempelajari materi dan buat siswa antusias. Contoh: Dengan ice-breaking singkat, pertanyaan menantang terkait materi, atau menunjukkan gambar/video menarik yang relevan dengan ${materi}.
       - Penyampaian Tujuan Pembelajaran: Jelaskan apa yang akan siswa capai setelah pembelajaran (sesuai Bagian B).
       - Asesmen Diagnostik Singkat (Mindful Learning): Ajukan 1-2 pertanyaan kunci terkait prasyarat materi atau pemahaman awal siswa tentang topik ${materi}. Ini bisa lisan atau tulis singkat.]

   2. Inti (Durasi: sekitar 70-80% dari total menit yang telah diinterpretasikan dengan benar dari input ${alokasiWaktu})
      [Kembangkan langkah-langkah kegiatan inti yang detail, interaktif, dan berpusat pada siswa, secara eksplisit mengintegrasikan Mindful, Meaningful, dan Joyful Learning. Setiap aktivitas harus dirancang untuk secara langsung mendukung pencapaian Tujuan Pembelajaran (Bagian B) dan sesuai dengan tingkat perkembangan siswa Kelas (${kelas}). Gunakan variasi metode (diskusi, tanya jawab, demonstrasi, eksperimen sederhana, kerja kelompok, penugasan individu, penggunaan media). Rincikan aktivitas siswa dan guru terkait ${materi}.

       [PENTING: Sertakan juga opsi untuk PEMBELAJARAN BERDIFERENSIASI dalam kegiatan inti. Berikan contoh konkret bagaimana guru dapat menyesuaikan kegiatan untuk siswa dengan tingkat kesiapan, minat, atau profil belajar yang berbeda. Misalnya, diferensiasi konten (materi yang berbeda), proses (cara belajar yang berbeda), atau produk (hasil belajar yang berbeda seperti penugasan berjenjang, pilihan proyek, atau format laporan yang bervariasi). Pastikan opsi diferensiasi ini tetap selaras dengan Tujuan Pembelajaran dan praktis untuk diimplementasikan di Kelas (${kelas}). Fokus pada 1-2 strategi diferensiasi yang paling relevan untuk ${materi} dan Tujuan Pembelajaran.]

       Contoh integrasi Mindful, Meaningful, Joyful Learning:
       - Mindful Learning:
         *   Aktivitas: Diskusi kelompok untuk menganalisis studi kasus terkait ${materi} yang mendorong pencapaian tujuan.
         *   Guru: Memberikan pertanyaan pemantik yang mendorong pemikiran kritis, seperti "Menurut kalian, mengapa hal itu terjadi?", "Apa dampak dari...?", "Bagaimana jika...?".
         *   Siswa: Melakukan refleksi singkat di akhir sesi diskusi tentang apa yang baru dipelajari dan bagaimana mereka memahaminya.
       - Meaningful Learning:
         *   Aktivitas: Siswa diminta mencari contoh penerapan ${materi} dalam kehidupan sehari-hari di lingkungan mereka, yang relevan dengan tujuan pembelajaran.
         *   Guru: Menghubungkan ${materi} dengan isu-isu aktual atau profesi tertentu.
         *   Siswa: Mempresentasikan temuan mereka dan menjelaskan relevansinya.
       - Joyful Learning:
         *   Aktivitas: Menggunakan permainan edukatif berbasis kuis tentang ${materi} atau simulasi interaktif yang menyenangkan dan relevan dengan Kelas (${kelas}).
         *   Guru: Menciptakan suasana kelas yang positif dan suportif, memberikan pujian atas usaha siswa.
         *   Siswa: Bekerja dalam kelompok secara kolaboratif untuk menyelesaikan tantangan atau proyek mini terkait ${materi}.
      Sajikan langkah-langkah secara berurutan dan logis. Misalnya: eksplorasi konsep, diskusi dan elaborasi, aplikasi konsep, presentasi hasil.]

   3. Penutup (Durasi: sekitar 10-15% dari total menit yang telah diinterpretasikan dengan benar dari input ${alokasiWaktu})
      [Rincikan langkah-langkah penutup:
       - Kesimpulan Bersama: Ajak siswa menyimpulkan poin-poin penting pembelajaran ${materi} yang berkaitan dengan Tujuan Pembelajaran.
       - Refleksi (Mindful Learning): Guru dan siswa melakukan refleksi terhadap proses pembelajaran. Contoh pertanyaan refleksi untuk siswa: "Apa hal baru yang kamu pelajari hari ini?", "Bagian mana yang paling menarik?", "Apa yang masih membuatmu bingung?".
       - Umpan Balik: Guru memberikan umpan balik konstruktif terhadap partisipasi dan hasil belajar siswa, khususnya terkait pencapaian Tujuan Pembelajaran.
       - Penguatan Materi: Berikan penguatan singkat atau tugas tindak lanjut (jika perlu).
       - Informasi Pertemuan Berikutnya: Sampaikan topik untuk pertemuan selanjutnya.
       - Salam penutup.]

E. LAMPIRAN

   1. Rubrik Penilaian
      [Sediakan contoh rubrik penilaian yang relevan untuk salah satu asesmen formatif atau sumatif yang disebutkan di bagian C. Misalnya, rubrik untuk presentasi kelompok atau penilaian esai terkait ${materi}. Rubrik harus mencakup kriteria penilaian, deskriptor untuk setiap level capaian (misal: Sangat Baik, Baik, Cukup, Perlu Bimbingan), dan skor/bobot jika ada.]

   2. LKPD (Lembar Kerja Peserta Didik)
      [Sajikan LKPD yang sesuai dengan kegiatan inti pembelajaran ${materi} dan mendukung pencapaian Tujuan Pembelajaran. Mulai LKPD dengan format berikut:
       Nama          : .............................................
       Kelas         : .............................................
       Nomor Absen   : .............................................

       Petunjuk Pengerjaan:
       [Tuliskan di sini petunjuk umum pengerjaan LKPD, misalnya: "Bacalah setiap soal dengan teliti.", "Kerjakan soal secara mandiri/kelompok.", "Tuliskan jawabanmu pada tempat yang disediakan."]

       Kemudian, lanjutkan dengan tugas atau soal-soal LKPD. Fokus pada pertanyaan atau tugas yang mendorong siswa untuk:
       - Mengeksplorasi konsep ${materi}.
       - Menganalisis informasi.
       - Memecahkan masalah terkait ${materi}.
       - Mengkomunikasikan pemahaman mereka.
       LKPD harus menarik, jelas instruksinya, dan sesuai dengan tingkat kesulitan untuk Kelas (${kelas}). Jika memungkinkan, berikan variasi soal atau aktivitas di LKPD yang mencerminkan diferensiasi (misalnya, soal dengan tingkat kesulitan berbeda atau pilihan tugas).]

   3. Materi Ajar
      [Sediakan ringkasan singkat materi atau poin-poin kunci dari ${materi} yang akan diajarkan. Ini bukan materi lengkap, tetapi highlight yang bisa membantu guru mengingat inti materi. Bisa juga berupa saran sumber belajar tambahan (misal: tautan video pembelajaran, artikel, atau buku teks yang relevan dengan ${materi} dan Kelas (${kelas})).]

   4. Lembar Evaluasi Individu
      [Buatlah lembar evaluasi individu yang terpisah dari LKPD. Lembar ini harus berisi 3-4 soal yang secara langsung mengukur ketercapaian Tujuan Pembelajaran yang telah ditetapkan di Bagian B.
       - Mulai dengan format header standar:
         Nama          : .............................................
         Kelas         : .............................................
         Nomor Absen   : .............................................

         Petunjuk: Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!

       - Buat variasi jenis soal (misalnya, 1-2 Pilihan Ganda dengan opsi A, B, C, D dan 1-2 soal Esai Singkat) yang relevan dengan ${materi} dan sesuai untuk level kognitif siswa Kelas (${kelas}).
       - Setelah daftar soal, sertakan bagian "KUNCI JAWABAN DAN PEDOMAN PENSKORAN" yang jelas untuk setiap soal. Untuk esai, berikan poin-poin kunci yang diharapkan ada dalam jawaban dan usulan skor untuk setiap soal.]

Pastikan bahasa yang digunakan jelas, lugas, profesional, dan mudah dipahami oleh guru. Seluruh output harus dalam Bahasa Indonesia. Format akhir harus konsisten dan terstruktur dengan baik.
`;
};