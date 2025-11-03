import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

/**
 * ✅ Get all public notes (with search)
 */
router.get("/", async (req, res) => {
  try {
    const { q } = req.query; // search query
    let filter = { isPublic: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    const notes = await Note.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notes });
  } catch (err) {
    console.error("❌ Fetch public notes error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch public notes" });
  }
});

/**
 * ✅ Increment views when someone opens a public note
 */
router.post("/:id/view", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.isPublic) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.views++;
    await note.save();

    res.json({ success: true, data: note });
  } catch (err) {
    console.error("❌ View note error:", err);
    res.status(500).json({ success: false, message: "Failed to update views" });
  }
});

export default router;
