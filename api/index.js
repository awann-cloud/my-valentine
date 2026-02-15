// Wrapper untuk Vercel Serverless Function
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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

// --- API ENDPOINTS ---
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

// --- SERVE STATIC FILES ---
const clientDir = path.join(__dirname, '..', 'client');
const publicDir = path.join(clientDir, 'public');

// Serve images
app.use('/images', express.static(path.join(publicDir, 'images'), {
  maxAge: '1d',
  etag: false
}));

// Serve client static files (CSS, JS, etc)
app.use(express.static(clientDir, {
  maxAge: '1h',
  etag: false
}));

// --- FALLBACK ROUTE ---
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(clientDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'index.html not found' });
    }
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).json({ error: 'Failed to serve index.html' });
  }
});

module.exports = app;
