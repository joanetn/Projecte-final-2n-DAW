import { useAuth } from "@/context/AuthContext";
import { useGetProfileSessions } from "@/queries/profile.queries";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Monitor, Smartphone, Globe, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Sessions() {
    const { data: sessions } = useGetProfileSessions()
    const { logoutDevice, deviceId, logoutAll } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [closingId, setClosingId] = useState<string | null>(null)

    const handleLogoutDevice = async (targetDeviceId: string) => {
        try {
            setClosingId(targetDeviceId)
            await logoutDevice(targetDeviceId)

            if (targetDeviceId !== deviceId) {
                await queryClient.invalidateQueries({ queryKey: ['getProfileSessions'] })
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al fer log out del device'
            console.error(errorMessage)
        } finally {
            setClosingId(null)
        }
    }

    const handleLogoutAll = async () => {
        try {
            await logoutAll()

            navigate("/")
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al fer log all'
            console.error(errorMessage)
        }
    }

    const getDeviceIcon = (deviceType?: string) => {
        if (deviceType?.toLowerCase() === 'mobile') {
            return <Smartphone className="w-5 h-5 text-warm-600" />
        }
        return <Monitor className="w-5 h-5 text-warm-600" />
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleString('ca-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-50 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-warm-600" />
                    Sessions actives
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gestiona les sessions dels teus dispositius
                </p>
            </div>

            {/* Sessions Grid */}
            <div className="grid gap-4">
                {!sessions || sessions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">No hi ha sessions actives</p>
                    </div>
                ) : (
                    <>
                        {sessions.map((sessio) => {
                            const isCurrentDevice = sessio.device_id === deviceId
                            const isClosing = closingId === sessio.device_id

                            return (
                                <div
                                    key={sessio.id ?? sessio.device_id}
                                    className={`
                                        relative p-4 rounded-lg border-2 transition-all
                                        ${isCurrentDevice
                                            ? 'border-warm-500 bg-warm-50 dark:bg-warm-950/20'
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                                        }
                                        hover:shadow-md
                                    `}
                                >
                                    {/* Badge de dispositiu actual */}
                                    {isCurrentDevice && (
                                        <div className="absolute -top-3 right-4">
                                            <Badge className="bg-warm-600 hover:bg-warm-700 text-white">
                                                Dispositiu actual
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        {/* Icon del dispositiu */}
                                        <div className="flex-shrink-0 pt-1">
                                            {getDeviceIcon(sessio.device_type)}
                                        </div>

                                        {/* Info del dispositiu */}
                                        <div className="flex-1 min-w-0 space-y-3">
                                            {/* Títol */}
                                            <div className="space-y-1">
                                                <p className="font-semibold text-warm-900 dark:text-warm-50 text-lg">
                                                    {sessio.browser || 'Navegador desconegut'} · {sessio.device_type?.charAt(0).toUpperCase() + (sessio.device_type?.slice(1) || '')}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {sessio.os || 'SO desconegut'}
                                                </p>
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                                                <div>
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">Creat:</p>
                                                    <p>{formatDate(sessio.created_at)}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">Últim ús:</p>
                                                    <p>{formatDate(sessio.last_used_at)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botó logout */}
                                        <div className="flex-shrink-0">
                                            <Button
                                                onClick={() => void handleLogoutDevice(sessio.device_id)}
                                                disabled={isClosing}
                                                variant={isCurrentDevice ? "destructive" : "outline"}
                                                size="sm"
                                                className={`
                                                    gap-2
                                                    ${isCurrentDevice
                                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                                        : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                                                    }
                                                `}
                                            >
                                                {isClosing && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {!isClosing && <LogOut className="w-4 h-4" />}
                                                <span className="hidden sm:inline">
                                                    {isClosing ? 'Tancant...' : 'Tancar'}
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="col-span-full">
                            <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Tancar totes les sessions.
                                </div>
                                <Button
                                    onClick={handleLogoutAll}
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Log out all
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {
                sessions && sessions.length > 0 && (
                    <div className="p-3 bg-warm-50 dark:bg-warm-950/30 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-200">
                        <p>💡 Tanca les sessions de dispositius que no reconegues per mantenir la teva seguretat.</p>
                    </div>
                )
            }
        </div >
    );
}

