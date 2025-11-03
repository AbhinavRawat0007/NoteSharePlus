import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const imageModel = genAI.getGenerativeModel({ model: "imagen-3.0" }); // Free image generation

// 🔹 Helper for text responses
async function generateResponse(prompt) {
  const result = await textModel.generateContent(prompt);
  return result.response.text();
}

/**
 * 📌 Summarize Text
 */
router.post("/summarize", authMiddleware, async (req, res) => {
  try {
    const { text, type = "Brief" } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Summarize this text in a ${type.toLowerCase()} way:\n\n${text}`;
    const result = await generateResponse(prompt);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Gemini Summarize Error:", err);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

/**
 * 📌 Paraphrase Text
 */
router.post("/paraphrase", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Paraphrase this text in simpler, clearer words:\n\n${text}`;
    const result = await generateResponse(prompt);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Gemini Paraphrase Error:", err);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

/**
 * 📌 Generate Questions
 */
router.post("/questions", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Generate 5 study questions based on the following text:\n\n${text}`;
    const result = await generateResponse(prompt);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Gemini Questions Error:", err);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

/**
 * 📌 Study Guide
 */
router.post("/study", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Create a study guide from the following text. Include key points, definitions, and important notes:\n\n${text}`;
    const result = await generateResponse(prompt);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Gemini Study Guide Error:", err);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

/**
 * 📌 Extract Key Points
 */
router.post("/extract", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const prompt = `Extract the most important key points from the following text:\n\n${text}`;
    const result = await generateResponse(prompt);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Gemini Extract Error:", err);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

/**
 * 📌 Generate Images (Gemini Imagen 3.0)
 */
router.post("/images", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const result = await imageModel.generateContent(prompt);

    // Gemini returns base64 images
    const imageBase64 = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!imageBase64) {
      return res.status(500).json({ success: false, message: "No image generated" });
    }

    res.json({ success: true, result: `data:image/png;base64,${imageBase64}` });
  } catch (err) {
    console.error("Gemini Image Error:", err);
    res.status(500).json({ success: false, message: "AI image generation failed" });
  }
});

export default router;
