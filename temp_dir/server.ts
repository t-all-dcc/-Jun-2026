import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { text, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(503).json({ 
          error: "GEMINI_API_KEY is not configured",
          needKey: true 
        });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: text,
        config: {
          systemInstruction: "You are T All BOT, an intelligent assistant for the SMART CERT system.",
          tools: [{ googleSearch: {} }]
        }
      });
      
      const reply = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({ reply, groundingChunks });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
