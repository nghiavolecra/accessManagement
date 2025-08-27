import http from "./http";
import { useAuthStore } from "@/stores/auth.store";


type LoginBody = { email: string; password: string };
export async function loginApi(body: LoginBody) {
    const { data } = await http.post("/auth/login", body);
    const { accessToken, refreshToken, user } = data;
    useAuthStore.getState().setAuth({ accessToken, refreshToken, user, roles: user?.roles ?? [] });
    return data;
}


export async function logoutApi() {
    const rt = useAuthStore.getState().refreshToken;
    try { await http.post("/auth/logout", { refreshToken: rt }); } catch { }
    useAuthStore.getState().clear();
}