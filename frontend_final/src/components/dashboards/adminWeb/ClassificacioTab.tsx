import { useState } from 'react'
import { useGetClassificacionsAdmin, useGetLliguesAdmin } from '@/queries/adminWeb.queries'
import type { ClassificacioEntry } from '@/types/admin'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    Trophy,
} from 'lucide-react'

export function ClassificacioTab() {
    const [lligaFilter, setLligaFilter] = useState('')
    const { data: lliguesData } = useGetLliguesAdmin()
    const { data, isLoading, error, refetch } = useGetClassificacionsAdmin()

    const lligues = lliguesData?.lligues ?? []
    // classificacions may be an array or a Record grouped by league
    const rawClassificacions = data?.classificacions ?? []
    const classificacions: ClassificacioEntry[] = Array.isArray(rawClassificacions)
        ? (rawClassificacions as ClassificacioEntry[])
        : (Object.values(rawClassificacions as Record<string, ClassificacioEntry[]>).flat() as ClassificacioEntry[])
    const filtered = lligaFilter
        ? classificacions.filter(e => (e as any).lligaId === lligaFilter)
        : classificacions

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al carregar les classificacions</p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-100">
                    Classificació
                </h3>
                <div className="flex gap-2">
                    <Select value={lligaFilter || 'all'} onValueChange={v => setLligaFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[200px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                            <SelectValue placeholder="Totes les lligues" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Totes les lligues</SelectItem>
                            {lligues.map(l => <SelectItem key={l.id} value={l.id}>{l.nom}</SelectItem>)}
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
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Trophy className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300">No hi ha dades de classificació disponibles</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300">#</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Equip</th>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300">PJ</th>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300">PG</th>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300">PP</th>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300">SF</th>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300">SC</th>
                                <th className="text-center px-3 py-3 font-semibold text-warm-700 dark:text-warm-300 font-bold">PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((entry, index) => (
                                <tr key={entry.equipId} className={`border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50 ${index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                                    <td className="px-3 py-3 text-center font-bold text-warm-700 dark:text-warm-300">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-warm-900 dark:text-warm-100">{entry.nom ?? entry.equipId}</td>
                                    <td className="px-3 py-3 text-center text-warm-600 dark:text-warm-300">{entry.pj}</td>
                                    <td className="px-3 py-3 text-center text-green-600 dark:text-green-400">{entry.g}</td>
                                    <td className="px-3 py-3 text-center text-red-600 dark:text-red-400">{entry.p}</td>
                                    <td className="px-3 py-3 text-center text-warm-600 dark:text-warm-300">{entry.gf}</td>
                                    <td className="px-3 py-3 text-center text-warm-600 dark:text-warm-300">{entry.gc}</td>
                                    <td className="px-3 py-3 text-center font-bold text-warm-900 dark:text-warm-100">{entry.pts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
