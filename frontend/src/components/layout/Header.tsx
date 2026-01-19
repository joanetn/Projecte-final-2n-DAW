import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useEffect } from "react";

const Header = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const isLoggedIn = !!user;
    if (isLoading) return null;

    const isActive = (path: string) => location.pathname === path;

    const { showToast } = useToast();

    useEffect(() => {
        const handler = (e: any) => {
            const data = e.detail;
            setNotifs(prev => [{ id: `socket-${Date.now()}`, titol: data.titol, missatge: data.missatge, created_at: data.created_at || new Date().toISOString(), extra: data.extra }, ...prev]);
        };
        window.addEventListener('new-notificacio', handler as EventListener);
        return () => window.removeEventListener('new-notificacio', handler as EventListener);
    }, []);

    const handleLogout = () => {
        logout();
        showToast({ type: 'info', title: 'Sessió tancada', description: "S'ha tancat la sessió." });
        navigate("/login");
    };

    const handleAcceptProposta = async (notifId: string) => {
        setProcessingId(notifId);
        try {
            const res = await fetch(`http://localhost:3001/propostes/${notifId}/accept`, { method: 'POST' });
            if (!res.ok) throw new Error('Error acceptant proposta');
            showToast({ type: 'success', title: 'Proposta acceptada', description: "S'ha creat el partit amb la data proposada." });
            // Update local state to reflect accepted
            setNotifs(prev => prev.map(n => n.id === notifId ? { ...n, extra: { ...n.extra, estat: 'ACCEPTAT' } } : n));
        } catch (e) {
            console.error(e);
            showToast({ type: 'error', title: 'Error', description: "No s'ha pogut acceptar la proposta." });
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectProposta = async (notifId: string) => {
        setProcessingId(notifId);
        try {
            const res = await fetch(`http://localhost:3001/propostes/${notifId}/reject`, { method: 'POST' });
            if (!res.ok) throw new Error('Error rebutjant proposta');
            showToast({ type: 'info', title: 'Proposta rebutjada', description: "S'ha rebutjat la proposta de partit." });
            // Update local state to reflect rejected
            setNotifs(prev => prev.map(n => n.id === notifId ? { ...n, extra: { ...n.extra, estat: 'REBUTJAT' } } : n));
        } catch (e) {
            console.error(e);
            showToast({ type: 'error', title: 'Error', description: "No s'ha pogut rebutjar la proposta." });
        } finally {
            setProcessingId(null);
        }
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

                        {/* Bell icon (visual only) - only for logged users */}
                        {isLoggedIn && (
                            <div className="relative">
                                <button
                                    aria-label="Notificacions"
                                    className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                                    onClick={async () => {
                                        setNotifOpen(v => !v);
                                        if (!notifOpen) {
                                            setLoadingNotifs(true);
                                            try {
                                                const res = await fetch(`http://localhost:3001/notificacions?usuariId=${user?.id}&_sort=created_at&_order=desc`);
                                                const data = await res.json();
                                                setNotifs(Array.isArray(data) ? data : [data]);
                                            } catch (e) {
                                                console.error('Error carregant notificacions', e);
                                            } finally {
                                                setLoadingNotifs(false);
                                            }
                                        }
                                    }}
                                >
                                    <Bell />
                                    {/* small red dot */}
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-50">
                                        <div className="p-3 border-b">
                                            <div className="font-medium">Notificacions</div>
                                        </div>
                                        <div className="max-h-64 overflow-auto">
                                            {loadingNotifs && <div className="p-3 text-sm text-gray-500">Carregant...</div>}
                                            {!loadingNotifs && notifs.length === 0 && <div className="p-3 text-sm text-gray-500">Cap notificació</div>}
                                            {!loadingNotifs && notifs.map(n => {
                                                const isProposta = n.tipus === 'proposta';
                                                const isPendent = n.extra?.estat === 'PENDENT';
                                                const isAcceptat = n.extra?.estat === 'ACCEPTAT';
                                                const isRebutjat = n.extra?.estat === 'REBUTJAT';
                                                const isProcessing = processingId === n.id;

                                                return (
                                                    <div key={n.id} className="p-3 border-b last:border-b-0">
                                                        <div className="font-semibold text-sm">{n.titol}</div>
                                                        <div className="text-xs text-gray-600">{n.missatge}</div>
                                                        <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>

                                                        {/* Botones para propostas pendientes */}
                                                        {isProposta && isPendent && (
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    onClick={() => handleAcceptProposta(n.id)}
                                                                    disabled={isProcessing}
                                                                    className="flex-1 px-2 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                                                                >
                                                                    {isProcessing ? '...' : 'Acceptar'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectProposta(n.id)}
                                                                    disabled={isProcessing}
                                                                    className="flex-1 px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                                                                >
                                                                    {isProcessing ? '...' : 'Rebutjar'}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Badge de estat si ja s'ha processat */}
                                                        {isProposta && isAcceptat && (
                                                            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded">
                                                                ✓ Acceptada
                                                            </span>
                                                        )}
                                                        {isProposta && isRebutjat && (
                                                            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded">
                                                                ✗ Rebutjada
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="p-2 border-t text-center">
                                            <button className="text-sm text-blue-600" onClick={() => { setNotifOpen(false); }}>Tancar</button>
                                        </div>
                                    </div>
                                )}
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
                            <div className="pt-2 space-y-2">
                                <div className="flex items-center justify-between px-4">
                                    <div className="text-sm text-foreground">Hola, {user.nom}</div>
                                    {/* mobile bell visual */}
                                    <button
                                        aria-label="Notificacions"
                                        className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                                        onClick={() => { /* placeholder */ setMobileMenuOpen(false); }}
                                    >
                                        <Bell />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                    </button>
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