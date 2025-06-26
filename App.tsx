
import React, { useState, useCallback } from 'react';
import { LessonPlanForm } from './components/LessonPlanForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { generateLessonPlanPrompt } from './services/geminiService';
import { LessonPlanInput } from './types';
import { GoogleGenAI } from '@google/genai';
import { jsPDF } from 'jspdf'; // Import jsPDF
import { markdownToHtml, markdownToPlainText } from './utils/markdownUtils'; 

// Ambil API_KEY dari konfigurasi global yang di-inject oleh config.js
// @ts-ignore
const API_KEY = window.APP_CONFIG?.API_KEY;

const App: React.FC = () => {
  const [lessonPlanInput, setLessonPlanInput] = useState<LessonPlanInput | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (data: LessonPlanInput) => {
    if (!API_KEY) {
      setError("Kunci API tidak tersedia. Pastikan API_KEY telah dikonfigurasi dengan benar di environment variable Vercel dan build berhasil dijalankan.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);
    setLessonPlanInput(data);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const prompt = generateLessonPlanPrompt(data);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
      });

      const genPlanText = response.text;
      if (!genPlanText || genPlanText.trim() === "") {
        setGeneratedPlan(null); 
        setError("Gagal menghasilkan konten RPP. AI mengembalikan respons kosong. Silakan sesuaikan input Anda atau coba lagi nanti.");
      } else {
        setGeneratedPlan(genPlanText);
      }

    } catch (e) {
      console.error("Error generating lesson plan:", e);
      setGeneratedPlan(null);
      setError("Terjadi kesalahan saat membuat RPP. Silakan coba lagi.");
      if (e instanceof Error) {
         setError(`Terjadi kesalahan: ${e.message}. Pastikan API Key valid dan model tersedia.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDownloadPdf = useCallback(async () => {
    if (!generatedPlan || !lessonPlanInput) return;

    setIsLoading(true);
    setError(null);

    try {
      const htmlContent = markdownToHtml(generatedPlan);
      if (htmlContent.startsWith("<p>Tidak ada konten")) { // Error check from markdownToHtml
          setError("Gagal membuat PDF: Konten RPP tidak valid atau kosong setelah pembersihan.");
          setIsLoading(false); 
          return;
      }

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4' 
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 30; 
      const contentWidth = pdfWidth - (margin * 2);
      
      const windowWidthForHtmlRender = 1200; 
      const scale = contentWidth / windowWidthForHtmlRender; 

      const fileName = `RPP_Modul_Ajar_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_') || 'Generated'}.pdf`;

      await pdf.html(htmlContent, {
        callback: (doc) => {
          doc.save(fileName);
        },
        margin: [margin, margin, margin, margin], 
        autoPaging: 'text', 
        width: contentWidth, 
        windowWidth: windowWidthForHtmlRender, 
        html2canvas: {
            scale: scale, 
            useCORS: true,
            // letterRendering: true, 
        }
      });
    } catch (e) {
      console.error("Error generating PDF:", e);
      setError("Gagal membuat file PDF. Silakan coba lagi.");
       if (e instanceof Error) {
         setError(`Kesalahan PDF: ${e.message}`);
      }
    } finally {
        setIsLoading(false);
    }
  }, [generatedPlan, lessonPlanInput]);

  const handleDownloadTxt = useCallback(async () => {
    if (!generatedPlan || !lessonPlanInput) return;

    setIsLoading(true);
    setError(null);

    try {
      const plainTextContent = markdownToPlainText(generatedPlan);
      if (plainTextContent.includes("Tidak ada konten RPP")) { 
          setError("Gagal membuat TXT: Konten RPP tidak valid atau kosong setelah pembersihan.");
          setIsLoading(false);
          return;
      }

      const fileName = `RPP_Modul_Ajar_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_') || 'Generated'}.txt`;
      const blob = new Blob([plainTextContent], { type: 'text/plain;charset=utf-8' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (e) {
      console.error("Error generating TXT:", e);
      setError("Gagal membuat file TXT. Silakan coba lagi.");
       if (e instanceof Error) {
         setError(`Kesalahan TXT: ${e.message}`);
      }
    } finally {
        setIsLoading(false);
    }
  }, [generatedPlan, lessonPlanInput]);

  const handlePrint = useCallback(() => {
    if (!generatedPlan) return;
    window.print();
  }, [generatedPlan]);


  const downloadButtonBaseClass = "text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base flex items-center justify-center gap-2 w-full sm:w-auto no-print";


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4 sm:p-6 md:p-8 text-slate-100" style={{fontFamily: "'Poppins', sans-serif"}}>
      <header className="text-center mb-8 no-print">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
          Generator RPP/Modul Ajar Cerdas
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Buat RPP Inovatif dengan Prinsip Mindful, Meaningful, & Joyful Learning
        </p>
      </header>

      <main className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 no-print">
          <LessonPlanForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>

        <div id="lesson-plan-display-container" className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 min-h-[400px] flex flex-col items-center justify-start print-content">
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && (
            <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg w-full max-w-md border border-red-300">
              <p className="font-semibold text-xl">Error!</p>
              <p>{error}</p>
            </div>
          )}
          {generatedPlan && !isLoading && !error && lessonPlanInput && (
            <div className="w-full">
              <div className="text-center mb-6 no-print">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-green-700 mb-2">RPP Berhasil Dibuat!</h2>
                <p className="text-slate-700 mb-4 text-md">
                  Gunakan tombol di bawah untuk mengunduh atau mencetak RPP Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleDownloadPdf}
                    className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`}
                    aria-label="Unduh RPP sebagai PDF"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Unduh PDF</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`}
                    aria-label="Unduh RPP sebagai TXT"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Unduh TXT</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className={`${downloadButtonBaseClass} bg-teal-500 hover:bg-teal-600`}
                    aria-label="Cetak RPP"
                    disabled={isLoading || !generatedPlan}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Cetak RPP</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-300 pt-4 no-print"></div>
              <LessonPlanDisplay planText={generatedPlan} />
            </div>
          )}
          {!isLoading && !error && !generatedPlan && (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-500 text-center no-print">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-xl">RPP/Modul Ajar akan dihasilkan di sini.</p>
              <p className="text-sm">Isi formulir di samping dan klik "Buat RPP" untuk memulai.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center mt-12 py-6 border-t border-slate-700 no-print">
        <p className="text-slate-400 text-sm">
          Powered by Google Gemini API & React. Dibuat dengan ❤️ untuk para pendidik Indonesia.
        </p>
      </footer>
    </div>
  );
};

export default App;
