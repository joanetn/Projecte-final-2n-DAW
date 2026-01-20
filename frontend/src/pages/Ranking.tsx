import { useGetRankingGlobal } from "@/queries/ranking.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, User, TrendingUp, Loader2 } from "lucide-react";

const Ranking = () => {
    const { data: rankingData, isLoading, isError } = useGetRankingGlobal();


    const getRankBadgeStyle = (position: number) => {
        switch (position) {
            case 1:
                return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-500";
            case 2:
                return "bg-gradient-to-r from-gray-300 to-gray-500 text-white border-gray-400";
            case 3:
                return "bg-gradient-to-r from-amber-500 to-amber-700 text-white border-amber-600";
            default:
                return "";
        }
    };

    const getRowStyle = (position: number) => {
        switch (position) {
            case 1:
                return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800";
            case 2:
                return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20 border-gray-200 dark:border-gray-700";
            case 3:
                return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800";
            default:
                return "bg-card hover:bg-muted/50 border-border";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregant el ranking...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-3 rounded-full bg-destructive/10">
                                <TrendingUp className="w-8 h-8 text-destructive" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Error carregant el ranking</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    No s'ha pogut obtenir les dades. Torna-ho a provar més tard.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center gap-3 mb-4">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                        Ranking Global
                    </h1>
                    <Trophy className="w-10 h-10 text-yellow-500" />
                </div>
                <p className="text-muted-foreground">
                    Classificació dels millors jugadors de la temporada
                </p>
            </div>

            {/* Lista completa del ranking */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Classificació Completa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {rankingData && rankingData.length > 0 ? (
                        <div className="space-y-2">
                            {rankingData.map((jugador, index) => {
                                const position = index + 1;
                                return (
                                    <div
                                        key={jugador.jugadorId}
                                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${getRowStyle(position)}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${position <= 3 ? getRankBadgeStyle(position) : 'bg-muted'}`}>
                                                <img src={jugador.avatar} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-lg">{jugador.nom}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Jugador #{jugador.jugadorId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{jugador.punts}</p>
                                            <p className="text-xs text-muted-foreground">punts</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <User className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground">No hi ha dades del ranking</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Encara no hi ha jugadors al ranking
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Ranking;