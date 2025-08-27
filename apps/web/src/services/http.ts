import axios from "axios";
import { API_BASE_URL } from "@/constants";
import { useAuthStore } from "@/stores/auth.store";


const http = axios.create({ baseURL: `${API_BASE_URL}/api` });


http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
    return config;
});


let isRefreshing = false;
let queue: Array<() => void> = [];


http.interceptors.response.use(
    (res) => res,
    async (err) => {
        const status = err?.response?.status;
        const original = err.config;
        const refreshToken = useAuthStore.getState().refreshToken;


        if (status === 401 && refreshToken && !original._retry) {
            original._retry = true;
            try {
                if (isRefreshing) {
                    await new Promise<void>((resolve) => queue.push(resolve));
                }
                isRefreshing = true;
                const resp = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
                const newAccess = resp.data.accessToken as string;
                useAuthStore.getState().setAuth({ accessToken: newAccess });
                queue.forEach((fn) => fn());
                queue = [];
                isRefreshing = false;
                original.headers["Authorization"] = `Bearer ${newAccess}`;
                return http(original);
            } catch (e) {
                isRefreshing = false;
                queue = [];
                useAuthStore.getState().clear();
                return Promise.reject(e);
            }
        }
        return Promise.reject(err);
    }
);


export default http;