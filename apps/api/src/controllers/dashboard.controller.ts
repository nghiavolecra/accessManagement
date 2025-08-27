import { Request, Response } from "express";
import { prisma } from "../config/env";

export async function summary(_req: Request, res: Response) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // ── Totals ───────────────────────────────
    const totalEmployees = await prisma.user.count({ where: { isActive: true } });

    // Tính trung bình ngày vắng (Absence.hours / 8)
    const absences = await prisma.absence.findMany({
        where: {
            date: {
                gte: new Date(`${currentYear}-01-01`),
                lt: new Date(`${currentYear + 1}-01-01`),
            },
        },
        select: { userId: true, hours: true },
    });
    const absenceDays = absences.reduce((s, a) => s + a.hours / 8, 0);
    const avgAbsenceDaysThisYear =
        totalEmployees > 0 ? absenceDays / totalEmployees : 0;

    // Trung bình OT/tuần (tổng giờ OT / tổng tuần / số user)
    const overtimes = await prisma.overtime.findMany({
        where: {
            date: {
                gte: new Date(`${currentYear}-01-01`),
                lt: new Date(`${currentYear + 1}-01-01`),
            },
        },
        select: { userId: true, hours: true, date: true },
    });
    const totalOtHours = overtimes.reduce((s, o) => s + o.hours, 0);
    const weeks = Math.max(
        1,
        Math.ceil((now.getTime() - new Date(`${currentYear}-01-01`).getTime()) / (7 * 86400 * 1000))
    );
    const avgOvertimePerWeek =
        totalEmployees > 0 ? totalOtHours / weeks / totalEmployees : 0;

    // ── Employees by Department ─────────────
    const depRows = await prisma.user.groupBy({
        by: ["department"],
        where: { isActive: true },
        _count: { _all: true },
    });
    const totalDep = depRows.reduce((s, r) => s + r._count._all, 0) || 1;
    const employeesByDepartment = depRows.map((r) => ({
        department: r.department ?? "Unknown",
        count: r._count._all,
        pct: Math.round((r._count._all / totalDep) * 10000) / 100,
    }));

    // ── Absenteeism by year ─────────────────
    const absenteeismAgg = await prisma.$queryRaw<
        { year: number; days: number }[]
    >`
    SELECT EXTRACT(YEAR FROM "date")::int AS year,
           SUM("hours")/8 AS days
    FROM "Absence"
    GROUP BY 1
    ORDER BY 1;
  `;
    const absenteeismByYear = absenteeismAgg.map((r) => ({
        year: Number(r.year),
        days: Number(r.days),
        rate: totalEmployees > 0 ? Number(r.days) / totalEmployees : 0,
    }));

    // ── Training by year ────────────────────
    const trainingAgg = await prisma.$queryRaw<
        { year: number; cost: number; returns: number }[]
    >`
    SELECT EXTRACT(YEAR FROM "startDate")::int AS year,
           SUM("cost")   AS cost,
           SUM(COALESCE("returns",0)) AS returns
    FROM "TrainingSession"
    GROUP BY 1
    ORDER BY 1;
  `;
    const trainingByYear = trainingAgg.map((r) => ({
        year: Number(r.year),
        cost: Number(r.cost || 0),
        returns: Number(r.returns || 0),
    }));

    // ── Overtime avg by year ────────────────
    const overtimeAgg = await prisma.$queryRaw<
        { year: number; hrs: number }[]
    >`
    SELECT EXTRACT(YEAR FROM "date")::int AS year,
           AVG("hours") AS hrs
    FROM "Overtime"
    GROUP BY 1
    ORDER BY 1;
  `;
    const overtimeAvgByYear = overtimeAgg.map((r) => ({
        year: Number(r.year),
        hrs: Number(r.hrs),
    }));

    return res.json({
        totals: {
            totalEmployees,
            avgAbsenceDaysThisYear: Math.round(avgAbsenceDaysThisYear * 100) / 100,
            avgOvertimePerWeek: Math.round(avgOvertimePerWeek * 100) / 100,
        },
        employeesByDepartment,
        absenteeismByYear,
        trainingByYear,
        overtimeAvgByYear,
    });
}
