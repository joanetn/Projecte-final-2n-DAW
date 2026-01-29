import { useCalendari } from "@/queries/entrenador.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2, ChevronRight, Home, Plane } from "lucide-react";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import { PartitCalendari } from "@/types/entrenador";
const CalendariPartits = () => {
    const { data, isLoading, isError } = useCalendari();
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETAT":
                return <Badge variant="default" className="bg-green-600">Completat</Badge>;
            case "PENDENT":
                return <Badge variant="secondary">Pendent</Badge>;
            case "EN_JOC":
                return <Badge variant="default" className="bg-blue-600 animate-pulse">En joc</Badge>;
            case "CANCEL·LAT":
                return <Badge variant="destructive">Cancel·lat</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };
    const renderPartit = (partit: PartitCalendari) => {
        const dataFormatejada = format(new Date(partit.dataHora), "EEEE d MMM - HH:mm", { locale: ca });
        return (
            <div
                key={partit.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${partit.esLocal
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                    }`}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="capitalize">{dataFormatejada}</span>
                    </div>
                    {getStatusBadge(partit.status)}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={`flex items-center gap-2 flex-1 ${partit.esLocal ? 'font-bold' : ''}`}>
                            {partit.esLocal && <Home className="w-4 h-4 text-blue-600" />}
                            <span className="truncate">{partit.local?.nom || "TBD"}</span>
                        </div>
                        <div className="px-4 py-1 bg-muted rounded-lg text-center min-w-[80px]">
                            {partit.status === "COMPLETAT" && partit.resultatLocal !== undefined ? (
                                <span className="font-bold text-lg">
                                    {partit.resultatLocal} - {partit.resultatVisitant}
                                </span>
                            ) : (
                                <span className="text-muted-foreground font-medium">VS</span>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 flex-1 justify-end ${!partit.esLocal ? 'font-bold' : ''}`}>
                            <span className="truncate">{partit.visitant?.nom || "TBD"}</span>
                            {!partit.esLocal && <Plane className="w-4 h-4 text-orange-600" />}
                        </div>
                    </div>
                </div>
                {partit.pista && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{partit.pista.nom}</span>
                    </div>
                )}
            </div>
        );
    };
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Carregant calendari...</span>
            </div>
        );
    }
    if (isError || !data) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant el calendari
                </CardContent>
            </Card>
        );
    }
    return (
        <div className="space-y-6">
            {data.lliga && (
                <Card className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 border-primary/20">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-primary" />
                                <div>
                                    <CardTitle className="text-xl">Calendari de Partits</CardTitle>
                                    <p className="text-sm text-muted-foreground">{data.lliga.nom}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                {data.totalPartits} partits
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>
            )}
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-800"></div>
                    <Home className="w-4 h-4 text-blue-600" />
                    <span>Local</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-200 dark:bg-orange-800"></div>
                    <Plane className="w-4 h-4 text-orange-600" />
                    <span>Visitant</span>
                </div>
            </div>
            {data.calendari.map((jornada) => (
                <Card key={jornada.jornada.id}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ChevronRight className="w-5 h-5 text-primary" />
                                {jornada.jornada.nom}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {format(new Date(jornada.jornada.data), "d MMMM yyyy", { locale: ca })}
                                </span>
                                {getStatusBadge(jornada.jornada.status)}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {jornada.partits.length > 0 ? (
                            <div className="space-y-3">
                                {jornada.partits.map(renderPartit)}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                No tens partits en aquesta jornada
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
            {data.partitsSenseJornada.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            Partits sense jornada assignada
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.partitsSenseJornada.map(renderPartit)}
                        </div>
                    </CardContent>
                </Card>
            )}
            {data.calendari.length === 0 && data.partitsSenseJornada.length === 0 && (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No hi ha partits programats</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
export default CalendariPartits;
