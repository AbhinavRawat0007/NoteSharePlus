import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * ✅ Get current user profile
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("❌ Fetch profile error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

/**
 * ✅ Update user profile
 */
router.put("/update", authMiddleware, async (req, res, next) => {
    try {
      // 1. Get all the data from the body
      const { name, university, academicYear, major, bio, studyPreferences } =
        req.body;
  
      // 2. Find the user by their ID from the token
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      // 3. Update the user object's properties
      // This pattern handles fields that might be empty or unchanged
      user.name = name;
      user.university = university;
      user.academicYear = academicYear;
      user.major = major;
      user.bio = bio;
      user.studyPreferences = studyPreferences;
  
      // 4. Save the updated user (this will run full validation)
      const updatedUser = await user.save();
  
      // 5. Send back the updated user data (without the password)
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
  
      res.json({
        success: true,
        message: "Profile updated successfully",
        data: userResponse,
      });
    } catch (err) {
      // 5. If user.save() fails (e.g., validation error), we'll catch it here
      console.error("❌ Update profile error:", err);
      // Send the specific validation error if it exists
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ success: false, message: err.message });
      }
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  });
export default router;
