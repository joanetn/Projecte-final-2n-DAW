import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

interface CalendariTabProps {
    calendari: UseQueryResult<any, unknown>;
}

export function CalendariTab({ calendari }: CalendariTabProps) {
    if (calendari.isLoading) {
        return (
            <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    Carregant calendari...
                </span>
            </div>
        );
    }

    if (calendari.isError) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant el calendari
                </CardContent>
            </Card>
        );
    }

    if (calendari.data) {
        return (
            <div className="space-y-4">
                {calendari.data.partits?.length === 0 && (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No hi ha partits programats
                        </CardContent>
                    </Card>
                )}
                {calendari.data.partits?.map((partit: any) => (
                    <Card
                        key={partit.id}
                        className={`${
                            partit.esElMeuEquip ? 'border-primary' : ''
                        }`}
                    >
                        <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p
                                        className={`font-medium ${
                                            partit.equipLocalId === calendari.data?.equipId
                                                ? 'text-primary'
                                                : ''
                                        }`}
                                    >
                                        {partit.equipLocalNom}
                                    </p>
                                </div>
                                <div className="px-4 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(partit.data).toLocaleDateString(
                                            'ca-ES',
                                            {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                            }
                                        )}
                                    </p>
                                    <p className="font-bold text-lg">VS</p>
                                    {partit.hora && (
                                        <p className="text-sm text-muted-foreground">
                                            {partit.hora}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1 text-right">
                                    <p
                                        className={`font-medium ${
                                            partit.equipVisitantId ===
                                            calendari.data?.equipId
                                                ? 'text-primary'
                                                : ''
                                        }`}
                                    >
                                        {partit.equipVisitantNom}
                                    </p>
                                </div>
                            </div>
                            {partit.ubicacio && (
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    📍 {partit.ubicacio}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return null;
}
