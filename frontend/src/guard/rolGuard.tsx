import { useAuth } from "@/context/AuthContext";
import { JSX } from "react";
import { Navigate } from "react-router-dom";
export const RolGuard = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    const hasRole = user.rols.some(r => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to="/" replace />;
    return children;
};
