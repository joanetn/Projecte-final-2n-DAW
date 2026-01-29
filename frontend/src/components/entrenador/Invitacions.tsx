import { useInvitacionsEnviades, useJugadorsDisponibles } from "@/queries/invitacions.queries";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Loader2, Users, Mail, Clock, XCircle, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useCancelarInvitacio, useEnviarInvitacio } from "@/mutations/invitacions.mutations";
import { InvitacioData } from "@/types/invitacions";
import { useToast } from "../ui/Toast";
const Invitacions = () => {
    const { data: jugadorsDisponibles, isLoading: jugadorsIsLoading, isError: jugadorsIsError } = useJugadorsDisponibles();
    const jugadors = jugadorsDisponibles?.jugadors || [];
    const [openFormFor, setOpenFormFor] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const { data: invitacions, isLoading: invitacionsIsLoading, isError: invitacionsIsError } = useInvitacionsEnviades();
    const { showToast } = useToast();
    const mutationEnviar = useEnviarInvitacio();
    const mutationCancelar = useCancelarInvitacio();
    const enviarInvitacio = (body: InvitacioData) => {
        console.log(body);
        mutationEnviar.mutate(body, {
            onSuccess: () => {
                setOpenFormFor(null);
                setMessage("");
                showToast({ type: 'success', title: 'Invitació enviada', description: "L'invitació s'ha enviat correctament" });
            },
            onError: (err: any) => {
                console.error("Error al enviar l'invitacio:", err);
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut enviar l'invitació." });
            }
        })
    }
    const cancelarInvitacio = (id: string) => {
        console.log(id);
        mutationCancelar.mutate(id, {
            onSuccess: () => {
                showToast({ type: 'success', title: 'Invitacio cancelada', description: "L'invitació s'ha cancelat correctament" });
            },
            onError: (err: any) => {
                console.error("Error al cancelar l'invitacio:", err);
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut cancelar l'invitació." });
            }
        })
    }
    return (
        <Tabs className="w-full" defaultValue="jugadors">
            <TabsList className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <TabsTrigger
                    value="jugadors"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent shadow-sm bg-transparent hover:bg-muted/5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    <Users className="w-4 h-4 hidden sm:inline" />
                    <span>Jugadors</span>
                </TabsTrigger>
                <TabsTrigger
                    value="invitacions"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent shadow-sm bg-transparent hover:bg-muted/5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    <Users className="w-4 h-4 hidden sm:inline" />
                    <span>Invitacions</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="jugadors">
                {jugadorsIsLoading && (
                    <div className="flex items-center justify-center h-[40vh]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">
                            Carregant jugadors disponibles...
                        </span>
                    </div>
                )}
                {jugadorsIsError && (
                    <div className="text-center text-red-600">
                        Error carregant jugadors disponibles
                    </div>
                )}
                {!jugadorsIsLoading && jugadorsDisponibles && jugadorsDisponibles.total === 0 && (
                    <div className="text-center text-muted-foreground">
                        No hi ha jugadors disponibles
                    </div>
                )}
                {!jugadorsIsLoading && jugadorsDisponibles && jugadorsDisponibles.total > 0 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jugadors.map((j) => (
                                <Card key={j.id} className="hover:shadow-md transition">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{j.nom}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{j.email}</p>
                                                {j.telefon && (
                                                    <p className="text-xs text-muted-foreground/70 mt-1">{j.telefon}</p>
                                                )}
                                            </div>
                                            {j.avatar && (
                                                <img src={j.avatar} alt={j.nom} className="h-12 w-12 rounded-full object-cover" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {j.nivell && (
                                            <p className="text-sm text-muted-foreground mb-2">Nivell: {j.nivell}</p>
                                        )}
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenFormFor((prev) => (prev === String(j.id) ? null : String(j.id)));
                                                    setMessage("");
                                                }}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-transparent bg-slate-100 hover:bg-slate-200"
                                            >
                                                Contactar
                                            </button>
                                            {openFormFor === String(j.id) && (
                                                <div className="mt-3 p-3 border border-muted/30 rounded-md bg-white shadow-sm">
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Missatge</label>
                                                    <textarea
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-md border px-2 py-1 text-sm resize-y"
                                                        placeholder="Escriu el missatge que vols manar-li al jugador..."
                                                    />
                                                    <div className="mt-2 flex gap-2 justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenFormFor(null);
                                                                setMessage("");
                                                            }}
                                                            className="px-3 py-1 rounded-md text-sm bg-transparent border hover:bg-muted/5"
                                                        >
                                                            Cancel·la
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                enviarInvitacio({ jugadorId: j.id, missatge: message });
                                                            }}
                                                            className="px-3 py-1 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                                                        >
                                                            Enviar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="invitacions">
                {invitacionsIsLoading && (
                    <div className="flex items-center justify-center h-[40vh]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">
                            Carregant invitacions enviades...
                        </span>
                    </div>
                )}
                {invitacionsIsError && (
                    <div className="text-center text-red-600">
                        Error carregant invitacions enviades
                    </div>
                )}
                {!invitacionsIsLoading && invitacions && invitacions.total === 0 && (
                    <div className="text-center text-muted-foreground">
                        No hi ha invitacions enviades per ara
                    </div>
                )}
                {!invitacionsIsLoading && invitacions && invitacions.total > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Send className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Invitacions enviades</h3>
                                    <p className="text-sm text-muted-foreground">{invitacions.total} invitació{invitacions.total !== 1 ? 'ns' : ''} en total</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {invitacions.invitacions.map((inv) => {
                                const estatColors: Record<string, { bg: string; text: string; border: string }> = {
                                    PENDENT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                                    ACCEPTADA: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                                    REBUTJADA: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
                                    CANCELADA: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
                                };
                                const estatStyle = estatColors[inv.estat] || estatColors.PENDENT;
                                const dataEnviament = new Date(inv.created_at);
                                const dataFormatejada = dataEnviament.toLocaleDateString('ca-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                return (
                                    <Card
                                        key={inv.id}
                                        className="group relative overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start gap-4">
                                                <div className="relative">
                                                    {inv.jugador.avatar ? (
                                                        <img
                                                            src={inv.jugador.avatar}
                                                            alt={inv.jugador.nom}
                                                            className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
                                                        />
                                                    ) : (
                                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ring-2 ring-white shadow-md">
                                                            <span className="text-white font-semibold text-lg">
                                                                {inv.jugador.nom.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${inv.estat === 'PENDENT' ? 'bg-amber-400' :
                                                        inv.estat === 'ACCEPTADA' ? 'bg-emerald-400' :
                                                            inv.estat === 'REBUTJADA' ? 'bg-red-400' : 'bg-gray-400'
                                                        }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base font-semibold text-gray-800 truncate">
                                                        {inv.jugador.nom}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground truncate">
                                                            {inv.jugador.email}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`${estatStyle.bg} ${estatStyle.text} ${estatStyle.border} text-xs font-medium px-2.5 py-0.5`}
                                                >
                                                    {inv.estat.charAt(0) + inv.estat.slice(1).toLowerCase()}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-4">
                                            {inv.jugador.nivell && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nivell:</span>
                                                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                                        {inv.jugador.nivell}
                                                    </span>
                                                </div>
                                            )}
                                            {inv.missatge && (
                                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                                    <div className="flex items-start gap-2">
                                                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                            {inv.missatge}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span className="text-xs">{dataFormatejada}</span>
                                                </div>
                                                {inv.estat === 'PENDENT' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            cancelarInvitacio(inv.id)
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100 hover:border-red-200"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Cancel·lar
                                                    </button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </TabsContent>
        </Tabs >
    );
}
export default Invitacions;
