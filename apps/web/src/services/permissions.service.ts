// apps/web/src/services/permissions.service.ts
import axios from "axios";

const API = "/api/permissions";

// Lấy toàn bộ permissions
export async function listPermissions() {
    const res = await axios.get(API);
    return res.data;
}
