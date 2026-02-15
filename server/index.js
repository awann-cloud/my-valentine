const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- KONFIGURASI PATH ---
const clientDir = path.join(__dirname, '..', 'client'); // Naik satu folder, masuk client

// --- PENTING: IMPORT DATA LANGSUNG DI ATAS ---
// Supaya Vercel gak bingung nyari filenya, kita "panggil" di awal.
// (Pastikan file JSON kamu ada di folder server/data/)
const loveLetter = require('./data/loveLetter.json');
const memories = require('./data/memories.json');
const playlist = require('./data/playlist.json');

// --- SETUP STATIC FILES (GAMBAR & FRONTEND) ---
// 1. Biar folder 'public' di client bisa diakses (buat gambar)
app.use(express.static(path.join(clientDir, 'public')));

// 2. Serve file statis frontend (HTML, CSS, JS)
app.use(express.static(clientDir));


// --- API ENDPOINTS (Pakai data yang udah di-load di atas) ---
app.get('/api/love-letter', (req, res) => {
  res.json(loveLetter);
});

app.get('/api/memories', (req, res) => {
  res.json(memories);
});

app.get('/api/playlist', (req, res) => {
  res.json(playlist);
});


// --- FALLBACK ROUTE ---
// Kalau user refresh halaman, balikin ke index.html biar gak error 404
app.use((req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

// --- EXPORT BUAT VERCEL ---
module.exports = app;

// --- START SERVER (Cuma jalan di Localhost) ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`❤️  Valentine App jalan di http://localhost:${PORT}`);
  });
}