// apps/web/src/services/accessRequests.service.ts
import axios from "axios";

const API = "http://localhost:4000/api/access-requests"; // <— đổi 3000 -> 4000

export async function listAccessReq() {
    const res = await axios.get(API);
    return res.data;
}
export async function createAccessReq(data: any) {
    const res = await axios.post(API, data);
    return res.data;
}
export async function approveAccessReq(id: string) {
    const res = await axios.put(`${API}/${id}/approve`);
    return res.data;
}
export async function rejectAccessReq(id: string) {
    const res = await axios.put(`${API}/${id}/reject`);
    return res.data;
}
