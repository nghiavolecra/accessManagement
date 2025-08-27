import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !user.roles.some(r => roles.includes(r))) return <Navigate to="/" replace />;
  return <Outlet />;
}