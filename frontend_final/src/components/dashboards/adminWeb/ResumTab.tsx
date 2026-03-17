import { Users, ShieldCheck, Trophy, Calendar, Gavel, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard } from './subcomponentes/StatCard'
import { useGetEstadistiques } from '@/queries/adminWeb.queries'

export function ResumTab() {
    const { data, isLoading, error, refetch } = useGetEstadistiques()

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al cargar estadísticas</p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                </Button>
            </div>
        )
    }

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100">Resum del Sistema</h2>
                    <p className="text-warm-600 dark:text-warm-300 text-sm mt-1">Visió general de l'estat actual</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Usuaris"
                    value={data.usuaris.total}
                    icon={Users}
                    subtitle={`${data.usuaris.actius} actius / ${data.usuaris.inactius} inactius`}
                    color="blue"
                />
                <StatCard
                    title="Equips"
                    value={data.equips.total}
                    icon={ShieldCheck}
                    subtitle={`${data.equips.actius} actius`}
                    color="green"
                />
                <StatCard
                    title="Lligues"
                    value={data.lligues.total}
                    icon={Trophy}
                    subtitle={`${data.lligues.actives} actives`}
                    color="purple"
                />
                <StatCard
                    title="Partits"
                    value={data.partits.total}
                    icon={Calendar}
                    subtitle={`${data.partits.pendents} pendents / ${data.partits.completats} completats`}
                    color="orange"
                />
                <StatCard
                    title="Àrbitres"
                    value={data.arbitres.total}
                    icon={Gavel}
                    color="indigo"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-warm-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-800">
                    <h3 className="font-semibold text-warm-900 dark:text-warm-100 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> Usuaris
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-warm-600 dark:text-warm-400">Actius</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{data.usuaris.actius}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-warm-600 dark:text-warm-400">Inactius</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">{data.usuaris.inactius}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-warm-100 dark:border-slate-700 pt-2 mt-2">
                            <span className="text-warm-700 dark:text-warm-300 font-medium">Total</span>
                            <span className="font-bold text-warm-900 dark:text-warm-100">{data.usuaris.total}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-warm-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-800">
                    <h3 className="font-semibold text-warm-900 dark:text-warm-100 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" /> Partits
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-warm-600 dark:text-warm-400">Pendents</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">{data.partits.pendents}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-warm-600 dark:text-warm-400">Completats</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{data.partits.completats}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-warm-100 dark:border-slate-700 pt-2 mt-2">
                            <span className="text-warm-700 dark:text-warm-300 font-medium">Total</span>
                            <span className="font-bold text-warm-900 dark:text-warm-100">{data.partits.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
