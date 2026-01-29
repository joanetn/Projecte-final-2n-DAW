import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

interface EstadistiquesTabProps {
    estadistiques: UseQueryResult<any, unknown>;
}

export function EstadistiquesTab({ estadistiques }: EstadistiquesTabProps) {
    if (estadistiques.isLoading) {
        return (
            <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    Carregant estadístiques...
                </span>
            </div>
        );
    }

    if (estadistiques.isError) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant les estadístiques
                </CardContent>
            </Card>
        );
    }

    if (estadistiques.data) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <p className="text-3xl font-bold text-primary">
                                {estadistiques.data.partitsJugats || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Partits Jugats
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <p className="text-3xl font-bold text-green-600">
                                {estadistiques.data.partitsGuanyats || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Victòries
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <p className="text-3xl font-bold text-red-600">
                                {estadistiques.data.partitsPerduts || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Derrotes
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <p className="text-3xl font-bold">
                                {estadistiques.data.setsAFavor || 0} -{' '}
                                {estadistiques.data.setsEnContra || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Sets (F/C)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {estadistiques.data.jugadors &&
                    estadistiques.data.jugadors.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Estadístiques per Jugador
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">
                                                    Jugador
                                                </th>
                                                <th className="text-center p-2">
                                                    PJ
                                                </th>
                                                <th className="text-center p-2">
                                                    PG
                                                </th>
                                                <th className="text-center p-2">
                                                    PP
                                                </th>
                                                <th className="text-center p-2">
                                                    % Victòries
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estadistiques.data.jugadors.map(
                                                (jugador: any) => (
                                                    <tr
                                                        key={jugador.id}
                                                        className="border-b hover:bg-muted/50"
                                                    >
                                                        <td className="p-2">
                                                            {jugador.nom}
                                                        </td>
                                                        <td className="text-center p-2">
                                                            {
                                                                jugador.partitsJugats
                                                            }
                                                        </td>
                                                        <td className="text-center p-2 text-green-600">
                                                            {
                                                                jugador.partitsGuanyats
                                                            }
                                                        </td>
                                                        <td className="text-center p-2 text-red-600">
                                                            {
                                                                jugador.partitsPerduts
                                                            }
                                                        </td>
                                                        <td className="text-center p-2">
                                                            {jugador.partitsJugats >
                                                            0
                                                                ? Math.round(
                                                                      (jugador.partitsGuanyats /
                                                                          jugador.partitsJugats) *
                                                                          100
                                                                  )
                                                                : 0}
                                                            %
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
            </div>
        );
    }

    return null;
}
