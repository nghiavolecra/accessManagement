// apps/web/src/pages/dashboard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/dashboard.service";
import type { DashboardSummary } from "@/types/dashboard";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import React from "react";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658",
  "#ff8042", "#0088FE", "#00C49F",
  "#FFBB28", "#FF4444",
];

function formatNumber(n: number | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return "0";
  const v = Math.abs(n) < 1e-9 ? 0 : n;
  return Intl.NumberFormat(undefined, {
    maximumFractionDigits: digits,
  }).format(v);
}

function formatCurrency(n: number | undefined) {
  // Nếu backend đang lưu cents, bạn có thể chia /100 ở service thay vì ở đây.
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

export default function Dashboard() {
  const { data, isLoading, isError, error } = useQuery<DashboardSummary>({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });

  // Fallback an toàn khi chưa có data
  const totals = data?.totals ?? {
    totalEmployees: 0,
    avgAbsenceDaysThisYear: 0,
    avgOvertimePerWeek: 0,
  };

  const employeesByDept = (data?.employeesByDepartment ?? []).map((d) => ({
    name: d.department ?? "Unknown",
    value: d.pct,     // dùng % cho biểu đồ tròn
    count: d.count,   // hiển thị thêm trong tooltip
  }));

  const absenteeism = (data?.absenteeismByYear ?? []).map((x) => ({
    year: x.year,
    days: x.days,
    rate: x.rate, // 0.26 -> 26%?
  }));

  const trainingCosts = (data?.trainingByYear ?? []).map((x) => ({
    year: x.year,
    // Nếu backend lưu cents, bạn có thể đổi ở service hoặc ở đây:
    cost: x.cost,       // / 100 nếu muốn
    returns: x.returns, // / 100 nếu muốn
  }));

  const overtime = (data?.overtimeAvgByYear ?? []).map((x) => ({
    year: x.year,
    hrs: x.hrs,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* KPI Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Avg. Yearly Absenteeism</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {formatNumber(totals.avgAbsenceDaysThisYear, 2)} Days
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Trung bình mỗi nhân sự / 12 tháng gần nhất
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overtime per Week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {formatNumber(totals.avgOvertimePerWeek, 2)} Hrs
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Trung bình mỗi nhân sự / tuần (12 tháng)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {formatNumber(totals.totalEmployees, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Đang Active
          </p>
        </CardContent>
      </Card>

      {/* Loading & Error state */}
      {isLoading && (
        <Card className="col-span-full">
          <CardContent className="py-10">
            <p>Loading dashboard…</p>
          </CardContent>
        </Card>
      )}
      {isError && (
        <Card className="col-span-full">
          <CardContent className="py-10">
            <p className="text-red-600">
              Failed to load: {(error as any)?.message ?? "Unknown error"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pie Chart — Employees by Department */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Employees by Department</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {employeesByDept.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={employeesByDept} dataKey="value" nameKey="name" outerRadius={100}>
                  {employeesByDept.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  formatter={(v: number, _n, payload) => {
                    const pct = `${formatNumber(v, 2)}%`;
                    const cnt = (payload?.payload?.count ?? 0) as number;
                    return [`${pct} (${cnt})`, "Share"];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Absenteeism Over Last 5 Years (Bar + Line) */}
      <Card>
        <CardHeader>
          <CardTitle>Absenteeism Over Last 5 Years</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {absenteeism.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={absenteeism}>
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${formatNumber(v * 100, 0)}%`} />
                <Tooltip
                  formatter={(v: number, name) => {
                    if (name === "rate") return [`${formatNumber(v * 100, 2)}%`, "rate"];
                    return [formatNumber(v, 2), name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="days" name="Days" fill="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey="rate" name="Rate" stroke="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Training Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Training Costs</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {trainingCosts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingCosts}>
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => formatNumber(v, 0)} />
                <Tooltip
                  formatter={(v: number, name) => [formatCurrency(v), name]}
                />
                <Legend />
                <Bar dataKey="cost" name="Net Costs" fill="#8884d8" />
                <Bar dataKey="returns" name="Returns" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Overtime Line */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Yearly Avg Overtime Hours / Employee</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {overtime.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overtime}>
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => formatNumber(v, 1)} />
                <Tooltip formatter={(v: number) => [formatNumber(v, 2), "hrs"]} />
                <Legend />
                <Line type="monotone" dataKey="hrs" name="Hours" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
