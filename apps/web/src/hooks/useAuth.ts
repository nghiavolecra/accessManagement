import { useAuthStore } from "@/stores/auth.store";


export function useAuth() {
    const { user, roles, accessToken, refreshToken, setAuth, clear } = useAuthStore();
    const isAuthenticated = !!accessToken;
    const hasRole = (...allowed: string[]) => roles?.some((r) => allowed.includes(r));
    return { user, roles, accessToken, refreshToken, isAuthenticated, hasRole, setAuth, clear };
}