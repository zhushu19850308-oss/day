import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for generating growth cards
  app.post("/api/generate", async (req, res) => {
    const { keyword } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `你是一位儿童成长顾问。用户输入了关键词：${keyword}。请生成一张今日成长卡片，包含：
◦ 一句鼓励人心的金句（20 字以内，适合孩子）
◦ 今日行动建议（一个具体小行动，50 字以内）
◦ 今日反思问题（一个引发思考的问题，30 字以内）
语气温暖活泼，返回标准的 JSON 格式。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quote: {
                type: Type.STRING,
                description: "一句鼓励人心的金句",
              },
              action: {
                type: Type.STRING,
                description: "今日行动建议",
              },
              reflection: {
                type: Type.STRING,
                description: "今日反思问题",
              },
            },
            required: ["quote", "action", "reflection"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("AI failed to generate content.");
      }

      res.json(JSON.parse(text));
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate growth card." });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
