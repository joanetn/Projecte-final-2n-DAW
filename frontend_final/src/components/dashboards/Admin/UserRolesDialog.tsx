import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Loader2, Trash2, ShieldCheck } from 'lucide-react'
import { useGetUserRoles } from '@/queries/user.queries'
import {
    useCreateUserRole,
    useUpdateUserRole,
    useDeleteUserRole,
    useBulkUpdateUserRoles,
} from '@/mutations/user.mutations'
import type { User } from '@/types/users'

const AVAILABLE_ROLES = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'admin_club', label: 'Admin Club', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { value: 'entrenador', label: 'Entrenador', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'arbitre', label: 'Árbitro', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'jugador', label: 'Jugador', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
]

interface UserRolesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
}

export function UserRolesDialog({ open, onOpenChange, user }: UserRolesDialogProps) {
    const { data: roles = [], isLoading } = useGetUserRoles(user?.id ?? null)
    const createRoleMutation = useCreateUserRole()
    const updateRoleMutation = useUpdateUserRole()
    const deleteRoleMutation = useDeleteUserRole()
    const bulkMutation = useBulkUpdateUserRoles()

    const [error, setError] = useState<string | null>(null)

    if (!user) return null

    const handleToggleRole = async (rolName: string) => {
        setError(null)
        try {
            await createRoleMutation.mutateAsync({
                usuariId: user.id,
                data: { rol: rolName },
            })
        } catch (err: any) {
            setError(err?.response?.data?.message || `Error al gestionar el rol "${rolName}"`)
        }
    }

    const handleUpdateRoleStatus = async (rolId: string, isActive: boolean) => {
        setError(null)
        try {
            await updateRoleMutation.mutateAsync({
                usuariId: user.id,
                rolId,
                data: { isActive },
            })
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar el rol')
        }
    }

    const handleDeleteRole = async (rolId: string) => {
        setError(null)
        try {
            await deleteRoleMutation.mutateAsync({
                usuariId: user.id,
                rolId,
            })
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al eliminar el rol')
        }
    }

    const handleBulkAssign = async (selectedRoles: string[]) => {
        setError(null)
        try {
            await bulkMutation.mutateAsync({
                usuariId: user.id,
                data: { roles: selectedRoles },
            })
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al asignar roles masivamente')
        }
    }

    const getRoleConfig = (rolName: string) =>
        AVAILABLE_ROLES.find((r) => r.value === rolName)

    const isPending =
        createRoleMutation.isPending ||
        updateRoleMutation.isPending ||
        deleteRoleMutation.isPending ||
        bulkMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-800 border-warm-200 dark:border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-warm-600 dark:text-warm-400" />
                        Roles de {user.nom}
                    </DialogTitle>
                    <DialogDescription className="text-warm-600 dark:text-warm-400">
                        Gestiona los roles asignados a este usuario.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="alert alert-error text-sm">{error}</div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-warm-600 dark:text-warm-400" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Roles actuales */}
                        <div>
                            <h4 className="text-sm font-semibold text-warm-800 dark:text-warm-200 mb-3">
                                Roles asignados
                            </h4>
                            {roles.length === 0 ? (
                                <p className="text-sm text-warm-500 dark:text-warm-400 italic">
                                    No tiene roles asignados.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {roles.map((role) => {
                                        const config = getRoleConfig(role.rol)
                                        return (
                                            <div
                                                key={role.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-warm-200 dark:border-slate-600 bg-warm-50/50 dark:bg-slate-700/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        className={
                                                            config?.color ||
                                                            'bg-warm-100 text-warm-800 dark:bg-slate-600 dark:text-slate-200'
                                                        }
                                                    >
                                                        {config?.label || role.rol}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Label
                                                            htmlFor={`switch-${role.id}`}
                                                            className="text-xs text-warm-600 dark:text-warm-400"
                                                        >
                                                            {role.isActive ? 'Activo' : 'Inactivo'}
                                                        </Label>
                                                        <Switch
                                                            id={`switch-${role.id}`}
                                                            checked={role.isActive}
                                                            onCheckedChange={(checked) =>
                                                                handleUpdateRoleStatus(role.id, checked)
                                                            }
                                                            disabled={isPending}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteRole(role.id)}
                                                        disabled={isPending}
                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Añadir roles */}
                        <div>
                            <h4 className="text-sm font-semibold text-warm-800 dark:text-warm-200 mb-3">
                                Añadir / Toggle rol
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_ROLES.map((role) => {
                                    const exists = roles.some(
                                        (r) => r.rol === role.value && r.isActive
                                    )
                                    return (
                                        <Button
                                            key={role.value}
                                            variant={exists ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleToggleRole(role.value)}
                                            disabled={isPending}
                                            className={
                                                exists
                                                    ? 'bg-warm-600 hover:bg-warm-700 dark:bg-warm-500 dark:hover:bg-warm-600 text-white'
                                                    : 'border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700'
                                            }
                                        >
                                            {role.label}
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Bulk assign */}
                        <div>
                            <h4 className="text-sm font-semibold text-warm-800 dark:text-warm-200 mb-3">
                                Asignación masiva
                            </h4>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleBulkAssign(['jugador', 'entrenador'])
                                    }
                                    disabled={isPending}
                                    className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700"
                                >
                                    Jugador + Entrenador
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleBulkAssign(['jugador', 'entrenador', 'admin_club'])
                                    }
                                    disabled={isPending}
                                    className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700"
                                >
                                    Jugador + Entrenador + Admin Club
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
