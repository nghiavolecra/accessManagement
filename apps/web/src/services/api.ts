import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api" });

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

let isRefreshing = false; let queue: ((t?: string) => void)[] = [];
api.interceptors.response.use(r => r, async error => {
  const original = error.config;
  if (error.response?.status === 401 && !original._retry) {
    original._retry = true;
    if (isRefreshing) {
      await new Promise<void>(res => queue.push(() => res()));
      original.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
      return api(original);
    }
    try {
      isRefreshing = true;
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) throw new Error("No refresh token");
      const { data } = await axios.post(`${api.defaults.baseURL!.replace(/\/api$/, "")}/api/auth/refresh`, { refreshToken });
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
      queue.forEach(fn => fn()); queue = [];
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (e) {
      useAuthStore.getState().logout();
      return Promise.reject(e);
    } finally { isRefreshing = false; }
  }
  return Promise.reject(error);
});

export default api;