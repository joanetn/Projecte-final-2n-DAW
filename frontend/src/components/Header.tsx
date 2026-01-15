import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLoggedIn = !!user;

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PP</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">
                            PadelPlay
                        </span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium ${isActive("/") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            Inici
                        </Link>

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
                                <span className="text-sm text-gray-700">
                                    Hola, {user.nom}
                                </span>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Tancar sessió
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="w-full">Iniciar sessió</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="w-full">Registrar-se</Button>
                                </Link>
                            </>
                        ) : (
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                                Tancar sessió
                            </Button>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
