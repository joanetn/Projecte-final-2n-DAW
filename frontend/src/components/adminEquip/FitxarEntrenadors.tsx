import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "../ui/Toast";
import { useEntrenadorsDisponibles } from "@/queries/invitacions.queries";
import { useEnviarInvitacio } from "@/mutations/invitacions.mutations";
import { InvitacioData } from "@/types/invitacions";

const FitxarEntrenadors = () => {
    const { data: entrenadorsDisponibles, isLoading: entrenadorsIsLoading, isError: entrenadorsIsError } = useEntrenadorsDisponibles();
    const entrenadors = entrenadorsDisponibles?.entrenadors || [];
    const [openFormFor, setOpenFormFor] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const { showToast } = useToast();
    const mutationEnviar = useEnviarInvitacio();

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

    return (
        <div className="w-full">
            {entrenadorsIsLoading && (
                <div className="flex items-center justify-center h-[40vh]">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                        Carregant entrenadors disponibles...
                    </span>
                </div>
            )}
            {entrenadorsIsError && (
                <div className="text-center text-red-600">
                    Error carregant entrenadors disponibles
                </div>
            )}
            {!entrenadorsIsLoading && entrenadorsDisponibles && entrenadorsDisponibles.total === 0 && (
                <div className="text-center text-muted-foreground">
                    No hi ha entrenadors disponibles
                </div>
            )}
            {!entrenadorsIsLoading && entrenadorsDisponibles && entrenadorsDisponibles.total > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {entrenadors.map((e) => (
                            <Card key={e.id} className="hover:shadow-md transition">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{e.nom}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{e.email}</p>
                                            {e.telefon && (
                                                <p className="text-xs text-muted-foreground/70 mt-1">{e.telefon}</p>
                                            )}
                                        </div>
                                        {e.avatar && (
                                            <img src={e.avatar} alt={e.nom} className="h-12 w-12 rounded-full object-cover" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {e.especialitat && (
                                        <p className="text-sm text-muted-foreground mb-2">Especialitat: {e.especialitat}</p>
                                    )}
                                    <div className="mt-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenFormFor((prev) => (prev === String(e.id) ? null : String(e.id)));
                                                setMessage("");
                                            }}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-transparent bg-slate-100 hover:bg-slate-200"
                                        >
                                            Contactar
                                        </button>
                                        {openFormFor === String(e.id) && (
                                            <div className="mt-3 p-3 border border-muted/30 rounded-md bg-white shadow-sm">
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Missatge</label>
                                                <textarea
                                                    value={message}
                                                    onChange={(evt) => setMessage(evt.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-md border px-2 py-1 text-sm resize-y"
                                                    placeholder="Escriu el missatge que vols manar-li a l'entrenador..."
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
                                                            enviarInvitacio({ jugadorId: e.id, missatge: message });
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
        </div>
    );
};

export default FitxarEntrenadors;
