import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
    useGetEquipMembres,
    useGetLligaDetail,
    useGetLliguesDisponibles,
    useGetMeusEquips,
} from '@/queries/club.queries'
import { useGetPartits } from '@/queries/partit.queries'
import { useGetUsers } from '@/queries/user.queries'
import { useCrearInvitacioEquip, useGetInvitacionsEquip } from '@/queries/alineacio.queries'
import { useInscriureEquipALliga } from '@/mutations/club.mutations'
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
    Bell,
    UserPlus,
} from 'lucide-react'
import type { Invitacio } from '@/services/invitacio.service'
import type { Partit } from '@/services/partit.service'
import type { Equip, Lliga } from '@/types/club'
import type { User } from '@/types/users'

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

function hasRole(user: User | undefined, role: string) {
    if (!user) return false

    return (user.rols ?? []).some(
        (rol) => rol.isActive && (rol.rol ?? '').toUpperCase() === role.toUpperCase(),
    )
}

function InvitationStatusBadge({ estat }: { estat: Invitacio['estat'] }) {
    const map: Record<string, { label: string; cls: string }> = {
        pendent: { label: 'Pendent', cls: 'bg-orange-100 text-orange-800' },
        acceptada: { label: 'Acceptada', cls: 'bg-green-100 text-green-800' },
        rebutjada: { label: 'Rebutjada', cls: 'bg-red-100 text-red-800' },
        cancelada: { label: 'Cancelada', cls: 'bg-slate-200 text-slate-700' },
    }

    const status = map[estat] ?? map.pendent

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
            {status.label}
        </span>
    )
}

// ─── Tab: Plantilla ───────────────────────────────────────────────────────────
function PlantillaTab({ equip }: { equip: Equip | null }) {
    const { data: membresData, isLoading } = useGetEquipMembres(equip?.id ?? null)
    const { data: users = [] } = useGetUsers()

    const usersById = useMemo(
        () => new Map(users.map((user) => [user.id, user])),
        [users],
    )

    const membres = useMemo(() => {
        return (membresData?.membres ?? []).map((membre) => {
            const usuari = usersById.get(membre.usuariId)

            return {
                ...membre,
                nom: membre.nom ?? usuari?.nom ?? `Usuari #${membre.usuariId.slice(0, 8)}`,
                email: membre.email ?? usuari?.email ?? '—',
            }
        })
    }, [membresData, usersById])

    if (!equip) return (
        <div className="text-center py-12 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecciona un equip per veure la plantilla.</p>
        </div>
    )

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="w-7 h-7 animate-spin text-green-700" />
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

            <p className="text-xs text-slate-500">
                Les altes de jugadors i entrenadors es gestionen des del tab d&apos;invitacions.
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                        <tr>
                            <th className="text-left p-4 font-medium">#</th>
                            <th className="text-left p-4 font-medium">Nom</th>
                            <th className="text-left p-4 font-medium">Email</th>
                            <th className="text-left p-4 font-medium">Posició</th>
                            <th className="text-left p-4 font-medium">Segur</th>
                            <th className="text-left p-4 font-medium">Estat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!membres.length ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">
                                    Encara no hi ha membres en la plantilla de {equip.nom}.
                                </td>
                            </tr>
                        ) : (
                            membres.map((membre, index) => (
                                <tr key={membre.id} className="border-t border-slate-100 dark:border-slate-700/60">
                                    <td className="p-4 text-slate-500">{index + 1}</td>
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-100">{membre.nom}</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-300">{membre.email ?? '—'}</td>
                                    <td className="p-4 capitalize text-slate-600 dark:text-slate-300">{membre.rolEquip ?? '—'}</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-300">
                                        {membre.teSeguir === true ? 'Sí' : membre.teSeguir === false ? 'No' : '—'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${membre.isActive === false
                                            ? 'bg-slate-200 text-slate-700'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {membre.isActive === false ? 'Inactiu' : 'Actiu'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
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
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    Els partits els crea l&apos;administració web. Aquí pots consultar els partits del teu equip.
                </p>
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

// ─── Tab: Invitacions ────────────────────────────────────────────────────────
function InvitacionsTab({ equip, authUserId }: { equip: Equip | null; authUserId: string }) {
    const { data: users = [], isLoading: usersLoading } = useGetUsers()
    const { data: membresData } = useGetEquipMembres(equip?.id ?? null)
    const { data: invitacions = [], isLoading: invitacionsLoading } = useGetInvitacionsEquip(equip?.id ?? null)
    const crearInvitacio = useCrearInvitacioEquip(equip?.id ?? '')

    const [query, setQuery] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [missatge, setMissatge] = useState('')
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const membreIds = useMemo(
        () => new Set((membresData?.membres ?? []).map((membre) => membre.usuariId)),
        [membresData],
    )

    const candidates = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()

        return users.filter((candidate) => {
            const isJugadorOrEntrenador = hasRole(candidate, 'JUGADOR') || hasRole(candidate, 'ENTRENADOR')
            if (!isJugadorOrEntrenador) return false
            if (candidate.id === authUserId) return false
            if (membreIds.has(candidate.id)) return false

            if (!normalizedQuery) return true

            const nom = (candidate.nom ?? '').toLowerCase()
            const email = (candidate.email ?? '').toLowerCase()

            return nom.includes(normalizedQuery) || email.includes(normalizedQuery)
        })
    }, [authUserId, membreIds, query, users])

    const sortedInvitacions = useMemo(() => {
        return [...invitacions].sort((a, b) => {
            if (a.estat === 'pendent' && b.estat !== 'pendent') return -1
            if (a.estat !== 'pendent' && b.estat === 'pendent') return 1
            return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        })
    }, [invitacions])

    const handleSendInvitation = async () => {
        if (!equip || !selectedUserId) {
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

    if (!equip) return (
        <div className="text-center py-12 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecciona un equip per gestionar invitacions.</p>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Enviar invitació</h3>

                {feedback && (
                    <div
                        className={`rounded-lg px-3 py-2 text-xs ${feedback.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {feedback.text}
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cerca per nom o email"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                    />

                    <select
                        value={selectedUserId}
                        onChange={(event) => setSelectedUserId(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                    >
                        <option value="">Selecciona destinatari</option>
                        {candidates.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                                {candidate.nom} · {hasRole(candidate, 'ENTRENADOR') ? 'Entrenador' : 'Jugador'}
                            </option>
                        ))}
                    </select>
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
                        className="bg-green-700 hover:bg-green-800 text-white text-xs"
                        disabled={usersLoading || crearInvitacio.isPending || !selectedUserId}
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

                {!usersLoading && candidates.length === 0 && (
                    <p className="text-xs text-slate-500">No hi ha jugadors o entrenadors disponibles amb aquest filtre.</p>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Historial d&apos;invitacions de l&apos;equip</h3>

                {invitacionsLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-green-700" />
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
                                        {invitation.usuariNom ?? `Usuari #${invitation.usuariId}`}
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

// ─── Tab: Lligues ────────────────────────────────────────────────────────────
function LliguesTab({ equip }: { equip: Equip | null }) {
    const { data: lligues = [], isLoading } = useGetLliguesDisponibles(equip?.categoria ?? null)
    const inscriureMutation = useInscriureEquipALliga()

    const [selectedLligaId, setSelectedLligaId] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        setSelectedLligaId(null)
        setFeedback(null)
    }, [equip?.id])

    useEffect(() => {
        if (!lligues.length) {
            setSelectedLligaId(null)
            return
        }

        if (!selectedLligaId || !lligues.some((lliga) => lliga.id === selectedLligaId)) {
            setSelectedLligaId(lligues[0].id)
        }
    }, [lligues, selectedLligaId])

    const { data: lligaDetail, isLoading: lligaDetailLoading } = useGetLligaDetail(selectedLligaId)

    const handleInscripcio = async (lliga: Lliga) => {
        if (!equip) return

        if (!equip.clubId) {
            setFeedback({
                type: 'error',
                text: 'No s\'ha pogut determinar el club de l\'equip. Recarrega i torna-ho a provar.',
            })
            return
        }

        try {
            await inscriureMutation.mutateAsync({
                clubId: equip.clubId,
                equipId: equip.id,
                lligaId: lliga.id,
            })

            setFeedback({ type: 'success', text: `Equip inscrit a ${lliga.nom} correctament.` })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No s\'ha pogut completar la inscripció.'
            setFeedback({ type: 'error', text: message })
        }
    }

    if (!equip) return (
        <div className="text-center py-12 text-slate-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecciona un equip per veure les lligues disponibles.</p>
        </div>
    )

    return (
        <div className="space-y-4">
            {feedback && (
                <div
                    className={`rounded-lg px-3 py-2 text-xs ${feedback.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                        }`}
                >
                    {feedback.text}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Lligues disponibles per categoria ({equip.categoria ?? 'sense categoria'})
                </h3>

                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-green-700" />
                    </div>
                ) : lligues.length === 0 ? (
                    <p className="text-sm text-slate-500">No hi ha lligues disponibles per aquesta categoria.</p>
                ) : (
                    <div className="space-y-2">
                        {lligues.map((lliga) => {
                            const isSelected = selectedLligaId === lliga.id
                            const isSameLeague = equip.lligaId === lliga.id

                            return (
                                <div
                                    key={lliga.id}
                                    className={`rounded-lg border px-3 py-3 flex items-center justify-between gap-3 ${isSelected
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLligaId(lliga.id)}
                                        className="text-left flex-1"
                                    >
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{lliga.nom}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Categoria: {lliga.categoria ?? '—'}</p>
                                    </button>

                                    <Button
                                        size="sm"
                                        variant={isSameLeague ? 'outline' : 'default'}
                                        className={isSameLeague ? 'text-xs' : 'bg-green-700 hover:bg-green-800 text-white text-xs'}
                                        disabled={isSameLeague || inscriureMutation.isPending || !equip.clubId}
                                        onClick={() => handleInscripcio(lliga)}
                                    >
                                        {isSameLeague ? 'Ja inscrits' : 'Inscriure equip'}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Equips de la lliga seleccionada</h3>

                {!selectedLligaId ? (
                    <p className="text-sm text-slate-500">Selecciona una lliga per veure els equips.</p>
                ) : lligaDetailLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-green-700" />
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                            {lligaDetail?.nom ?? 'Lliga'} · {lligaDetail?.categoria ?? '—'}
                        </p>

                        {lligaDetail?.equips?.length ? (
                            <div className="grid sm:grid-cols-2 gap-2">
                                {lligaDetail.equips.map((leagueTeam) => (
                                    <div
                                        key={leagueTeam.id}
                                        className={`rounded-lg border px-3 py-2 text-sm ${leagueTeam.id === equip.id
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 font-semibold'
                                            : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        {leagueTeam.nom}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Aquesta lliga encara no té equips inscrits.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

// ─── Tab: Alineacions ────────────────────────────────────────────────────────
function AlineacionsTab({ equip }: { equip: Equip | null }) {
    const navigate = useNavigate()
    const { data, isLoading } = useGetPartits(equip ? { equipId: equip.id } : undefined)
    const partits = (data?.partits ?? []).filter((p: Partit) =>
        p.status !== 'COMPLETAT' && p.status !== 'CANCELAT'
    )

    if (!equip) return (
        <div className="text-center py-12 text-slate-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecciona un equip per veure les alineacions.</p>
        </div>
    )

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="w-7 h-7 animate-spin text-green-700" />
        </div>
    )

    return (
        <div className="space-y-4">
            {!partits.length ? (
                <div className="text-center py-12 text-slate-500">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No hi ha partits pendents per preparar alineacions.</p>
                </div>
            ) : partits.map((partit: Partit) => (
                <div
                    key={partit.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                                <Calendar className="w-4 h-4 text-green-700" />
                                {formatDate(partit.dataHora)} — {formatTime(partit.dataHora)}
                            </div>
                            {partit.ubicacio && <p className="text-xs text-slate-500 mb-2">📍 {partit.ubicacio}</p>}
                            <div className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <span>{partit.localNom ?? 'Local'}</span>
                                <span className="text-slate-400 font-normal">vs</span>
                                <span>{partit.visitantNom ?? 'Visitant'}</span>
                            </div>
                            <div className="mt-2">
                                <StatusBadge status={partit.status} />
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="bg-green-700 hover:bg-green-800 text-white text-xs"
                            onClick={() => navigate(`/alineacio/${partit.id}?equipId=${equip.id}`)}
                        >
                            Obrir alineació
                        </Button>
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
                            <TabsTrigger value="lligues" className="rounded-lg data-[state=active]:bg-green-800 data-[state=active]:text-white text-xs">
                                <Trophy className="w-3.5 h-3.5 mr-1" />Lligues
                            </TabsTrigger>
                            <TabsTrigger value="invitacions" className="rounded-lg data-[state=active]:bg-green-800 data-[state=active]:text-white text-xs">
                                <Bell className="w-3.5 h-3.5 mr-1" />Invitacions
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
                        <TabsContent value="lligues">
                            <LliguesTab equip={selectedEquip} />
                        </TabsContent>
                        <TabsContent value="invitacions">
                            <InvitacionsTab equip={selectedEquip} authUserId={user.id} />
                        </TabsContent>
                        <TabsContent value="partits">
                            <FutursPartitsTab equip={selectedEquip} />
                        </TabsContent>
                        <TabsContent value="alineacions">
                            <AlineacionsTab equip={selectedEquip} />
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
