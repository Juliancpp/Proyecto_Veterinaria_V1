import api from "@/services/api";
import type { User } from "@/store/authStore";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login/", payload);
    return data;
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register/", payload);
    return data;
  },
};
