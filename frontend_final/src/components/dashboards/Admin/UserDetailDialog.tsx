import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, User as UserIcon, Mail, Phone, Calendar, CreditCard, Shield } from 'lucide-react'
import { useGetAdminUserDetail, useGetUserRoles } from '@/queries/user.queries'
import type { User } from '@/types/users'

interface UserDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
}

export function UserDetailDialog({ open, onOpenChange, user }: UserDetailDialogProps) {
    const { data: detail, isLoading } = useGetAdminUserDetail(open ? user?.id ?? null : null)
    // const { data: roles = [] } = useGetUserRoles(open ? user?.id ?? null : null)

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-800 border-warm-200 dark:border-slate-700 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-warm-600 dark:text-warm-400" />
                        Detalle de {user.nom}
                    </DialogTitle>
                    <DialogDescription className="text-warm-600 dark:text-warm-400">
                        Información completa del usuario y sus relaciones.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-warm-600 dark:text-warm-400" />
                    </div>
                ) : detail ? (
                    <div className="space-y-6">
                        {/* Info básica */}
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-warm-200 dark:bg-slate-600 flex items-center justify-center text-2xl font-bold text-warm-700 dark:text-warm-300 shrink-0">
                                {detail.avatar ? (
                                    <img
                                        src={detail.avatar}
                                        alt={detail.nom}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    detail.nom?.charAt(0).toUpperCase() || '?'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-100 truncate">
                                    {detail.nom}
                                </h3>
                                <Badge
                                    className={
                                        detail.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }
                                >
                                    {detail.isActive ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>
                        </div>

                        {/* Datos de contacto */}
                        <div className="grid gap-3">
                            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={detail.email} />
                            <InfoRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={detail.telefon || '—'} />
                            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Fecha nacimiento" value={detail.dataNaixement?.split('T')[0] || '—'} />
                            <InfoRow icon={<CreditCard className="w-4 h-4" />} label="DNI" value={detail.dni || '—'} />
                            <InfoRow icon={<Shield className="w-4 h-4" />} label="Nivel" value={detail.nivell || '—'} />
                        </div>

                        {/* Roles */}
                        {detail.rols && detail.rols.length > 0 && (
                            <Section title="Roles">
                                <div className="flex flex-wrap gap-2">
                                    {detail.rols.map((rol) => (
                                        <Badge
                                            key={rol.id}
                                            className={
                                                rol.isActive
                                                    ? 'bg-warm-100 text-warm-800 dark:bg-warm-900 dark:text-warm-200'
                                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 line-through'
                                            }
                                        >
                                            {rol.rol}
                                        </Badge>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Equipos */}
                        {detail.equipUsuaris && detail.equipUsuaris.length > 0 && (
                            <Section title="Equipos">
                                <div className="space-y-2">
                                    {detail.equipUsuaris.map((eq: any, i: number) => (
                                        <div
                                            key={eq.id || i}
                                            className="flex items-center justify-between text-sm p-2 rounded bg-warm-50 dark:bg-slate-700/50"
                                        >
                                            <span className="text-warm-800 dark:text-warm-200">
                                                Equipo: {eq.equipId?.substring(0, 8)}...
                                            </span>
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {eq.rolEquip}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Compras */}
                        {detail.compras && detail.compras.length > 0 && (
                            <Section title="Compras">
                                <div className="space-y-2">
                                    {detail.compras.map((compra: any, i: number) => (
                                        <div
                                            key={compra.id || i}
                                            className="flex items-center justify-between text-sm p-2 rounded bg-warm-50 dark:bg-slate-700/50"
                                        >
                                            <span className="text-warm-800 dark:text-warm-200">
                                                {compra.quantitat}x — {compra.total}€
                                            </span>
                                            <Badge
                                                className={
                                                    compra.pagat
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                }
                                            >
                                                {compra.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Seguros */}
                        {detail.seguros && detail.seguros.length > 0 && (
                            <Section title="Seguros">
                                <div className="space-y-2">
                                    {detail.seguros.map((seguro: any, i: number) => (
                                        <div
                                            key={seguro.id || i}
                                            className="flex items-center justify-between text-sm p-2 rounded bg-warm-50 dark:bg-slate-700/50"
                                        >
                                            <span className="text-warm-800 dark:text-warm-200">
                                                Expira: {seguro.dataExpiracio}
                                            </span>
                                            <Badge
                                                className={
                                                    seguro.pagat
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }
                                            >
                                                {seguro.pagat ? 'Pagado' : 'Pendiente'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Fechas */}
                        <div className="pt-3 border-t border-warm-200 dark:border-slate-700 text-xs text-warm-500 dark:text-warm-400 flex justify-between">
                            <span>Creado: {detail.createdAt?.split('T')[0] || '—'}</span>
                            <span>Actualizado: {detail.updatedAt?.split('T')[0] || '—'}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-warm-500 dark:text-warm-400 text-center py-8">
                        No se pudieron cargar los detalles.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="text-warm-500 dark:text-warm-400">{icon}</span>
            <span className="text-warm-600 dark:text-warm-400 w-36 shrink-0">{label}:</span>
            <span className="text-warm-900 dark:text-warm-100 font-medium truncate">{value}</span>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-sm font-semibold text-warm-800 dark:text-warm-200 mb-2">
                {title}
            </h4>
            {children}
        </div>
    )
}
