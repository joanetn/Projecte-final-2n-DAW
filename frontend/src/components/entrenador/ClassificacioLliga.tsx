import { useClassificacio } from "@/queries/entrenador.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Loader2, TrendingUp } from "lucide-react";

const ClassificacioLliga = () => {
    const { data, isLoading, isError } = useClassificacio();

    const getPosicioIcon = (posicio: number) => {
        switch (posicio) {
            case 1:
                return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-400" />;
            case 3:
                return <Award className="w-5 h-5 text-amber-600" />;
            default:
                return <span className="w-5 h-5 flex items-center justify-center font-bold text-muted-foreground">{posicio}</span>;
        }
    };

    const getRowStyle = (posicio: number, esElMeuEquip: boolean) => {
        if (esElMeuEquip) {
            return "bg-primary/10 border-primary/30 ring-2 ring-primary/20";
        }
        switch (posicio) {
            case 1:
                return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
            case 2:
                return "bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700";
            case 3:
                return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
            default:
                return "bg-card border-border hover:bg-muted/50";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Carregant classificació...</span>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant la classificació
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header de la lliga */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-primary" />
                        <div>
                            <CardTitle className="text-xl">{data.lliga.nom}</CardTitle>
                            <p className="text-sm text-muted-foreground">{data.lliga.categoria}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Tabla de clasificación */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Classificació
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Header de la tabla */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase border-b">
                        <div className="col-span-1">#</div>
                        <div className="col-span-4">Equip</div>
                        <div className="col-span-1 text-center">PJ</div>
                        <div className="col-span-1 text-center">PG</div>
                        <div className="col-span-1 text-center">PP</div>
                        <div className="col-span-2 text-center">Sets</div>
                        <div className="col-span-2 text-center font-bold">Pts</div>
                    </div>

                    {/* Filas de equipos */}
                    <div className="space-y-1 mt-2">
                        {data.classificacio.map((c) => (
                            <div
                                key={c.id}
                                className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg border transition-all ${getRowStyle(c.posicio, c.esElMeuEquip)}`}
                            >
                                <div className="col-span-1 flex items-center">
                                    {getPosicioIcon(c.posicio)}
                                </div>
                                <div className="col-span-4 flex items-center gap-2">
                                    <span className="font-medium truncate">{c.equip?.nom || "Desconegut"}</span>
                                    {c.esElMeuEquip && (
                                        <Badge variant="secondary" className="text-xs">Tu</Badge>
                                    )}
                                </div>
                                <div className="col-span-1 text-center font-medium">{c.partitsJugats}</div>
                                <div className="col-span-1 text-center text-green-600 dark:text-green-400 font-medium">{c.partitsGuanyats}</div>
                                <div className="col-span-1 text-center text-red-600 dark:text-red-400 font-medium">{c.partitsPerduts}</div>
                                <div className="col-span-2 text-center text-sm">
                                    <span className="text-green-600 dark:text-green-400">{c.setsGuanyats}</span>
                                    <span className="text-muted-foreground mx-1">-</span>
                                    <span className="text-red-600 dark:text-red-400">{c.setsPerduts}</span>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="text-xl font-bold">{c.punts}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data.classificacio.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No hi ha dades de classificació
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ClassificacioLliga;
