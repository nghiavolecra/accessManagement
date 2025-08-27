import http from "./http";
import api from "./api";
export const listRoles = () => http.get("/roles").then(r => r.data);
export const createRole = (payload: any) => http.post("/roles", payload).then(r => r.data);
export const updateRole = (id: string, payload: any) => http.put(`/roles/${id}`, payload).then(r => r.data);
export const deleteRole = (id: string) => http.delete(`/roles/${id}`).then(r => r.data);


// NEW: list all permissions
export async function listPermissions() {
    const res = await api.get("/permissions");
    return res.data;
}

// NEW: add/remove permission from role
export async function addPermissionToRole(roleId: string, permissionId: string) {
    const res = await api.post("/roles/add-permission", { roleId, permissionId });
    return res.data;
}

export async function removePermissionFromRole(roleId: string, permissionId: string) {
    const res = await api.post("/roles/remove-permission", { roleId, permissionId });
    return res.data;
}