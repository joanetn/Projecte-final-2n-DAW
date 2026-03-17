import { useState } from 'react'
import { useGetEquipsAdmin, useGetLliguesAdmin, useGetMembresEquip } from '@/queries/adminWeb.queries'
import {
    useCrearEquip,
    useActualitzarEquip,
    useEliminarEquip,
} from '@/mutations/adminWeb.mutations'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'
import type { EquipAdmin, LligaAdmin, CreateEquipData, UpdateEquipData } from '@/types/admin'
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
import { Switch } from '@/components/ui/switch'
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Search,
    Plus,
    Pencil,
    Trash2,
    Users,
    ShieldCheck,
} from 'lucide-react'

function EquipFormDialog({
    equip,
    open,
    onClose,
    onSave,
    loading,
    lligues,
}: {
    equip: EquipAdmin | null
    open: boolean
    onClose: () => void
    onSave: (data: CreateEquipData | UpdateEquipData) => void
    loading: boolean
    lligues: LligaAdmin[]
}) {
    const [nom, setNom] = useState(equip?.nom ?? '')
    const [categoria, setCategoria] = useState(equip?.categoria ?? '')
    const [lligaId, setLligaId] = useState(equip?.lliga?.id ?? '')
    const [isActive, setIsActive] = useState(equip?.isActive ?? true)

    const handleSave = () => {
        if (!nom.trim()) return
        if (equip) {
            onSave({ nom, categoria, lligaId: lligaId || undefined, isActive } as UpdateEquipData)
        } else {
            onSave({ nom, categoria, lligaId: lligaId || undefined } as CreateEquipData)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        {equip ? 'Editar equip' : 'Nou equip'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Nom *</label>
                        <Input
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            placeholder="Nom de l'equip"
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Categoria</label>
                        <Input
                            value={categoria}
                            onChange={e => setCategoria(e.target.value)}
                            placeholder="Categoria"
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                        />
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
                    {equip && (
                        <div className="flex items-center gap-2">
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                            <label className="text-sm text-warm-700 dark:text-warm-300">Actiu</label>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel·lar</Button>
                    <Button onClick={handleSave} disabled={loading || !nom.trim()} className="bg-warm-600 hover:bg-warm-700 text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {equip ? 'Guardar canvis' : 'Crear equip'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function MembresModal({
    equipId,
    equipNom,
    open,
    onClose,
}: {
    equipId: string
    equipNom: string
    open: boolean
    onClose: () => void
}) {
    const { data, isLoading } = useGetMembresEquip(open ? equipId : '')
    const membres = data?.membres ?? []

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        Membres — {equipNom}
                    </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-warm-600 dark:text-warm-400" />
                    </div>
                ) : membres.length === 0 ? (
                    <p className="text-warm-600 dark:text-warm-300 text-sm py-4 text-center">
                        Aquest equip no té membres
                    </p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {membres.map(m => (
                            <div key={m.id} className="flex items-center justify-between py-2 border-b border-warm-100 dark:border-slate-700 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-warm-900 dark:text-warm-100">{m.nom}</p>
                                    <p className="text-xs text-warm-500 dark:text-warm-400">{m.email}</p>
                                </div>
                                <Badge variant="secondary" className="text-xs">{m.rolEquip}</Badge>
                            </div>
                        ))}
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Tancar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteDialog({
    equip,
    open,
    onClose,
    onConfirm,
    loading,
}: {
    equip: EquipAdmin | null
    open: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}) {
    if (!equip) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400">Eliminar equip</DialogTitle>
                </DialogHeader>
                <p className="text-warm-700 dark:text-warm-300 py-2">
                    Segur que vols eliminar <strong>{equip.nom}</strong>? Aquesta acció no es pot desfer.
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

export function EquipsTab() {
    const [cerca, setCerca] = useState('')
    const [lligaFilter, setLligaFilter] = useState('')
    const { can } = usePermissions()

    const params: Record<string, string> = {}
    if (cerca) params.cerca = cerca
    if (lligaFilter) params.lligaId = lligaFilter

    const { data, isLoading, error, refetch } = useGetEquipsAdmin(params)
    const { data: lliguesData } = useGetLliguesAdmin()
    const crearMutation = useCrearEquip()
    const actualitzarMutation = useActualitzarEquip()
    const eliminarMutation = useEliminarEquip()

    const [formDialog, setFormDialog] = useState<EquipAdmin | 'new' | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<EquipAdmin | null>(null)
    const [membresModal, setMembresModal] = useState<EquipAdmin | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000)
    }

    const handleSave = async (formData: CreateEquipData | UpdateEquipData) => {
        try {
            if (formDialog === 'new') {
                await crearMutation.mutateAsync(formData as CreateEquipData)
                showNotification('success', 'Equip creat correctament')
            } else if (formDialog && typeof formDialog === 'object') {
                await actualitzarMutation.mutateAsync({ equipId: (formDialog as EquipAdmin).id, data: formData as UpdateEquipData })
                showNotification('success', 'Equip actualitzat correctament')
            }
            setFormDialog(null)
        } catch {
            showNotification('error', 'Error al guardar l\'equip')
        }
    }

    const handleDelete = async () => {
        if (!deleteDialog) return
        try {
            await eliminarMutation.mutateAsync(deleteDialog.id)
            showNotification('success', 'Equip eliminat correctament')
            setDeleteDialog(null)
        } catch {
            showNotification('error', 'Error al eliminar l\'equip')
        }
    }

    const equips = data?.equips ?? []
    const lligues = lliguesData?.lligues ?? []

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al carregar els equips</p>
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
                        placeholder="Cercar equips..."
                        value={cerca}
                        onChange={e => setCerca(e.target.value)}
                        className="pl-9 bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={lligaFilter || 'all'} onValueChange={v => setLligaFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                            <SelectValue placeholder="Totes les lligues" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Totes les lligues</SelectItem>
                            {lligues.map(l => <SelectItem key={l.id} value={l.id}>{l.nom}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    {can(AdminPermissions.EQUIPS_CREATE) && (
                        <Button size="sm" onClick={() => setFormDialog('new')} className="bg-warm-600 hover:bg-warm-700 text-white">
                            <Plus className="w-4 h-4 mr-1" /> Nou equip
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
                </div>
            ) : equips.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <ShieldCheck className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300">No s'han trobat equips</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Nom</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Categoria</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Lliga</th>
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Estat</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equips.map(equip => (
                                <tr key={equip.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-medium text-warm-900 dark:text-warm-100">{equip.nom}</td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{equip.categoria ?? '—'}</td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{equip.lliga?.nom ?? '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={equip.isActive ? 'default' : 'secondary'}>
                                            {equip.isActive ? 'Actiu' : 'Inactiu'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setMembresModal(equip)}
                                                className="border-warm-300 dark:border-slate-600"
                                                title="Veure membres"
                                            >
                                                <Users className="w-4 h-4" />
                                            </Button>
                                            {can(AdminPermissions.EQUIPS_EDIT) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFormDialog(equip)}
                                                    className="border-warm-300 dark:border-slate-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {can(AdminPermissions.EQUIPS_DELETE) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog(equip)}
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

            <EquipFormDialog
                equip={formDialog !== 'new' ? formDialog : null}
                open={!!formDialog}
                onClose={() => setFormDialog(null)}
                onSave={handleSave}
                loading={crearMutation.isPending || actualitzarMutation.isPending}
                lligues={lligues}
            />
            <DeleteDialog
                equip={deleteDialog}
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={eliminarMutation.isPending}
            />
            {membresModal && (
                <MembresModal
                    equipId={membresModal.id}
                    equipNom={membresModal.nom}
                    open={!!membresModal}
                    onClose={() => setMembresModal(null)}
                />
            )}
        </div>
    )
}
