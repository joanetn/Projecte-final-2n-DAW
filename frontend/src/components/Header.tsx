import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle"

const Header = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLoggedIn = !!user;
    if (isLoading) return null;

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const hasRol = (rol: string) => {
        return user?.rols?.some(r => (typeof r === 'string' ? r : r) === rol) || false;
    };

    const isAdmin = hasRol("ADMIN_WEB");
    const isArbitre = hasRol("ARBITRE");
    const isEntrenador = hasRol("ENTRENADOR");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PP</span>
                        </div>
                        <span className="text-xl font-semibold text-foreground">
                            PadelPlay
                        </span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium ${isActive("/") ? "text-blue-600" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Inici
                        </Link>

                        {/* Dashboards según rol */}
                        {isAdmin && (
                            <Link
                                to="/dashboardAdmin"
                                className={`text-sm font-medium ${isActive("/dashboardAdmin") ? "text-blue-600" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Dashboard Admin
                            </Link>
                        )}

                        {isArbitre && (
                            <Link
                                to="/dashboardArbitre"
                                className={`text-sm font-medium ${isActive("/dashboardArbitre") ? "text-blue-600" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Dashboard Àrbitre
                            </Link>
                        )}

                        {isEntrenador && (
                            <Link
                                to="/dashboardEntrenador"
                                className={`text-sm font-medium ${isActive("/dashboardEntrenador") ? "text-blue-600" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Dashboard Entrenador
                            </Link>
                        )}

                        {!isLoggedIn && (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Iniciar sessió</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Registrar-se</Button>
                                </Link>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-foreground">
                                    Hola, {user.nom}
                                </span>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Tancar sessió
                                </Button>
                            </div>
                        )}

                        <ThemeToggle />
                    </div>

                    {/* Mobile button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border space-y-2">
                        <Link
                            to="/"
                            className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Inici
                        </Link>

                        {/* Dashboards móvil según rol */}
                        {isAdmin && (
                            <Link
                                to="/dashboardAdmin"
                                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard Admin
                            </Link>
                        )}

                        {isArbitre && (
                            <Link
                                to="/dashboardArbitre"
                                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard Àrbitre
                            </Link>
                        )}

                        {isEntrenador && (
                            <Link
                                to="/dashboardEntrenador"
                                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard Entrenador
                            </Link>
                        )}

                        {!isLoggedIn ? (
                            <div className="space-y-2 pt-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full">Iniciar sessió</Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Registrar-se</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-2">
                                <div className="px-4 py-2 text-sm text-foreground">
                                    Hola, {user.nom}
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Tancar sessió
                                </Button>
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;