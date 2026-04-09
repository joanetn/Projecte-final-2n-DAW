import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useGetInsurances } from '@/queries/insurance.queries'
import { useGetMeusEquips } from '@/queries/club.queries'
import { useGetPartits } from '@/queries/partit.queries'
import { useGetInvitacionsPendents, useRespondreInvitacio } from '@/queries/alineacio.queries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    User as UserIcon,
    Users,
    BarChart2,
    Calendar,
    Shield,
    Mail,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Loader2,
    Clock,
    Bell,
    MapPin,
} from 'lucide-react'
import type { Equip } from '@/types/club'
import type { Partit } from '@/types/partit'
import type { Invitacio } from '@/services/dto/invitacio.dto'
import type { Insurance } from '@/types/insurance'

// ── Tab: Mis Datos ────────────────────────────────────────────────────────────
function MisDatosTab() {
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user) return null
    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start gap-5">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-slate-600 flex items-center justify-center text-3xl font-bold text-blue-700 dark:text-blue-300 shrink-0">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.nom} className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            user.nom?.[0]?.toUpperCase() ?? 'U'
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.nom}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" /> {user.email}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(user.rols ?? []).map((r) => (
                                <Badge key={r.id} variant="secondary" className="text-xs">{r.rol}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                    {user.telefon && (
                        <div>
                            <p className="text-xs text-slate-500">Telèfon</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.telefon}</p>
                        </div>
                    )}
                    {user.dataNaixement && (
                        <div>
                            <p className="text-xs text-slate-500">Data de naixement</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {new Date(user.dataNaixement).toLocaleDateString('ca-ES')}
                            </p>
                        </div>
                    )}
                    {user.dni && (
                        <div>
                            <p className="text-xs text-slate-500">DNI</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.dni}</p>
                        </div>
                    )}
                    {user.nivell && (
                        <div>
                            <p className="text-xs text-slate-500">Nivell</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.nivell}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-slate-500">Estat</p>
                        <p className={`text-sm font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {user.isActive ? 'Actiu' : 'Inactiu'}
                        </p>
                    </div>
                </div>
                <Button size="sm" variant="outline" className="mt-4" onClick={() => navigate('/profile')}>
                    Editar perfil <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    )
}

// ── Tab: Mis Equips ───────────────────────────────────────────────────────────
function MisEquipsTab({ userId }: { userId: string }) {
    const { data, isLoading } = useGetMeusEquips(userId)
    const equips = data?.equips ?? []

    if (isLoading) return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
    )

    if (!equips.length) return (
        <div className="text-center py-12 text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No pertanys a cap equip encara.</p>
            <p className="text-sm mt-1">Espera una invitació o contacta al teu entrenador.</p>
        </div>
    )

    return (
        <div className="space-y-3">
            {equips.map((equip: Equip) => (
                <div key={equip.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white">
                                {equip.nom || 'Equip sense nom'}
                            </p>
                            {equip.categoria && <p className="text-xs text-slate-500 mt-0.5">{equip.categoria}</p>}
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {equip.lligaNom && <Badge variant="secondary" className="text-xs">{equip.lligaNom}</Badge>}
                                {equip.rolMeu && <Badge className="text-xs bg-blue-100 text-blue-700">{equip.rolMeu}</Badge>}
                            </div>
                        </div>
                        <Badge className={equip.isActive === false ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}>
                            {equip.isActive === false ? 'Inactiu' : 'Actiu'}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Tab: Estadístiques ────────────────────────────────────────────────────────
function EstadistiquesTab({
    equipsCount,
    partitsTotals,
    partitsPendents,
    invitacionsPendents,
}: {
    equipsCount: number
    partitsTotals: number
    partitsPendents: number
    invitacionsPendents: number
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Equips actius</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{equipsCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Partits totals</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{partitsTotals}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Partits pendents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{partitsPendents}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Invitacions pendents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{invitacionsPendents}</p>
            </div>
        </div>
    )
}

// ── Tab: Pròxims Partits ──────────────────────────────────────────────────────
function PartitsTab({ equipIds }: { equipIds: string[] }) {
    const equipIdsParam = equipIds.join(',')
    const { data, isLoading } = useGetPartits({ equipIds: equipIdsParam || '__NONE__' })
    const partits = (data?.partits ?? [])
        .filter((p: Partit) => p.status !== 'COMPLETAT')
        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())

    if (isLoading) return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
    )

    if (!partits.length) return (
        <div className="text-center py-12 text-slate-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Cap partit proper programat.</p>
        </div>
    )

    return (
        <div className="space-y-3">
            {partits.map((p: Partit) => (
                <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(p.dataHora).toLocaleDateString('ca-ES', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                        {' — '}
                        {new Date(p.dataHora).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {p.ubicacio && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" />{p.ubicacio}
                        </p>
                    )}
                    <p className="font-bold text-slate-800 dark:text-white">
                        {p.localNom ?? 'Local'} <span className="text-slate-400 font-normal">vs</span> {p.visitantNom ?? 'Visitant'}
                    </p>
                    <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'PROGRAMAT' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                            }`}>{p.status}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Tab: Seguro ───────────────────────────────────────────────────────────────
function SeguroTab() {
    const navigate = useNavigate()
    const { data: insurances, isLoading } = useGetInsurances()

    if (isLoading) return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
    )

    const activeInsurance = (insurances ?? []).find((ins: Insurance) =>
        !!ins.isActive && ins.pagat
    )

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Estat del Segur</h3>
                </div>
                {activeInsurance ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Segur actiu</span>
                        </div>
                        {activeInsurance.dataExpiracio && (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                                <Clock className="w-4 h-4" />
                                Venciment: {new Date(activeInsurance.dataExpiracio).toLocaleDateString('ca-ES')}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Sense segur actiu</span>
                        </div>
                        <p className="text-sm text-slate-500">Necessites un segur per poder jugar.</p>
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white" onClick={() => navigate('/seguro')}>
                            Contractar Segur
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Tab: Invitacions ──────────────────────────────────────────────────────────
function InvitacionsTab({ userId }: { userId: string }) {
    const { data: invitacions, isLoading } = useGetInvitacionsPendents(userId)
    const respondre = useRespondreInvitacio(userId)
    const pendents = invitacions ?? []

    if (isLoading) return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
    )

    if (!pendents.length) return (
        <div className="text-center py-12 text-slate-500">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Cap invitació pendent.</p>
        </div>
    )

    return (
        <div className="space-y-3">
            {pendents.map((inv: Invitacio) => (
                <div key={inv.id} className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-orange-400 border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                Invitació de {inv.equipNom ?? 'Equip sense nom'}
                            </p>
                            {inv.tipus && <p className="text-xs text-slate-500 mt-0.5">Rol: {inv.tipus}</p>}
                            {inv.dataCreacio && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {new Date(inv.dataCreacio).toLocaleDateString('ca-ES')}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                                disabled={respondre.isPending}
                                onClick={() => respondre.mutate({ id: inv.id, estat: 'acceptada' })}>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Acceptar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
                                disabled={respondre.isPending}
                                onClick={() => respondre.mutate({ id: inv.id, estat: 'rebutjada' })}>
                                <XCircle className="w-3.5 h-3.5 mr-1" />Rebutjar
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Dashboard Jugador (main) ──────────────────────────────────────────────────
export default function DashboardJugador() {
    const { user } = useAuth()
    const { data: insurances } = useGetInsurances()
    const { data: equipsData } = useGetMeusEquips(user?.id ?? null)
    const { data: invitacionsData } = useGetInvitacionsPendents(user?.id ?? null)

    const activeInsurance = (insurances ?? []).find((ins: Insurance) =>
        !!ins.isActive && ins.pagat
    )
    const equips = equipsData?.equips ?? []
    const equipIds = useMemo(() => equips.map((equip) => equip.id), [equips])
    const equipIdsParam = useMemo(() => equipIds.join(','), [equipIds])
    const { data: partitsMeusData } = useGetPartits({ equipIds: equipIdsParam || '__NONE__' })
    const partitsMeus = useMemo(
        () => partitsMeusData?.partits ?? [],
        [partitsMeusData]
    )
    const propersPartits = useMemo(
        () => partitsMeus
            .filter((p: Partit) => p.status !== 'COMPLETAT')
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()),
        [partitsMeus]
    )
    const properPartit = propersPartits[0]
    const pendentCount = invitacionsData?.length ?? 0

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Jugador</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Benvingut, {user.nom}</p>
                    </div>
                </div>
            </div>

            {/* Stats personals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Equips</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{equips.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Proper Partit</span>
                    </div>
                    {properPartit ? (
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {new Date(properPartit.dataHora).toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit' })}
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">—</p>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Segur</span>
                    </div>
                    {activeInsurance ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Actiu
                        </span>
                    ) : (
                        <span className="text-red-500 text-sm font-medium">Sense segur</span>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Invitacions</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-500">{pendentCount}</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="dades" className="space-y-4">
                <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 flex-wrap h-auto gap-1">
                    <TabsTrigger value="dades" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                        <UserIcon className="w-3.5 h-3.5 mr-1" />Les Meves Dades
                    </TabsTrigger>
                    <TabsTrigger value="equips" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                        <Users className="w-3.5 h-3.5 mr-1" />Els Meus Equips
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                        <BarChart2 className="w-3.5 h-3.5 mr-1" />Estadístiques
                    </TabsTrigger>
                    <TabsTrigger value="partits" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                        <Calendar className="w-3.5 h-3.5 mr-1" />Pròxims Partits
                    </TabsTrigger>
                    <TabsTrigger value="segur" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                        <Shield className="w-3.5 h-3.5 mr-1" />Segur
                    </TabsTrigger>
                    <TabsTrigger value="invitacions" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                        <Bell className="w-3.5 h-3.5 mr-1" />Invitacions
                        {pendentCount > 0 && (
                            <span className="ml-1 bg-orange-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold leading-none">
                                {pendentCount}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dades"><MisDatosTab /></TabsContent>
                <TabsContent value="equips"><MisEquipsTab userId={user.id} /></TabsContent>
                <TabsContent value="stats"><EstadistiquesTab equipsCount={equips.length} partitsTotals={partitsMeus.length} partitsPendents={propersPartits.length} invitacionsPendents={pendentCount} /></TabsContent>
                <TabsContent value="partits"><PartitsTab equipIds={equipIds} /></TabsContent>
                <TabsContent value="segur"><SeguroTab /></TabsContent>
                <TabsContent value="invitacions"><InvitacionsTab userId={user.id} /></TabsContent>
            </Tabs>
        </div>
    )
}
