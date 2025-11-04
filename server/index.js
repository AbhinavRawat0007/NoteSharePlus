import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import aiRoutes from "./routes/ai.js";
import publicNotesRoutes from "./routes/publicNotesRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ ensure correct file name
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

// --- Fix __dirname in ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://noteshareplus.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/public-notes", publicNotesRoutes);
app.use("/api/user", userRoutes); // ✅ use singular (must match frontend fetch calls)

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You accessed a protected route ✅", user: req.user });
});

// Simple test route
app.get("/", (req, res) => {
  res.send("🚀 NoteShare+ backend is running!");
});

// --- Serve uploaded files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server ❌" });
});

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
