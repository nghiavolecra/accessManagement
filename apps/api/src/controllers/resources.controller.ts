// apps/api/src/controllers/resources.controller.ts
import { Request, Response } from "express";
import { prisma } from "../config/env";
import type { Prisma as PrismaTypes } from "@prisma/client"; // chỉ để khai báo type
import { Prisma } from "@prisma/client"; // để dùng giá trị như DbNull, JsonNull
import { writeAudit } from "../utils/audit";

function toNullableJson(
  val: unknown
): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined {
  if (val === undefined) return undefined;      // không đụng tới cột
  if (val === null) return Prisma.DbNull;       // đặt DB NULL (hoặc Prisma.JsonNull nếu muốn JSON 'null')
  return val as Prisma.InputJsonValue;          // object/array/primitive hợp lệ
}

// Giữ literal type ổn định khi include (nếu muốn đếm liên quan)
const resourceArgs = {} as const;
type Resource = Prisma.ResourceGetPayload<{ include: typeof resourceArgs }>;

// utility: xác định vai trò
function isPrivileged(roles: string[] | undefined | null) {
  return !!roles?.some((r) => r === "Admin" || r === "Manager");
}

// enum hợp lệ theo schema.prisma
const RESOURCE_TYPES = ["physical", "digital", "system"] as const;
const SECURITY_LEVELS = ["low", "medium", "high", "critical"] as const;

type ResourceType = (typeof RESOURCE_TYPES)[number];
type SecurityLevel = (typeof SECURITY_LEVELS)[number];

function validateType(v: unknown): v is ResourceType {
  return typeof v === "string" && (RESOURCE_TYPES as readonly string[]).includes(v);
}
function validateSecurity(v: unknown): v is SecurityLevel {
  return typeof v === "string" && (SECURITY_LEVELS as readonly string[]).includes(v);
}

// -------------------- LIST --------------------
export async function list(req: Request, res: Response) {
  const user = (req as any).user as { sub: string; roles?: string[] } | undefined;

  // Phân trang & sort đơn giản
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const where = isPrivileged(user?.roles) ? {} : { isActive: true };

  const [items, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      ...resourceArgs,
    }),
    prisma.resource.count({ where }),
  ]);

  res.json({ page, limit, total, items });
}

// -------------------- GET BY ID --------------------
export async function get(req: Request, res: Response) {
  const id = req.params.id;
  const user = (req as any).user as { roles?: string[] } | undefined;

  const r = (await prisma.resource.findUnique({
    where: { id },
    ...resourceArgs,
  })) as Resource | null;

  if (!r) return res.sendStatus(404);
  if (!r.isActive && !isPrivileged(user?.roles)) {
    // user thường không được xem resource đã inactive
    return res.sendStatus(403);
  }
  res.json(r);
}

// -------------------- CREATE --------------------
export async function create(req: Request, res: Response) {
  const { name, type, location, securityLevel, accessSchedule, isActive } = req.body as {
    name?: string;
    type?: string;
    location?: string | null;
    securityLevel?: string;
    accessSchedule?: unknown;
    isActive?: boolean;
  };

  if (!name) return res.status(400).json({ message: "name is required" });
  if (!validateType(type)) {
    return res.status(400).json({ message: `type must be one of ${RESOURCE_TYPES.join(", ")}` });
  }
  if (!validateSecurity(securityLevel)) {
    return res.status(400).json({ message: `securityLevel must be one of ${SECURITY_LEVELS.join(", ")}` });
  }

  // accessSchedule có thể là JSON (object/array) — để nguyên, Prisma nhận Json
  const created = await prisma.resource.create({
    data: {
      name,
      type, // Prisma enum sẽ kiểm tra thêm 1 lớp
      location: location ?? null,
      securityLevel,
      accessSchedule: toNullableJson(accessSchedule),
      isActive: typeof isActive === "boolean" ? isActive : true,
    },
  });

  await writeAudit(req, {
    action: "RESOURCE_CREATE",
    resourceId: created.id,
    success: true,
    details: { name, type, securityLevel }
  });

  res.status(201).json(created);
}

// -------------------- UPDATE --------------------
export async function update(req: Request, res: Response) {
  const id = req.params.id;
  const { name, type, location, securityLevel, accessSchedule, isActive } = req.body as {
    name?: string;
    type?: string;
    location?: string | null;
    securityLevel?: string;
    accessSchedule?: unknown;
    isActive?: boolean;
  };

  // Validate điều kiện nếu có truyền
  if (type !== undefined && !validateType(type)) {
    return res.status(400).json({ message: `type must be one of ${RESOURCE_TYPES.join(", ")}` });
  }
  if (securityLevel !== undefined && !validateSecurity(securityLevel)) {
    return res
      .status(400)
      .json({ message: `securityLevel must be one of ${SECURITY_LEVELS.join(", ")}` });
  }

  const updated = await prisma.resource.update({
    where: { id },
    data: {
      name,
      type: type as ResourceType | undefined,
      location: location ?? undefined,
      securityLevel: securityLevel as SecurityLevel | undefined,
      accessSchedule: toNullableJson(accessSchedule),
      isActive,
    },
  });

  await writeAudit(req, {
    action: "RESOURCE_UPDATE",
    resourceId: updated.id,
    success: true,
    details: { changed: { name, type, securityLevel, isActive } }
  });

  res.json(updated);
}

// -------------------- DELETE --------------------
export async function remove(req: Request, res: Response) {
  const id = req.params.id;

  // Chặn xoá khi còn AccessRequest tham chiếu (tránh orphan records)
  const used = await prisma.accessRequest.count({ where: { resourceId: id } });
  if (used > 0) {
    return res.status(400).json({
      message: "Resource is referenced by existing access requests; cannot delete.",
    });
  }

  await prisma.resource.delete({ where: { id } });
  await writeAudit(req, {
    action: "RESOURCE_DELETE",
    resourceId: id,
    success: true
  });
  res.json({ success: true });
}
