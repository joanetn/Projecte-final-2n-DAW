import { useEstadistiques } from "@/queries/entrenador.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, TrendingUp, TrendingDown, User } from "lucide-react";
import { EstadisticaJugador } from "@/types/entrenador";
const EstadistiquesJugadors = () => {
    const { data, isLoading, isError } = useEstadistiques();
    const getWinRateColor = (winRate: number) => {
        if (winRate >= 70) return "text-green-600 dark:text-green-400";
        if (winRate >= 50) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };
    const getWinRateBg = (winRate: number) => {
        if (winRate >= 70) return "bg-green-500";
        if (winRate >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };
    const renderJugadorCard = (jugador: EstadisticaJugador, index: number) => {
        return (
            <Card key={jugador.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        {}
                        <div className="relative">
                            {jugador.avatar ? (
                                <img
                                    src={jugador.avatar}
                                    alt={jugador.nom}
                                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                            <Badge
                                className="absolute -bottom-1 -right-1 w-6 h-6 p-0 flex items-center justify-center text-xs"
                                variant={index < 3 ? "default" : "secondary"}
                            >
                                {index + 1}
                            </Badge>
                        </div>
                        {}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{jugador.nom}</h3>
                            {jugador.nivell && (
                                <Badge variant="outline" className="text-xs mt-1">
                                    {jugador.nivell}
                                </Badge>
                            )}
                        </div>
                        {}
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${getWinRateColor(jugador.winRate)}`}>
                                {jugador.winRate}%
                            </div>
                            <span className="text-xs text-muted-foreground">Win Rate</span>
                        </div>
                    </div>
                    {}
                    <div className="mt-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getWinRateBg(jugador.winRate)} transition-all duration-500`}
                                style={{ width: `${jugador.winRate}%` }}
                            />
                        </div>
                    </div>
                    {}
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-xl font-bold">{jugador.partitsJugats}</div>
                            <div className="text-xs text-muted-foreground">Partits</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {jugador.partitsGuanyats}
                            </div>
                            <div className="text-xs text-muted-foreground">Guanyats</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                                <TrendingDown className="w-4 h-4" />
                                {jugador.partitsPerduts}
                            </div>
                            <div className="text-xs text-muted-foreground">Perduts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-medium">
                                <span className="text-green-600 dark:text-green-400">{jugador.setsGuanyats}</span>
                                <span className="text-muted-foreground">/</span>
                                <span className="text-red-600 dark:text-red-400">{jugador.setsPerduts}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Sets</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Carregant estadístiques...</span>
            </div>
        );
    }
    if (isError || !data) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant les estadístiques
                </CardContent>
            </Card>
        );
    }
    const totalPartits = data.estadistiques.reduce((acc, j) => acc + j.partitsJugats, 0);
    const totalGuanyats = data.estadistiques.reduce((acc, j) => acc + j.partitsGuanyats, 0);
    const totalPerduts = data.estadistiques.reduce((acc, j) => acc + j.partitsPerduts, 0);
    const avgWinRate = data.estadistiques.length > 0
        ? Math.round(data.estadistiques.reduce((acc, j) => acc + j.winRate, 0) / data.estadistiques.length)
        : 0;
    return (
        <div className="space-y-6">
            {}
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-primary" />
                        <div>
                            <CardTitle className="text-xl">Estadístiques dels Jugadors</CardTitle>
                            <p className="text-sm text-muted-foreground">{data.total} jugadors a la plantilla</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                            <div className="text-3xl font-bold text-primary">{totalPartits}</div>
                            <div className="text-sm text-muted-foreground">Partits totals</div>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalGuanyats}</div>
                            <div className="text-sm text-muted-foreground">Victòries</div>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{totalPerduts}</div>
                            <div className="text-sm text-muted-foreground">Derrotes</div>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                            <div className={`text-3xl font-bold ${getWinRateColor(avgWinRate)}`}>{avgWinRate}%</div>
                            <div className="text-sm text-muted-foreground">Win Rate mitjà</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {}
            {data.estadistiques.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.estadistiques.map((jugador, index) => renderJugadorCard(jugador, index))}
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No hi ha estadístiques disponibles</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
export default EstadistiquesJugadors;
