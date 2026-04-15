import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// API Routes (define before static files so they take precedence)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health check passed' });
});

app.post('/api/mood/analyze', async (req, res) => {
  try {
    const { method, data } = req.body;
    
    if (!method || !data) {
      return res.status(400).json({ message: 'Method and data are required' });
    }

    console.log(`Analyzing mood - method: ${method}, data: ${data}`);

    // For now, return a simple response
    res.json({
      mood: 'happy',
      energy: 'high',
      intent: 'uplift',
      confidence: 0.85,
      recommendations: ['smile', 'breathe'],
      games: [],
      outfits: [],
      playlists: []
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
});

// Serve static files from dist/public
const staticPath = path.join(__dirname, '../dist/public');
app.use(express.static(staticPath));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
