import { useEffect, useState } from 'react'
import { useGetUsuarisAdmin } from '@/queries/adminWeb.queries'
import {
    useToggleUsuariActiu,
    useCanviarRolsUsuari,
    useEliminarUsuari,
} from '@/mutations/adminWeb.mutations'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'
import type { UsuariAdmin } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Search,
    Trash2,
    ShieldCheck,
    Users,
} from 'lucide-react'

const ROLE_ALIASES: Record<string, string> = {
    ADMIN_EQUIP: 'ADMIN_CLUB',
}

const ALL_ROLES = ['ADMIN_WEB', 'ADMIN_CLUB', 'ENTRENADOR', 'ARBITRE', 'JUGADOR']

const normalizeRol = (rol: string) => ROLE_ALIASES[String(rol).toUpperCase()] ?? String(rol).toUpperCase()

const normalizeRols = (rols: string[]) => Array.from(new Set(rols.map(normalizeRol)))

function RolsDialog({
    user,
    open,
    onClose,
    onSave,
    loading,
}: {
    user: UsuariAdmin | null
    open: boolean
    onClose: () => void
    onSave: (rols: string[]) => void
    loading: boolean
}) {
    const [selectedRols, setSelectedRols] = useState<string[]>([])

    useEffect(() => {
        setSelectedRols(normalizeRols(user?.rols ?? []))
    }, [user, open])

    const toggleRol = (rol: string) => {
        setSelectedRols(prev =>
            prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
        )
    }

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        Editar rols — {user.nom}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-2 py-2">
                    {ALL_ROLES.map(rol => (
                        <label key={rol} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-warm-50 dark:hover:bg-slate-700">
                            <input
                                type="checkbox"
                                checked={selectedRols.includes(rol)}
                                onChange={() => toggleRol(rol)}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm text-warm-900 dark:text-warm-100">{rol}</span>
                        </label>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel·lar
                    </Button>
                    <Button
                        onClick={() => onSave(selectedRols)}
                        disabled={loading}
                        className="bg-warm-600 hover:bg-warm-700 text-white"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Guardar rols
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteDialog({
    user,
    open,
    onClose,
    onConfirm,
    loading,
}: {
    user: UsuariAdmin | null
    open: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}) {
    if (!user) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400">Eliminar usuari</DialogTitle>
                </DialogHeader>
                <p className="text-warm-700 dark:text-warm-300 py-2">
                    Segur que vols eliminar <strong>{user.nom}</strong>? Aquesta acció no es pot desfer.
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel·lar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function UsuarisTab() {
    const [cerca, setCerca] = useState('')
    const [rolFilter, setRolFilter] = useState('')
    const [activFilter, setActivFilter] = useState('')

    const { can } = usePermissions()

    const params: Record<string, string> = {}
    if (cerca) params.cerca = cerca
    if (rolFilter) params.rol = rolFilter
    if (activFilter) params.actiu = activFilter

    const { data, isLoading, error, refetch } = useGetUsuarisAdmin(params)
    const toggleMutation = useToggleUsuariActiu()
    const rolsMutation = useCanviarRolsUsuari()
    const eliminarMutation = useEliminarUsuari()

    const [rolsDialog, setRolsDialog] = useState<UsuariAdmin | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<UsuariAdmin | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000)
    }

    const handleToggle = async (user: UsuariAdmin) => {
        try {
            await toggleMutation.mutateAsync(user.id)
            showNotification('success', `Usuari ${user.isActive ? 'desactivat' : 'activat'} correctament`)
        } catch {
            showNotification('error', 'Error al canviar l\'estat de l\'usuari')
        }
    }

    const handleSaveRols = async (rols: string[]) => {
        if (!rolsDialog) return
        try {
            await rolsMutation.mutateAsync({
                usuariId: rolsDialog.id,
                rols: normalizeRols(rols),
            })
            showNotification('success', 'Rols actualitzats correctament')
            setRolsDialog(null)
        } catch {
            showNotification('error', 'Error al actualitzar els rols')
        }
    }

    const handleDelete = async () => {
        if (!deleteDialog) return
        try {
            await eliminarMutation.mutateAsync(deleteDialog.id)
            showNotification('success', 'Usuari eliminat correctament')
            setDeleteDialog(null)
        } catch {
            showNotification('error', 'Error al eliminar l\'usuari')
        }
    }

    const usuaris = data?.usuaris ?? []

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al carregar els usuaris</p>
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
                        placeholder="Cercar per nom o email..."
                        value={cerca}
                        onChange={e => setCerca(e.target.value)}
                        className="pl-9 bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={rolFilter || 'all'} onValueChange={v => setRolFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                            <SelectValue placeholder="Tots els rols" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots els rols</SelectItem>
                            {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={activFilter || 'all'} onValueChange={v => setActivFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[140px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                            <SelectValue placeholder="Tots" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots</SelectItem>
                            <SelectItem value="1">Actius</SelectItem>
                            <SelectItem value="0">Inactius</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
                </div>
            ) : usuaris.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Users className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300">No s'han trobat usuaris</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Usuari</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Email</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Rols</th>
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Actiu</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuaris.map(user => (
                                <tr key={user.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-warm-900 dark:text-warm-100 font-medium">
                                        {user.nom}
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(user.rols ?? []).map(rol => (
                                                <Badge key={rol} variant="secondary" className="text-xs">{rol}</Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Switch
                                            checked={user.isActive}
                                            onCheckedChange={() => handleToggle(user)}
                                            disabled={!can(AdminPermissions.USUARIS_TOGGLE) || toggleMutation.isPending}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setRolsDialog(user)}
                                                disabled={!can(AdminPermissions.USUARIS_EDIT)}
                                                className="border-warm-300 dark:border-slate-600"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteDialog(user)}
                                                disabled={!can(AdminPermissions.USUARIS_DELETE)}
                                                className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <RolsDialog
                user={rolsDialog}
                open={!!rolsDialog}
                onClose={() => setRolsDialog(null)}
                onSave={handleSaveRols}
                loading={rolsMutation.isPending}
            />
            <DeleteDialog
                user={deleteDialog}
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={eliminarMutation.isPending}
            />
        </div>
    )
}
