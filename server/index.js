const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- IMPORT DATA (Static Require) ---
// Path tetap relatif terhadap file server/index.js
const loveLetter = require('./data/loveLetter.json');
const memories = require('./data/memories.json');
const playlist = require('./data/playlist.json');

// --- API ENDPOINTS SAJA (Vercel akan handle static files) ---
app.get('/api/love-letter', (req, res) => {
  res.json(loveLetter);
});

app.get('/api/memories', (req, res) => {
  res.json(memories);
});

app.get('/api/playlist', (req, res) => {
  res.json(playlist);
});

// --- EXPORT BUAT VERCEL ---
// Ini Wajib biar Vercel ngenalin ini sebagai Serverless Function
module.exports = app;

// --- START SERVER (Cuma jalan di Localhost) ---
if (require.main === module) {
  const clientDir = path.join(__dirname, '..', 'client');
  
  // Serve static files untuk development
  app.use(express.static(path.join(clientDir, 'public')));
  app.use(express.static(clientDir));
  
  // Fallback untuk development
  app.use((req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`❤️  API Valentine jalan di http://localhost:${PORT}`);
  });
}
