// apps/api/src/controllers/roles.controller.ts
import { Request, Response } from "express";
import { prisma } from "../config/env";
import { Prisma } from "@prisma/client";

// Giữ args include để có type chính xác
const roleWithPermsArgs = Prisma.validator<Prisma.RoleDefaultArgs>()({
  include: {
    permissions: { include: { permission: true } },
    parent: true,
    children: true,
  },
});
type RoleWithPerms = Prisma.RoleGetPayload<typeof roleWithPermsArgs>;

/**
 * GET /api/roles
 */
export async function list(_req: Request, res: Response) {
  const roles = (await prisma.role.findMany({
    orderBy: { name: "asc" },
    ...roleWithPermsArgs,
  })) as RoleWithPerms[];
  res.json(
    roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      parentId: r.parentId ?? null,
      permissions: r.permissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        resource: rp.permission.resource,
        action: rp.permission.action,
      })),
      children: r.children.map((c) => ({ id: c.id, name: c.name })),
    }))
  );
}

/**
 * GET /api/roles/:id
 */
export async function get(req: Request, res: Response) {
  const role = (await prisma.role.findUnique({
    where: { id: req.params.id },
    ...roleWithPermsArgs,
  })) as RoleWithPerms | null;

  if (!role) return res.sendStatus(404);

  res.json({
    id: role.id,
    name: role.name,
    description: role.description,
    parentId: role.parentId ?? null,
    permissions: role.permissions.map((rp) => ({
      id: rp.permission.id,
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
    })),
    children: role.children.map((c) => ({ id: c.id, name: c.name })),
  });
}

/**
 * POST /api/roles
 * body: { name: string; description?: string; parentId?: string }
 */
export async function create(req: Request, res: Response) {
  const { name, description, parentId } = req.body as {
    name?: string;
    description?: string;
    parentId?: string;
  };
  if (!name) return res.status(400).json({ message: "name is required" });

  const created = await prisma.role.create({
    data: { name, description, parentId: parentId || null },
  });

  res.status(201).json(created);
}

/**
 * PUT /api/roles/:id
 * body: { name?: string; description?: string; parentId?: string | null }
 */
export async function update(req: Request, res: Response) {
  const { name, description, parentId } = req.body as {
    name?: string;
    description?: string;
    parentId?: string | null;
  };

  const updated = await prisma.role.update({
    where: { id: req.params.id },
    data: { name, description, parentId: parentId ?? undefined },
  });

  res.json(updated);
}

/**
 * DELETE /api/roles/:id
 * Chặn xoá nếu còn user đang gán role
 */
export async function remove(req: Request, res: Response) {
  const roleId = req.params.id;

  const inUse = await prisma.userRole.count({ where: { roleId } });
  if (inUse > 0) {
    return res
      .status(400)
      .json({ message: "Role is assigned to users; unassign before delete." });
  }

  await prisma.role.delete({ where: { id: roleId } });
  res.json({ success: true });
}

// Gán permission cho role
export async function addPermission(req: Request, res: Response) {
  const { roleId, permissionId } = req.body;
  if (!roleId || !permissionId) {
    return res.status(400).json({ message: "roleId and permissionId are required" });
  }

  await prisma.rolePermission.create({
    data: { roleId, permissionId },
  });

  res.json({ success: true });
}

// Gỡ permission khỏi role
export async function removePermission(req: Request, res: Response) {
  const { roleId, permissionId } = req.body;
  if (!roleId || !permissionId) {
    return res.status(400).json({ message: "roleId and permissionId are required" });
  }

  await prisma.rolePermission.delete({
    where: { roleId_permissionId: { roleId, permissionId } },
  });

  res.json({ success: true });
}
