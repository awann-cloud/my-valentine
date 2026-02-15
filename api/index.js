const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// --- IMPORT DATA ---
let loveLetter = null;
let memories = null;
let playlist = null;

try {
  loveLetter = require('./data/loveLetter.json');
  memories = require('./data/memories.json');
  playlist = require('./data/playlist.json');
  console.log('✅ Data files loaded successfully');
} catch (error) {
  console.error('❌ Error loading data files:', error.message);
}

// --- API ENDPOINTS ONLY ---
app.get('/api/love-letter', (req, res) => {
  if (!loveLetter) {
    return res.status(500).json({ error: 'loveLetter not loaded' });
  }
  res.json(loveLetter);
});

app.get('/api/memories', (req, res) => {
  if (!memories) {
    return res.status(500).json({ error: 'memories not loaded' });
  }
  res.json(memories);
});

app.get('/api/playlist', (req, res) => {
  if (!playlist) {
    return res.status(500).json({ error: 'playlist not loaded' });
  }
  res.json(playlist);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;

