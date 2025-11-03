import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    university: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    major: { type: String, default: "" },
    bio: { type: String, default: "" },
    studyPreferences: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
