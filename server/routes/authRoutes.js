import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully ✅" });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials ❌" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login successful ✅",
      token,
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Get current logged-in user (protected)
 */
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found ❌" });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    // ✅ FIX: Use 'req.user.id' to match your 'GET /me' route
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

export default router;
