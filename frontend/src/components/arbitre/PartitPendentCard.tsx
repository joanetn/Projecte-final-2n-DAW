import { PartitPendentActa } from "@/types/acta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, FileText } from "lucide-react";

interface PartitPendentCardProps {
    partit: PartitPendentActa;
    onCrearActa: (partitId: string | number) => void;
}

export function PartitPendentCard({ partit, onCrearActa }: PartitPendentCardProps) {
    const dataPartit = new Date(partit.dataHora);
    const dataFormatejada = dataPartit.toLocaleDateString("ca-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const horaFormatejada = dataPartit.toLocaleTimeString("ca-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        {partit.local?.nom || "Equip Local"} vs {partit.visitant?.nom || "Equip Visitant"}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Completat
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{dataFormatejada} - {horaFormatejada}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Jornada {partit.jornadaId}</span>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={() => onCrearActa(partit.id)}
                        className="w-full gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Crear Acta
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
