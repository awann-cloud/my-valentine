const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Path Folder
const dataDir = path.join(__dirname, 'data');
const clientDir = path.join(__dirname, '..', 'client'); // Naik satu folder, masuk client

// Folder Images (Hati-hati, di Vercel folder public server kadang gak kebaca)
// Tapi buat local ini aman.
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(clientDir, 'public')));

// Helper Load JSON
function loadJson(fileName) {
  try {
    return require(path.join(dataDir, fileName));
  } catch (e) {
    console.error("Error loading JSON:", e);
    return {};
  }
}

// --- API ENDPOINTS ---
app.get('/api/love-letter', (req, res) => {
  const letter = loadJson('loveLetter.json');
  res.json(letter);
});

app.get('/api/memories', (req, res) => {
  const memories = loadJson('memories.json');
  res.json(memories);
});

app.get('/api/playlist', (req, res) => {
  const playlist = loadJson('playlist.json');
  res.json(playlist);
});

// --- BAGIAN FRONTEND ---
// 1. Serve file statis (HTML, CSS, JS dari folder client)
app.use(express.static(clientDir));

// 2. Fallback Route: Kalau route gak ketemu, balikin ke index.html
// (Penting buat React biar gak 404 pas di-refresh)
app.use((req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

// --- BAGIAN YANG DIUBAH BUAT VERCEL ---
// (Copy dari sini ke bawah ya!)

// Export app supaya Vercel bisa "pinjam" backend lo
module.exports = app;

// Cek: Apakah file ini dijalankan langsung di laptop?
// Kalau iya, nyalain servernya. Kalau di Vercel, jangan nyalain (nanti Vercel marah).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`❤️  Valentine App jalan di http://localhost:${PORT}`);
  });
}