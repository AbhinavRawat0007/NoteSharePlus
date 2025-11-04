import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

dotenv.config();

const router = express.Router();

// --- Debug: confirm env present ---
console.log("✅ CO_API_KEY Loaded:", !!process.env.CO_API_KEY);

// --- Cohere v7 client ---
const cohere = new CohereClient({ apiKey: process.env.CO_API_KEY });

// --- Helper that works across response shapes ---
async function generateResponse(prompt) {
    try {
      const response = await cohere.chat({
        model: "command-nightly",
        message: prompt,  // ✅ correct for v7.19.0
      });
  
      // v7 returns plain text under response.text
      if (!response.text) throw new Error("No text returned");
      return response.text.trim();
  
    } catch (err) {
      console.error("🔥 Cohere Chat Error:", err?.message || err);
      throw new Error("AI request failed");
    }
  }
  

/* ---------------- TEMP: SELF TEST (no auth) ---------------- */
// Hit this to verify your key + SDK work without frontend/token issues
router.get("/_selftest", async (req, res) => {
  try {
    const out = await generateResponse("Reply with exactly: OK");
    res.json({
      ok: true,
      got: out.slice(0, 200),
      sdk: "cohere-ai@7.x chat()",
      env: { CO_API_KEY: !!process.env.CO_API_KEY },
    });
  } catch (e) {
    res
      .status(500)
      .json({ ok: false, error: e?.message || String(e), hint: "Check CO_API_KEY & model name" });
  }
});

/* ---------------- Your protected AI routes ---------------- */

router.post("/summarize", authMiddleware, async (req, res) => {
  try {
    const { text, type = "Brief" } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Summarize this text in a ${type.toLowerCase()} way:\n\n${text}`;
    const result = await generateResponse(prompt);
    res.json({ success: true, result });
  } catch (e) {
    console.error("Summarize error:", e?.message || e);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

router.post("/paraphrase", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Paraphrase this text in simpler, clearer words:\n\n${text}`;
    const result = await generateResponse(prompt);
    res.json({ success: true, result });
  } catch (e) {
    console.error("Paraphrase error:", e?.message || e);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

router.post("/questions", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Generate 5 study questions based on the following text:\n\n${text}`;
    const result = await generateResponse(prompt);
    res.json({ success: true, result });
  } catch (e) {
    console.error("Questions error:", e?.message || e);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

router.post("/study", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Create a study guide with key points, definitions, and important notes from the following:\n\n${text}`;
    const result = await generateResponse(prompt);
    res.json({ success: true, result });
  } catch (e) {
    console.error("Study error:", e?.message || e);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

router.post("/extract", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Extract the most important key points from the following text:\n\n${text}`;
    const result = await generateResponse(prompt);
    res.json({ success: true, result });
  } catch (e) {
    console.error("Extract error:", e?.message || e);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

export default router;
