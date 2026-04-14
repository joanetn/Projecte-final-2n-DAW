import { useEffect, useMemo, useState } from 'react'
import { useGetClubs, useGetEquipsClub, useGetEquipMembres, useGetLeagueCategories } from '@/queries/club.queries'
import { useGetPartits } from '@/queries/partit.queries'
import { useCrearInvitacioEquip, useGetInvitacioCandidates, useGetInvitacionsEquip } from '@/queries/alineacio.queries'
import {
    useCrearEquip,
    useActualitzarClub,
    useLeaveMeEquip,
    useRemoveEquipMembre,
    useUpdateEquipMembreRole,
} from '@/mutations/club.mutations'
import { useAuth } from '@/context/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Building2,
    Users,
    BarChart2,
    UserCog,
    Plus,
    Loader2,
    Trophy,
    Phone,
    Mail,
    MapPin,
    Edit2,
    X,
    Check,
    Trash2,
    LogOut,
    Bell,
    UserPlus,
    RefreshCw,
} from 'lucide-react'

const normalizeEquipRole = (rol?: string | null) => String(rol ?? '').trim().toLowerCase()
const canBeRemovedByManager = (rol?: string | null) => {
    const normalized = normalizeEquipRole(rol)
    return normalized === 'jugador' || normalized === 'entrenador'
}

const getEquipRoleLabel = (rol?: string | null) => {
    const normalized = normalizeEquipRole(rol)

    if (normalized === 'jugador') return 'Jugador'
    if (normalized === 'entrenador') return 'Entrenador'
    if (normalized === 'delegat') return 'Delegat'

    return rol ?? 'Sense rol'
}

const getEquipRoleBadgeClass = (rol?: string | null) => {
    const normalized = normalizeEquipRole(rol)

    if (normalized === 'entrenador') {
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    }

    if (normalized === 'jugador') {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }

    if (normalized === 'delegat') {
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
    }

    return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
}

function InvitationStatusBadge({ estat }: { estat: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        pendent: { label: 'Pendent', cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
        acceptada: { label: 'Acceptada', cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
        rebutjada: { label: 'Rebutjada', cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
        cancelada: { label: 'Cancelada', cls: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' },
    }

    const status = map[estat] ?? map.pendent

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
            {status.label}
        </span>
    )
}

const formatNivellLabel = (nivell?: string) => {
    if (!nivell) return 'Nivell no indicat'
    return `${nivell.charAt(0).toUpperCase()}${nivell.slice(1)}`
}

const getAvatarInitials = (nom?: string) => {
    const trimmed = (nom ?? '').trim()
    if (!trimmed) return 'U'

    const words = trimmed.split(/\s+/).filter(Boolean)
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase()
    }

    return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase()
}

// ── Tab: Informació del Club ──────────────────────────────────────────────────
function InfoClubTab({ clubId }: { clubId: string }) {
    const { data: clubsData, isLoading } = useGetClubs()
    const club = (clubsData?.clubs ?? []).find((c) => c.id === clubId)
    const actualitzarMutation = useActualitzarClub(clubId)

    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        nom: club?.nom ?? '',
        email: club?.email ?? '',
        telefon: club?.telefon ?? '',
        ubicacio: club?.ubicacio ?? '',
    })

    if (isLoading) return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
        </div>
    )

    if (!club) return <p className="text-slate-500 py-8 text-center">No se encontró información del club.</p>

    const handleSave = async () => {
        await actualitzarMutation.mutateAsync(form)
        setEditing(false)
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-100 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center text-2xl font-bold text-warm-700 dark:text-warm-300">
                        {club.nom?.[0]?.toUpperCase() ?? 'C'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{club.nom}</h2>
                        {club.numEquips !== undefined && (
                            <Badge variant="secondary" className="text-xs">{club.numEquips} equipos</Badge>
                        )}
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        if (editing) {
                            setEditing(false)
                            setForm({ nom: club.nom ?? '', email: club.email ?? '', telefon: club.telefon ?? '', ubicacio: club.ubicacio ?? '' })
                        } else {
                            setEditing(true)
                        }
                    }}
                >
                    {editing ? <><X className="w-4 h-4 mr-1" />Cancelar</> : <><Edit2 className="w-4 h-4 mr-1" />Editar</>}
                </Button>
            </div>

            {editing ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nombre</label>
                            <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Email</label>
                            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Teléfono</label>
                            <Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Ubicación</label>
                            <Input value={form.ubicacio} onChange={(e) => setForm({ ...form, ubicacio: e.target.value })} />
                        </div>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={actualitzarMutation.isPending}
                        className="bg-warm-600 hover:bg-warm-700 text-white"
                    >
                        {actualitzarMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                        Guardar cambios
                    </Button>
                </div>
            ) : (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {club.email && (
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <div>
                                <dt className="text-xs text-slate-500 dark:text-slate-400">Email</dt>
                                <dd className="text-slate-900 dark:text-white">{club.email}</dd>
                            </div>
                        </div>
                    )}
                    {club.telefon && (
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <div>
                                <dt className="text-xs text-slate-500 dark:text-slate-400">Teléfono</dt>
                                <dd className="text-slate-900 dark:text-white">{club.telefon}</dd>
                            </div>
                        </div>
                    )}
                    {club.ubicacio && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <div>
                                <dt className="text-xs text-slate-500 dark:text-slate-400">Ubicación</dt>
                                <dd className="text-slate-900 dark:text-white">{club.ubicacio}</dd>
                            </div>
                        </div>
                    )}
                    {club.createdAt && (
                        <div className="text-sm">
                            <dt className="text-xs text-slate-500 dark:text-slate-400">Creado el</dt>
                            <dd className="text-slate-900 dark:text-white">
                                {new Date(club.createdAt).toLocaleDateString('ca-ES')}
                            </dd>
                        </div>
                    )}
                </dl>
            )}
        </div>
    )
}

// ── Tab: Equips del Club ──────────────────────────────────────────────────────
function EquipsTab({ clubId }: { clubId: string }) {
    const { data, isLoading } = useGetEquipsClub(clubId)
    const { data: categoriesData } = useGetLeagueCategories()
    const equips = data?.equips ?? []
    const categories = categoriesData ?? []
    const crearEquipMutation = useCrearEquip()

    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ nom: '', categoria: '', clubId })

    const handleCrear = async () => {
        if (!form.nom.trim() || !form.categoria.trim()) return
        await crearEquipMutation.mutateAsync({ ...form, clubId })
        setShowForm(false)
        setForm({ nom: '', categoria: '', clubId })
    }

    if (isLoading) return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                    className="bg-warm-600 hover:bg-warm-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Crear Equipo
                </Button>
            </div>

            {showForm && (
                <div className="p-4 rounded-lg bg-warm-50 dark:bg-slate-700 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                            placeholder="Nombre del equipo *"
                            value={form.nom}
                            onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        />
                        <select
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                            className="text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2"
                        >
                            <option value="">Selecciona categoría *</option>
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleCrear}
                            disabled={crearEquipMutation.isPending || !form.nom.trim() || !form.categoria.trim()}
                            className="bg-warm-600 hover:bg-warm-700 text-white"
                        >
                            {crearEquipMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                            Crear
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                    </div>
                </div>
            )}

            {equips.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Este club no tiene equipos todavía.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {equips.map((equip) => (
                        <div
                            key={equip.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-warm-100 dark:border-slate-700 p-4 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{equip.nom}</p>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    {equip.categoria && <Badge variant="secondary" className="text-xs">{equip.categoria}</Badge>}
                                    {equip.lligaNom && <Badge variant="secondary" className="text-xs">{equip.lligaNom}</Badge>}
                                    {equip.numJugadors !== undefined && (
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{equip.numJugadors} jugadores</span>
                                    )}
                                </div>
                            </div>
                            <Badge
                                className={
                                    equip.isActive !== false
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                                }
                            >
                                {equip.isActive !== false ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Tab: Estadístiques ────────────────────────────────────────────────────────
function EstadistiquesTab({ clubId }: { clubId: string }) {
    const { data: equipsData, isLoading: loadingEquips } = useGetEquipsClub(clubId)
    const equips = equipsData?.equips ?? []

    const equipIdsParam = equips
        .map((equip) => equip.id)
        .filter((id): id is string => Boolean(id))
        .join(',')

    const { data: partitsData, isLoading: loadingPartits } = useGetPartits({
        equipIds: equipIdsParam || '__NONE__',
    })

    const partits = partitsData?.partits ?? []

    if (loadingEquips || loadingPartits) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
            </div>
        )
    }

    if (equips.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Crea equips per començar a veure estadístiques del club.</p>
            </div>
        )
    }

    const totalEquips = equips.length
    const equipsActius = equips.filter((equip) => equip.isActive !== false).length
    const equipsAmbLliga = equips.filter((equip) => Boolean(equip.lligaId)).length
    const totalJugadors = equips.reduce((acc, equip) => acc + (equip.numJugadors ?? 0), 0)

    const partitsCompletats = partits.filter((partit) => partit.status === 'COMPLETAT').length
    const partitsPendents = partits.filter(
        (partit) => partit.status !== 'COMPLETAT' && partit.status !== 'CANCELAT',
    ).length

    const categoriesMap = equips.reduce<Record<string, number>>((acc, equip) => {
        const key = (equip.categoria || 'Sense categoria').trim() || 'Sense categoria'
        acc[key] = (acc[key] ?? 0) + 1
        return acc
    }, {})

    const categories = Object.entries(categoriesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Equips totals</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalEquips}</p>
                </div>

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Equips actius</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{equipsActius}</p>
                </div>

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Equips inscrits</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{equipsAmbLliga}</p>
                </div>

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Jugadors (estimació)</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-1">{totalJugadors}</p>
                </div>

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Partits completats</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{partitsCompletats}</p>
                </div>

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Partits pendents</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-400 mt-1">{partitsPendents}</p>
                </div>
            </div>

            <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Distribució per categoria</h3>

                {categories.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No hi ha categories disponibles.</p>
                ) : (
                    <div className="space-y-2">
                        {categories.map(([categoria, count]) => (
                            <div key={categoria} className="flex items-center justify-between text-sm">
                                <span className="text-slate-700 dark:text-slate-200">{categoria}</span>
                                <Badge variant="secondary" className="text-xs">{count} equips</Badge>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Tab: Membres ──────────────────────────────────────────────────────────────
function MembresTab({ clubId, currentUserId }: { clubId: string; currentUserId: string }) {
    const { data: equipsData, isLoading: loadingEquips } = useGetEquipsClub(clubId)
    const equips = equipsData?.equips ?? []
    const removeMembreMutation = useRemoveEquipMembre()
    const updateMembreRoleMutation = useUpdateEquipMembreRole()
    const leaveEquipMutation = useLeaveMeEquip()

    const [selectedEquipId, setSelectedEquipId] = useState<string>('')
    const [removeTarget, setRemoveTarget] = useState<{ id: string; nom: string } | null>(null)
    const [roleTarget, setRoleTarget] = useState<{
        id: string
        nom: string
        currentRole: 'jugador' | 'entrenador'
    } | null>(null)
    const [nextRole, setNextRole] = useState<'jugador' | 'entrenador'>('jugador')
    const [leaveOpen, setLeaveOpen] = useState(false)
    const [successorMembreId, setSuccessorMembreId] = useState('')
    const [actionError, setActionError] = useState<string | null>(null)

    useEffect(() => {
        if (equips.length === 0) {
            if (selectedEquipId) {
                setSelectedEquipId('')
            }
            return
        }

        const selectedIsValid = equips.some((equip) => equip.id === selectedEquipId)
        if (!selectedEquipId || !selectedIsValid) {
            setSelectedEquipId(equips[0].id)
        }
    }, [equips, selectedEquipId])

    const {
        data: membresData,
        isLoading: loadingMembres,
        isError,
    } = useGetEquipMembres(selectedEquipId || null)

    const membres = membresData?.membres ?? []
    const currentEquip = equips.find((equip) => equip.id === selectedEquipId) ?? null
    const myMembre = membres.find((membre) => membre.usuariId === currentUserId)
    const myRole = normalizeEquipRole(myMembre?.rolEquip)
    const hasDelegatInEquip = membres.some((membre) => normalizeEquipRole(membre.rolEquip) === 'delegat')
    const hasOtherDelegat = membres.some(
        (membre) => membre.usuariId !== currentUserId && normalizeEquipRole(membre.rolEquip) === 'delegat',
    )
    const otherTrainerCount = membres.filter(
        (membre) => membre.usuariId !== currentUserId && normalizeEquipRole(membre.rolEquip) === 'entrenador',
    ).length
    const requiresSuccessor = (myRole === 'delegat' && !hasOtherDelegat)
        || (myRole === 'entrenador' && !hasDelegatInEquip && otherTrainerCount === 0)
    const successorCandidates = membres.filter((membre) => membre.usuariId !== currentUserId && membre.isActive !== false)

    useEffect(() => {
        if (!leaveOpen) return

        const firstCandidate = successorCandidates[0]
        setSuccessorMembreId(firstCandidate?.id ?? '')
    }, [leaveOpen, successorCandidates])

    const confirmRemoveMembre = () => {
        if (!currentEquip || !removeTarget) return

        setActionError(null)
        removeMembreMutation.mutate(
            { equipId: currentEquip.id, membreId: removeTarget.id },
            {
                onSuccess: () => {
                    setRemoveTarget(null)
                },
                onError: (error) => {
                    const message = error instanceof Error ? error.message : 'No s\'ha pogut donar de baixa el membre.'
                    setActionError(message)
                },
            },
        )
    }

    const openRoleDialog = (membreId: string, nom?: string, rolEquip?: string | null) => {
        const currentRole = normalizeEquipRole(rolEquip) === 'entrenador' ? 'entrenador' : 'jugador'

        setRoleTarget({
            id: membreId,
            nom: nom ?? 'Membre',
            currentRole,
        })
        setNextRole(currentRole)
        setActionError(null)
    }

    const confirmRoleChange = () => {
        if (!currentEquip || !roleTarget) return

        if (nextRole === roleTarget.currentRole) {
            setActionError('Selecciona un rol diferent abans de guardar.')
            return
        }

        setActionError(null)
        updateMembreRoleMutation.mutate(
            {
                equipId: currentEquip.id,
                membreId: roleTarget.id,
                rolEquip: nextRole,
            },
            {
                onSuccess: () => {
                    setRoleTarget(null)
                },
                onError: (error) => {
                    const message = error instanceof Error ? error.message : 'No s\'ha pogut canviar el rol del membre.'
                    setActionError(message)
                },
            },
        )
    }

    const confirmLeaveEquip = () => {
        if (!currentEquip) return

        setActionError(null)
        leaveEquipMutation.mutate(
            {
                equipId: currentEquip.id,
                successorMembreId: requiresSuccessor ? successorMembreId || null : null,
            },
            {
                onSuccess: () => {
                    setLeaveOpen(false)
                    setSuccessorMembreId('')
                },
                onError: (error) => {
                    const message = error instanceof Error ? error.message : 'No s\'ha pogut sortir de l\'equip.'
                    setActionError(message)
                },
            },
        )
    }

    if (loadingEquips) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
            </div>
        )
    }

    if (equips.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No hay equipos creados todavía. Crea un equipo para ver sus miembros.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-warm-50 dark:bg-slate-700 rounded-xl border border-warm-100 dark:border-slate-600 p-4">
                <label className="text-xs text-slate-500 dark:text-slate-300 mb-1 block">Selecciona equipo</label>
                <select
                    value={selectedEquipId}
                    onChange={(e) => setSelectedEquipId(e.target.value)}
                    className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2"
                >
                    {equips.map((equip) => (
                        <option key={equip.id} value={equip.id}>{equip.nom}</option>
                    ))}
                </select>
            </div>

            {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    {actionError}
                </div>
            )}

            {myMembre && (
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setActionError(null)
                            setLeaveOpen(true)
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        Sortir de l&apos;equip seleccionat
                    </Button>
                </div>
            )}

            {loadingMembres ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
                </div>
            ) : isError ? (
                <div className="text-sm rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300 p-4">
                    No se han podido cargar los miembros del equipo seleccionado.
                </div>
            ) : membres.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Este equipo todavía no tiene miembros.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300">
                            <tr>
                                <th className="text-left p-3 font-medium">Miembro</th>
                                <th className="text-left p-3 font-medium">Rol en el equipo</th>
                                <th className="text-left p-3 font-medium">Estado</th>
                                <th className="text-left p-3 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membres.map((membre) => {
                                const fallbackName = membre.usuariId
                                    ? 'Usuari sense nom'
                                    : 'Usuari'

                                return (
                                    <tr key={membre.id} className="border-t border-warm-100 dark:border-slate-700">
                                        <td className="p-3">
                                            <p className="font-medium text-slate-900 dark:text-white">{membre.nom ?? fallbackName}</p>
                                            {membre.email && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{membre.email}</p>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <Badge className={`text-xs ${getEquipRoleBadgeClass(membre.rolEquip)}`}>
                                                {getEquipRoleLabel(membre.rolEquip)}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                className={
                                                    membre.isActive !== false
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                }
                                            >
                                                {membre.isActive !== false ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            {membre.usuariId === currentUserId ? (
                                                <Badge variant="secondary" className="text-xs">Tu</Badge>
                                            ) : canBeRemovedByManager(membre.rolEquip) ? (
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-warm-700 border-warm-200 hover:bg-warm-50"
                                                        disabled={updateMembreRoleMutation.isPending || removeMembreMutation.isPending}
                                                        onClick={() => openRoleDialog(membre.id, membre.nom, membre.rolEquip)}
                                                    >
                                                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                                                        Canviar rol
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        disabled={removeMembreMutation.isPending || updateMembreRoleMutation.isPending}
                                                        onClick={() => {
                                                            setActionError(null)
                                                            setRemoveTarget({ id: membre.id, nom: membre.nom ?? 'Membre' })
                                                        }}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                        Donar de baixa
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">Sense accions</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog
                open={!!roleTarget}
                onOpenChange={(open) => {
                    if (!open) {
                        setRoleTarget(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Canviar rol de membre</DialogTitle>
                        <DialogDescription>
                            Tria el nou rol de {roleTarget?.nom ?? 'aquest membre'} dins de l&apos;equip.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-2">
                            {([
                                {
                                    id: 'jugador',
                                    title: 'Jugador',
                                    description: 'Participa en partits i convocatòries de plantilla.',
                                },
                                {
                                    id: 'entrenador',
                                    title: 'Entrenador',
                                    description: 'Gestiona alineacions i direcció esportiva de l\'equip.',
                                },
                            ] as const).map((option) => {
                                const isSelected = nextRole === option.id

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setNextRole(option.id)}
                                        className={`text-left rounded-xl border-2 px-3 py-3 transition-all ${isSelected
                                            ? 'border-warm-500 bg-warm-50 dark:bg-warm-900/20'
                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-warm-300 dark:hover:border-warm-700'
                                            }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{option.title}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{option.description}</p>
                                    </button>
                                )
                            })}
                        </div>

                        {roleTarget && nextRole === roleTarget.currentRole && (
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Aquest membre ja té seleccionat aquest rol.
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleTarget(null)} disabled={updateMembreRoleMutation.isPending}>
                            Cancel·lar
                        </Button>
                        <Button
                            onClick={confirmRoleChange}
                            disabled={
                                updateMembreRoleMutation.isPending
                                || !roleTarget
                                || nextRole === roleTarget.currentRole
                            }
                            className="bg-warm-600 hover:bg-warm-700 text-white"
                        >
                            {updateMembreRoleMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Guardar nou rol
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Donar de baixa membre</DialogTitle>
                        <DialogDescription>
                            Estàs segur que vols donar de baixa a {removeTarget?.nom ?? 'aquest membre'} de l&apos;equip?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRemoveTarget(null)} disabled={removeMembreMutation.isPending}>
                            Cancel·lar
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={confirmRemoveMembre}
                            disabled={removeMembreMutation.isPending}
                        >
                            {removeMembreMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Confirmar baixa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={leaveOpen} onOpenChange={(open) => !open && setLeaveOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sortir de l&apos;equip</DialogTitle>
                        <DialogDescription>
                            Confirma que vols sortir de {currentEquip?.nom ?? 'l\'equip seleccionat'}.
                        </DialogDescription>
                    </DialogHeader>

                    {requiresSuccessor && (
                        <div className="space-y-2">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                Com a administrador del equip, has d&apos;escollir un successor abans de sortir.
                            </p>
                            <select
                                value={successorMembreId}
                                onChange={(event) => setSuccessorMembreId(event.target.value)}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                            >
                                <option value="">Selecciona successor</option>
                                {successorCandidates.map((membre) => (
                                    <option key={membre.id} value={membre.id}>
                                        {membre.nom ?? 'Membre sense nom'} · {membre.rolEquip ?? 'sense rol'}
                                    </option>
                                ))}
                            </select>
                            {successorCandidates.length === 0 && (
                                <p className="text-xs text-red-600">
                                    No hi ha cap altre membre actiu per assignar com a successor.
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLeaveOpen(false)} disabled={leaveEquipMutation.isPending}>
                            Cancel·lar
                        </Button>
                        <Button
                            onClick={confirmLeaveEquip}
                            disabled={leaveEquipMutation.isPending || (requiresSuccessor && !successorMembreId)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {leaveEquipMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Sortir de l&apos;equip
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ── Tab: Invitacions ─────────────────────────────────────────────────────────
function InvitacionsTab({ clubId }: { clubId: string }) {
    const { data: equipsData, isLoading: loadingEquips } = useGetEquipsClub(clubId)
    const equips = equipsData?.equips ?? []

    const [selectedEquipId, setSelectedEquipId] = useState('')
    const [query, setQuery] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [missatge, setMissatge] = useState('')
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (equips.length === 0) {
            if (selectedEquipId) {
                setSelectedEquipId('')
            }
            return
        }

        const selectedIsValid = equips.some((equip) => equip.id === selectedEquipId)
        if (!selectedEquipId || !selectedIsValid) {
            setSelectedEquipId(equips[0].id)
        }
    }, [equips, selectedEquipId])

    const { data: candidates = [], isLoading: candidatesLoading } = useGetInvitacioCandidates(selectedEquipId || null, query)
    const { data: invitacions = [], isLoading: invitacionsLoading } = useGetInvitacionsEquip(selectedEquipId || null)
    const crearInvitacio = useCrearInvitacioEquip(selectedEquipId || '')

    useEffect(() => {
        if (selectedUserId && !candidates.some((candidate) => candidate.id === selectedUserId)) {
            setSelectedUserId('')
        }
    }, [candidates, selectedUserId])

    const sortedInvitacions = useMemo(() => {
        return [...invitacions].sort((a, b) => {
            if (a.estat === 'pendent' && b.estat !== 'pendent') return -1
            if (a.estat !== 'pendent' && b.estat === 'pendent') return 1
            return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        })
    }, [invitacions])

    const selectedCandidate = candidates.find((candidate) => candidate.id === selectedUserId) ?? null

    const handleSendInvitation = async () => {
        if (!selectedEquipId || !selectedUserId) {
            setFeedback({ type: 'error', text: 'Selecciona un destinatari per enviar la invitació.' })
            return
        }

        try {
            await crearInvitacio.mutateAsync({
                usuariId: selectedUserId,
                missatge: missatge.trim() || undefined,
            })

            setFeedback({ type: 'success', text: 'Invitació enviada correctament.' })
            setSelectedUserId('')
            setMissatge('')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No s\'ha pogut enviar la invitació.'
            setFeedback({ type: 'error', text: message })
        }
    }

    if (loadingEquips) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
            </div>
        )
    }

    if (equips.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No hi ha equips per gestionar invitacions.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-warm-50 dark:bg-slate-700 rounded-xl border border-warm-100 dark:border-slate-600 p-4">
                <label className="text-xs text-slate-500 dark:text-slate-300 mb-1 block">Selecciona equipo</label>
                <select
                    value={selectedEquipId}
                    onChange={(event) => {
                        setSelectedEquipId(event.target.value)
                        setFeedback(null)
                    }}
                    className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2"
                >
                    {equips.map((equip) => (
                        <option key={equip.id} value={equip.id}>{equip.nom}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-100 dark:border-slate-700 p-4 space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Enviar invitació</h3>

                {feedback && (
                    <div
                        className={`rounded-lg px-3 py-2 text-xs ${feedback.type === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                    >
                        {feedback.text}
                    </div>
                )}

                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cerca per nom o email"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                />

                {selectedCandidate && (
                    <div className="rounded-lg border border-warm-200 bg-warm-50/80 dark:border-warm-700/50 dark:bg-warm-900/20 px-3 py-2 text-xs text-warm-800 dark:text-warm-200">
                        Destinatari seleccionat: <span className="font-semibold">{selectedCandidate.nom}</span> ({selectedCandidate.tipus === 'ENTRENADOR' ? 'Entrenador' : 'Jugador'})
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-2">
                    {candidatesLoading ? (
                        <div className="flex items-center justify-center py-5 text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Cercant candidats disponibles...
                        </div>
                    ) : candidates.length === 0 ? (
                        <p className="text-xs text-slate-500 p-2">No hi ha jugadors o entrenadors disponibles amb aquest filtre.</p>
                    ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {candidates.map((candidate) => {
                                const isSelected = selectedUserId === candidate.id

                                return (
                                    <button
                                        key={candidate.id}
                                        type="button"
                                        onClick={() => setSelectedUserId(candidate.id)}
                                        className={`w-full text-left rounded-lg border px-3 py-2 transition-all ${isSelected
                                            ? 'border-warm-500 bg-warm-50 dark:bg-warm-900/20'
                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-warm-300 dark:hover:border-warm-700'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {candidate.avatar ? (
                                                <img
                                                    src={candidate.avatar}
                                                    alt={`Avatar de ${candidate.nom}`}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 flex items-center justify-center text-xs font-semibold">
                                                    {getAvatarInitials(candidate.nom)}
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{candidate.nom}</p>
                                                    <Badge className="text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                                        {candidate.tipus === 'ENTRENADOR' ? 'Entrenador' : 'Jugador'}
                                                    </Badge>
                                                    {candidate.nivell && (
                                                        <Badge className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                            {formatNivellLabel(candidate.nivell)}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-500 truncate">{candidate.email}</p>

                                                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                                                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5">
                                                        Equips actius: {candidate.equipsActius ?? 0}
                                                    </span>
                                                    {typeof candidate.edat === 'number' && candidate.edat > 0 && (
                                                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5">
                                                            {candidate.edat} anys
                                                        </span>
                                                    )}
                                                    <span className={`rounded-full px-2 py-0.5 ${candidate.teSegur
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                        }`}>
                                                        {candidate.teSegur ? 'Segur actiu' : 'Sense segur actiu'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <textarea
                    value={missatge}
                    onChange={(event) => setMissatge(event.target.value)}
                    placeholder="Missatge opcional per a la invitació"
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                />

                <div className="flex justify-end">
                    <Button
                        size="sm"
                        className="bg-warm-600 hover:bg-warm-700 text-white text-xs"
                        disabled={candidatesLoading || crearInvitacio.isPending || !selectedUserId}
                        onClick={handleSendInvitation}
                    >
                        {crearInvitacio.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                            <UserPlus className="w-3.5 h-3.5 mr-1" />
                        )}
                        Enviar invitació
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-100 dark:border-slate-700 p-4 space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Historial d&apos;invitacions de l&apos;equip</h3>

                {invitacionsLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-warm-600" />
                    </div>
                ) : sortedInvitacions.length === 0 ? (
                    <p className="text-sm text-slate-500">Aquest equip encara no té invitacions registrades.</p>
                ) : (
                    <div className="space-y-2">
                        {sortedInvitacions.map((invitation) => (
                            <div
                                key={invitation.id}
                                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center justify-between gap-2"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                        {invitation.usuariNom ?? 'Usuari sense nom'}
                                    </p>
                                    {invitation.missatge && (
                                        <p className="text-xs text-slate-500 mt-0.5">{invitation.missatge}</p>
                                    )}
                                    {invitation.createdAt && (
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {new Date(invitation.createdAt).toLocaleDateString('ca-ES')}
                                        </p>
                                    )}
                                </div>
                                <InvitationStatusBadge estat={invitation.estat} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Dashboard Admin Club (main) ───────────────────────────────────────────────
export default function DashboardAdminClub() {
    const { user } = useAuth()
    const { data: clubsData, isLoading } = useGetClubs()

    if (!user) {
        return null
    }

    const userRoles = (user?.rols ?? []).map((r) => String(r.rol).toUpperCase())
    const isAdminWeb = userRoles.includes('ADMIN_WEB')

    const clubs = (clubsData?.clubs ?? []).filter((club) => {
        if (isAdminWeb) {
            return true
        }

        return club.creadorId === user?.id
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-warm-600" />
            </div>
        )
    }

    if (clubs.length === 0) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No eres admin de ningún club</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Crea un club desde la página principal para poder gestionarlo aquí.
                </p>
            </div>
        )
    }

    const club = clubs[0]

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-warm-600 dark:text-warm-400" />
                    Dashboard: {club.nom}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Gestiona tu club, equipos y miembros
                </p>
            </div>

            <Tabs defaultValue="info">
                <TabsList className="grid grid-cols-5 mb-6 bg-warm-50 dark:bg-slate-800 p-1 rounded-lg">
                    <TabsTrigger value="info" className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-warm-700">
                        <Building2 className="w-4 h-4 mr-1 hidden sm:inline" />
                        Información
                    </TabsTrigger>
                    <TabsTrigger value="equips" className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-warm-700">
                        <Trophy className="w-4 h-4 mr-1 hidden sm:inline" />
                        Equipos
                    </TabsTrigger>
                    <TabsTrigger value="estadistiques" className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-warm-700">
                        <BarChart2 className="w-4 h-4 mr-1 hidden sm:inline" />
                        Estadísticas
                    </TabsTrigger>
                    <TabsTrigger value="membres" className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-warm-700">
                        <UserCog className="w-4 h-4 mr-1 hidden sm:inline" />
                        Miembros
                    </TabsTrigger>
                    <TabsTrigger value="invitacions" className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-warm-700">
                        <Bell className="w-4 h-4 mr-1 hidden sm:inline" />
                        Invitaciones
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info"><InfoClubTab clubId={club.id} /></TabsContent>
                <TabsContent value="equips"><EquipsTab clubId={club.id} /></TabsContent>
                <TabsContent value="estadistiques"><EstadistiquesTab clubId={club.id} /></TabsContent>
                <TabsContent value="membres"><MembresTab clubId={club.id} currentUserId={user.id} /></TabsContent>
                <TabsContent value="invitacions"><InvitacionsTab clubId={club.id} /></TabsContent>
            </Tabs>
        </div>
    )
}
