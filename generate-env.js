const fs = require('fs');
const path = require('path');

// API_KEY ini akan diambil dari environment variable yang Anda set di Vercel
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn(
    'PERINGATAN: Environment variable API_KEY tidak diatur untuk proses build. ' +
    'Aplikasi kemungkinan akan gagal terhubung ke Gemini API. ' +
    'Mohon atur API_KEY pada environment variable di proyek Vercel Anda.'
  );
}

// Gunakan JSON.stringify untuk memastikan API key di-escape dengan benar
// dan aman untuk dimasukkan ke dalam file JavaScript.
const configObject = {
  API_KEY: apiKey || ''
};
const configContent = `window.APP_CONFIG = ${JSON.stringify(configObject)};`;

// Menulis config.js ke direktori root, tempat index.html berada
const outputPath = path.join(__dirname, 'config.js');

try {
  fs.writeFileSync(outputPath, configContent);
  console.log(`Berhasil membuat ${outputPath} dengan API_KEY.`);
} catch (error) {
  console.error(`Error saat membuat ${outputPath}:`, error);
  process.exit(1); // Keluar dengan error agar proses build Vercel gagal jika ada masalah
}
