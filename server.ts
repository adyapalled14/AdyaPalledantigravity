import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to analyze waste image using Gemini 2.5 flash / 4 hydrogen
app.post('/api/analyze-waste', async (req, res) => {
  try {
    const { image, prompt } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');

    const customPrompt = prompt || "Analyze this image of garbage/waste in Bengaluru. Classify the waste type, estimate volume, urgency level, and provide a 1-sentence description.";

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: customPrompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            waste_type: {
              type: Type.STRING,
              description: "Must be one of: Organic/Wet, Dry/Recyclable, Hazardous, Construction & Demolition, Mixed",
            },
            estimated_volume: {
              type: Type.STRING,
              description: "Must be one of: Small, Medium, Large/Bulk",
            },
            urgency_level: {
              type: Type.STRING,
              description: "Must be one of: Normal, High",
            },
            description: {
              type: Type.STRING,
              description: "A short 1-sentence summary of the waste observed.",
            }
          },
          required: ["waste_type", "estimated_volume", "urgency_level", "description"]
        }
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);
    res.json(resultJson);
  } catch (error: any) {
    console.error('Gemini analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze waste image' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`CleanBBMP server running on http://localhost:${port}`);
  });
}

startServer();
