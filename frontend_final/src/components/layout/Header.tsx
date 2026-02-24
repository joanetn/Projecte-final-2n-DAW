import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Skeleton } from '@/components/ui/skeleton'
import { Menu, X, LogOut, Shield } from 'lucide-react'

export function Header() {
    const { user, isAuthenticated, isLoading, logout } = useAuth()
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
            setIsMobileMenuOpen(false)
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    const handleAdminClick = () => {
        navigate('/dashboardAdmin')
        setIsMobileMenuOpen(false)
    }

    const handleLoginClick = () => {
        navigate('/login')
        setIsMobileMenuOpen(false)
    }

    const handleRegisterClick = () => {
        navigate('/register')
        setIsMobileMenuOpen(false)
    }

    const handleProfileClick = () => {
        navigate('/profile')
        setIsMobileMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-warm-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-warm-900/20 dark:bg-slate-950/95">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-warm-500 to-warm-600">
                            <span className="text-lg font-bold text-white">PP</span>
                        </div>
                        <span className="hidden sm:inline font-bold text-lg text-slate-900 dark:text-white">
                            PadelPlay
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-sm font-medium text-slate-700 hover:text-warm-600 dark:text-slate-300 dark:hover:text-warm-400 transition-colors"
                        >
                            Home
                        </Link>
                    </div>

                    {/* Right side buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeSwitcher />

                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-20 rounded-md" />
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </div>
                        ) : isAuthenticated && user ? (
                            <>
                                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                                    <Button
                                        onClick={handleProfileClick}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Profile
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {user.nom}
                                    </span>
                                    <Button
                                        onClick={handleLogout}
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Salir
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleLoginClick}
                                    variant="outline"
                                    size="sm"
                                >
                                    Entrar
                                </Button>
                                <Button
                                    onClick={handleRegisterClick}
                                    size="sm"
                                    className="bg-warm-600 hover:bg-warm-700 text-white"
                                >
                                    Registrarse
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeSwitcher />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-warm-200 dark:border-warm-900/20 py-4 space-y-3">
                        <Link
                            to="/"
                            className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                            {isLoading ? (
                                <div className="px-4 space-y-2">
                                    <Skeleton className="h-8 w-full rounded-md" />
                                    <Skeleton className="h-8 w-full rounded-md" />
                                </div>
                            ) : isAuthenticated && user ? (
                                <>
                                    <div className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {user.nom}
                                    </div>
                                    {user.nivell === 'admin' && (
                                        <button
                                            onClick={handleAdminClick}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Shield className="h-4 w-4" />
                                            Panel Admin
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Salir
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={handleLoginClick}
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-center"
                                    >
                                        Entrar
                                    </Button>
                                    <Button
                                        onClick={handleRegisterClick}
                                        size="sm"
                                        className="w-full justify-center bg-warm-600 hover:bg-warm-700 text-white"
                                    >
                                        Registrarse
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
