import { useInvitacionsRebudes } from "@/queries/invitacions.queries"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Mail, Clock, MessageSquare, Check, X } from "lucide-react"
import { useState } from "react"
import { useAcceptarInvitacio, useRebutjarInvitacio } from "@/mutations/invitacions.mutations"
import { useToast } from "../ui/Toast"
import SeguroWarning from "./SeguroWarning"
import SeguroBadge from "./SeguroBadge"

const InvitacionsJugador = () => {
    const { data: invitacions, isLoading: invitacionsIsLoading, isError: invitacionsIsError } = useInvitacionsRebudes();
    const mutationAcceptar = useAcceptarInvitacio();
    const mutationRebutjar = useRebutjarInvitacio();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [replyFor, setReplyFor] = useState<string | null>(null);
    const [replyMode, setReplyMode] = useState<'accept' | 'reject' | null>(null);
    const [replyMessage, setReplyMessage] = useState<string>('');
    const { showToast } = useToast();

    const acceptarInvitacio = (id: string) => {
        mutationAcceptar.mutate(id, {
            onSuccess: () => {
                showToast({ type: 'success', title: 'Invitació acceptada', description: "Formes part de l'equip" });
            },
            onError: () => {
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut acceptar l'invitació." });
            }
        });
    }

    const rebutjarInvitacio = (id: string) => {
        mutationRebutjar.mutate(id, {
            onSuccess: () => {
                showToast({ type: 'success', title: 'Invitació rebutjada', description: "No formaràs part de l'equip" });
            },
            onError: () => {
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut rebutjar l'invitació." });
            }
        })
    }

    const handleOpenReply = (invId: string, mode: 'accept' | 'reject') => {
        setReplyFor(invId);
        setReplyMode(mode);
        setReplyMessage('');
        setIsDialogOpen(true);
    };

    const handleConfirm = () => {
        console.log({ id: replyFor, action: replyMode, message: replyMessage });
        replyMode === 'accept' ? acceptarInvitacio(replyFor!) : rebutjarInvitacio(replyFor!)
        setIsDialogOpen(false);
        setReplyFor(null);
        setReplyMode(null);
        setReplyMessage('');
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setReplyFor(null);
        setReplyMode(null);
        setReplyMessage('');
    };

    if (invitacionsIsLoading) {
        return (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
                Càrregant invitacions...
            </div>
        )
    }

    if (invitacionsIsError) {
        return (
            <div className="text-center text-red-600">Error carregant invitacions.</div>
        )
    }

    const total = invitacions?.total || 0;
    const items = invitacions?.invitacions || [];

    const estatColors: Record<string, string> = {
        PENDENT: 'bg-amber-50 text-amber-700 border-amber-200',
        ACCEPTADA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        REBUTJADA: 'bg-red-50 text-red-700 border-red-200',
        CANCELADA: 'bg-gray-50 text-gray-600 border-gray-200',
    };

    return (
        <>
            <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Avís de segur */}
                <SeguroWarning />

                <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                        <h2 className="text-lg font-semibold text-gray-800">Invitacions rebudes</h2>
                        <p className="text-sm text-muted-foreground">Tens {total} invitació{total !== 1 ? 's' : ''} rebuda{total !== 1 ? 's' : ''}.</p>
                    </div>
                    <SeguroBadge size="sm" />
                </div>

                {total === 0 && (
                    <div className="text-center text-muted-foreground">No tens invitacions per ara.</div>
                )}

                {total > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((inv: any) => {
                            const estat = inv.estat || 'PENDENT';
                            const badgeClass = estatColors[estat] || estatColors.PENDENT;

                            const data = inv.created_at ? new Date(inv.created_at) : null;
                            const dataStr = data
                                ? data.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : '';

                            return (
                                <Card key={inv.id} className="hover:shadow-md transition">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {inv.jugador?.avatar ? (
                                                    <img src={inv.jugador.avatar} alt={inv.jugador.nom} className="h-12 w-12 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                        {inv.jugador?.nom?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <CardTitle className="text-sm font-semibold truncate">{inv.jugador?.nom || inv.enviadaPer?.nom || 'Desconegut'}</CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground truncate">{inv.jugador?.email || ''}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Badge variant="outline" className={`${badgeClass} text-xs px-2 py-0.5`}> {estat.charAt(0) + estat.slice(1).toLowerCase()} </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0 space-y-3">
                                        {inv.missatge && (
                                            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                                                    <p className="text-sm text-gray-700 leading-relaxed">{inv.missatge}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs">{dataStr}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button size="sm" onClick={() => handleOpenReply(inv.id, 'accept')} className="inline-flex items-center gap-2">
                                                    <Check className="w-4 h-4" />
                                                    Acceptar
                                                </Button>

                                                <Button size="sm" variant="destructive" onClick={() => handleOpenReply(inv.id, 'reject')} className="inline-flex items-center gap-2">
                                                    <X className="w-4 h-4" />
                                                    Rebutjar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {replyMode === 'accept' ? 'Acceptar invitació' : 'Rebutjar invitació'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {replyMode === 'accept'
                                ? 'Escriu un missatge per acceptar aquesta invitació (opcional).'
                                : 'Escriu un missatge per rebutjar aquesta invitació (opcional).'}
                        </p>

                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder={replyMode === 'accept' ? "Missatge d'acceptació..." : 'Missatge de rebutge...'}
                            className="w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            rows={4}
                        />
                    </div>

                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel·lar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant={replyMode === 'accept' ? 'default' : 'destructive'}
                            className="inline-flex items-center gap-2"
                        >
                            {replyMode === 'accept' ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Acceptar
                                </>
                            ) : (
                                <>
                                    <X className="w-4 h-4" />
                                    Rebutjar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default InvitacionsJugador;
