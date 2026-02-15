// Wrapper untuk Vercel Serverless Function
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// --- IMPORT DATA ---
try {
  const loveLetter = require('./data/loveLetter.json');
  const memories = require('./data/memories.json');
  const playlist = require('./data/playlist.json');

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
} catch (error) {
  console.error('Error loading data files:', error);
  app.get('/api/*', (req, res) => {
    res.status(500).json({ error: 'Data files not found' });
  });
}

// --- SERVE STATIC FILES ---
const clientDir = path.join(__dirname, '..', 'client');
const publicDir = path.join(clientDir, 'public');

// Serve public folder (images, etc)
app.use('/images', express.static(path.join(publicDir, 'images')));

// Serve CSS, JSX, and other assets from client
app.use(express.static(clientDir));

// --- FALLBACK ROUTE ---
// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(clientDir, 'index.html');
  res.sendFile(indexPath);
});

module.exports = app;
