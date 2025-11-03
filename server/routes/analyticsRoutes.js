import express from "express";
import Note from "../models/Note.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Dashboard Stats
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ user: req.user });
  const totalViews = notes.reduce((acc, n) => acc + n.views, 0);

  res.json({
    notes: notes.length,
    views: totalViews,
    recent: notes.slice(0, 5),
  });
});

export default router;
