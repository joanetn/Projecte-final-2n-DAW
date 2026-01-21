import { useJugadorsDisponibles } from "@/queries/invitacions.queries";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import { usePlantilla } from "@/queries/entrenador.queries";

const Invitacions = () => {
    const { data: jugadorsDisponibles, isLoading: jugadorsIsLoading, isError: jugadorsIsError } = useJugadorsDisponibles();

    const jugadors = jugadorsDisponibles?.jugadors || [];
    const { data: plantilla } = usePlantilla();
    const [openFormFor, setOpenFormFor] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    const enviarInvitacio = () => {

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

                                        {/* Botón para abrir el formulario desplegable */}
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
                                                                // solo UI: cerrar y limpiar
                                                                setOpenFormFor(null);
                                                                setMessage("");
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
        </Tabs >
    );
}

export default Invitacions;