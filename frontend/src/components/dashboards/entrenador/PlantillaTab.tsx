import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldAlert } from "lucide-react";
import PlantillaCard from "@/components/plantilla/PlantillaCard";
import type { UseQueryResult } from "@tanstack/react-query";

interface PlantillaTabProps {
    plantilla: UseQueryResult<any, unknown>;
    jugadorsSenseSeguro: number;
    segurosMap: Record<string, boolean>;
}

export function PlantillaTab({
    plantilla,
    jugadorsSenseSeguro,
    segurosMap,
}: PlantillaTabProps) {
    if (plantilla.isLoading) {
        return (
            <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    Carregant plantilla...
                </span>
            </div>
        );
    }

    if (plantilla.isError) {
        return (
            <div className="text-center text-red-600">
                Error carregant la plantilla
            </div>
        );
    }

    if (!plantilla.isLoading && plantilla.data && plantilla.data.total === 0) {
        return (
            <div className="text-center text-muted-foreground">
                No hi ha jugadors a la plantilla
            </div>
        );
    }

    if (!plantilla.isLoading && plantilla.data && plantilla.data.total > 0) {
        return (
            <div className="space-y-8">
                {plantilla.data.equip && (
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {plantilla.data.equip.nom}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Categoria: {plantilla.data.equip.categoria}
                            </p>
                        </CardHeader>
                    </Card>
                )}

                {plantilla.data.plantilla.entrenadors.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                            Entrenadors ({plantilla.data.plantilla.entrenadors.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plantilla.data.plantilla.entrenadors.map((usuari: any) => (
                                <PlantillaCard key={usuari.id} usuari={usuari} />
                            ))}
                        </div>
                    </div>
                )}

                {plantilla.data.plantilla.jugadors.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-foreground">
                                Jugadors ({plantilla.data.plantilla.jugadors.length})
                            </h3>
                            {jugadorsSenseSeguro > 0 && (
                                <div className="flex items-center gap-1 text-sm text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                                    <ShieldAlert className="h-4 w-4" />
                                    {jugadorsSenseSeguro} sense segur
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plantilla.data.plantilla.jugadors.map((usuari: any) => (
                                <PlantillaCard
                                    key={usuari.id}
                                    usuari={usuari}
                                    teSeguro={segurosMap[usuari.id]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {plantilla.data.plantilla.administradors.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                            Administradors ({plantilla.data.plantilla.administradors.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plantilla.data.plantilla.administradors.map((usuari: any) => (
                                <PlantillaCard key={usuari.id} usuari={usuari} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
