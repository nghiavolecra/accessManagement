import { Request, Response } from "express";
import { prisma } from "../config/env";
import { Prisma } from "@prisma/client";
const API = "/api/access-requests";
import { writeAudit } from "../utils/audit";

// PUT /api/access-requests/:id/approve
export async function approve(req: Request, res: Response) {
  const { id } = req.params;

  const updated = await prisma.accessRequest.update({
    where: { id },
    data: {
      status: "approved",
      approverId: (req as any).user?.sub ?? null, // nếu có thông tin user đăng nhập
      approvedAt: new Date(),
    },
    include: {
      requester: true,
      resource: true,
    },
  });

  await writeAudit(req, {
    action: "ACCESS_REQUEST_APPROVE",
    userId: updated.approverId ?? (req as any).user?.sub ?? null,
    resourceId: updated.resourceId,
    success: true,
    details: { requestId: id }
  });

  res.json(updated);
}

// PUT /api/access-requests/:id/reject
export async function reject(req: Request, res: Response) {
  const { id } = req.params;

  const updated = await prisma.accessRequest.update({
    where: { id },
    data: {
      status: "rejected",
      approverId: (req as any).user?.sub ?? null,
      approvedAt: new Date(),
    },
    include: {
      requester: true,
      resource: true,
    },
  });

  await writeAudit(req, {
    action: "ACCESS_REQUEST_REJECT",
    userId: updated.approverId ?? (req as any).user?.sub ?? null,
    resourceId: updated.resourceId,
    success: true,
    details: { requestId: id }
  });

  res.json(updated);
}

// GET /api/access-requests
export async function list(req: Request, res: Response) {
  const items = await prisma.accessRequest.findMany({
    include: {
      requester: true,
      approver: true,
      resource: true,
    },
  });
  res.json(items);
}

// GET /api/access-requests/:id
export async function get(req: Request, res: Response) {
  const { id } = req.params;
  const item = await prisma.accessRequest.findUnique({
    where: { id },
    include: {
      requester: true,
      approver: true,
      resource: true,
    },
  });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
}

// POST /api/access-requests
export async function create(req: Request, res: Response) {
  try {
    const {
      requesterId,
      resourceId,
      purpose,
      startDate,
      endDate,
      status,
      approverId,
    } = req.body;

    if (!requesterId || !resourceId) {
      return res.status(400).json({ message: "Missing requesterId or resourceId" });
    }

    const item = await prisma.accessRequest.create({
      data: {
        requesterId,
        resourceId,
        purpose,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        approverId,
      },
    });

    await writeAudit(req, {
      action: "ACCESS_REQUEST_CREATE",
      userId: requesterId,        // ai gửi request
      resourceId: resourceId,
      success: true,
      details: { purpose, startDate, endDate, status }
    });


    res.status(201).json(item);
  } catch (err: any) {
    console.error("❌ Create AccessRequest failed:", err);
    res.status(500).json({ message: err.message });
  }
}


// PUT /api/access-requests/:id
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { purpose, startDate, endDate, status, approverId } = req.body;

  const item = await prisma.accessRequest.update({
    where: { id },
    data: {
      purpose,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status,
      approverId,
    },
  });

  res.json(item);
}

// DELETE /api/access-requests/:id
export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.accessRequest.delete({ where: { id } });
  res.status(204).send();
}
