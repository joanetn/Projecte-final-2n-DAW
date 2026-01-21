import { createContext, useContext, useState, useEffect } from "react";
import { CurrentData, User } from "@/types/auth";
import { backend_rapid } from "@/api/axios";

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const response = await backend_rapid.get<CurrentData>("/auth/me");
                    setUser(response.data.usuari);
                } catch (error) {
                    console.error("Token inválido:", error);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }

            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (user: User) => {
        setUser(user);
        localStorage.setItem("token", user.token!);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div>Cargando...</div>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
};