import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return secret;
};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
  }
};
