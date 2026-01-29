import { Acta } from "@/types/acta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, Edit, Eye, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ActaCardProps {
    acta: Acta;
    onVeure: (actaId: string) => void;
    onEditar?: (actaId: string) => void;
    onEliminar?: (actaId: string) => void;
}

export function ActaCard({ acta, onVeure, onEditar, onEliminar }: ActaCardProps) {
    const dataCreacio = new Date(acta.created_at);
    const dataFormatejada = dataCreacio.toLocaleDateString("ca-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const teIncidencies = acta.incidencies && acta.incidencies.length > 0;

    return (
        <Card className={`hover:shadow-md transition-shadow ${acta.validada ? 'border-green-200' : 'border-yellow-200'}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        {acta.partit?.local?.nom || "Local"} vs {acta.partit?.visitant?.nom || "Visitant"}
                    </CardTitle>
                    {acta.validada ? (
                        <Badge className="bg-green-100 text-green-700 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Validada
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="border-yellow-400 text-yellow-700 gap-1">
                            <Clock className="h-3 w-3" />
                            Pendent
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Resultat en sets */}
                <div className="flex items-center justify-center py-3 bg-muted rounded-lg">
                    <span className="text-3xl font-bold text-primary">
                        {acta.setsLocal} - {acta.setsVisitant}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">sets</span>
                </div>

                {/* Detall sets */}
                {acta.sets && acta.sets.length > 0 && (
                    <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                        {acta.sets.map((set) => (
                            <span key={set.numeroSet} className="px-2 py-1 bg-background rounded border">
                                {set.jocsLocal}-{set.jocsVisitant}
                                {set.tiebreak && <sup className="text-xs">*</sup>}
                            </span>
                        ))}
                    </div>
                )}

                {/* Data partit */}
                {acta.partit?.dataHora && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(acta.partit.dataHora).toLocaleDateString("ca-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                )}

                {/* Indicador d'incidències */}
                {teIncidencies && (
                    <div className="text-sm">
                        <Badge variant="destructive" className="text-xs">
                            {acta.incidencies!.length} incidència(es) registrada(es)
                        </Badge>
                    </div>
                )}

                {/* Observacions preview */}
                {acta.observacions && (
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        "{acta.observacions}"
                    </p>
                )}

                {/* Data creació */}
                <div className="text-xs text-muted-foreground">
                    Creada el {dataFormatejada}
                </div>

                {/* Accions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => onVeure(acta.id)}
                    >
                        <Eye className="h-4 w-4" />
                        Veure
                    </Button>

                    {!acta.validada && onEditar && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => onEditar(acta.id)}
                        >
                            <Edit className="h-4 w-4" />
                            Editar
                        </Button>
                    )}

                    {!acta.validada && onEliminar && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Eliminar acta</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Estàs segur que vols eliminar aquesta acta? Aquesta acció no es pot desfer.
                                        <div className="mt-3 p-3 bg-muted rounded-lg text-foreground">
                                            <strong>{acta.partit?.local?.nom}</strong> vs <strong>{acta.partit?.visitant?.nom}</strong>
                                            <div className="text-sm mt-1">Resultat: {acta.setsLocal} - {acta.setsVisitant}</div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => onEliminar(acta.id)}
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
