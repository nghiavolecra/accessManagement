// apps/web/src/types/dashboard.ts
export type DashboardSummary = {
    totals: {
        totalEmployees: number;
        avgAbsenceDaysThisYear: number;
        avgOvertimePerWeek: number;
    };
    employeesByDepartment: Array<{ department: string; count: number; pct: number }>;
    absenteeismByYear: Array<{ year: number; days: number; rate: number }>;
    trainingByYear: Array<{ year: number; cost: number; returns: number }>;
    overtimeAvgByYear: Array<{ year: number; hrs: number }>;
};
