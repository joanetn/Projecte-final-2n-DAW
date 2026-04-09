import { useState, useEffect } from 'react'
import { useGetLeaguesAdmin } from '@/queries/leagues.queries'
import { useCreateLeague, useUpdateLeague, useDeleteLeague, useGenerateLeagueFixtures } from '@/mutations/leagues.mutations'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'
import type { LeaguesAdminResponse, CreateLeagueData, UpdateLeagueData } from '@/types/leagues'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useGetLeagueCategories } from '@/queries/club.queries'
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Plus,
    Pencil,
    Trash2,
    Trophy,
    CalendarDays,
} from 'lucide-react'

function LligaEquipsDialog({
    lliga,
    open,
    onClose,
}: {
    lliga: LeaguesAdminResponse | null
    open: boolean
    onClose: () => void
}) {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        Informació de la lliga · {lliga?.nom}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 uppercase mb-1">ID</p>
                        <p className="text-sm text-warm-900 dark:text-warm-100 font-mono">{lliga?.id}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 uppercase mb-1">Categoria</p>
                        <p className="text-sm text-warm-900 dark:text-warm-100">{lliga?.categoria ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 uppercase mb-1">Data Inici</p>
                        <p className="text-sm text-warm-900 dark:text-warm-100">{lliga?.dataInici ? new Date(lliga.dataInici).toLocaleDateString('ca-ES') : '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 uppercase mb-1">Data Fi</p>
                        <p className="text-sm text-warm-900 dark:text-warm-100">{lliga?.dataFi ? new Date(lliga.dataFi).toLocaleDateString('ca-ES') : '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 uppercase mb-1">Estat</p>
                        <p className="text-sm text-warm-900 dark:text-warm-100">{lliga?.status ?? '—'}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Tancar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// NOTA: Funcionalitat de generar partits eliminada temporalment fins que es proporcioni el mutation
/* 
function GenerateFixturesDialog({
    lliga,
    open,
    onClose,
    onConfirm,
    loading,
}: {
    lliga: LeaguesAdminResponse | null
    open: boolean
    onClose: () => void
    onConfirm: (force: boolean) => void
    loading: boolean
}) {
    if (!lliga) return null

    const alreadyGenerated = false // À ACTUALITZAR quan es tingui la info

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        {alreadyGenerated ? 'Re-randomitzar enfrontaments' : 'Generar enfrontaments'}
                    </DialogTitle>
                </DialogHeader>
                <p className="text-warm-700 dark:text-warm-300 py-2 text-sm">
                    {alreadyGenerated
                        ? `La lliga ${lliga.nom} ja té partits generats. Vols regenerar tot el calendari (ida i tornada)?`
                        : `Vols generar el calendari complet d'anada i tornada per la lliga ${lliga.nom}?`}
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel·lar</Button>
                    <Button
                        onClick={() => onConfirm(alreadyGenerated)}
                        disabled={loading}
                        className="bg-warm-600 hover:bg-warm-700 text-white"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {alreadyGenerated ? 'Re-randomitzar' : 'Generar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
*/

function LligaFormDialog({
    lliga,
    open,
    onClose,
    onSave,
    loading,
}: {
    lliga: LeaguesAdminResponse | null
    open: boolean
    onClose: () => void
    onSave: (data: CreateLeagueData | UpdateLeagueData) => void
    loading: boolean
}) {
    const [nom, setNom] = useState(lliga?.nom ?? '')
    const [categoria, setCategoria] = useState(lliga?.categoria ?? '')
    const [status, setStatus] = useState(lliga?.status ?? 'NOT_STARTED')
    const [dataInici, setDataInici] = useState(lliga?.dataInici ? new Date(lliga.dataInici).toISOString().split('T')[0] : '')
    const [dataFi, setDataFi] = useState(lliga?.dataFi ? new Date(lliga.dataFi).toISOString().split('T')[0] : '')
    const [isActive, setIsActive] = useState(lliga?.isActive ?? true)

    const { data: categoriesData } = useGetLeagueCategories()
    const categories = categoriesData ?? []

    useEffect(() => {
        setNom(lliga?.nom ?? '')
        setCategoria(lliga?.categoria ?? '')
        setStatus(lliga?.status ?? 'NOT_STARTED')
        setDataInici(lliga?.dataInici ? new Date(lliga.dataInici).toISOString().split('T')[0] : '')
        setDataFi(lliga?.dataFi ? new Date(lliga.dataFi).toISOString().split('T')[0] : '')
        setIsActive(lliga?.isActive ?? true)
    }, [lliga, open])

    const handleSave = () => {
        if (!nom.trim() || !status.trim()) return

        if (lliga) {
            onSave({
                nom,
                categoria: categoria || undefined,
                status: status || undefined,
                isActive,
                dataInici: dataInici || undefined,
                dataFi: dataFi || undefined,
            } as UpdateLeagueData)
        } else {
            onSave({
                nom,
                categoria: categoria || undefined,
                status,
                dataInici: dataInici || new Date().toISOString().split('T')[0],
            } as CreateLeagueData)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        {lliga ? 'Editar lliga' : 'Nova lliga'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Nom *</label>
                        <Input
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            placeholder="Nom de la lliga"
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Categoria</label>
                        <Select value={categoria || 'none'} onValueChange={v => setCategoria(v === 'none' ? '' : v)}>
                            <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                <SelectValue placeholder="Selecciona categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Selecciona categoria</SelectItem>
                                {categories.map(c => (
                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Estat *</label>
                        <Select value={status || 'NOT_STARTED'} onValueChange={v => setStatus(v)}>
                            <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                <SelectValue placeholder="Selecciona estat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NOT_STARTED">No iniciada</SelectItem>
                                <SelectItem value="ON_PROGRESS">En progrés</SelectItem>
                                <SelectItem value="FINISHED">Finalitzada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Data Inici</label>
                        <input
                            type="date"
                            value={dataInici}
                            onChange={e => setDataInici(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-warm-900 dark:text-warm-100"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Data Fi</label>
                        <input
                            type="date"
                            value={dataFi}
                            onChange={e => setDataFi(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-warm-900 dark:text-warm-100"
                        />
                    </div>
                    {lliga && (
                        <div className="flex items-center gap-2">
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                            <label className="text-sm text-warm-700 dark:text-warm-300">Activa</label>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel·lar</Button>
                    <Button onClick={handleSave} disabled={loading || !nom.trim() || !status.trim()} className="bg-warm-600 hover:bg-warm-700 text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {lliga ? 'Guardar canvis' : 'Crear lliga'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteDialog({
    lliga,
    open,
    onClose,
    onConfirm,
    loading,
}: {
    lliga: LeaguesAdminResponse | null
    open: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}) {
    if (!lliga) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400">Eliminar lliga</DialogTitle>
                </DialogHeader>
                <p className="text-warm-700 dark:text-warm-300 py-2">
                    Segur que vols eliminar <strong>{lliga.nom}</strong>? Aquesta acció no es pot desfer.
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel·lar</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function LliguesTab() {
    const { can, userPermissions, userRoles } = usePermissions()
    const { data: liguesData, isLoading, error, refetch } = useGetLeaguesAdmin()
    const createMutation = useCreateLeague()
    const updateMutation = useUpdateLeague()
    const deleteMutation = useDeleteLeague()
    const generateMutation = useGenerateLeagueFixtures()
    const lligues = Array.isArray(liguesData?.lligues) ? liguesData.lligues : []
    const totalLligues = typeof liguesData?.total === 'number' ? liguesData.total : lligues.length

    // Debug: Log user permissions
    console.debug('🏆 LliguesTab - User Roles:', userRoles)
    console.debug('🏆 LliguesTab - User Permissions:', userPermissions)
    console.debug('🏆 LliguesTab - Can LLIGUES_CREATE:', can(AdminPermissions.LLIGUES_CREATE))

    const [formDialog, setFormDialog] = useState<LeaguesAdminResponse | 'new' | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<LeaguesAdminResponse | null>(null)
    const [infoDialog, setInfoDialog] = useState<LeaguesAdminResponse | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000)
    }

    const handleSave = async (formData: CreateLeagueData | UpdateLeagueData) => {
        try {
            if (formDialog === 'new') {
                await createMutation.mutateAsync(formData as CreateLeagueData)
                showNotification('success', 'Lliga creada correctament')
            } else if (formDialog && typeof formDialog === 'object') {
                await updateMutation.mutateAsync({ id: formDialog.id, data: formData as UpdateLeagueData })
                showNotification('success', 'Lliga actualitzada correctament')
            }
            setFormDialog(null)
        } catch {
            showNotification('error', 'Error al guardar la lliga')
        }
    }

    const handleDelete = async () => {
        if (!deleteDialog) return
        try {
            await deleteMutation.mutateAsync(deleteDialog.id)
            showNotification('success', 'Lliga eliminada correctament')
            setDeleteDialog(null)
        } catch {
            showNotification('error', 'Error al eliminar la lliga')
        }
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al carregar les lligues</p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notification && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${notification.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                    }`}>
                    {notification.type === 'success'
                        ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-100">
                    Lligues ({totalLligues})
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    {!can(AdminPermissions.LLIGUES_CREATE) ? (
                        <div className="text-xs text-orange-600 dark:text-orange-400 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800">
                            ⚠️ Permisos insuficientes
                        </div>
                    ) : (
                        <Button size="sm" onClick={() => setFormDialog('new')} className="bg-warm-600 hover:bg-warm-700 text-white">
                            <Plus className="w-4 h-4 mr-1" /> Nova lliga
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
                </div>
            ) : lligues.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Trophy className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300">No hi ha lligues registrades</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Nom</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Categoria</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Estat</th>
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Estat Actiu</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lligues.map(lliga => (
                                <tr key={lliga.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-medium text-warm-900 dark:text-warm-100">{lliga.nom}</td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{lliga.categoria ?? '—'}</td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">
                                        <Badge variant="outline" className="text-xs">
                                            {lliga.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={lliga.isActive ? 'default' : 'secondary'}>
                                            {lliga.isActive ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setInfoDialog(lliga)}
                                                className="border-warm-300 dark:border-slate-600"
                                                title="Veure informació"
                                            >
                                                <Trophy className="w-4 h-4" />
                                            </Button>
                                            {can(AdminPermissions.LLIGUES_EDIT) ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Generar els partits per aquesta lliga? Aquesta acció pot sobreescriure el calendari existent.')) {
                                                            generateMutation.mutate({ id: lliga.id })
                                                        }
                                                    }}
                                                    className="border-warm-300 dark:border-slate-600"
                                                    title="Generar partits"
                                                >
                                                    {generateMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    className="border-warm-300 dark:border-slate-600 opacity-50 cursor-not-allowed"
                                                    title="Sense permís per generar"
                                                >
                                                    <CalendarDays className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {can(AdminPermissions.LLIGUES_EDIT) ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFormDialog(lliga)}
                                                    className="border-warm-300 dark:border-slate-600"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    className="border-warm-300 dark:border-slate-600 opacity-50 cursor-not-allowed"
                                                    title="Sense permís per editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {can(AdminPermissions.LLIGUES_DELETE) ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog(lliga)}
                                                    className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 opacity-50 cursor-not-allowed"
                                                    title="Sense permís per eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <LligaFormDialog
                lliga={formDialog !== 'new' ? formDialog : null}
                open={!!formDialog}
                onClose={() => setFormDialog(null)}
                onSave={handleSave}
                loading={createMutation.isPending || updateMutation.isPending}
            />
            <DeleteDialog
                lliga={deleteDialog}
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={deleteMutation.isPending}
            />
            <LligaEquipsDialog
                lliga={infoDialog}
                open={!!infoDialog}
                onClose={() => setInfoDialog(null)}
            />
        </div>
    )
}
