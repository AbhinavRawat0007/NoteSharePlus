import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Note from "../models/Note.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/** -------------------------------
 *  File Upload Setup with Multer
 * ------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/**
 * POST /api/notes
 * Create a new note (with optional file upload)
 */
router.post("/", authMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    const { title, content, tags = [], isPublic = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    const note = await Note.create({
      title,
      content,
      tags: Array.isArray(tags) ? tags : JSON.parse(tags || "[]"),
      isPublic: isPublic === "true" || isPublic === true,
      createdBy: req.user.id,
      file: req.file ? `/uploads/${req.file.filename}` : null, // ✅ store full path
    });

    res.status(201).json({ success: true, message: "Note created ✅", data: note });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notes
 * Get all notes (with optional sort & pagination)
 */
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { sort = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // ✅ FIX: Changed 'user' to 'createdBy'
    const notes = await Note.find({ createdBy: req.user.id })
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // ✅ FIX: Changed 'user' to 'createdBy'
    const total = await Note.countDocuments({ createdBy: req.user.id });

    res.json({ success: true, total, page: pageNum, limit: limitNum, data: notes });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notes/:id
 * Get a single note by ID
 */
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found ❌" });

    // Increment views
    note.views = (note.views || 0) + 1;
    await note.save();

    res.json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/notes/:id
 * Update a note by ID
 */
router.put("/:id", authMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    const { title, content, tags, isPublic } = req.body;

    const note = await Note.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found ❌" });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
    if (typeof isPublic !== "undefined") note.isPublic = isPublic === "true" || isPublic === true;
    if (req.file) note.file = `/uploads/${req.file.filename}`; // ✅ update with full path

    await note.save();
    res.json({ success: true, message: "Note updated ✅", data: note });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/notes/:id
 * Delete a note by ID
 */
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found ❌" });

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted ✅" });
  } catch (err) {
    next(err);
  }
});

export default router;
