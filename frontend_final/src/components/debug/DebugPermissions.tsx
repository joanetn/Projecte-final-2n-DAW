import { useAuth } from '@/context/AuthContext'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'
import { Copy, Code } from 'lucide-react'
import { useState } from 'react'

/**
 * Componente de debug para ver permisos del usuario
 * Añade este componente a un page para debuguear
 * 
 * Uso:
 * import { DebugPermissions } from '@/components/debug/DebugPermissions'
 * 
 * Luego en tu componente:
 * <DebugPermissions />
 */
export const DebugPermissions = () => {
    const { user } = useAuth()
    const { userPermissions, userRoles } = usePermissions()
    const [copied, setCopied] = useState(false)

    if (!user) return null

    const debugInfo = {
        userId: user.id,
        userName: user.nom,
        userEmail: user.email,
        roles: user.rols?.map(r => r.rol) ?? [],
        permissions: userPermissions,
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <h3 className="font-bold text-sm">Debug Permisos</h3>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="gap-1"
                    >
                        <Copy className="w-3 h-3" />
                        {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-900 rounded p-3 font-mono max-h-64 overflow-y-auto">
                    <div>
                        <span className="text-blue-600">Usuario:</span> {user.nom}
                    </div>
                    <div>
                        <span className="text-blue-600">ID:</span> {user.id}
                    </div>
                    <div className="mt-2">
                        <span className="text-green-600">Roles:</span>
                        <div className="ml-2">
                            {userRoles && userRoles.length > 0 ? (
                                userRoles.map((role, i) => (
                                    <div key={i} className="text-slate-700 dark:text-slate-300">
                                        • {role}
                                    </div>
                                ))
                            ) : (
                                <div className="text-orange-600">Sin roles</div>
                            )}
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-purple-600">Permisos ({userPermissions?.length ?? 0}):</span>
                        <div className="ml-2">
                            {userPermissions && userPermissions.length > 0 ? (
                                userPermissions.map((perm, i) => (
                                    <div key={i} className="text-slate-700 dark:text-slate-300 break-words">
                                        • {perm}
                                    </div>
                                ))
                            ) : (
                                <div className="text-orange-600">Sin permisos</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
                    <p><strong>💡 Tip:</strong> Abre la consola (F12) para ver logs detallados</p>
                </div>
            </div>
        </div>
    )
}

export default DebugPermissions
