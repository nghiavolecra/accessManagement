// apps/web/src/services/reports.service.ts
import api from "./api"; // axios instance đã config baseURL + interceptors

export async function getAccessSummary() {
    const res = await api.get("/reports/access-summary");
    return res.data;
}
