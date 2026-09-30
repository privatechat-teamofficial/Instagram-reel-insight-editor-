import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize Google GenAI with recommended httpOptions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to analyze graph & metrics from an uploaded image with high precision
app.post('/api/analyze-graph', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not set on the server.',
        fallback: true,
      });
    }

    // Clean base64 data if data URL prefix is included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/png',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `You are an expert computer vision system specializing in Instagram Reel Insights analytics screenshots.
Carefully examine this image. It contains an Instagram Reel Insights graph and possibly summary metrics.

TASK 1: GRAPH EXTRACTION (CRITICAL & HIGH PRECISION)
- Locate the "Views over time" line chart with the magenta/pink line.
- Extract 'yMax': The peak number on the vertical Y-axis (e.g. 4000 for 4K, 10000 for 10K, 25000, 100000, etc.).
- Extract 'dates': Array of date strings shown along the bottom horizontal axis (e.g. ["12 Sept", "21 Sept", "29 Sept"]).
- Extract 'points': Exactly 20 to 28 sequential, evenly-spaced data points tracing the magenta line from the far left (start date) to the far right (end date).
  - For each point:
    - 'label': day or date marker (e.g. "12 Sept", "14 Sept", etc.)
    - 'all': estimated view count corresponding to the height of the line at this position relative to yMax (between 0 and yMax). Trace every bend, flat plateau, steep rise, and level-off accurately.
    - 'followers': follower count at this point (0 if not specified)
    - 'nonFollowers': non-follower count at this point (same as 'all' if all views are non-followers)

TASK 2: METRICS EXTRACTION (IF VISIBLE IN FULL SCREENSHOT)
If the image is a full or partial Reel Insights screenshot, extract:
- 'summary':
  - 'views': total views count in the Summary card (e.g. 5608)
  - 'viewers': total viewers count in Summary card (e.g. 1318)
  - 'averageWatchTime': average watch time string (e.g. "11s")
  - 'follows': follows count (e.g. 0)
- 'topMetrics':
  - 'likes': count under heart icon (e.g. 196)
  - 'comments': count under comment bubble (e.g. 0)
  - 'reposts': count under repost arrows (e.g. 0)
  - 'shares': count under share icon (e.g. 82)
  - 'saves': count under bookmark icon (e.g. 0)

Ensure points follow the exact trajectory of the line so when rendered as an SVG line chart it matches the screenshot 1:1.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            yMax: { type: Type.NUMBER, description: 'Maximum Y-axis scale value (e.g. 4000)' },
            dates: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Date markers along X-axis (e.g. ["12 Sept", "21 Sept", "29 Sept"])',
            },
            points: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  all: { type: Type.NUMBER },
                  followers: { type: Type.NUMBER },
                  nonFollowers: { type: Type.NUMBER },
                },
                required: ['label', 'all'],
              },
              description: 'Dense list of 20 to 28 sampled points tracing the curve from left to right',
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                views: { type: Type.NUMBER },
                viewers: { type: Type.NUMBER },
                averageWatchTime: { type: Type.STRING },
                follows: { type: Type.NUMBER },
              },
            },
            topMetrics: {
              type: Type.OBJECT,
              properties: {
                likes: { type: Type.NUMBER },
                comments: { type: Type.NUMBER },
                reposts: { type: Type.NUMBER },
                shares: { type: Type.NUMBER },
                saves: { type: Type.NUMBER },
              },
            },
          },
          required: ['yMax', 'dates', 'points'],
        },
      },
    });

    const outputText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(outputText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing graph with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze graph image',
      fallback: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
