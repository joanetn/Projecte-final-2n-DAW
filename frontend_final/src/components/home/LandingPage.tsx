import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leagues } from '@/components/home/Leagues/Leagues'
import {
    Trophy,
    Users,
    Shield,
    Medal,
    Handshake,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react'

const features = [
    {
        icon: Trophy,
        title: 'Crea tus equipos en segundos',
        description: 'Define plantilla, roles y gestiona miembros',
        details: ['Asigna automáticamente roles de admin', 'Importa jugadores existentes', 'Define posiciones y dorsales'],
    },
    {
        icon: Users,
        title: 'Alineaciones visuales',
        description: 'Crea alineaciones antes del partido',
        details: ['Interfaz tipo pista', 'Titulares + suplentes', 'Validaciones automáticas'],
    },
    {
        icon: Shield,
        title: 'Sistema de actas oficial',
        description: 'Registra todos los detalles del partido',
        details: ['Sets, juegos y puntos', 'Incidencias (lesiones, avisos)', 'Observaciones y notas'],
    },
    {
        icon: Medal,
        title: 'Clasificaciones en tiempo real',
        description: 'Ve el ranking actualizado automáticamente',
        details: ['Por liga y categoría', 'Histórico de cambios', 'Gráficas de progresión'],
    },
    {
        icon: Handshake,
        title: 'Solicita y negocia partidos',
        description: 'Coordina encuentros entre equipos',
        details: ['Envía propuestas directas', 'Confirmación automática', 'Calendario sincronizado'],
    },
    {
        icon: CheckCircle2,
        title: 'Protege a tus jugadores',
        description: 'Sistema de seguros integrado',
        details: ['25€/año por jugador', 'Pago con Stripe', 'Validación en alineaciones'],
    },
]

export function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen">
            {/* ── Hero Section ──────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-warm-600 via-warm-500 to-warm-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white py-20 md:py-32">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                        🎾 Plataforma de Gestión de Pádel
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Gestiona tu Liga de Pádel{' '}
                        <span className="text-warm-200 dark:text-warm-300">Profesionalmente</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Sincroniza alineaciones, arbitrajes y estadísticas en tiempo real. Todo en un solo lugar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-warm-700 hover:bg-warm-50 font-semibold shadow-lg"
                            onClick={() => navigate('/register')}
                        >
                            Registrarse gratis
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar sesión
                        </Button>
                    </div>

                    {/* Stats animadas */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
                        {[
                            { value: '500+', label: 'Usuarios' },
                            { value: '50+', label: 'Equipos' },
                            { value: '1000+', label: 'Partidos' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-white/70">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────── */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Todo lo que necesitas para gestionar tu liga
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            Herramientas profesionales diseñadas específicamente para clubes y ligas de pádel.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={feature.title}
                                    className="group p-6 rounded-xl border border-warm-100 dark:border-slate-700 bg-warm-50/30 dark:bg-slate-800 hover:shadow-md hover:border-warm-300 dark:hover:border-warm-600 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-warm-600 dark:text-warm-400" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{feature.description}</p>
                                    <ul className="space-y-1">
                                        {feature.details.map((d) => (
                                            <li key={d} className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                                                <span className="text-warm-500">✓</span> {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── Ligas (Carrusel) ──────────────────────────────── */}
            <div className="bg-warm-50 dark:bg-slate-800">
                <Leagues />
            </div>

            {/* ── CTA Final ─────────────────────────────────────── */}
            <section className="py-20 bg-gradient-to-r from-warm-600 to-warm-700 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-3xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comenzar?</h2>
                    <p className="text-white/80 mb-8 text-lg">
                        Únete a cientos de clubes que ya gestionan su liga con nuestra plataforma.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-warm-700 hover:bg-warm-50 font-semibold"
                            onClick={() => navigate('/register')}
                        >
                            Crear mi cuenta
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            onClick={() => navigate('/login')}
                        >
                            Ya tengo cuenta
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
