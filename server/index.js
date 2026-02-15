const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- IMPORT DATA ---
// Pastikan file ini ada di dalam folder 'api/data/'
const loveLetter = require('./data/loveLetter.json');
const memories = require('./data/memories.json');
const playlist = require('./data/playlist.json');

// --- API ENDPOINTS ---
// Server CUMA melayani ini. Gak ngurusin HTML/Gambar lagi.
app.get('/api/love-letter', (req, res) => {
  res.json(loveLetter);
});

app.get('/api/memories', (req, res) => {
  res.json(memories);
});

app.get('/api/playlist', (req, res) => {
  res.json(playlist);
});

// Endpoint untuk ngecek server idup apa nggak
app.get('/api/health', (req, res) => {
  res.send('Server Valentine Aman Terkendali! ❤️');
});

// --- EXPORT BUAT VERCEL ---
module.exports = app;

// --- START LOCAL ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`❤️  API Ready di http://localhost:${PORT}`);
  });
}