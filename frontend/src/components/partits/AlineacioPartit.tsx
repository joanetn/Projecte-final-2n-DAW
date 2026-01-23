import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import DraggableJugador from "./DraggableJugador";
import SlotJugador from "./DropPista";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useMemo } from "react";
import { useComprovarAlineacions, usePlantilla } from "@/queries/entrenador.queries";
import { useToast } from "@/components/ui/Toast";
import { Button } from "../ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useGuardarAlineacio } from "@/mutations/entrenador.mutations";
import { CompAlineacioResponse } from "@/types/entrenador";
import { ArrowLeft, Users, Save, Check, ShieldAlert } from "lucide-react";
import { Badge } from "../ui/badge";
import { useValidarJugadorsAlineacio } from "@/queries/seguro.queries";

const AlineacioPartit = () => {
    const { data: plantillaData } = usePlantilla();
    const plantilla = plantillaData?.plantilla.jugadors || [];
    const params = useParams();
    const navigate = useNavigate();
    const partitId = params.partitId!;
    const [activeId, setActiveId] = useState<string | null>(null);
    const [alineacio, setAlineacio] = useState<{
        [key: string]: any | null
    }>({
        slot1: null,
        slot2: null
    });
    const [mostrarBoto, setMostrarBoto] = useState(false);
    const [jugadoresUsados, setJugadoresUsados] = useState<string[]>([]);

    const mutation = useGuardarAlineacio();
    const compAlineacio = useComprovarAlineacions();
    const { showToast } = useToast();

    // Obtenir IDs de tots els jugadors per validar el segur
    const jugadorIds = useMemo(() => plantilla.map(j => j.id), [plantilla]);
    const { data: validacioSeguros } = useValidarJugadorsAlineacio(jugadorIds);

    // Mapa de jugador -> teSeguro per accés ràpid
    const segurosMap = useMemo(() => {
        const map: Record<string, boolean> = {};
        if (validacioSeguros?.jugadors) {
            validacioSeguros.jugadors.forEach(j => {
                map[j.jugadorId] = j.teSeguro;
            });
        }
        return map;
    }, [validacioSeguros]);

    // Comptar jugadors sense segur
    const jugadorsSenseSeguro = useMemo(() => {
        return plantilla.filter(j => segurosMap[j.id] === false);
    }, [plantilla, segurosMap]);

    const guardarAlineacio = () => {
        const body = {
            jugadorsId: jugadoresUsados,
            partitId
        };

        mutation.mutate(body, {
            onSuccess: () => {
                showToast({ type: 'success', title: 'Alineació guardada', description: "S'ha guardat l'alineació correctament." });
            },
            onError: (err: any) => {
                console.error("Error de guardar alineacio:", err);
                showToast({ type: 'error', title: 'Error', description: "No s'ha pogut guardar l'alineació." });
            },
        })
    }

    useEffect(() => {
        const comp: CompAlineacioResponse = compAlineacio.data;
        if (!comp || !plantilla) return;

        const slot1Jugador = plantilla.find(j => j.id === comp.slot1) || null;
        const slot2Jugador = plantilla.find(j => j.id === comp.slot2) || null;

        setAlineacio(prev => ({
            ...prev,
            slot1: slot1Jugador,
            slot2: slot2Jugador
        }));

        const usedIds = [slot1Jugador?.id, slot2Jugador?.id].filter(Boolean) as string[];
        setJugadoresUsados(Array.from(usedIds));
    }, [compAlineacio.data, plantilla])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const jugador = plantilla.find(j => j.id === active.id);
        if (!jugador) return;

        const slotActual = over.id as string;
        const jugadorEnSlot = alineacio[slotActual];

        if (jugadorEnSlot) {
            setJugadoresUsados(prev =>
                prev.filter(id => id !== jugadorEnSlot.id)
            );
        }

        setAlineacio(prev => ({
            ...prev,
            [slotActual]: jugador
        }));

        setJugadoresUsados(prev => {
            const filteredPrev = prev.filter(id => id !== jugador.id);
            return [...filteredPrev, jugador.id];
        });

    };

    const handleSlotClick = (slotId: string) => {
        const jugadorEnSlot = alineacio[slotId];
        if (!jugadorEnSlot) return;

        setAlineacio(prev => ({
            ...prev,
            [slotId]: null
        }));

        setJugadoresUsados(prev => prev.filter(id => id !== jugadorEnSlot.id));
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const activeJugador = activeId ? plantilla.find(j => j.id === activeId) : null;

    useEffect(() => {
        const filledSlots = Object.values(alineacio).filter(Boolean).length;
        const totalSlots = Object.keys(alineacio).length;
        setMostrarBoto(filledSlots === totalSlots && totalSlots > 0);
    }, [alineacio, jugadoresUsados])

    const filledSlots = Object.values(alineacio).filter(Boolean).length;
    const totalSlots = Object.keys(alineacio).length;

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={(event) => {
                handleDragEnd(event);
                setActiveId(null);
            }}
            onDragCancel={handleDragCancel}
        >
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
                {/* Header amb navegació */}
                <div className="max-w-6xl mx-auto mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/dashboardEntrenador')}
                                className="rounded-full"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Configurar Alineació</h1>
                                <p className="text-muted-foreground">Partit #{partitId} · Arrastra els jugadors als slots</p>
                            </div>
                        </div>
                        <Badge variant={mostrarBoto ? "default" : "secondary"} className="text-sm px-3 py-1">
                            {filledSlots}/{totalSlots} posicions ocupades
                        </Badge>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto flex gap-6">
                    {/* PLANTILLA */}
                    <Card className="w-72 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5" />
                                Jugadors Disponibles
                            </CardTitle>
                            {jugadorsSenseSeguro.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                                    <ShieldAlert className="h-3 w-3" />
                                    {jugadorsSenseSeguro.length} sense segur
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(80vh-200px)]">
                                <div className="space-y-2 pr-4">
                                    {plantilla
                                        .filter(j => !jugadoresUsados.includes(j.id))
                                        .map(j => (
                                            <DraggableJugador
                                                key={j.id}
                                                jugador={j}
                                                teSeguro={segurosMap[j.id] ?? true}
                                            />
                                        ))}
                                    {plantilla.filter(j => !jugadoresUsados.includes(j.id)).length === 0 && (
                                        <p className="text-center text-muted-foreground text-sm py-4">
                                            Tots els jugadors assignats
                                        </p>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* PISTA I ACCIONS */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* PISTA */}
                        <Card className="flex-1 shadow-lg overflow-hidden">
                            <div className="h-full flex items-center justify-center p-8">
                                <div className="relative w-full max-w-[600px] h-[350px] bg-gradient-to-b from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 border-4 border-white/30 rounded-2xl shadow-2xl overflow-hidden">
                                    {/* Línia central */}
                                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white/60" />

                                    {/* Cercle central decoratiu */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/40" />

                                    {/* Marques de cantonada */}
                                    <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-white/40 rounded-tl-lg" />
                                    <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-white/40 rounded-tr-lg" />
                                    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-white/40 rounded-bl-lg" />
                                    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-white/40 rounded-br-lg" />

                                    {/* Labels dels slots */}
                                    <div className="absolute top-4 left-16 text-white/80 text-xs font-semibold uppercase tracking-wider">
                                        Jugador 1
                                    </div>
                                    <div className="absolute top-4 right-16 text-white/80 text-xs font-semibold uppercase tracking-wider">
                                        Jugador 2
                                    </div>

                                    {/* Slots */}
                                    <div className="absolute top-1/2 left-16 -translate-y-1/2 z-10">
                                        <SlotJugador
                                            id="slot1"
                                            jugador={alineacio.slot1}
                                            onSlotClick={() => handleSlotClick('slot1')}
                                        />
                                    </div>

                                    <div className="absolute top-1/2 right-16 -translate-y-1/2 z-10">
                                        <SlotJugador
                                            id="slot2"
                                            jugador={alineacio.slot2}
                                            onSlotClick={() => handleSlotClick('slot2')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Botó Guardar - FORA de la pista */}
                        <div className="flex justify-center">
                            <Button
                                onClick={() => guardarAlineacio()}
                                disabled={!mostrarBoto || mutation.isPending}
                                size="lg"
                                className="px-8 gap-2 shadow-lg"
                            >
                                {mutation.isPending ? (
                                    <>Guardant...</>
                                ) : mostrarBoto ? (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Guardar Alineació
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Posiciona dos jugadors
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Instruccions */}
                        <Card className="shadow-sm">
                            <CardContent className="py-3">
                                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-blue-500" />
                                        <span>Arrossega jugador al slot</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-red-500" />
                                        <span>Clica al slot per llevar el jugador</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Overlay mentre arrossegues */}
            <DragOverlay>
                {activeJugador && (
                    <div className="p-3 bg-primary text-primary-foreground rounded-lg shadow-2xl font-medium cursor-grabbing transform scale-105">
                        {activeJugador.nom}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default AlineacioPartit;
