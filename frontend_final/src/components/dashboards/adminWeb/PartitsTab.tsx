import { useState } from 'react'
import { useGetPartitsAdmin, useGetEquipsAdmin, useGetLliguesAdmin, useGetArbitresAdmin } from '@/queries/adminWeb.queries'
import {
    useCrearPartit,
    useActualitzarPartit,
    useEliminarPartit,
    useAssignarArbitre,
} from '@/mutations/adminWeb.mutations'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'
import type { PartitAdmin, ArbitreAdmin, CreatePartitData, UpdatePartitData } from '@/types/admin'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Plus,
    Pencil,
    Trash2,
    Calendar,
    Gavel,
    Search,
} from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
    PENDENT: 'Pendent',
    EN_JOC: 'En joc',
    COMPLETAT: 'Completat',
    CANCEL·LAT: 'Cancel·lat',
}

const STATUS_COLORS: Record<string, string> = {
    PENDENT: 'secondary',
    EN_JOC: 'default',
    COMPLETAT: 'default',
    'CANCEL·LAT': 'destructive',
}

function PartitFormDialog({
    partit,
    open,
    onClose,
    onSave,
    loading,
    equips,
    lligues,
}: {
    partit: PartitAdmin | null
    open: boolean
    onClose: () => void
    onSave: (data: CreatePartitData | UpdatePartitData) => void
    loading: boolean
    equips: { id: string; nom: string }[]
    lligues: { id: string; nom: string }[]
}) {
    const [localId, setLocalId] = useState(partit?.localId ?? '')
    const [visitantId, setVisitantId] = useState(partit?.visitantId ?? '')
    const [data, setData] = useState(partit?.data ?? '')
    const [hora, setHora] = useState(partit?.hora ?? '')
    const [ubicacio, setUbicacio] = useState(partit?.ubicacio ?? '')
    const [lligaId, setLligaId] = useState('')
    const [status, setStatus] = useState<string>(partit?.status ?? 'PENDENT')
    const [setsLocal, setSetsLocal] = useState(String(partit?.setsLocal ?? 0))
    const [setsVisitant, setSetsVisitant] = useState(String(partit?.setsVisitant ?? 0))

    const handleSave = () => {
        if (partit) {
            onSave({
                status,
                setsLocal: Number(setsLocal),
                setsVisitant: Number(setsVisitant),
                data: data || undefined,
                hora: hora || undefined,
                ubicacio: ubicacio || undefined,
            } as UpdatePartitData)
        } else {
            if (!localId || !visitantId || !data || !hora) return
            onSave({
                localId,
                visitantId,
                data,
                hora,
                ubicacio: ubicacio || undefined,
                lligaId: lligaId || undefined,
            } as CreatePartitData)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        {partit ? 'Editar partit' : 'Nou partit'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2 max-h-96 overflow-y-auto">
                    {!partit ? (
                        <>
                            <div>
                                <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Equip local *</label>
                                <Select value={localId || 'none'} onValueChange={v => setLocalId(v === 'none' ? '' : v)}>
                                    <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                        <SelectValue placeholder="Selecciona equip local" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equips.map(e => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Equip visitant *</label>
                                <Select value={visitantId || 'none'} onValueChange={v => setVisitantId(v === 'none' ? '' : v)}>
                                    <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                        <SelectValue placeholder="Selecciona equip visitant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equips.filter(e => e.id !== localId).map(e => <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Lliga</label>
                                <Select value={lligaId || 'none'} onValueChange={v => setLligaId(v === 'none' ? '' : v)}>
                                    <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                        <SelectValue placeholder="Sense lliga" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sense lliga</SelectItem>
                                        {lligues.map(l => <SelectItem key={l.id} value={l.id}>{l.nom}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Estat</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Sets local</label>
                                    <Input type="number" min={0} value={setsLocal} onChange={e => setSetsLocal(e.target.value)} className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Sets visitant</label>
                                    <Input type="number" min={0} value={setsVisitant} onChange={e => setSetsVisitant(e.target.value)} className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600" />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Data *</label>
                            <Input type="date" value={data} onChange={e => setData(e.target.value)} className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Hora *</label>
                            <Input type="time" value={hora} onChange={e => setHora(e.target.value)} className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Ubicació</label>
                        <Input value={ubicacio} onChange={e => setUbicacio(e.target.value)} placeholder="Pavelló, camp, etc." className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel·lar</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-warm-600 hover:bg-warm-700 text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {partit ? 'Guardar canvis' : 'Crear partit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AssignarArbitreDialog({
    partit,
    open,
    onClose,
    onSave,
    loading,
    arbitres,
}: {
    partit: PartitAdmin | null
    open: boolean
    onClose: () => void
    onSave: (arbitreId: string) => void
    loading: boolean
    arbitres: ArbitreAdmin[]
}) {
    const [arbitreId, setArbitreId] = useState(partit?.arbitreId ?? '')

    if (!partit) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">Assignar àrbitre</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <Select value={arbitreId || 'none'} onValueChange={v => setArbitreId(v === 'none' ? '' : v)}>
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                            <SelectValue placeholder="Selecciona àrbitre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Cap àrbitre</SelectItem>
                            {arbitres.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.nom}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel·lar</Button>
                    <Button onClick={() => arbitreId && onSave(arbitreId)} disabled={loading || !arbitreId} className="bg-warm-600 hover:bg-warm-700 text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Assignar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteDialog({
    partit,
    open,
    onClose,
    onConfirm,
    loading,
}: {
    partit: PartitAdmin | null
    open: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}) {
    if (!partit) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400">Eliminar partit</DialogTitle>
                </DialogHeader>
                <p className="text-warm-700 dark:text-warm-300 py-2">
                    Segur que vols eliminar el partit <strong>{partit.localNom ?? partit.localId} vs {partit.visitantNom ?? partit.visitantId}</strong>?
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

export function PartitsTab() {
    const [cerca, setCerca] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const { can } = usePermissions()

    const params: Record<string, string> = {}
    if (cerca) params.cerca = cerca
    if (statusFilter) params.status = statusFilter

    const { data, isLoading, error, refetch } = useGetPartitsAdmin(params)
    const { data: equipsData } = useGetEquipsAdmin()
    const { data: lliguesData } = useGetLliguesAdmin()
    const { data: arbitresData } = useGetArbitresAdmin()
    const crearMutation = useCrearPartit()
    const actualitzarMutation = useActualitzarPartit()
    const eliminarMutation = useEliminarPartit()
    const assignarMutation = useAssignarArbitre()

    const [formDialog, setFormDialog] = useState<PartitAdmin | 'new' | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<PartitAdmin | null>(null)
    const [arbitreDialog, setArbitreDialog] = useState<PartitAdmin | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000)
    }

    const handleSave = async (formData: CreatePartitData | UpdatePartitData) => {
        try {
            if (formDialog === 'new') {
                await crearMutation.mutateAsync(formData as CreatePartitData)
                showNotification('success', 'Partit creat correctament')
            } else if (formDialog && typeof formDialog === 'object') {
                await actualitzarMutation.mutateAsync({ partitId: (formDialog as PartitAdmin).id, data: formData as UpdatePartitData })
                showNotification('success', 'Partit actualitzat correctament')
            }
            setFormDialog(null)
        } catch {
            showNotification('error', 'Error al guardar el partit')
        }
    }

    const handleDelete = async () => {
        if (!deleteDialog) return
        try {
            await eliminarMutation.mutateAsync(deleteDialog.id)
            showNotification('success', 'Partit eliminat correctament')
            setDeleteDialog(null)
        } catch {
            showNotification('error', 'Error al eliminar el partit')
        }
    }

    const handleAssignarArbitre = async (arbitreId: string) => {
        if (!arbitreDialog) return
        try {
            await assignarMutation.mutateAsync({ partitId: arbitreDialog.id, arbitreId })
            showNotification('success', 'Àrbitre assignat correctament')
            setArbitreDialog(null)
        } catch {
            showNotification('error', 'Error al assignar l\'àrbitre')
        }
    }

    const partits = data?.partits ?? []
    const equips = equipsData?.equips ?? []
    const lligues = lliguesData?.lligues ?? []
    const arbitres = arbitresData?.arbitres ?? []

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al carregar els partits</p>
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

            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <Input
                        placeholder="Cercar partits..."
                        value={cerca}
                        onChange={e => setCerca(e.target.value)}
                        className="pl-9 bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={statusFilter || 'all'} onValueChange={v => setStatusFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[150px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                            <SelectValue placeholder="Tots els estats" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots els estats</SelectItem>
                            {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    {can(AdminPermissions.PARTITS_CREATE) && (
                        <Button size="sm" onClick={() => setFormDialog('new')} className="bg-warm-600 hover:bg-warm-700 text-white">
                            <Plus className="w-4 h-4 mr-1" /> Nou partit
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
                </div>
            ) : partits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Calendar className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300">No s'han trobat partits</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Enfrontament</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Data/Hora</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Ubicació</th>
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Estat</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partits.map(partit => (
                                <tr key={partit.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-medium text-warm-900 dark:text-warm-100">
                                        {partit.localNom ?? partit.localId} vs {partit.visitantNom ?? partit.visitantId}
                                        {(partit.setsLocal > 0 || partit.setsVisitant > 0) && (
                                            <span className="ml-2 text-xs text-warm-500 dark:text-warm-400">
                                                ({partit.setsLocal}-{partit.setsVisitant})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">
                                        {partit.data} {partit.hora && `${partit.hora}`}
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{partit.ubicacio ?? '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={(STATUS_COLORS[partit.status] as 'default' | 'secondary' | 'destructive') ?? 'secondary'}>
                                            {STATUS_LABELS[partit.status] ?? partit.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {can(AdminPermissions.ARBITRES_ASSIGN) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setArbitreDialog(partit)}
                                                    className="border-warm-300 dark:border-slate-600"
                                                    title="Assignar àrbitre"
                                                >
                                                    <Gavel className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {can(AdminPermissions.PARTITS_EDIT) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFormDialog(partit)}
                                                    className="border-warm-300 dark:border-slate-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {can(AdminPermissions.PARTITS_DELETE) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog(partit)}
                                                    className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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

            <PartitFormDialog
                partit={formDialog !== 'new' ? formDialog : null}
                open={!!formDialog}
                onClose={() => setFormDialog(null)}
                onSave={handleSave}
                loading={crearMutation.isPending || actualitzarMutation.isPending}
                equips={equips}
                lligues={lligues}
            />
            <AssignarArbitreDialog
                partit={arbitreDialog}
                open={!!arbitreDialog}
                onClose={() => setArbitreDialog(null)}
                onSave={handleAssignarArbitre}
                loading={assignarMutation.isPending}
                arbitres={arbitres}
            />
            <DeleteDialog
                partit={deleteDialog}
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={eliminarMutation.isPending}
            />
        </div>
    )
}
