import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload { sub: string; roles: string[]; }

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    (req as any).user = payload; // attach
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}