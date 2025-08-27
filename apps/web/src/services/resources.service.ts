import http from "./http";
export const listResources = (params?: any) => http.get("/resources", { params }).then(r => r.data);
export const getResource = (id: string) => http.get(`/resources/${id}`).then(r => r.data);
export const createResource = (payload: any) => http.post("/resources", payload).then(r => r.data);
export const updateResource = (id: string, payload: any) => http.put(`/resources/${id}`, payload).then(r => r.data);
export const deleteResource = (id: string) => http.delete(`/resources/${id}`).then(r => r.data);