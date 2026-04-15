import 'dotenv/config';
import express from "express";

const app = express();

app.use(express.json());

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

app.get('/', (req, res) => {
  res.json({ message: 'MoodMirror API is running' });
});

export default app;
