import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useGetPartits } from '@/queries/partit.queries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
    Shield,
    Calendar,
    FileText,
    BarChart2,
    History,
    CheckCircle2,
    Clock,
    Edit,
    Loader2,
    AlertCircle,
} from 'lucide-react'
import type { Partit } from '@/services/partit.service'

// ─── Helper badges ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string }> = {
        PENDENT: { label: 'Pendent', className: 'bg-orange-100 text-orange-800 border-orange-200' },
        PROGRAMAT: { label: 'Programat', className: 'bg-blue-100 text-blue-800 border-blue-200' },
        EN_CURS: { label: 'En Curs', className: 'bg-green-100 text-green-800 border-green-200' },
        COMPLETAT: { label: 'Completat', className: 'bg-gray-100 text-gray-800 border-gray-200' },
        SENSE_ARBITRE: { label: 'Sense Àrbitre', className: 'bg-red-100 text-red-800 border-red-200' },
        CONFIRMADA: { label: '✔ Confirmada', className: 'bg-green-100 text-green-800 border-green-200' },
        BORRADOR: { label: '📝 Borrador', className: 'bg-gray-100 text-gray-700 border-gray-200' },
    }
    const s = map[status] ?? { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${s.className}`}>
            {s.label}
        </span>
    )
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ca-ES', {
        weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    })
}
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
}

// ─── Tab 1: Partits Pendents ─────────────────────────────────────────────────
function PartitsPendentsTab({ userId }: { userId: string }) {
    const navigate = useNavigate()
    const { data, isLoading, isError } = useGetPartits({ arbitreId: userId, status: 'PENDENT' })
    const partits = data?.partits ?? []

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
        </div>
    )
    if (isError) return (
        <div className="flex items-center gap-2 text-red-600 p-6">
            <AlertCircle className="w-5 h-5" />
            Error carregant partits. Torna-ho a intentar.
        </div>
    )
    if (!partits.length) return (
        <div className="text-center py-12 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No tens partits assignats pendents.</p>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Partits pendents: {partits.length}</span>
            </div>
            {partits.map((p: Partit) => (
                <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-blue-800 border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-blue-700" />
                                <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                                    {formatDate(p.dataHora)} — {formatTime(p.dataHora)}
                                </span>
                            </div>
                            {p.ubicacio && (
                                <p className="text-xs text-slate-500 mb-2">📍 {p.ubicacio}</p>
                            )}
                            <div className="flex items-center gap-3 text-base font-bold text-slate-800 dark:text-white">
                                <span>{p.localNom ?? 'Equip Local'}</span>
                                <span className="text-slate-400 font-normal">vs</span>
                                <span>{p.visitantNom ?? 'Equip Visitant'}</span>
                            </div>
                            <div className="mt-2">
                                <StatusBadge status={p.status} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                size="sm"
                                className="bg-blue-900 hover:bg-red-700 text-white text-xs"
                                onClick={() => navigate(`/acta/crear/${p.id}`)}
                            >
                                <FileText className="w-3.5 h-3.5 mr-1" />
                                Crear Acta
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => navigate(`/partits/${p.id}`)}
                            >
                                Detalls
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Tab 2: Meves Actes ───────────────────────────────────────────────────────
function MevesActesTab({ userId }: { userId: string }) {
    const navigate = useNavigate()
    // Get all partits assigned to this arbitre (including completed)
    const { data, isLoading } = useGetPartits({ arbitreId: userId })
    const partits = (data?.partits ?? []).filter((p: Partit) =>
        p.status === 'COMPLETAT' || p.status === 'EN_CURS'
    )

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
        </div>
    )
    if (!partits.length) return (
        <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Cap acta registrada encara.</p>
        </div>
    )

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                        <th className="text-left p-4 font-medium">Data</th>
                        <th className="text-left p-4 font-medium">Local</th>
                        <th className="text-left p-4 font-medium">Visitant</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Accions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {partits.map((p: Partit) => (
                        <tr key={p.id} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                            <td className="p-4 text-slate-700 dark:text-slate-300">
                                {new Date(p.dataHora).toLocaleDateString('ca-ES')}
                            </td>
                            <td className="p-4 font-medium text-slate-800 dark:text-white">
                                {p.localNom ?? '-'} {p.setsLocal !== undefined ? `(${p.setsLocal})` : ''}
                            </td>
                            <td className="p-4 font-medium text-slate-800 dark:text-white">
                                {p.visitantNom ?? '-'} {p.setsVisitant !== undefined ? `(${p.setsVisitant})` : ''}
                            </td>
                            <td className="p-4">
                                <StatusBadge status={p.status === 'COMPLETAT' ? 'CONFIRMADA' : 'BORRADOR'} />
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => navigate(`/acta/${p.id}`)}
                                    >
                                        {p.status === 'COMPLETAT' ? 'Veure' : <><Edit className="w-3 h-3 mr-1" />Editar</>}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// ─── Tab 3: Estadístiques ────────────────────────────────────────────────────
function EstadistiquesTab({ userId }: { userId: string }) {
    const { data } = useGetPartits({ arbitreId: userId })
    const total = data?.partits?.length ?? 0
    const completats = data?.partits?.filter((p: Partit) => p.status === 'COMPLETAT').length ?? 0
    const pendents = data?.partits?.filter((p: Partit) => p.status === 'PENDENT').length ?? 0
    const taxa = total > 0 ? Math.round((completats / total) * 100) : 0

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Partits', value: total, color: 'text-blue-700' },
                    { label: 'Completats', value: completats, color: 'text-green-600' },
                    { label: 'Pendents', value: pendents, color: 'text-orange-600' },
                    { label: 'Taxa confirmació', value: `${taxa}%`, color: 'text-purple-600' },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center">
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Distribució de partits</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Completats', value: completats, total, color: 'bg-green-500' },
                        { label: 'Pendents', value: pendents, total, color: 'bg-orange-400' },
                    ].map((bar) => (
                        <div key={bar.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600 dark:text-slate-400">{bar.label}</span>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{bar.value}</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${bar.color} rounded-full transition-all`}
                                    style={{ width: `${bar.total > 0 ? (bar.value / bar.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Tab 4: Historial ─────────────────────────────────────────────────────────
function HistorialTab({ userId }: { userId: string }) {
    const navigate = useNavigate()
    const { data, isLoading } = useGetPartits({ arbitreId: userId })
    const partits = data?.partits ?? []

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
        </div>
    )

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                        <th className="text-left p-4 font-medium">Data</th>
                        <th className="text-left p-4 font-medium">Local</th>
                        <th className="text-left p-4 font-medium">Visitant</th>
                        <th className="text-left p-4 font-medium">Sets</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Accions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {partits.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">Cap historial disponible</td>
                        </tr>
                    ) : partits.map((p: Partit) => (
                        <tr key={p.id} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                            <td className="p-4 text-slate-600 dark:text-slate-400">
                                {new Date(p.dataHora).toLocaleDateString('ca-ES')}
                            </td>
                            <td className="p-4">{p.localNom ?? '-'}</td>
                            <td className="p-4">{p.visitantNom ?? '-'}</td>
                            <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                                {p.setsLocal !== undefined ? `${p.setsLocal}–${p.setsVisitant}` : '—'}
                            </td>
                            <td className="p-4"><StatusBadge status={p.status} /></td>
                            <td className="p-4">
                                <Button size="sm" variant="outline" className="text-xs"
                                    onClick={() => navigate(`/acta/${p.id}`)}>
                                    Veure
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardArbitre() {
    const { user } = useAuth()
    const { data } = useGetPartits({ arbitreId: user?.id })
    const partits = data?.partits ?? []
    const pendents = partits.filter((p: Partit) => p.status === 'PENDENT' || p.status === 'SENSE_ARBITRE')
    const completats = partits.filter((p: Partit) => p.status === 'COMPLETAT')
    const proper = pendents[0]

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Àrbitre</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Benvingut, {user.nom}</p>
                    </div>
                </div>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-700" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Proper Partit</span>
                    </div>
                    {proper ? (
                        <>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                {formatDate(proper.dataHora)}
                            </p>
                            <p className="text-xs text-slate-500">{proper.localNom} vs {proper.visitantNom}</p>
                        </>
                    ) : (
                        <p className="text-sm text-slate-400">Cap pendent</p>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Actes Pendent</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{pendents.length}</p>
                    <p className="text-xs text-slate-500">per completar</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Actes Confirmades</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{completats.length}</p>
                    <p className="text-xs text-slate-500">completades</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pendents" className="space-y-4">
                <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                    <TabsTrigger value="pendents" className="rounded-lg data-[state=active]:bg-blue-900 data-[state=active]:text-white text-xs">
                        <Calendar className="w-3.5 h-3.5 mr-1" />Partits Pendents
                    </TabsTrigger>
                    <TabsTrigger value="actes" className="rounded-lg data-[state=active]:bg-blue-900 data-[state=active]:text-white text-xs">
                        <FileText className="w-3.5 h-3.5 mr-1" />Meves Actes
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-blue-900 data-[state=active]:text-white text-xs">
                        <BarChart2 className="w-3.5 h-3.5 mr-1" />Estadístiques
                    </TabsTrigger>
                    <TabsTrigger value="historial" className="rounded-lg data-[state=active]:bg-blue-900 data-[state=active]:text-white text-xs">
                        <History className="w-3.5 h-3.5 mr-1" />Historial
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pendents">
                    <PartitsPendentsTab userId={user.id} />
                </TabsContent>
                <TabsContent value="actes">
                    <MevesActesTab userId={user.id} />
                </TabsContent>
                <TabsContent value="stats">
                    <EstadistiquesTab userId={user.id} />
                </TabsContent>
                <TabsContent value="historial">
                    <HistorialTab userId={user.id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
