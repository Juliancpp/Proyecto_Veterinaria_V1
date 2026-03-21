import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService, type LoginPayload, type RegisterPayload } from "@/features/auth/authService";

export const useAuth = () => {
  const { isAuthenticated, user, setAuth, updateUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authService.login(payload);
      setAuth(token, user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authService.register(payload);
      setAuth(token, user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al registrarse");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, user, login, register, logout, updateUser, loading, error };
};
