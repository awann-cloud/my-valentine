const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- KONFIGURASI PATH ---
// Penjelasan: __dirname itu sekarang ada di folder "api".
// Kita naik satu level ('..') buat keluar ke root, terus masuk ke "client".
const clientDir = path.join(__dirname, '..', 'client');

// --- IMPORT DATA (Static Require) ---
// Karena folder "data" ikut pindah ke dalam folder "api",
// path-nya tetap './data/...' (relatif terhadap file ini).
const loveLetter = require('./data/loveLetter.json');
const memories = require('./data/memories.json');
const playlist = require('./data/playlist.json');

// --- STATIC FILES (GAMBAR & FRONTEND) ---

// 1. Biar folder 'public' di dalam client bisa diakses (buat gambar)
// Penting buat Vercel biar bisa baca /images/foto.jpg
app.use(express.static(path.join(clientDir, 'public')));

// 2. Serve file statis frontend (HTML, CSS, JS)
app.use(express.static(clientDir));


// --- API ENDPOINTS ---
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
// Kalau user refresh halaman atau buka link ngawur, balikin ke index.html
app.use((req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

// --- EXPORT BUAT VERCEL ---
// Ini Wajib biar Vercel ngenalin ini sebagai Serverless Function
module.exports = app;

// --- START SERVER (Cuma jalan di Localhost) ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`❤️  API Valentine jalan di http://localhost:${PORT}`);
  });
}