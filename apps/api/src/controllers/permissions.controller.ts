import { Request, Response } from "express";
import { prisma } from "../config/env";

export async function list(_req: Request, res: Response) {
    const perms = await prisma.permission.findMany({
        orderBy: { name: "asc" },
    });
    res.json(perms);
}
