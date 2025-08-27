import { prisma } from "../config/env";
import type { Request } from "express";

type AuditInput = {
    action: string;
    userId?: string | null;
    resourceId?: string | null;
    success: boolean;
    details?: any;
};

export async function writeAudit(req: Request, input: AuditInput) {
    try {
        await prisma.auditLog.create({
            data: {
                action: input.action,
                userId: input.userId ?? (req as any).user?.sub ?? null,
                resourceId: input.resourceId ?? null,
                success: input.success,
                details: input.details ?? undefined,
                ipAddress: req.ip,
                userAgent: req.get("user-agent") ?? undefined,
            },
        });
    } catch (e) {
        // tránh làm hỏng flow chính nếu ghi log lỗi
        console.error("[audit] write failed:", e);
    }
}
