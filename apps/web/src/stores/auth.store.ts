import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants";


export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  roles: string[];
  user: { id: string; email: string; firstName?: string; lastName?: string } | null;
  setAuth: (p: Partial<AuthState>) => void;
  clear: () => void;
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      roles: [],
      user: null,
      setAuth: (p) => set((s) => ({ ...s, ...p })),
      clear: () => set({ accessToken: null, refreshToken: null, roles: [], user: null }),
    }),
    { name: "am-auth", partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken, roles: s.roles, user: s.user }) }
  )
);


// Optional helpers for direct localStorage access
export const tokenStorage = {
  get access() { return localStorage.getItem(ACCESS_TOKEN_KEY); },
  set access(v: string | null) { v ? localStorage.setItem(ACCESS_TOKEN_KEY, v) : localStorage.removeItem(ACCESS_TOKEN_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_TOKEN_KEY); },
  set refresh(v: string | null) { v ? localStorage.setItem(REFRESH_TOKEN_KEY, v) : localStorage.removeItem(REFRESH_TOKEN_KEY); },
};