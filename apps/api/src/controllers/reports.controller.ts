// apps/api/src/controllers/reports.controller.ts
import { Request, Response } from "express";
import { prisma } from "../config/env";
import { Prisma } from "@prisma/client";

export async function accessSummary(req: Request, res: Response) {
  // --- Parse query ---
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;

  const where =
    from || to
      ? {
        createdAt: {
          gte: from ?? undefined,
          lt: to ?? undefined,
        },
      }
      : {};

  // --- Groupings song song ---
  const [byResourceRaw, byStatusRaw, byRequesterRaw] = await Promise.all([
    prisma.accessRequest.groupBy({
      by: ["resourceId"],
      where,
      _count: { _all: true },
    }),
    prisma.accessRequest.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
    prisma.accessRequest.groupBy({
      by: ["requesterId"],
      where,
      _count: { _all: true },
    }),
  ]);

  // Lấy tên resource
  const resourceIds = byResourceRaw.map((x) => x.resourceId);
  const resources = resourceIds.length
    ? await prisma.resource.findMany({
      where: { id: { in: resourceIds } },
      select: { id: true, name: true },
    })
    : [];
  const resourceMap = Object.fromEntries(resources.map((r) => [r.id, r.name]));

  const byResource = byResourceRaw.map((x) => ({
    resourceId: x.resourceId,
    resourceName: resourceMap[x.resourceId] ?? x.resourceId,
    count: x._count._all,
  }));

  const byStatus = byStatusRaw.map((x) => ({
    status: x.status,
    count: x._count._all,
  }));

  // Gom theo department (join qua User)
  const requesterIds = byRequesterRaw.map((x) => x.requesterId);
  const users = requesterIds.length
    ? await prisma.user.findMany({
      where: { id: { in: requesterIds } },
      select: { id: true, department: true },
    })
    : [];
  const depMap = new Map(users.map((u) => [u.id, u.department ?? "Unknown"]));
  const depAgg: Record<string, number> = {};
  for (const r of byRequesterRaw) {
    const dep = depMap.get(r.requesterId) ?? "Unknown";
    depAgg[dep] = (depAgg[dep] ?? 0) + r._count._all;
  }
  const byDepartment = Object.entries(depAgg).map(([department, count]) => ({
    department,
    count,
  }));

  // Xu hướng theo ngày (date_trunc)
  const whereClauses: Prisma.Sql[] = [];
  if (from) whereClauses.push(Prisma.sql`"createdAt" >= ${from}`);
  if (to) whereClauses.push(Prisma.sql`"createdAt" < ${to}`);
  const whereSql =
    whereClauses.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(whereClauses, " AND ")}`
      : Prisma.empty;

  const trendDailyRaw = await prisma.$queryRaw<
    { day: Date; count: bigint }[]
  >(Prisma.sql`
    SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::bigint AS count
    FROM "AccessRequest"
    ${whereSql}
    GROUP BY 1
    ORDER BY 1
  `);
  const trendDaily = trendDailyRaw.map((r) => ({
    date: r.day,
    count: Number(r.count),
  }));

  // Totals
  const totalRequests = byStatus.reduce((s, x) => s + x.count, 0);
  const totals = {
    requests: totalRequests,
    approved: byStatus.find((x) => x.status === "approved")?.count ?? 0,
    rejected: byStatus.find((x) => x.status === "rejected")?.count ?? 0,
    pending: byStatus.find((x) => x.status === "pending")?.count ?? 0,
    expired: byStatus.find((x) => x.status === "expired")?.count ?? 0,
  };

  return res.json({
    period: {
      from: from ?? null,
      to: to ?? null,
    },
    totals,
    byResource,
    byStatus,
    byDepartment,
    trendDaily,
  });
}
