import { useState } from 'react'
import { useGetLliguesAdmin } from '@/queries/adminWeb.queries'
import {
    useCrearLliga,
    useActualitzarLliga,
    useEliminarLliga,
} from '@/mutations/adminWeb.mutations'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'
import type { LligaAdmin, CreateLligaData, UpdateLligaData } from '@/types/admin'
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
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Plus,
    Pencil,
    Trash2,
    Trophy,
} from 'lucide-react'

function LligaFormDialog({
    lliga,
    open,
    onClose,
    onSave,
    loading,
}: {
    lliga: LligaAdmin | null
    open: boolean
    onClose: () => void
    onSave: (data: CreateLligaData | UpdateLligaData) => void
    loading: boolean
}) {
    const [nom, setNom] = useState(lliga?.nom ?? '')
    const [categoria, setCategoria] = useState(lliga?.categoria ?? '')
    const [isActive, setIsActive] = useState(lliga?.isActive ?? true)

    const handleSave = () => {
        if (!nom.trim()) return
        if (lliga) {
            onSave({ nom, categoria, isActive } as UpdateLligaData)
        } else {
            onSave({ nom, categoria } as CreateLligaData)
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
                        <Input
                            value={categoria}
                            onChange={e => setCategoria(e.target.value)}
                            placeholder="Categoria"
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
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
                    <Button onClick={handleSave} disabled={loading || !nom.trim()} className="bg-warm-600 hover:bg-warm-700 text-white">
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
    lliga: LligaAdmin | null
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
    const { can } = usePermissions()
    const { data, isLoading, error, refetch } = useGetLliguesAdmin()
    const crearMutation = useCrearLliga()
    const actualitzarMutation = useActualitzarLliga()
    const eliminarMutation = useEliminarLliga()

    const [formDialog, setFormDialog] = useState<LligaAdmin | 'new' | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<LligaAdmin | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000)
    }

    const handleSave = async (formData: CreateLligaData | UpdateLligaData) => {
        try {
            if (formDialog === 'new') {
                await crearMutation.mutateAsync(formData as CreateLligaData)
                showNotification('success', 'Lliga creada correctament')
            } else if (formDialog && typeof formDialog === 'object') {
                await actualitzarMutation.mutateAsync({ lligaId: (formDialog as LligaAdmin).id, data: formData as UpdateLligaData })
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
            await eliminarMutation.mutateAsync(deleteDialog.id)
            showNotification('success', 'Lliga eliminada correctament')
            setDeleteDialog(null)
        } catch {
            showNotification('error', 'Error al eliminar la lliga')
        }
    }

    const lligues = data?.lligues ?? []

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
                    Lligues ({lligues.length})
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    {can(AdminPermissions.LLIGUES_CREATE) && (
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
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Estat</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lligues.map(lliga => (
                                <tr key={lliga.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-medium text-warm-900 dark:text-warm-100">{lliga.nom}</td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{lliga.categoria ?? '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={lliga.isActive ? 'default' : 'secondary'}>
                                            {lliga.isActive ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {can(AdminPermissions.LLIGUES_EDIT) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFormDialog(lliga)}
                                                    className="border-warm-300 dark:border-slate-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {can(AdminPermissions.LLIGUES_DELETE) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog(lliga)}
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

            <LligaFormDialog
                lliga={formDialog !== 'new' ? formDialog : null}
                open={!!formDialog}
                onClose={() => setFormDialog(null)}
                onSave={handleSave}
                loading={crearMutation.isPending || actualitzarMutation.isPending}
            />
            <DeleteDialog
                lliga={deleteDialog}
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={eliminarMutation.isPending}
            />
        </div>
    )
}
