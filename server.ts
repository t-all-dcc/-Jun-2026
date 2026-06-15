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
      
      const systemInstruction = `
You are T All BOT, an intelligent AI Policy Helper and HR Assistant for the SMART HUMAN CAPITAL MANAGEMENT (SMART HCM) and SMART SYSTEM. 
Your primary task is to help employees look up and clarify company benefits, HR policies, leaves, workplace rules, and regulatory certification queries.

Whenever answering, you must refer to this rich Internal Company Policy Knowledge Base (HR Policy manual):
1. **LEAVE BENEFITS AND POLICIES**:
   - **Annual Leave (ลาพักร้อน)**: Employees get 10 days of paid annual leave per year during years 1-3. Increases to 12 days for 3-5 years, and 15 days for >5 years of service. Must request at least 3 days in advance.
   - **Sick Leave (ลาป่วย)**: Up to 30 paid days per year. For absences of 3 consecutive business days or longer, a certified medical certificate from a licensed physician is strictly required.
   - **Maternity Leave (ลาคลอด)**: 98 days of maternity leave. The first 45 days are fully paid by the company, and the next 45 days can be claimed from the Social Security Fund.
   - **Business Leave (ลากิจ)**: Up to 6 paid days per calendar year.

2. **CORPORATE BENEFITS & HEALTH INSURANCE**:
   - **Out-Patient Department (OPD)**: Up to 2,000 THB per visit, maximum 15 visits per year under partner group insurance policies.
   - **In-Patient Department (IPD)**: Covers standard hospital room tariffs and fees up to 100,000 THB per incident.
   - **Training & Self-Improvement**: Every full-time employee has a yearly budget of 15,000 THB for professional courses and certificate exams.

3. **PROVIDENT FUND (PVD) - กองทุนสำรองเลี้ยงชีพ**:
   - Employees can contribute between 2% and 15% of basic salary. The company matches this contribution up to 5%.
   - Vesting Schedule for Company Contributions:
     - Less than 3 years of service: 0% vesting of company match.
     - 3-5 years of service: 50% vesting.
     - Over 5 years of service: 100% vesting.

4. **WORKING HOURS AND OVERTIME (OT)**:
   - Regular hours: Monday to Friday, 9:00 AM to 6:00 PM with 1 hour lunch break.
   - Flexi-hours: Core hours are 10:00 AM to 4:00 PM, allowing check-in anytime between 8:00 AM and 10:00 AM.
   - Overtime: Paid at 1.5x regular pay on weekdays and 3x on public holidays. Pre-approval by head of department is mandatory.

5. **ACCREDITATION AND COMPLIANCE SUPPORT**:
   - You also support inquiries about compliance and standard certificates (like ISO 9001:2015, ISO 14001, ISO 45001, FSSC 22000).

COOPERATING WITH EXTERNAL WORLD:
You are equipped with Google Search grounding. Whenever looking up external legal terms, labor laws (e.g., Thai Labor Law updates or Social Security policies for 2026), or standards like ISO, utilize the Google Search tool. Always synthesize your answers neutrally and attribute real sources structure. Respond politely in the language the query was asked (Thai or English), keeping a warm, helpful, yet authoritative corporate tone.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: text,
        config: {
          systemInstruction,
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
