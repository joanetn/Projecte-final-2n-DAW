import { useState } from 'react'
import { useSearchAdminUsers } from '@/queries/user.queries'
import { useUpdateUser } from '@/mutations/user.mutations'
import { useUsersState } from '@/hooks/useUsersState'
import { UserFormDialog } from './UserFormDialog'
import { UserDetailDialog } from './UserDetailDialog'
import { UserRolesDialog } from './UserRolesDialog'
import { DeleteUserDialog } from './DeleteUserDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Plus,
    Eye,
    Pencil,
    Trash2,
    ShieldCheck,
    Loader2,
    RefreshCw,
    Users,
    AlertCircle,
    CheckCircle,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import type { User } from '@/types/users'

export function UsersTab() {
    const {
        qInput, setQInput,
        nivell, setNivell,
        sort, setSort,
        page, limit, setPage, setLimit,
        clearFilters,
        apiParams,
    } = useUsersState()

    const { data: response, isLoading, error, refetch } = useSearchAdminUsers(apiParams)
    const updateUserMutation = useUpdateUser()

    const users = response?.data ?? []
    const totalPages = response?.last_page ?? 1
    const total = response?.total ?? 0

    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [rolesDialogOpen, setRolesDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const [notification, setNotification] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    const hasActiveFilters = !!(apiParams.q || apiParams.nivell || apiParams.sort !== 'created_at_desc')

    const openCreate = () => {
        setSelectedUser(null)
        setFormDialogOpen(true)
    }

    const openEdit = (user: User) => {
        setSelectedUser(user)
        setFormDialogOpen(true)
    }

    const openDetail = (user: User) => {
        setSelectedUser(user)
        setDetailDialogOpen(true)
    }

    const openRoles = (user: User) => {
        setSelectedUser(user)
        setRolesDialogOpen(true)
    }

    const openDelete = (user: User) => {
        setSelectedUser(user)
        setDeleteDialogOpen(true)
    }

    const handleToggleActive = async (user: User) => {
        try {
            await updateUserMutation.mutateAsync({
                id: user.id,
                data: { isActive: !user.isActive },
            })
            setNotification({
                type: 'success',
                message: `Usuario ${user.isActive ? 'desactivado' : 'activado'} correctamente`,
            })
            setTimeout(() => setNotification(null), 3000)
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Error al cambiar el estado del usuario'
            setNotification({
                type: 'error',
                message: errorMessage,
            })
            console.error('Error toggling user status:', err)
            setTimeout(() => setNotification(null), 5000)
        }
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <p className="font-semibold">Error al cargar usuarios</p>
                <p className="text-sm mt-1">No se pudieron cargar los datos de los usuarios.</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="mt-3 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notification && (
                <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${notification.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                        }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={qInput}
                            onChange={(e) => setQInput(e.target.value)}
                            className="pl-9 bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>

                        <Button
                            size="sm"
                            onClick={openCreate}
                            className="bg-warm-600 hover:bg-warm-700 dark:bg-warm-500 dark:hover:bg-warm-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Nuevo usuario
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <Select value={nivell || 'all'} onValueChange={(v) => setNivell(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                            <SelectValue placeholder="Todos los niveles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los niveles</SelectItem>
                            <SelectItem value="principant">Principant</SelectItem>
                            <SelectItem value="intermedi">Intermedi</SelectItem>
                            <SelectItem value="avançat">Avançat</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[180px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                            <SelectValue placeholder="Ordenar por..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_at_desc">Más recientes</SelectItem>
                            <SelectItem value="created_at_asc">Más antiguos</SelectItem>
                            <SelectItem value="nom_asc">Nombre A-Z</SelectItem>
                            <SelectItem value="nom_desc">Nombre Z-A</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                        <SelectTrigger className="w-[120px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 / pág</SelectItem>
                            <SelectItem value="20">20 / pág</SelectItem>
                            <SelectItem value="50">50 / pág</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400 mx-auto mb-3" />
                        <p className="text-warm-600 dark:text-warm-300">Cargando usuarios...</p>
                    </div>
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Users className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300 text-lg font-medium">
                        {hasActiveFilters ? 'No se encontraron usuarios con esos filtros' : 'No hay usuarios registrados'}
                    </p>
                    {hasActiveFilters ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4 border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300"
                        >
                            Limpiar filtros
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={openCreate}
                            className="mt-4 bg-warm-600 hover:bg-warm-700 dark:bg-warm-500 dark:hover:bg-warm-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Crear primer usuario
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-warm-100 dark:bg-slate-800 border-b-2 border-warm-200 dark:border-slate-700">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider hidden md:table-cell">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider hidden lg:table-cell">
                                        Teléfono
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider hidden md:table-cell">
                                        Nivel
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-warm-200 dark:bg-slate-600 flex items-center justify-center font-bold text-sm text-warm-700 dark:text-warm-300 shrink-0">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.nom}
                                                            className="w-9 h-9 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        user.nom?.charAt(0).toUpperCase() || '?'
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm text-warm-900 dark:text-slate-100 truncate">
                                                        {user.nom}
                                                    </p>
                                                    <p className="text-xs text-warm-500 dark:text-warm-400 md:hidden truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-warm-700 dark:text-warm-300 hidden md:table-cell">
                                            {user.email}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-warm-700 dark:text-warm-300 hidden lg:table-cell">
                                            {user.telefon || '—'}
                                        </td>

                                        <td className="px-4 py-3 text-center hidden md:table-cell">
                                            {user.nivell ? (
                                                <Badge className="bg-warm-100 text-warm-800 dark:bg-warm-900 dark:text-warm-200">
                                                    {user.nivell.charAt(0).toUpperCase() + user.nivell.slice(1)}
                                                </Badge>
                                            ) : (
                                                <span className="text-warm-400 text-sm">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Switch
                                                    checked={user.isActive}
                                                    onCheckedChange={() => handleToggleActive(user)}
                                                    disabled={updateUserMutation.isPending}
                                                />
                                                <Badge
                                                    className={
                                                        user.isActive
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }
                                                >
                                                    {user.isActive ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDetail(user)}
                                                    title="Ver detalle"
                                                    className="h-8 w-8 p-0 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(user)}
                                                    title="Editar usuario"
                                                    className="h-8 w-8 p-0 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openRoles(user)}
                                                    title="Gestionar roles"
                                                    className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDelete(user)}
                                                    title="Eliminar usuario"
                                                    className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
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

                    <div className="p-3 bg-warm-50 dark:bg-slate-800/50 rounded-lg border border-warm-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-warm-700 dark:text-warm-300">
                            Mostrando{' '}
                            <strong>{users.length}</strong>{' '}
                            de <strong>{total}</strong>{' '}
                            usuario{total !== 1 ? 's' : ''}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <span className="text-sm text-warm-700 dark:text-warm-300 px-2">
                                {page} / {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}

            <UserFormDialog
                open={formDialogOpen}
                onOpenChange={setFormDialogOpen}
                user={selectedUser}
            />
            <UserDetailDialog
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
                user={selectedUser}
            />
            <UserRolesDialog
                open={rolesDialogOpen}
                onOpenChange={setRolesDialogOpen}
                user={selectedUser}
            />
            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={selectedUser}
            />
        </div>
    )
}