// server/models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    file: { type: String }, // optional attachment
    isPublic: { type: Boolean, default: false }, // ✅ public/private toggle
    views: { type: Number, default: 0 }, // track popularity
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;