import { useState } from 'react'
import { useGetClubs, useGetEquipsClub } from '@/queries/club.queries'
import { useCrearEquip, useActualitzarClub } from '@/mutations/club.mutations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
} from 'lucide-react'

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
    const equips = data?.equips ?? []
    const crearEquipMutation = useCrearEquip(clubId)

    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ nom: '', categoria: '', clubId })

    const handleCrear = async () => {
        if (!form.nom.trim()) return
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
                        <Input
                            placeholder="Categoría"
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleCrear}
                            disabled={crearEquipMutation.isPending || !form.nom.trim()}
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
function EstadistiquesTab() {
    return (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Estadísticas del club disponibles próximamente.</p>
        </div>
    )
}

// ── Tab: Membres ──────────────────────────────────────────────────────────────
function MembresTab() {
    return (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Gestión de miembros disponible próximamente.</p>
        </div>
    )
}

// ── Dashboard Admin Club (main) ───────────────────────────────────────────────
export default function DashboardAdminClub() {
    const { data: clubsData, isLoading } = useGetClubs()
    const clubs = clubsData?.clubs ?? []

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
                <TabsList className="grid grid-cols-4 mb-6 bg-warm-50 dark:bg-slate-800 p-1 rounded-lg">
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
                </TabsList>

                <TabsContent value="info"><InfoClubTab clubId={club.id} /></TabsContent>
                <TabsContent value="equips"><EquipsTab clubId={club.id} /></TabsContent>
                <TabsContent value="estadistiques"><EstadistiquesTab /></TabsContent>
                <TabsContent value="membres"><MembresTab /></TabsContent>
            </Tabs>
        </div>
    )
}
