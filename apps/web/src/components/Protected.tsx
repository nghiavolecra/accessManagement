import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


type Props = { children: React.ReactNode; roles?: string[] };
export default function Protected({ children, roles }: Props) {
    const { isAuthenticated, hasRole } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && roles.length > 0 && !hasRole(...roles)) return <Navigate to="/" replace />;
    return <>{children}</>;
}