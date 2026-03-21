import { Navigate } from "react-router-dom";
import { useAuthStore, type AppRole } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/pets" replace />;
  }

  return <>{children}</>;
};
