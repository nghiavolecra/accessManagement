import { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as { roles: string[] } | undefined;
  if (!user) return res.status(401).json({ message: "Unauthenticated" });
  const allowed = user.roles.some(r => roles.includes(r));
  if (!allowed) return res.status(403).json({ message: "Forbidden" });
  next();
};