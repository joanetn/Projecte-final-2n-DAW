import { useState } from 'react'
import { useGetArbitresAdmin, useGetPartitsArbitre } from '@/queries/adminWeb.queries'
import type { ArbitreAdmin } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    Gavel,
    Calendar,
    Eye,
} from 'lucide-react'

function PartitsArbitreDialog({
    arbitre,
    open,
    onClose,
}: {
    arbitre: ArbitreAdmin | null
    open: boolean
    onClose: () => void
}) {
    const { data, isLoading } = useGetPartitsArbitre(open && !!arbitre ? arbitre.id : '')
    const partits = data?.partits ?? []

    if (!arbitre) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-slate-800 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        Partits de {arbitre.nom}
                    </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-warm-600 dark:text-warm-400" />
                    </div>
                ) : partits.length === 0 ? (
                    <p className="text-warm-600 dark:text-warm-300 text-sm py-4 text-center">
                        Aquest àrbitre no té partits assignats
                    </p>
                ) : (
                    <div className="max-h-80 overflow-y-auto space-y-2">
                        {partits.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-warm-100 dark:border-slate-700">
                                <div>
                                    <p className="text-sm font-medium text-warm-900 dark:text-warm-100">
                                        {p.equipLocal} vs {p.equipVisitant}
                                    </p>
                                    <p className="text-xs text-warm-500 dark:text-warm-400">
                                        {p.data} {p.hora && `— ${p.hora}`}
                                    </p>
                                </div>
                                <Badge variant={p.status === 'COMPLETAT' ? 'default' : 'secondary'}>
                                    {p.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Tancar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function ArbitresTab() {
    const { data, isLoading, error, refetch } = useGetArbitresAdmin()
    const [detailDialog, setDetailDialog] = useState<ArbitreAdmin | null>(null)

    const arbitres = data?.arbitres ?? []

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error al carregar els àrbitres</p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-100">
                    Àrbitres ({arbitres.length})
                </h3>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
                </div>
            ) : arbitres.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Gavel className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300">No hi ha àrbitres registrats</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Àrbitre</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Email</th>
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Partits assignats</th>
                                <th className="text-center px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Pendents</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arbitres.map(arbitre => (
                                <tr key={arbitre.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-medium text-warm-900 dark:text-warm-100">
                                        {arbitre.nom}
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">{arbitre.email}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 text-warm-700 dark:text-warm-300">
                                            <Calendar className="w-3 h-3" />
                                            {arbitre.partitsAssignats}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={arbitre.partitsPendents > 0 ? 'default' : 'secondary'}>
                                            {arbitre.partitsPendents}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDetailDialog(arbitre)}
                                            className="border-warm-300 dark:border-slate-600"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <PartitsArbitreDialog
                arbitre={detailDialog}
                open={!!detailDialog}
                onClose={() => setDetailDialog(null)}
            />
        </div>
    )
}
