import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Pawsy Chatbot: Gemini AI Client successfully initialized.");
  } catch (err) {
    console.error("Pawsy Chatbot: Failed to initialize Gemini client.", err);
  }
} else {
  console.log("Pawsy Chatbot: No valid GEMINI_API_KEY found. Running in FAQ Fallback Mode.");
}

// System instructions for the Pawsy AI assistant
const PAWSY_SYSTEM_INSTRUCTIONS = `
You are Pawsy, the friendly, caring, and professional AI veterinary assistant for Heritage Veterinary Clinic in Coburg, VIC, Australia.

CORE INFORMATION:
- Clinic Name: Heritage Veterinary Clinic
- Address: 274 Sydney Rd, Coburg VIC 3058 (located right on Sydney Road)
- Phone: (03) 9386 1501
- Email: admin@heritagevets.com.au
- Opening Hours: Monday to Friday, 8:30am–5:30pm (Closed Saturday, Sunday, and public holidays)
- Tagline: "Providing medical and surgical services for small animal companions"
- General Booking Link: https://calendly.com/pawsy1432/heritage-veterinary-clinic

TONE & STYLE:
- Speak in warm, compassionate, and professional Australian English (use terms like "vet", "desexing", "boarding", "weight-loss program", "kilos").
- Keep your replies concise: **strictly 2 to 3 sentences** per response.
- Always remain friendly and focused on the pet's well-being.

CRITICAL PROTOCOLS:
1. EMERGENCY SAFETY: If the user mentions any emergency, urgent symptoms, or life-threatening distress (e.g., severe bleeding, difficulty breathing, poisoning, snake bite, seizures, hit by car, extreme lethargy, bloated stomach, unresponsive pet), you MUST IMMEDIATELY respond with this exact protocol and DO NOT attempt any medical diagnosis or advice:
   "This sounds urgent — please call Advanced Vet Care in Kensington now on (03) 9092 0400, or go to your nearest emergency vet immediately. They provide 24/7 emergency care as we do not have an after-hours vet on-site."

2. MEDICAL ADVICE: Never provide medical diagnoses, treatment plans, or drug dosing recommendations. Keep suggestions general (e.g., recommend scheduling an examination).

3. BOOKINGS: Always recommend using the official Calendly booking link (https://calendly.com/pawsy1432/heritage-veterinary-clinic) or calling (03) 9386 1501 during hours.

4. NEW PATIENTS: If the user is a new patient, kindly collect:
   - Owner Name
   - Pet Name & Species
   - Reason for visit
   Collect this in a warm, friendly tone, and direct them to book their appointment online or by phone.

KNOWLEDGE BASE (FAQs):
1. Opening hours? Mon-Fri, 8:30am-5:30pm. Closed weekends.
2. Location? 274 Sydney Rd, Coburg VIC 3058.
3. Phone? (03) 9386 1501.
4. Email? admin@heritagevets.com.au.
5. After-hours/Emergency? No on-site emergency care. Nearest recommended is Advanced Vet Care, Kensington, (03) 9092 0400.
6. Services? Health examinations, vaccinations, desexing, dental care, microchipping, digital radiography (X-rays), ultrasonography, flea/worming advice, nutritional guidance, nurse-led dog obedience support, surgical procedures, and the Pet Slimmers weight-loss program.
7. Cat boarding? Yes, cat boarding is available. Contact for availability and rates.
8. Microchipping? Yes, standard service. Book a consultation.
9. X-Rays? Yes, digital radiography on-site.
10. Overweight pets? Yes, nutritional advice and "Pet Slimmers" program are available.
11. How to book? Use Calendly (https://calendly.com/pawsy1432/heritage-veterinary-clinic) or call (03) 9386 1501.
12. New patient intake? Call or message with owner name, pet name, and reason.
13. What to bring first visit? Previous vet records, vaccination history, current diet details.
14. Dental care? Yes, core service. Assessments done during consultations.
15. Dog obedience? Yes, nurse-led dog obedience support.
`;

// API Endpoint for Pawsy Chatbot
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // If Gemini is not available, return a flag telling the frontend to use local fallback
  if (!ai) {
    return res.json({
      fallback: true,
      reason: "API key not configured",
    });
  }

  try {
    // Format history for Gemini generateContent SDK
    // Expected structure: [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const contents: any[] = [];

    if (Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.role === "user" || msg.role === "model") {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.content || msg.text || "" }],
          });
        }
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: PAWSY_SYSTEM_INSTRUCTIONS,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here to help. Could you please rephrase that?";
    return res.json({ reply, fallback: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Graceful fallback to local bot
    return res.json({
      fallback: true,
      reason: "API call failed",
      error: error.message,
    });
  }
});

// Serve frontend assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Pawsy Server: Starting in Development Mode.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Pawsy Server: Starting in Production Mode.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pawsy Fullstack Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
