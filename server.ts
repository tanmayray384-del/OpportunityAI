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

  // API Route for AI Career Assistant
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { profile, message, chatHistory } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API Key is not configured. Please add GEMINI_API_KEY to your Secrets panel under Settings." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct dynamic system instructions based on the student's profile context
      const systemInstruction = `You are "OpportunityAI Career Coach", a world-class AI Career Coach & Academic Advisor. Your job is to analyze a student's profile (skills, interests, college year, major branch, state/city, achievements, and career goals) and provide deep, customized recommendations.
      
STUDENT CURRENT PARAMETERS:
- Student Name: ${profile.name || "Student"}
- Technical Skills: ${profile.skills?.join(", ") || "None listed"}
- Fields of Interest: ${profile.interests?.join(", ") || "None listed"}
- Education Conditions: ${profile.collegeYear} Year studying ${profile.branch} Major
- Geographic Location: ${profile.city}, ${profile.state}, ${profile.country}
- Achievements / Portfolio: ${profile.achievements?.join(", ") || "None listed"}
- Career Objective Focus: "${profile.careerGoal || "General Technology Specialist"}"

IMPORTANT:
Always respond with precise, elegant Markdown styling. Use headers, bold text elements, bullet lists, and visual spacing to make the content beautiful.

Provide rich, highly practical advice on:
1. BEST CAREER PATHS: Specific, tailored career tracks that bridge their skills with interests.
2. RELEVANT INTERNSHIPS: Types of roles and companies they should target.
3. SUITABLE HACKATHONS: Style of hackathons and what projects they are primed to build there.
4. RECOMMENDED CERTIFICATIONS: Key credentials they should secure to stand out.
5. HIGHER-IMPACT PROJECTS TO BUILD: 2-3 specific, non-trivial, end-to-end projects they should construct.
6. SKILLS TO LEARN NEXT: The top 3 technical skills or toolings to learn immediately based on gaps.

Keep the tone encouraging, technical, pragmatic, and detailed. Ensure you refer to them by their first name (${(profile.name || "Student").split(' ')[0]}) and speak directly to their major (${profile.branch}) and location (${profile.city}, ${profile.state}) as localized advantages.`;

      // Formulate messages list
      const contents: any[] = [];
      if (chatHistory && chatHistory.length > 0) {
        chatHistory.forEach((msg: any) => {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      
      const promptText = message || "Analyze my profile and provide primary career assistant recommendations.";
      contents.push({
        role: 'user',
        parts: [{ text: promptText }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "An error occurred calling the Gemini API" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
