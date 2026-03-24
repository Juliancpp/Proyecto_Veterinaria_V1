import { Navigate } from "react-router-dom";
import { useAuthStore, type AppRole } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

const roleHomeMap: Record<AppRole, string> = {
  admin: "/admin",
  staff: "/staff/pets",
  user: "/app/pets",
};

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectTo = roleHomeMap[user.role] || "/app/pets";
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
