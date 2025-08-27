// apps/api/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/env";
import { signAccessToken, issueRefreshToken, rotateRefreshToken } from "../services/token.service";
import { Prisma } from "@prisma/client";

// Dùng `as const` để giữ literal type cho include
const userWithRolesArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { roles: { include: { role: true } } } as const,
});

type UserWithRoles = Prisma.UserGetPayload<typeof userWithRolesArgs>;

function getRoleNames(u: UserWithRoles | null | undefined): string[] {
  return u?.roles.map((ur) => ur.role.name) ?? [];
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });

  const user = (await prisma.user.findUnique({
    where: { email },
    ...userWithRolesArgs,
  })) as UserWithRoles | null;

  if (!user?.isActive) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const roleNames = getRoleNames(user);
  const accessToken = signAccessToken(user.id, roleNames);
  const refreshToken = await issueRefreshToken(user.id);

  return res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: roleNames,
    },
  });
}

// ✅ thêm mới: register
export async function register(req: Request, res: Response) {
  const { email, password, firstName, lastName } = req.body as {
    email?: string; password?: string; firstName?: string; lastName?: string;
  };
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existed = await prisma.user.findUnique({ where: { email } });
  if (existed) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, isActive: true },
  });

  // gán role mặc định Employee nếu có
  const employeeRole = await prisma.role.findUnique({ where: { name: "Employee" } });
  if (employeeRole) {
    await prisma.userRole.create({ data: { userId: user.id, roleId: employeeRole.id } });
  }

  return res.status(201).json({ id: user.id, email: user.email, firstName, lastName });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ message: "Missing refresh token" });

  const rotated = await rotateRefreshToken(refreshToken);
  if (!rotated) return res.status(401).json({ message: "Invalid refresh token" });

  const user = (await prisma.user.findUnique({
    where: { id: rotated.userId },
    ...userWithRolesArgs,
  })) as UserWithRoles | null;

  const roleNames = getRoleNames(user);
  const accessToken = signAccessToken(rotated.userId, roleNames);

  return res.json({ accessToken, refreshToken: rotated.newToken });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ message: "Missing refresh token" });
  await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } }).catch(() => {});
  return res.json({ success: true });
}
