import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Lazy initialization of Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      aiClient = new GoogleGenAI({ apiKey: key });
    }
    return aiClient;
  }

  // API Route - Confrontational Question Generator
  app.post("/api/confront", async (req, res) => {
    try {
      const { promises, realities, profile } = req.body;
      
      // Fallback if no API Key is set to avoid breaking the UI for the user before they set their key
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        const mockQuestions = [
          "por que você passou as últimas duas horas ajustando o kerning de um botão ao invés de estruturar a arquitetura de informação do projeto?",
          "você realmente precisava ler 4 artigos sobre o renascimento da tipografia suíça ou estava apenas fugindo daquela planilha de dados de teste?",
          "o layout principal do cliente está intocado desde ontem, mas seu repositório de experimentos com canvas tem novos branches. o que você está temendo?",
          "por que o seletor de paleta de cores sutil levou mais tempo do que a tela de fluxo de checkout inteira?",
          "será que 12 abas de pesquisa de teclado mecânico realmente vão te ajudar a finalizar essa entrega atrasada?",
          "você está organizando arquivos no figma com cores perfeitas para esconder que não sabe por onde começar o layout principal?",
          "por que você está polindo as sombras do botão de salvar quando o fluxo de autenticação nem foi rascunhado?"
        ];
        const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
        return res.json({ question: randomQuestion, simulated: true });
      }

      const ai = getGenAI();
      const plistText = (promises || []).map((p: string) => `- ${p}`).join("\n");
      const rlistText = (realities || []).map((r: any) => `- ${r.text} (${r.status})`).join("\n");
      
      const prompt = `
You are Pyxis, a highly observant, minimalist, and direct ambient AI assistant for designers. Your tone is dry, surgical, calm, and slightly provocative, but completely supportive of deep work. You speak in Portuguese (Brazil) and use lowercase exclusively.

Look at these logs of what the designer promised to do versus what actually happened:
Promises:
${plistText}

Realities / browser activity:
${rlistText}

Designer specialty/profile: ${profile || "Design de Interfaces"}

Analyze their procrastination or avoidances. Identify the exact thing they are avoiding (usually the hardest creative layout, the core logic, or the final client-ready assembly). Ask them ONE direct, confrontational, lower_case sentence question about what they are avoiding, styled like a physical navigation compass confronting them.
No introduction, no emojis, no exclamation marks. Maximum 15 words. Keep it strictly lowercase and end with list-aligned question mark.
Example: "por que você está polindo as sombras do botão em vez de resolver o fluxo de checkout?"
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let question = response.text?.trim() || "";
      // Clean up response to ensure lowercase and no punctuation except a question mark
      question = question.toLowerCase().replace(/[!.]/g, "").trim();
      if (question && !question.endsWith("?")) {
        question += "?";
      }

      res.json({ question: question || "por que você está evitando o layout?", simulated: false });
    } catch (error: any) {
      console.error("Gemini confronting failed:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route - Passive Speech parsing into Task Promise
  app.post("/api/parse-speech", async (req, res) => {
    try {
      const { speech } = req.body;
      if (!speech) {
        return res.status(400).json({ error: "Speech text is required" });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.json({
          promise: speech.toLowerCase().replace(/[.!;?]/g, "").trim(),
          parsed: true,
          simulated: true
        });
      }

      const ai = getGenAI();
      const prompt = `
You are Pyxis, an ambient design companion. Given this piece of text transcribed from a designer's spoken statement in Portuguese, extract a single concise task promise in Portuguese.
It must be in lowercase, maximum 10 words, starting with a direct verb.
Speech: "${speech}"
Output only the parsed task promise. No introductory or explanatory text.
`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const promiseText = response.text?.trim().toLowerCase().replace(/[.!;?]/g, "") || speech;
      res.json({ promise: promiseText, parsed: true, simulated: false });
    } catch (error: any) {
      console.error("Speech parse failed:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route - Get system state status details
  app.get("/api/status", (req, res) => {
    res.json({
      online: true,
      model: "gemini-2.5-flash",
      listening: true,
      keyConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // Handle Vite server for front-end assets
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
    console.log(`[Pyxis Instrument Server] active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
