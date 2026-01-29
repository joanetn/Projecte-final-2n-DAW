import { useAuth } from "@/context/AuthContext";
import { JSX } from "react";
import { Navigate } from "react-router-dom";
export const NoAuthGuard = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();
    if (user) return <Navigate to="/" replace />;
    return children;
};
