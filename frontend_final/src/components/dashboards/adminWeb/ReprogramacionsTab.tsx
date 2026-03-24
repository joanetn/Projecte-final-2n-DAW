import { useMemo, useState } from 'react'
import { useGetMevesPropostesReprogramacio, useGetPartitsAdmin } from '@/queries/adminWeb.queries'
import {
    useCrearPropostaReprogramacio,
    useRespondrePropostaReprogramacio,
} from '@/mutations/adminWeb.mutations'
import type {
    PropostaReprogramacio,
    PropostaReprogramacioStatus,
    RespostaPropostaAccio,
} from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Send } from 'lucide-react'

const STATUS_LABELS: Record<PropostaReprogramacioStatus, string> = {
    PENDENT: 'Pendent',
    ACCEPTADA: 'Acceptada',
    REBUTJADA: 'Rebutjada',
}

const STATUS_BADGE: Record<PropostaReprogramacioStatus, 'secondary' | 'default' | 'destructive'> = {
    PENDENT: 'secondary',
    ACCEPTADA: 'default',
    REBUTJADA: 'destructive',
}

type RespondDialogState = {
    proposta: PropostaReprogramacio
    accio: RespostaPropostaAccio
} | null

function formatDate(dateValue?: string | null) {
    if (!dateValue) return '—'
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return dateValue
    return date.toLocaleString('ca-ES')
}

export function ReprogramacionsTab() {
    const [statusFilter, setStatusFilter] = useState<'all' | PropostaReprogramacioStatus>('all')
    const [partitId, setPartitId] = useState('')
    const [dataHoraProposada, setDataHoraProposada] = useState('')
    const [motiu, setMotiu] = useState('')
    const [respondDialog, setRespondDialog] = useState<RespondDialogState>(null)
    const [respostaText, setRespostaText] = useState('')
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const proposalsParams = statusFilter === 'all' ? undefined : { status: statusFilter }
    const { data, isLoading, error, refetch } = useGetMevesPropostesReprogramacio(proposalsParams)
    const { data: partitsData } = useGetPartitsAdmin()
    const createProposalMutation = useCrearPropostaReprogramacio()
    const respondProposalMutation = useRespondrePropostaReprogramacio()

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000)
    }

    const partits = partitsData?.partits ?? []
    const propostes = data?.propostes ?? []

    const selectedPartit = useMemo(
        () => partits.find((partit) => partit.id === partitId),
        [partits, partitId]
    )

    const handleEnviarProposta = async () => {
        if (!partitId || !dataHoraProposada) {
            showNotification('error', 'Selecciona partit i data/hora proposada')
            return
        }

        try {
            await createProposalMutation.mutateAsync({
                partitId,
                data: {
                    dataHoraProposada: new Date(dataHoraProposada).toISOString(),
                    motiu: motiu.trim() || undefined,
                },
            })
            showNotification('success', 'Proposta enviada correctament')
            setMotiu('')
        } catch {
            showNotification('error', 'No s\'ha pogut enviar la proposta')
        }
    }

    const openRespondDialog = (proposta: PropostaReprogramacio, accio: RespostaPropostaAccio) => {
        setRespondDialog({ proposta, accio })
        setRespostaText('')
    }

    const handleRespondre = async () => {
        if (!respondDialog) return

        try {
            await respondProposalMutation.mutateAsync({
                propostaId: respondDialog.proposta.id,
                data: {
                    accio: respondDialog.accio,
                    respostaText: respostaText.trim() || undefined,
                },
            })

            showNotification(
                'success',
                respondDialog.accio === 'ACCEPTAR'
                    ? 'Proposta acceptada correctament'
                    : 'Proposta rebutjada correctament'
            )
            setRespondDialog(null)
        } catch {
            showNotification('error', 'No s\'ha pogut respondre la proposta')
        }
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
                    {notification.type === 'success'
                        ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}

            <div className="rounded-lg border border-warm-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800/60">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-100 mb-3">Nova proposta de reprogramació</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Partit *</label>
                        <Select value={partitId || 'none'} onValueChange={value => setPartitId(value === 'none' ? '' : value)}>
                            <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                                <SelectValue placeholder="Selecciona un partit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Selecciona un partit</SelectItem>
                                {partits.map((partit) => (
                                    <SelectItem key={partit.id} value={partit.id}>
                                        {(partit.localNom ?? partit.localId)} vs {(partit.visitantNom ?? partit.visitantId)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Nova data/hora *</label>
                        <Input
                            type="datetime-local"
                            value={dataHoraProposada}
                            onChange={e => setDataHoraProposada(e.target.value)}
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Data actual</label>
                        <Input
                            value={formatDate(selectedPartit?.data && selectedPartit?.hora ? `${selectedPartit.data}T${selectedPartit.hora}` : selectedPartit?.data)}
                            readOnly
                            className="bg-warm-50 dark:bg-slate-700/60 border-warm-200 dark:border-slate-600"
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Motiu</label>
                    <textarea
                        value={motiu}
                        onChange={e => setMotiu(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-warm-900 dark:text-warm-100"
                        placeholder="Explica breument el motiu del canvi"
                    />
                </div>
                <div className="mt-3 flex justify-end">
                    <Button
                        onClick={handleEnviarProposta}
                        disabled={createProposalMutation.isPending || !partitId || !dataHoraProposada}
                        className="bg-warm-600 hover:bg-warm-700 text-white"
                    >
                        {createProposalMutation.isPending
                            ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            : <Send className="w-4 h-4 mr-2" />}
                        Enviar proposta
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center gap-3 flex-wrap">
                <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as 'all' | PropostaReprogramacioStatus)}
                >
                    <SelectTrigger className="w-[220px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600">
                        <SelectValue placeholder="Filtrar per estat" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tots els estats</SelectItem>
                        <SelectItem value="PENDENT">Pendents</SelectItem>
                        <SelectItem value="ACCEPTADA">Acceptades</SelectItem>
                        <SelectItem value="REBUTJADA">Rebutjades</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="border-warm-300 dark:border-slate-600">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refrescar
                </Button>
            </div>

            {error ? (
                <div className="alert alert-error">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-semibold">Error al carregar les propostes</p>
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400" />
                </div>
            ) : propostes.length === 0 ? (
                <div className="rounded-lg border border-warm-200 dark:border-slate-700 p-6 text-center text-warm-600 dark:text-warm-300">
                    No hi ha propostes de reprogramació
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-50 dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Partit</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Data actual</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Data proposada</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Estat</th>
                                <th className="text-left px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Resposta</th>
                                <th className="text-right px-4 py-3 font-semibold text-warm-700 dark:text-warm-300">Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propostes.map((proposta) => (
                                <tr key={proposta.id} className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-warm-900 dark:text-warm-100">
                                        {(proposta.partit?.localNom ?? proposta.equipProposaNom ?? 'Local')} vs {(proposta.partit?.visitantNom ?? proposta.equipReceptorNom ?? 'Visitant')}
                                        {proposta.motiu && (
                                            <p className="text-xs mt-1 text-warm-600 dark:text-warm-300">Motiu: {proposta.motiu}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">
                                        {formatDate(proposta.partit?.dataHoraActual)}
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">
                                        {formatDate(proposta.dataHoraProposada)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={STATUS_BADGE[proposta.estat] ?? 'secondary'}>
                                            {STATUS_LABELS[proposta.estat] ?? proposta.estat}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-warm-600 dark:text-warm-300">
                                        {proposta.respostaText ? proposta.respostaText : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {proposta.estat === 'PENDENT' ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => openRespondDialog(proposta, 'RECHAZAR')}
                                                >
                                                    Rebutjar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => openRespondDialog(proposta, 'ACCEPTAR')}
                                                    className="bg-warm-600 hover:bg-warm-700 text-white"
                                                >
                                                    Acceptar
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-warm-500 dark:text-warm-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={!!respondDialog} onOpenChange={(open) => !open && setRespondDialog(null)}>
                <DialogContent className="bg-white dark:bg-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-warm-900 dark:text-warm-100">
                            {respondDialog?.accio === 'ACCEPTAR' ? 'Acceptar proposta' : 'Rebutjar proposta'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <p className="text-sm text-warm-700 dark:text-warm-300">
                            {respondDialog?.accio === 'ACCEPTAR'
                                ? 'Si acceptes, el partit s\'actualitzarà amb la data proposada.'
                                : 'Si rebutges, el partit mantindrà la data actual.'}
                        </p>
                        <div>
                            <label className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-1 block">Resposta</label>
                            <textarea
                                value={respostaText}
                                onChange={e => setRespostaText(e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-warm-900 dark:text-warm-100"
                                placeholder="Resposta opcional"
                            />
                        </div>
                        {respondDialog?.proposta?.dataHoraProposada && (
                            <div className="text-sm text-warm-600 dark:text-warm-300">
                                Nova data proposada: {formatDate(respondDialog.proposta.dataHoraProposada)}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRespondDialog(null)} disabled={respondProposalMutation.isPending}>
                            Cancel·lar
                        </Button>
                        <Button
                            onClick={handleRespondre}
                            disabled={respondProposalMutation.isPending}
                            className={respondDialog?.accio === 'RECHAZAR'
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-warm-600 hover:bg-warm-700 text-white'}
                        >
                            {respondProposalMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
