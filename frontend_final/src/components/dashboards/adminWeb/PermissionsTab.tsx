import { useState } from 'react'
import { useGetPermisos, useGetUsuarisPermisos, useUpdatePermisosUsuari } from '@/queries/permissions.queries'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Loader2, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Permission } from '@/types/permissions'

export function PermissionsTab() {
    const { data: permisos, isLoading: isLoadingPermisos } = useGetPermisos()
    const { data: usuaris, isLoading: isLoadingUsuaris } = useGetUsuarisPermisos()
    const updateMutation = useUpdatePermisosUsuari()

    const [expandedUsuari, setExpandedUsuari] = useState<string | null>(null)
    const [editingUsuari, setEditingUsuari] = useState<string | null>(null)
    const [selectedPermisos, setSelectedPermisos] = useState<string[]>([])
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    // Agrupar permisos por módulo
    const permisosAgrupados = (permisos || []).reduce(
        (acc: Record<string, Permission[]>, perm: Permission) => {
            const modulo = perm.name.split('.')[1] || 'otros'
            if (!acc[modulo]) acc[modulo] = []
            acc[modulo].push(perm)
            return acc
        },
        {} as Record<string, Permission[]>
    )

    const handleEditarPermisos = (usuariId: string, permisosActuales: string[]) => {
        setEditingUsuari(usuariId)
        setSelectedPermisos(permisosActuales)
    }

    const handleGuardarPermisos = async () => {
        if (!editingUsuari) return

        try {
            await updateMutation.mutateAsync({
                usuariId: editingUsuari,
                permisosIds: selectedPermisos,
            })
            setNotification({
                type: 'success',
                message: 'Permisos actualizados correctamente',
            })
            setEditingUsuari(null)
            setTimeout(() => setNotification(null), 3000)
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Error al actualizar permisos',
            })
        }
    }

    const handleTogglePermiso = (permisionId: string) => {
        setSelectedPermisos((prev) =>
            prev.includes(permisionId) ? prev.filter((p) => p !== permisionId) : [...prev, permisionId]
        )
    }

    const handleToggleTodosPermisos = () => {
        if (selectedPermisos.length === (permisos || []).length) {
            setSelectedPermisos([])
        } else {
            setSelectedPermisos((permisos || []).map((p) => p.id))
        }
    }

    if (isLoadingPermisos || isLoadingUsuaris) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
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
                        <Check className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <X className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-100">
                    Gestión de Permisos ({usuaris?.length ?? 0} usuaris)
                </h3>

                <div className="bg-warm-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                    {(usuaris || []).map((usuari) => (
                        <div
                            key={usuari.id}
                            className="border border-warm-200 dark:border-slate-700 rounded-lg overflow-hidden"
                        >
                            {/* Header del usuario */}
                            <button
                                onClick={() => setExpandedUsuari(expandedUsuari === usuari.id ? null : usuari.id)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-warm-100 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={cn('p-2 rounded-lg', usuari.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30')}>
                                        {usuari.isActive ? (
                                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-warm-900 dark:text-warm-100">{usuari.nom}</p>
                                        <p className="text-xs text-warm-600 dark:text-warm-400">{usuari.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {usuari.rols.map((rol: string) => (
                                            <Badge key={rol} variant="secondary" className="text-xs">
                                                {rol}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {usuari.todosLosPermisos.length} permisos
                                    </Badge>
                                    {expandedUsuari === usuari.id ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </div>
                            </button>

                            {/* Expandable content */}
                            {expandedUsuari === usuari.id && (
                                <div className="border-t border-warm-200 dark:border-slate-700 px-4 py-4 space-y-4">
                                    {/* Pestaña de edición */}
                                    {editingUsuari === usuari.id ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 pb-3 border-b border-warm-200 dark:border-slate-700">
                                                <Checkbox
                                                    checked={selectedPermisos.length === (permisos || []).length}
                                                    onChange={handleToggleTodosPermisos}
                                                />
                                                <span className="text-sm font-semibold text-warm-700 dark:text-warm-300">
                                                    Seleccionar todos los permisos
                                                </span>
                                            </div>

                                            {/* Permisos por módulo */}
                                            {Object.entries(permisosAgrupados).map(([modulo, permsDelModulo]) => (
                                                <div key={modulo} className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wide">
                                                        {modulo}
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                                                        {permsDelModulo?.map((perm: Permission) => (
                                                            <label
                                                                key={perm.id}
                                                                className="flex items-start gap-2 cursor-pointer hover:bg-warm-100 dark:hover:bg-slate-700/50 p-2 rounded"
                                                            >
                                                                <Checkbox
                                                                    checked={selectedPermisos.includes(perm.id)}
                                                                    onChange={() => handleTogglePermiso(perm.id)}
                                                                    className="mt-1"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-semibold text-warm-900 dark:text-warm-100">
                                                                        {perm.name}
                                                                    </p>
                                                                    <p className="text-xs text-warm-600 dark:text-warm-400">
                                                                        {perm.description}
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex gap-2 pt-3 border-t border-warm-200 dark:border-slate-700">
                                                <Button
                                                    size="sm"
                                                    onClick={handleGuardarPermisos}
                                                    disabled={updateMutation.isPending}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {updateMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                            Guardando...
                                                        </>
                                                    ) : (
                                                        'Guardar cambios'
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingUsuari(null)}
                                                    disabled={updateMutation.isPending}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Vista actual de permisos */}
                                            {usuari.todosLosPermisos.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wide">
                                                        Permisos actuales:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {usuari.todosLosPermisos.map((perm: string) => (
                                                            <Badge key={perm} variant="outline" className="text-xs">
                                                                {perm}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-warm-600 dark:text-warm-400 italic">
                                                    No tiene permisos asignados
                                                </p>
                                            )}

                                            <div className="flex gap-2 pt-3 border-t border-warm-200 dark:border-slate-700">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditarPermisos(
                                                            usuari.id,
                                                            usuari.permisosDirectos
                                                        )
                                                    }
                                                    className="bg-warm-600 hover:bg-warm-700"
                                                >
                                                    Editar permisos
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
