import { Acta, Incidencia, SetResultat } from "@/types/acta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    ArrowLeft,
    Edit,
    Lock,
} from "lucide-react";

interface ActaDetallProps {
    acta: Acta;
    onTornar: () => void;
    onEditar?: (actaId: string) => void;
    onValidar?: (actaId: string) => void;
    isValidating?: boolean;
}

// Colors i labels per incidències de PÀDEL
const TIPUS_INCIDENCIA_COLORS: Record<string, string> = {
    ADVERTENCIA: "bg-yellow-100 text-yellow-700",
    CONDUCTA_ANTIESPORTIVA: "bg-red-100 text-red-700",
    LESIO: "bg-orange-100 text-orange-700",
    PROBLEMA_MATERIAL: "bg-blue-100 text-blue-700",
    RETARD: "bg-purple-100 text-purple-700",
    ALTRE: "bg-gray-100 text-gray-700",
};

const TIPUS_INCIDENCIA_LABELS: Record<string, string> = {
    ADVERTENCIA: "Advertència",
    CONDUCTA_ANTIESPORTIVA: "Conducta antiesportiva",
    LESIO: "Lesió",
    PROBLEMA_MATERIAL: "Problema de material/pista",
    RETARD: "Retard",
    ALTRE: "Altre",
};

export function ActaDetall({ acta, onTornar, onEditar, onValidar, isValidating }: ActaDetallProps) {
    const dataCreacio = new Date(acta.created_at);
    const dataPartit = acta.partit?.dataHora ? new Date(acta.partit.dataHora) : null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ca-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Capçalera */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onTornar}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Acta del Partit
                    </h1>
                    <p className="text-muted-foreground">
                        {acta.partit?.local?.nom || "Local"} vs {acta.partit?.visitant?.nom || "Visitant"}
                    </p>
                </div>
                {acta.validada ? (
                    <Badge className="bg-green-100 text-green-700 gap-1 text-sm py-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Acta Validada
                    </Badge>
                ) : (
                    <Badge variant="outline" className="border-yellow-400 text-yellow-700 gap-1 text-sm py-1">
                        <Clock className="h-4 w-4" />
                        Pendent de Validar
                    </Badge>
                )}
            </div>

            {/* Info del partit */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informació del Partit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {dataPartit && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(dataPartit)}</span>
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                        Acta creada el {formatDate(dataCreacio)}
                    </div>
                    {acta.validada && acta.dataValidacio && (
                        <div className="text-xs text-green-600 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Validada el {formatDate(new Date(acta.dataValidacio))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resultat per Sets */}
            <Card className="border-primary/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Resultat del Partit</CardTitle>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                            {acta.setsLocal} - {acta.setsVisitant}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Taula de sets */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-[1fr_80px_80px] gap-2 text-sm font-medium text-center border-b pb-2">
                            <div></div>
                            <div className="truncate">{acta.partit?.local?.nom || "Local"}</div>
                            <div className="truncate">{acta.partit?.visitant?.nom || "Visitant"}</div>
                        </div>
                        {acta.sets && acta.sets.map((set: SetResultat) => (
                            <div key={set.numeroSet} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center text-center">
                                <div className="text-left">
                                    <Badge variant="secondary">Set {set.numeroSet}</Badge>
                                    {set.tiebreak && (
                                        <span className="text-xs text-muted-foreground ml-2">
                                            (TB: {set.puntsLocalTiebreak}-{set.puntsVisitantTiebreak})
                                        </span>
                                    )}
                                </div>
                                <div className={`text-xl font-bold ${set.jocsLocal > set.jocsVisitant ? 'text-green-600' : ''}`}>
                                    {set.jocsLocal}
                                </div>
                                <div className={`text-xl font-bold ${set.jocsVisitant > set.jocsLocal ? 'text-green-600' : ''}`}>
                                    {set.jocsVisitant}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Observacions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Observacions Reglamentàries</CardTitle>
                    <CardDescription>
                        Desenvolupament del partit a nivell reglamentari
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {acta.observacions ? (
                        <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">
                            {acta.observacions}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No s'han registrat observacions
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Incidències */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Incidències Registrades
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {acta.incidencies && acta.incidencies.length > 0 ? (
                        <div className="space-y-3">
                            {acta.incidencies.map((inc: Incidencia, index: number) => (
                                <div
                                    key={inc.id || index}
                                    className="flex items-start p-3 border rounded-lg bg-muted/50"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className={TIPUS_INCIDENCIA_COLORS[inc.tipus] || "bg-gray-100"}>
                                                {TIPUS_INCIDENCIA_LABELS[inc.tipus] || inc.tipus}
                                            </Badge>
                                            {inc.set && (
                                                <span className="text-xs text-muted-foreground">
                                                    Set {inc.set}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm">{inc.descripcio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            No s'han registrat incidències
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Accions */}
            {!acta.validada && (
                <Card className="border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            {onEditar && (
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2"
                                    onClick={() => onEditar(acta.id)}
                                >
                                    <Edit className="h-4 w-4" />
                                    Editar Acta
                                </Button>
                            )}
                            {onValidar && (
                                <Button
                                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                    onClick={() => onValidar(acta.id)}
                                    disabled={isValidating}
                                >
                                    <Lock className="h-4 w-4" />
                                    {isValidating ? "Validant..." : "Validar i Tancar Acta"}
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            Un cop validada, l'acta no es podrà modificar
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
