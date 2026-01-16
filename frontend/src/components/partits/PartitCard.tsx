import { format } from "date-fns";
import { ca } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface PartitCardProps {
    partit: any;
    showSets?: boolean;
}

const PartitCard = ({ partit, showSets = false }: PartitCardProps) => {
    const dataFormatejada = format(new Date(partit.dataHora), "d MMMM yyyy - HH:mm", { locale: ca });
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">
                            {partit.local?.nom} vs {partit.visitant?.nom}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{dataFormatejada}</span>
                        </div>
                        {partit.pista && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{partit.pista.nom}</span>
                            </div>
                        )}
                    </div>
                    <Badge
                        variant={partit.status === "COMPLETAT" ? "default" : "secondary"}
                    >
                        {partit.status}
                    </Badge>
                </div>
            </CardHeader>

            {showSets && partit.sets && partit.sets.length > 0 && (
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Sets:</p>
                        {partit.sets.map((set: any) => (
                            <div key={set.id} className="flex items-center gap-4 text-sm">
                                <span className="font-medium">Set {set.numeroSet}:</span>
                                <span>
                                    {set.jocsLocal} - {set.jocsVisit}
                                </span>
                                {set.tiebreak && (
                                    <Badge variant="outline" className="text-xs">
                                        TB: {set.puntsLocalTiebreak}-{set.puntsVisitTiebreak}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
            {!showSets && (
                <div>
                    <Button
                        size="sm"
                        onClick={() => navigate(`/entrenador/partits/${partit.id}/alineacio`)}
                    >
                        Alinear
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default PartitCard;