import http from "./http";
export const listAuditLogs = (params?: any) => http.get("/audit-logs", { params }).then(r => r.data);
export const getAuditLog = (id: string) => http.get(`/audit-logs/${id}`).then(r => r.data);