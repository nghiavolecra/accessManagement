import api from "./api"; // axios instance (có baseURL + interceptors)

export async function listUsers(params?: { page?: number; limit?: number }) {
    const res = await api.get("/users", { params });
    return res.data;
}

export async function getUser(id: string) {
    const res = await api.get(`/users/${id}`);
    return res.data;
}

export async function createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department?: string;
    position?: string;
}) {
    const res = await api.post("/users", data);
    return res.data;
}

export async function updateUser(id: string, data: any) {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
}

export async function deleteUser(id: string) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}

export async function assignRole(userId: string, roleId: string) {
    const res = await api.post(`/users/${userId}/roles`, { roleId });
    return res.data;
}

export async function unassignRole(userId: string, roleId: string) {
    const res = await api.delete(`/users/${userId}/roles/${roleId}`);
    return res.data;
}