import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided ❌",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token ❌",
    });
  }
};
