// Wrapper untuk Vercel Serverless Function
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// --- IMPORT DATA ---
const loveLetter = require('../server/data/loveLetter.json');
const memories = require('../server/data/memories.json');
const playlist = require('../server/data/playlist.json');

// --- SERVE STATIC FILES ---
const clientDir = path.join(__dirname, '..', 'client');
const publicDir = path.join(clientDir, 'public');

// Serve public folder (images, etc)
app.use('/images', express.static(path.join(publicDir, 'images')));

// Serve CSS, JSX, and other assets
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
// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

module.exports = app;
