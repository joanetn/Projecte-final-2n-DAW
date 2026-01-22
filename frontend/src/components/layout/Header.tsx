import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useNotificacions } from "@/queries/notificacions.queries";
import { useAcceptProposta, useRejectProposta, useMarcarLlegida, useMarcarTotesLlegides } from "@/mutations/notificacions.mutations";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { data: notifs = [], isLoading: loadingNotifs, refetch } = useNotificacions(user?.id?.toString());
    const acceptMutation = useAcceptProposta();
    const rejectMutation = useRejectProposta();
    const marcarLlegidaMutation = useMarcarLlegida();
    const marcarTotesLlegidesMutation = useMarcarTotesLlegides();
    const notificacionsNoLlegides = notifs.filter(n => !n.read);
    const countNoLlegides = notificacionsNoLlegides.length;

    const isLoggedIn = !!user;
    if (isLoading) return null;

    const isActive = (path: string) => location.pathname === path;

    const { showToast } = useToast();

    useEffect(() => {
        const handler = () => {
            refetch();
        };
        window.addEventListener('new-notificacio', handler as EventListener);
        return () => window.removeEventListener('new-notificacio', handler as EventListener);
    }, [refetch]);

    useEffect(() => {
        const handler = () => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ["partitsPendents"] });
            queryClient.invalidateQueries({ queryKey: ["partitsJugats"] });
        };
        window.addEventListener('proposta-acceptada', handler as EventListener);
        window.addEventListener('proposta-rebutjada', handler as EventListener);
        return () => {
            window.removeEventListener('proposta-acceptada', handler as EventListener);
            window.removeEventListener('proposta-rebutjada', handler as EventListener);
        };
    }, [queryClient]);

    const handleLogout = () => {
        logout();
        showToast({ type: 'info', title: 'Sessió tancada', description: "S'ha tancat la sessió." });
        navigate("/login");
    };

    const handleAcceptProposta = async (notifId: string) => {
        setProcessingId(notifId);
        acceptMutation.mutate(notifId, {
            onSuccess: () => {
                showToast({ type: 'success', title: 'Proposta acceptada', description: "S'ha creat el partit amb la data proposada." });
                queryClient.invalidateQueries({ queryKey: ["partitsPendents"] });
                queryClient.invalidateQueries({ queryKey: ["partitsJugats"] });
                queryClient.invalidateQueries({ queryKey: ["notificacions"] });
            },
            onError: (e) => {
                console.error(e);
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut acceptar la proposta." });
            },
            onSettled: () => {
                setProcessingId(null);
            }
        });
    };

    const handleRejectProposta = async (notifId: string) => {
        setProcessingId(notifId);
        rejectMutation.mutate(notifId, {
            onSuccess: () => {
                showToast({ type: 'info', title: 'Proposta rebutjada', description: "S'ha rebutjat la proposta de partit." });
            },
            onError: (e) => {
                console.error(e);
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut rebutjar la proposta." });
            },
            onSettled: () => {
                setProcessingId(null);
            }
        });
    };

    const hasRol = (rol: string) => {
        return user?.rols?.some(r => (typeof r === 'string' ? r : r) === rol) || false;
    };

    const isAdmin = hasRol("ADMIN_WEB");
    const isArbitre = hasRol("ARBITRE");
    const isEntrenador = hasRol("ENTRENADOR");
    const isJugador = hasRol("JUGADOR");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PP</span>
                        </div>
                        <span className="text-xl font-semibold text-foreground">
                            PadelPlay
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Inici
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/dashboardAdmin"
                                className={`text-sm font-medium ${isActive("/dashboardAdmin") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Dashboard Admin
                            </Link>
                        )}

                        {isArbitre && (
                            <Link
                                to="/dashboardArbitre"
                                className={`text-sm font-medium ${isActive("/dashboardArbitre") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Dashboard Àrbitre
                            </Link>
                        )}

                        {isEntrenador && (
                            <Link
                                to="/dashboardEntrenador"
                                className={`text-sm font-medium ${isActive("/dashboardEntrenador") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Dashboard Entrenador
                            </Link>
                        )}

                        <Link
                            to="/ranking"
                            className={`text-sm font-medium ${isActive("/ranking") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Ranking
                        </Link>

                        {isJugador && (
                            <Link
                                to="/areaJugador"
                                className={`text-sm font-medium ${isActive("/areaJugador") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Area de jugador
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

                        {isLoggedIn && (
                            <div className="relative">
                                <button
                                    aria-label="Notificacions"
                                    className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                                    onClick={() => {
                                        setNotifOpen(v => !v);
                                        if (!notifOpen) {
                                            refetch();
                                        }
                                    }}
                                >
                                    <Bell />
                                    {countNoLlegides > 0 && (
                                        <>
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                                                {countNoLlegides > 99 ? '99+' : countNoLlegides}
                                            </span>
                                        </>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-50">
                                        <div className="p-3 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-t-lg flex items-center justify-between">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">Notificacions</div>
                                            {countNoLlegides > 0 && (
                                                <button
                                                    onClick={() => user?.id && marcarTotesLlegidesMutation.mutate(user.id.toString())}
                                                    disabled={marcarTotesLlegidesMutation.isPending}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
                                                >
                                                    {marcarTotesLlegidesMutation.isPending ? '...' : 'Marcar totes com llegides'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-auto bg-white dark:bg-zinc-900">
                                            {loadingNotifs && <div className="p-3 text-sm text-gray-500 dark:text-gray-400">Carregant...</div>}
                                            {!loadingNotifs && notifs.length === 0 && <div className="p-3 text-sm text-gray-500 dark:text-gray-400">Cap notificació</div>}
                                            {!loadingNotifs && [...notifs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(n => {
                                                const isProposta = n.tipus === 'proposta';
                                                const isPendent = n.extra?.estat === 'PENDENT';
                                                const isAcceptat = n.extra?.estat === 'ACCEPTAT';
                                                const isRebutjat = n.extra?.estat === 'REBUTJAT';
                                                const isProcessing = processingId === n.id;
                                                const isMarkingRead = marcarLlegidaMutation.isPending && marcarLlegidaMutation.variables === n.id;

                                                return (
                                                    <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                                                                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{n.titol}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-600 dark:text-gray-400">{n.missatge}</div>
                                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                                                            </div>
                                                            {!n.read && (
                                                                <button
                                                                    onClick={() => marcarLlegidaMutation.mutate(n.id)}
                                                                    disabled={isMarkingRead}
                                                                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                                                                    title="Marcar com a llegida"
                                                                >
                                                                    {isMarkingRead ? '...' : '✓'}
                                                                </button>
                                                            )}
                                                        </div>

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
                                        <div className="p-2 border-t border-gray-200 dark:border-zinc-700 text-center bg-gray-50 dark:bg-zinc-800 rounded-b-lg">
                                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" onClick={() => { setNotifOpen(false); }}>Tancar</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border space-y-2 bg-white dark:bg-zinc-900">
                        <Link
                            to="/"
                            className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Inici
                        </Link>

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
                                        onClick={() => {
                                            setNotifOpen(v => !v);
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Bell />
                                        {countNoLlegides > 0 && (
                                            <>
                                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                                                    {countNoLlegides > 99 ? '99+' : countNoLlegides}
                                                </span>
                                            </>
                                        )}
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