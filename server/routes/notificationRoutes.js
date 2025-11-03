import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Dummy notifications
const notifications = [
  { id: 1, text: "Your note 'Limits and Continuity' got 5 new views." },
  { id: 2, text: "Class 'Calculus I' has a new member." },
];

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

router.get("/", auth, (req, res) => {
  res.json(notifications);
});

export default router;
