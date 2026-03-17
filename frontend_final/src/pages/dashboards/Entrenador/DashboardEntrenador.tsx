import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useGetMeusEquips } from '@/queries/club.queries'
import { useGetPartits } from '@/queries/partit.queries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
    Trophy,
    Users,
    Calendar,
    Target,
    BarChart2,
    Shield,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    ChevronDown,
    Plus,
} from 'lucide-react'
import type { Partit } from '@/services/partit.service'
import type { Equip } from '@/types/club'

// ─── Helper ────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        PENDENT: { label: 'Pendent', cls: 'bg-orange-100 text-orange-800' },
        PROGRAMAT: { label: 'Programat', cls: 'bg-blue-100 text-blue-800' },
        EN_CURS: { label: 'En Curs', cls: 'bg-green-100 text-green-800' },
        COMPLETAT: { label: 'Completat', cls: 'bg-gray-100 text-gray-700' },
    }
    const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
            {s.label}
        </span>
    )
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ca-ES', {
        weekday: 'long', day: '2-digit', month: '2-digit',
    })
}
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
}

// ─── Tab: Plantilla ───────────────────────────────────────────────────────────
function PlantillaTab({ equip }: { equip: Equip | null }) {
    if (!equip) return (
        <div className="text-center py-12 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecciona un equip per veure la plantilla.</p>
        </div>
    )

    return (
        <div className="space-y-4">
            {/* Avisos */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Revisa l'estat del segur dels jugadors abans del proper partit
                </div>
            </div>

            {/* Accions */}
            <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white text-xs gap-1">
                    <Plus className="w-3.5 h-3.5" /> Afegir Jugador
                </Button>
            </div>

            {/* Taula placeholder */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                        <tr>
                            <th className="text-left p-4 font-medium">#</th>
                            <th className="text-left p-4 font-medium">Nom</th>
                            <th className="text-left p-4 font-medium">Posició</th>
                            <th className="text-left p-4 font-medium">Segur</th>
                            <th className="text-left p-4 font-medium">Estat</th>
                            <th className="text-left p-4 font-medium">Accions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                                Plantilla de {equip.nom} (implementació amb /api/clubs/&#123;id&#125;/equips/&#123;equipId&#125;/membres)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─── Tab: Futurs Partits ──────────────────────────────────────────────────────
function FutursPartitsTab({ equip }: { equip: Equip | null }) {
    const navigate = useNavigate()
    const { data, isLoading } = useGetPartits(equip ? { equipId: equip.id } : undefined)
    const partits = (data?.partits ?? []).filter((p: Partit) =>
        p.status !== 'COMPLETAT' && p.status !== 'CANCELAT'
    )

    if (!equip) return (
        <div className="text-center py-12 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecciona un equip per veure els partits.</p>
        </div>
    )
    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="w-7 h-7 animate-spin text-green-700" />
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white text-xs gap-1">
                    <Plus className="w-3.5 h-3.5" /> Crear Partit
                </Button>
            </div>
            {!partits.length ? (
                <div className="text-center py-12 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Cap partit proper programat.</p>
                </div>
            ) : partits.map((p: Partit) => (
                <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                                <Calendar className="w-4 h-4 text-green-700" />
                                {formatDate(p.dataHora)} — {formatTime(p.dataHora)}
                            </div>
                            {p.ubicacio && <p className="text-xs text-slate-500 mb-2">📍 {p.ubicacio}</p>}
                            <div className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <span>{p.localNom ?? 'Local'}</span>
                                <span className="text-slate-400 font-normal">vs</span>
                                <span>{p.visitantNom ?? 'Visitant'}</span>
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <StatusBadge status={p.status} />
                                {p.arbitreNom && (
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> {p.arbitreNom}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white text-xs"
                                onClick={() => navigate(`/alineacio/${p.id}?equipId=${equip?.id ?? ''}`)}>
                                Alineació
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs"
                                onClick={() => navigate(`/partits/${p.id}`)}>
                                Detalls
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Tab: Estadistiques ───────────────────────────────────────────────────────
function EstadistiquesTab({ equip }: { equip: Equip | null }) {
    const { data } = useGetPartits(equip ? { equipId: equip.id } : undefined)
    const partits = data?.partits ?? []
    const guanyats = partits.filter((p: Partit) => {
        if (p.status !== 'COMPLETAT') return false
        if (p.setsLocal === undefined || p.setsVisitant === undefined) return false
        return equip?.id === p.localId
            ? p.setsLocal > p.setsVisitant
            : p.setsVisitant > p.setsLocal
    })
    const perduts = partits.filter((p: Partit) => p.status === 'COMPLETAT').length - guanyats.length

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Partits Jugats', value: partits.filter((p: Partit) => p.status === 'COMPLETAT').length, color: 'text-blue-700' },
                    { label: 'Victòries', value: guanyats.length, color: 'text-green-600' },
                    { label: 'Derrotes', value: perduts, color: 'text-red-600' },
                    {
                        label: 'Taxa Victòria', value: partits.filter((p: Partit) => p.status === 'COMPLETAT').length > 0
                            ? `${Math.round((guanyats.length / partits.filter((p: Partit) => p.status === 'COMPLETAT').length) * 100)}%`
                            : '—', color: 'text-purple-600'
                    },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center">
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            {!equip && (
                <div className="text-center py-8 text-slate-400">Selecciona un equip per veure estadístiques detallades</div>
            )}
        </div>
    )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardEntrenador() {
    const { user } = useAuth()
    const { data: equipsData, isLoading: equipsLoading } = useGetMeusEquips(user?.id ?? null)
    const equips = equipsData?.equips ?? []
    const [selectedEquipId, setSelectedEquipId] = useState<string | null>(null)

    const selectedEquip = equips.find((e) => e.id === selectedEquipId) ?? equips[0] ?? null

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Entrenador</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Benvingut, {user.nom}</p>
                        </div>
                    </div>

                    {/* Selector equip */}
                    {equips.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">El meu equip:</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
                                    value={selectedEquipId ?? selectedEquip?.id ?? ''}
                                    onChange={(e) => setSelectedEquipId(e.target.value)}
                                >
                                    {equips.map((e) => (
                                        <option key={e.id} value={e.id}>{e.nom}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {equipsLoading ? (
                <div className="flex items-center justify-center h-60">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700" />
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-green-700" />
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Equips</span>
                            </div>
                            <p className="text-3xl font-bold text-green-700">{equips.length}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-blue-700" />
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Equip Actiu</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{selectedEquip?.nom ?? '—'}</p>
                            {selectedEquip?.categoria && <p className="text-xs text-slate-400">{selectedEquip.categoria}</p>}
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estat Segur</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Revisar plantilla</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart2 className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Equipos totals</span>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">{equips.length}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="plantilla" className="space-y-4">
                        <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 flex-wrap h-auto gap-1">
                            <TabsTrigger value="plantilla" className="rounded-lg data-[state=active]:bg-green-800 data-[state=active]:text-white text-xs">
                                <Users className="w-3.5 h-3.5 mr-1" />Plantilla
                            </TabsTrigger>
                            <TabsTrigger value="partits" className="rounded-lg data-[state=active]:bg-green-800 data-[state=active]:text-white text-xs">
                                <Calendar className="w-3.5 h-3.5 mr-1" />Futurs Partits
                            </TabsTrigger>
                            <TabsTrigger value="alineacions" className="rounded-lg data-[state=active]:bg-green-800 data-[state=active]:text-white text-xs">
                                <Target className="w-3.5 h-3.5 mr-1" />Alineacions
                            </TabsTrigger>
                            <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-green-800 data-[state=active]:text-white text-xs">
                                <BarChart2 className="w-3.5 h-3.5 mr-1" />Estadístiques
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="plantilla">
                            <PlantillaTab equip={selectedEquip} />
                        </TabsContent>
                        <TabsContent value="partits">
                            <FutursPartitsTab equip={selectedEquip} />
                        </TabsContent>
                        <TabsContent value="alineacions">
                            <div className="text-center py-16 text-slate-500">
                                <Target className="w-14 h-14 mx-auto mb-4 opacity-30" />
                                <p className="font-medium">Alineacions</p>
                                <p className="text-sm mt-1">Selecciona un partit per crear o editar l'alineació</p>
                                <Button className="mt-4 bg-green-700 hover:bg-green-800 text-white text-sm"
                                    onClick={() => { }}>
                                    Veure partits i alineacions
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="stats">
                            <EstadistiquesTab equip={selectedEquip} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    )
}
