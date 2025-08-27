// token.service.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../config/env";
import { addDays } from "date-fns";      // <- bỏ addMinutes vì không dùng
import crypto from "crypto";

export function signAccessToken(userId: string, roles: string[]) {
  const payload = { sub: userId, roles };

  const minutes = Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? "15");
  const expiresInSeconds = Math.max(60, minutes * 60); // tối thiểu 60s cho chắc

  const opts: SignOptions = { expiresIn: expiresInSeconds };
  const secret = process.env.JWT_ACCESS_SECRET!; // đảm bảo có trong .env

  return jwt.sign(payload, secret, opts);
}

export async function issueRefreshToken(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = addDays(new Date(), Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7));
  await prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  return token;
}

export async function rotateRefreshToken(oldToken: string) {
  const found = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
  if (!found || found.revoked || found.expiresAt < new Date()) return null;
  await prisma.refreshToken.update({ where: { token: oldToken }, data: { revoked: true } });
  const newToken = await issueRefreshToken(found.userId);
  return { userId: found.userId, newToken };
}
