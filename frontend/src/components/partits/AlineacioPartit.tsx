import { DndContext, DragEndEvent } from "@dnd-kit/core";
import DraggableJugador from "./DraggableJugador";
import SlotJugador from "./DropPista";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useComprovarAlineacions, usePlantilla } from "@/queries/entrenador.queries";
import { useToast } from "@/components/ui/Toast";
import { queryClient } from "@/lib/utils";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useGuardarAlineacio } from "@/mutations/entrenador.mutations";
import { CompAlineacioResponse } from "@/types/entrenador";

const AlineacioPartit = () => {
    const { data: plantillaData } = usePlantilla();
    const plantilla = plantillaData?.plantilla.jugadors || [];
    const params = useParams();
    const partitId = params.partitId!;
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

    const guardarAlineacio = () => {
        console.log("holaaaaaaaaaaa");
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

    useEffect(() => {
        const filledSlots = Object.values(alineacio).filter(Boolean).length;
        const totalSlots = Object.keys(alineacio).length;
        setMostrarBoto(filledSlots === totalSlots && totalSlots > 0);
    }, [alineacio, jugadoresUsados])

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex h-[80vh] gap-6 p-6">
                {/* PLANTILLA */}
                <Card className="w-64 p-4">
                    <ScrollArea className="h-full">
                        <div className="space-y-2">
                            {plantilla
                                .filter(j => !jugadoresUsados.includes(j.id))
                                .map(j => (
                                    <DraggableJugador
                                        key={j.id}
                                        jugador={j}
                                    />
                                ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* PISTA */}
                <div className="flex-1 flex justify-center items-center">
                    <div className="relative w-[500px] h-[300px] bg-green-100 border-4 border-green-600 rounded-xl">
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white" />

                        <div className="absolute top-1/2 left-16 -translate-y-1/2">
                            <SlotJugador id="slot1"
                                jugador={alineacio.slot1}
                                onSlotClick={() => handleSlotClick('slot1')}
                            />
                        </div>

                        <div className="absolute top-1/2 right-16 -translate-y-1/2">
                            <SlotJugador
                                id="slot2"
                                jugador={alineacio.slot2}
                                onSlotClick={() => handleSlotClick('slot2')}
                            />
                        </div>
                        {mostrarBoto && (
                            <Button
                                onClick={() => guardarAlineacio()}
                            >
                                Guardar Alineació
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default AlineacioPartit;
