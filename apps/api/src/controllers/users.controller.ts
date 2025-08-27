import { Request, Response } from "express";
import { prisma } from "../config/env";
import bcrypt from "bcryptjs";

export async function list(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } },
  });

  res.json({
    items: users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      department: u.department,
      position: u.position,
      accessLevel: u.accessLevel,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      roles: u.roles.map((ur) => ur.role.name),
      status: u.isActive ? "Active" : "Inactive",
    })),
    total: users.length,
  });

}



export async function create(req: Request, res: Response) {
  const { email, password, firstName, lastName, department, position, accessLevel, roles = [] } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const roleRecords = await prisma.role.findMany({ where: { name: { in: roles } } });
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      department,
      position,
      accessLevel,
      roles: { create: roleRecords.map((r) => ({ roleId: r.id })) },
    },
  });
  res.status(201).json({ id: user.id });
}

export async function get(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { roles: { include: { role: true } } },
  });
  if (!user) return res.sendStatus(404);

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    department: user.department,
    position: user.position,
    accessLevel: user.accessLevel,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    roles: user.roles.map((r) => r.role.name),
    status: user.isActive ? "Active" : "Inactive",
  });
}

export async function update(req: Request, res: Response) {
  const { firstName, lastName, department, position, accessLevel, isActive } = req.body;
  await prisma.user.update({
    where: { id: req.params.id },
    data: { firstName, lastName, department, position, accessLevel, isActive },
  });
  res.json({ success: true });
}


export async function remove(req: Request, res: Response) {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}

// Gán role cho user
export async function assignRole(req: Request, res: Response) {
  const { id } = req.params; // userId
  const { roleId } = req.body;
  if (!roleId) return res.status(400).json({ message: "roleId required" });

  // kiểm tra tồn tại
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) return res.status(404).json({ message: "Role not found" });

  await prisma.userRole.create({
    data: { userId: id, roleId },
  });

  res.json({ success: true });
}

// Gỡ role khỏi user
export async function unassignRole(req: Request, res: Response) {
  const { id, roleId } = req.params;

  await prisma.userRole.delete({
    where: {
      userId_roleId: { userId: id, roleId },
    },
  });

  res.json({ success: true });
}