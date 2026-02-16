import { useGetUsers } from "../../../queries/admin.queries"

export function UsersTab() {
    const { data: users = [], isLoading, error } = useGetUsers() as any;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-600 dark:border-warm-400 mx-auto mb-3"></div>
                    <p className="text-warm-600 dark:text-warm-300">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <p className="font-semibold">Error al cargar usuarios</p>
                <p className="text-sm mt-1">No se pudieron cargar los datos de los usuarios.</p>
            </div>
        )
    }

    if (!users || users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-warm-600 dark:text-warm-300 text-lg font-medium">No hay usuarios registrados</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {/* Search / Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    className="flex-1 px-4 py-2 border border-warm-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-warm-900 dark:text-slate-100 placeholder-warm-400 dark:placeholder-slate-400"
                />
                <button className="btn-primary">
                    Buscar
                </button>
            </div>

            {/* Users Table/List */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-warm-100 dark:bg-slate-800 border-b-2 border-warm-200 dark:border-slate-700">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-warm-900 dark:text-warm-100">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-warm-900 dark:text-warm-100">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-warm-900 dark:text-warm-100">Estado</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-warm-900 dark:text-warm-100">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any, index: number) => (
                            <tr
                                key={user.id || index}
                                className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="px-6 py-4 text-warm-900 dark:text-slate-100 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-warm-200 dark:bg-slate-600 flex items-center justify-center font-bold text-warm-700 dark:text-warm-300">
                                            {user.nom?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <span>{user.nom || 'Sin nombre'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-warm-700 dark:text-warm-300 text-sm">
                                    {user.email || '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`badge ${user.actiu
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                                            : 'bg-warm-100 dark:bg-slate-600 text-warm-800 dark:text-slate-200'
                                        }`}>
                                        {user.actiu ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button className="px-3 py-1 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700 rounded transition-colors text-sm font-medium">
                                            Editar
                                        </button>
                                        <button className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors text-sm font-medium">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Info */}
            <div className="mt-6 p-4 bg-warm-50 dark:bg-slate-800/50 rounded-lg border border-warm-200 dark:border-slate-700">
                <p className="text-sm text-warm-700 dark:text-warm-300">Total: <strong>{users.length}</strong> usuario{users.length !== 1 ? 's' : ''}</p>
            </div>
        </div>
    )
}