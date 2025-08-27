// apps/api/src/config/env.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Env helpers (tuỳ dùng)
export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
export const PORT = Number(process.env.PORT ?? 4000);

// Stub OpenAPI specs để /docs hoạt động tối thiểu
export const specs = {
  openapi: '3.0.0',
  info: { title: 'Access Management API', version: '0.1.0' },
  paths: {}
};
