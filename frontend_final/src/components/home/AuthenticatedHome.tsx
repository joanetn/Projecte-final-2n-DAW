import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useGetClubs, useGetLeagueCategories, useGetMeusEquips } from '@/queries/club.queries'
import { useCrearClub, useCrearEquip } from '@/mutations/club.mutations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    Trophy,
    Users,
    Shield,
    Medal,
    Plus,
    ArrowRight,
    Building2,
    Loader2,
    ClipboardList,
} from 'lucide-react'

const EMPTY_CLUB_FORM = {
    nom: '',
    descripcio: '',
    adreca: '',
    ciutat: '',
    codiPostal: '',
    provincia: '',
    telefon: '',
    email: '',
    web: '',
    anyFundacio: '',
}

const REQUIRED_CLUB_FIELDS: Array<{ key: keyof typeof EMPTY_CLUB_FORM; label: string }> = [
    { key: 'nom', label: 'nombre' },
    { key: 'descripcio', label: 'descripción' },
    { key: 'adreca', label: 'dirección' },
    { key: 'ciutat', label: 'ciudad' },
    { key: 'codiPostal', label: 'código postal' },
    { key: 'provincia', label: 'provincia' },
    { key: 'telefon', label: 'teléfono' },
    { key: 'email', label: 'email' },
    { key: 'web', label: 'web' },
    { key: 'anyFundacio', label: 'año de fundación' },
]

const EMPTY_EQUIP_FORM = {
    nom: '',
    categoria: '',
    clubId: '',
}

export function AuthenticatedHome() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { data: clubsData } = useGetClubs()
    const { data: equipsData } = useGetMeusEquips(user?.id ?? null)
    const { data: leagueCategoriesData } = useGetLeagueCategories()

    const clubs = clubsData?.clubs ?? []
    const equips = equipsData?.equips ?? []
    const leagueCategories = leagueCategoriesData ?? []

    const userRoles = (user?.rols ?? []).map((r) => String(r.rol).toUpperCase())
    const isAdminWeb = userRoles.includes('ADMIN_WEB')
    const adminClubs = isAdminWeb
        ? clubs
        : clubs.filter((club) => club.creadorId === user?.id)

    const goToMainDashboard = () => {
        if (userRoles.includes('ENTRENADOR')) {
            navigate('/dashboardEntrenador')
            return
        }

        if (userRoles.includes('JUGADOR')) {
            navigate('/dashboardJugador')
            return
        }

        if (userRoles.includes('ARBITRE')) {
            navigate('/dashboardArbitre')
            return
        }

        navigate('/dashboardJugador')
    }

    const dashboardShortcutLabel = userRoles.includes('ENTRENADOR')
        ? 'Dashboard Entrenador'
        : userRoles.includes('ARBITRE') && !userRoles.includes('JUGADOR')
            ? 'Dashboard Árbitro'
            : 'Mi Dashboard'

    // ── Crear Club ───────────────────────────────────────────────
    const [showClubForm, setShowClubForm] = useState(false)
    const [clubForm, setClubForm] = useState(EMPTY_CLUB_FORM)
    const [clubError, setClubError] = useState<string | null>(null)
    const crearClubMutation = useCrearClub()

    const cleanOptional = (value: string): string | undefined => {
        const trimmed = value.trim()
        return trimmed.length > 0 ? trimmed : undefined
    }

    const resetClubForm = () => {
        setClubForm(EMPTY_CLUB_FORM)
        setClubError(null)
    }

    const handleCrearClub = async () => {
        const missingFields = REQUIRED_CLUB_FIELDS
            .filter(({ key }) => !clubForm[key].trim())
            .map(({ label }) => label)

        if (missingFields.length > 0) {
            setClubError(`Debes completar todos los campos: ${missingFields.join(', ')}`)
            return
        }

        const parsedYear = clubForm.anyFundacio.trim()
            ? Number(clubForm.anyFundacio)
            : undefined

        if (parsedYear !== undefined && Number.isNaN(parsedYear)) {
            setClubError('El año de fundación debe ser numérico')
            return
        }

        setClubError(null)

        try {
            await crearClubMutation.mutateAsync({
                nom: clubForm.nom.trim(),
                descripcio: cleanOptional(clubForm.descripcio),
                adreca: cleanOptional(clubForm.adreca),
                ciutat: cleanOptional(clubForm.ciutat),
                codiPostal: cleanOptional(clubForm.codiPostal),
                provincia: cleanOptional(clubForm.provincia),
                telefon: cleanOptional(clubForm.telefon),
                email: cleanOptional(clubForm.email),
                web: cleanOptional(clubForm.web),
                anyFundacio: parsedYear,
            })
            setShowClubForm(false)
            resetClubForm()
        } catch {
            // error handled by mutation
            setClubError('No se ha podido crear el club. Revisa los datos e inténtalo otra vez.')
        }
    }

    // ── Crear Equip ──────────────────────────────────────────────
    const [showEquipForm, setShowEquipForm] = useState(false)
    const [equipForm, setEquipForm] = useState(EMPTY_EQUIP_FORM)
    const [equipError, setEquipError] = useState<string | null>(null)
    const crearEquipMutation = useCrearEquip()

    const resetEquipForm = () => {
        setEquipForm(EMPTY_EQUIP_FORM)
        setEquipError(null)
    }

    const openEquipModal = () => {
        setEquipError(null)
        setEquipForm((prev) => ({
            ...prev,
            clubId: prev.clubId || adminClubs[0]?.id || '',
        }))
        setShowEquipForm(true)
    }

    const handleCrearEquip = async () => {
        const clubId = equipForm.clubId || adminClubs[0]?.id || ''

        if (!clubId) {
            setEquipError('No tienes ningún club administrable para crear equipos')
            return
        }

        if (!equipForm.nom.trim() || !equipForm.categoria.trim()) {
            setEquipError('Nombre y categoría del equipo son obligatorios')
            return
        }

        setEquipError(null)

        try {
            await crearEquipMutation.mutateAsync({
                nom: equipForm.nom.trim(),
                categoria: equipForm.categoria.trim(),
                clubId,
            })
            setShowEquipForm(false)
            resetEquipForm()
        } catch {
            // error handled by mutation
            setEquipError('No se ha podido crear el equipo. Comprueba permisos y datos.')
        }
    }

    const rolBadgeColor = (rol: string) => {
        switch (rol) {
            case 'ADMIN_WEB': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            case 'ENTRENADOR': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case 'ARBITRE': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            default: return 'bg-warm-100 text-warm-700 dark:bg-warm-900/30 dark:text-warm-400'
        }
    }

    const shortcuts = [
        { label: dashboardShortcutLabel, icon: Users, action: goToMainDashboard, roles: ['JUGADOR', 'ENTRENADOR', 'ARBITRE'] },
        { label: 'Admin Web', icon: Shield, action: () => navigate('/dashboardAdminWeb'), roles: ['ADMIN_WEB'] },
        { label: 'Ranking', icon: Medal, action: () => navigate('/'), roles: [] },
        { label: 'Seguro', icon: ClipboardList, action: () => navigate('/seguro'), roles: [] },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* ── Greeting ─────────────────────────────────────── */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    ¡Hola, {user?.nom ?? 'Usuario'}!
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                    {userRoles.length === 0 ? (
                        <span className="text-slate-500 text-sm">Sin roles asignados</span>
                    ) : (
                        userRoles.map((rol) => (
                            <span
                                key={rol}
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${rolBadgeColor(rol)}`}
                            >
                                {rol}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ── Quick Shortcuts ───────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {shortcuts
                    .filter((s) => s.roles.length === 0 || s.roles.some((r) => userRoles.includes(r)))
                    .map((s) => {
                        const Icon = s.icon
                        return (
                            <button
                                key={s.label}
                                onClick={s.action}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 border border-warm-100 dark:border-slate-700 hover:border-warm-400 hover:shadow-sm transition-all text-center"
                            >
                                <Icon className="w-6 h-6 text-warm-600 dark:text-warm-400" />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
                            </button>
                        )
                    })}
            </div>

            {/* ── Mi Club ───────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-100 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-warm-600 dark:text-warm-400" />
                        Mi Club
                    </h2>
                    {adminClubs.length === 0 && (
                        <Button
                            size="sm"
                            onClick={() => {
                                resetClubForm()
                                setShowClubForm(true)
                            }}
                            className="bg-warm-600 hover:bg-warm-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Crear Club
                        </Button>
                    )}
                </div>

                <Dialog open={showClubForm} onOpenChange={(open) => {
                    setShowClubForm(open)
                    if (!open) resetClubForm()
                }}>
                    <DialogContent className="sm:max-w-3xl bg-white/95 dark:bg-slate-900/95 border-warm-200 dark:border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-warm-900 dark:text-warm-100">Crear club</DialogTitle>
                            <DialogDescription className="text-warm-700 dark:text-warm-300">
                                Completa toda la información principal del club. Se asignará automáticamente como creador tu usuario autenticado.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                placeholder="Nombre del club *"
                                value={clubForm.nom}
                                onChange={(e) => setClubForm({ ...clubForm, nom: e.target.value })}
                            />
                            <Input
                                placeholder="Año de fundación"
                                type="number"
                                min={1800}
                                value={clubForm.anyFundacio}
                                onChange={(e) => setClubForm({ ...clubForm, anyFundacio: e.target.value })}
                            />
                            <Input
                                placeholder="Email"
                                value={clubForm.email}
                                onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
                            />
                            <Input
                                placeholder="Teléfono"
                                value={clubForm.telefon}
                                onChange={(e) => setClubForm({ ...clubForm, telefon: e.target.value })}
                            />
                            <Input
                                placeholder="Dirección"
                                value={clubForm.adreca}
                                onChange={(e) => setClubForm({ ...clubForm, adreca: e.target.value })}
                            />
                            <Input
                                placeholder="Ciudad"
                                value={clubForm.ciutat}
                                onChange={(e) => setClubForm({ ...clubForm, ciutat: e.target.value })}
                            />
                            <Input
                                placeholder="Código postal"
                                value={clubForm.codiPostal}
                                onChange={(e) => setClubForm({ ...clubForm, codiPostal: e.target.value })}
                            />
                            <Input
                                placeholder="Provincia"
                                value={clubForm.provincia}
                                onChange={(e) => setClubForm({ ...clubForm, provincia: e.target.value })}
                            />
                            <Input
                                placeholder="Web"
                                className="sm:col-span-2"
                                value={clubForm.web}
                                onChange={(e) => setClubForm({ ...clubForm, web: e.target.value })}
                            />
                            <textarea
                                rows={4}
                                placeholder="Descripción del club"
                                className="sm:col-span-2 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm"
                                value={clubForm.descripcio}
                                onChange={(e) => setClubForm({ ...clubForm, descripcio: e.target.value })}
                            />
                        </div>

                        {clubError && (
                            <p className="text-sm text-red-600 dark:text-red-400">{clubError}</p>
                        )}

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowClubForm(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCrearClub}
                                disabled={crearClubMutation.isPending || !clubForm.nom.trim()}
                                className="bg-warm-600 hover:bg-warm-700 text-white"
                            >
                                {crearClubMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                                Crear club
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {adminClubs.length === 0 && !showClubForm ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        No eres admin de ningún club todavía.{' '}
                        <button
                            onClick={() => {
                                resetClubForm()
                                setShowClubForm(true)
                            }}
                            className="text-warm-600 dark:text-warm-400 font-medium hover:underline"
                        >
                            Crea uno ahora
                        </button>
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {adminClubs.map((club) => (
                            <div
                                key={club.id}
                                className="p-4 rounded-lg bg-warm-50 dark:bg-slate-700 border border-warm-100 dark:border-slate-600 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{club.nom}</p>
                                    {(club.adreca || club.ciutat || club.provincia) && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {[club.adreca, club.ciutat, club.provincia].filter(Boolean).join(' · ')}
                                        </p>
                                    )}
                                    {club.numEquips !== undefined && (
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                            {club.numEquips} equipos
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="shrink-0"
                                    onClick={() => navigate('/dashboardAdminClub')}
                                >
                                    Gestionar
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Mis Equips ────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-100 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-warm-600 dark:text-warm-400" />
                        Mis Equipos
                    </h2>
                    <Button
                        size="sm"
                        onClick={openEquipModal}
                        disabled={adminClubs.length === 0}
                        className="bg-warm-600 hover:bg-warm-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Equipo
                    </Button>
                </div>

                {adminClubs.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                        Solo los administradores del club pueden crear equipos. Primero crea tu club o accede con un usuario administrador del club.
                    </p>
                )}

                <Dialog open={showEquipForm} onOpenChange={(open) => {
                    setShowEquipForm(open)
                    if (!open) resetEquipForm()
                }}>
                    <DialogContent className="sm:max-w-xl bg-white/95 dark:bg-slate-900/95 border-warm-200 dark:border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-warm-900 dark:text-warm-100">Crear equipo</DialogTitle>
                            <DialogDescription className="text-warm-700 dark:text-warm-300">
                                El equipo debe pertenecer a un club que administres. Nombre y categoría son obligatorios.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                placeholder="Nombre del equipo *"
                                value={equipForm.nom}
                                onChange={(e) => setEquipForm({ ...equipForm, nom: e.target.value })}
                            />
                            <select
                                value={equipForm.categoria}
                                onChange={(e) => setEquipForm({ ...equipForm, categoria: e.target.value })}
                                className="text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2"
                            >
                                <option value="">Selecciona categoría *</option>
                                {leagueCategories.map((category) => (
                                    <option key={category.value} value={category.value}>{category.label}</option>
                                ))}
                            </select>
                            <select
                                value={equipForm.clubId || adminClubs[0]?.id || ''}
                                onChange={(e) => setEquipForm({ ...equipForm, clubId: e.target.value })}
                                className="sm:col-span-2 text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2"
                            >
                                {adminClubs.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nom}</option>
                                ))}
                            </select>
                        </div>

                        {equipError && (
                            <p className="text-sm text-red-600 dark:text-red-400">{equipError}</p>
                        )}

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setShowEquipForm(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCrearEquip}
                                disabled={
                                    crearEquipMutation.isPending ||
                                    !equipForm.nom.trim() ||
                                    !equipForm.categoria.trim() ||
                                    adminClubs.length === 0
                                }
                                className="bg-warm-600 hover:bg-warm-700 text-white"
                            >
                                {crearEquipMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                                Crear equipo
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {equips.length === 0 && !showEquipForm ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        No perteneces a ningún equipo todavía.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {equips.map((equip) => (
                            <div
                                key={equip.id}
                                className="p-4 rounded-lg bg-warm-50 dark:bg-slate-700 border border-warm-100 dark:border-slate-600"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{equip.nom}</p>
                                        {equip.categoria && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{equip.categoria}</p>
                                        )}
                                        {equip.rolMeu && (
                                            <Badge variant="secondary" className="mt-1 text-xs">{equip.rolMeu}</Badge>
                                        )}
                                    </div>
                                    <Button size="sm" variant="outline" onClick={goToMainDashboard}>
                                        Entrar
                                        <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
