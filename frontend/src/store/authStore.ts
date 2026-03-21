import { create } from "zustand";

export type AppRole = "user" | "admin" | "staff";

export interface User {
  id: number;
  email: string;
  name: string;
  role: AppRole;
  onboarding_complete: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("token"),
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial };
    localStorage.setItem("user", JSON.stringify(updated));
    set({ user: updated });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
