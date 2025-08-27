// apps/api/src/controllers/audit.controller.ts
import { Request, Response } from "express";
import { prisma } from "../config/env";

export async function list(req: Request, res: Response) {
  // optional: phân trang đơn giản ?page=1&limit=20
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: true, resource: true },
    }),
    prisma.auditLog.count(),
  ]);

  res.json({ page, limit, total, items });
}

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: { user: true, resource: true },
  });
  if (!log) return res.sendStatus(404);
  res.json(log);
}
