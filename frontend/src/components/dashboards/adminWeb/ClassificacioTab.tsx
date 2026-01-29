import { useClassificacions } from "@/queries/adminWeb.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClassificacioTab() {
    const { data, isLoading, isError } = useClassificacions();
    const classificacions = data?.classificacions || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 py-8">
                Error carregant les classificacions
            </div>
        );
    }

    if (classificacions.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                No hi ha classificacions disponibles
            </div>
        );
    }

    return (
        <Tabs defaultValue={classificacions[0]?.lligaId} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(classificacions.length, 4)}, 1fr)` }}>
                {classificacions.map((lliga) => (
                    <TabsTrigger key={lliga.lligaId} value={lliga.lligaId}>
                        <span className="hidden sm:inline">{lliga.lligaNom}</span>
                        <span className="sm:hidden">{lliga.lligaNom.slice(0, 10)}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {classificacions.map((lliga) => (
                <TabsContent key={lliga.lligaId} value={lliga.lligaId} className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-primary/20">
                                    <th className="text-left py-3 px-2 font-semibold">Posició</th>
                                    <th className="text-left py-3 px-2 font-semibold">Equip</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">PJ</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">V</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">E</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">D</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">SF</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">SC</th>
                                    <th className="text-center py-3 px-2 font-semibold text-xs">+/-</th>
                                    <th className="text-center py-3 px-2 font-semibold">Punts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lliga.classificacio.map((equip, index) => (
                                    <tr
                                        key={equip.equipId}
                                        className={`border-b transition-colors ${
                                            index === 0
                                                ? "bg-yellow-50 hover:bg-yellow-100"
                                                : index === 1
                                                ? "bg-gray-50 hover:bg-gray-100"
                                                : index === 2
                                                ? "bg-orange-50 hover:bg-orange-100"
                                                : "hover:bg-muted/50"
                                        }`}
                                    >
                                        <td className="py-3 px-2 font-bold text-center w-12">
                                            {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />}
                                            {index + 1}
                                        </td>
                                        <td className="py-3 px-2 font-medium truncate">{equip.equipNom}</td>
                                        <td className="text-center py-3 px-2">{equip.partitsJugats}</td>
                                        <td className="text-center py-3 px-2 text-green-600 font-semibold">{equip.victories}</td>
                                        <td className="text-center py-3 px-2 text-blue-600 font-semibold">{equip.empats}</td>
                                        <td className="text-center py-3 px-2 text-red-600 font-semibold">{equip.derrotes}</td>
                                        <td className="text-center py-3 px-2">{equip.setsAFavor}</td>
                                        <td className="text-center py-3 px-2">{equip.setsEnContra}</td>
                                        <td className="text-center py-3 px-2">
                                            <span className={equip.diferenciaSets >= 0 ? "text-green-600" : "text-red-600"}>
                                                {equip.diferenciaSets > 0 ? "+" : ""}{equip.diferenciaSets}
                                            </span>
                                        </td>
                                        <td className="text-center py-3 px-2 font-bold text-lg text-primary">
                                            {equip.punts}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Equips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{lliga.classificacio.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Partits Totals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(
                                        lliga.classificacio.reduce((sum, eq) => sum + eq.partitsJugats, 0) / (lliga.classificacio.length || 1)
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Sets Totals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {lliga.classificacio.reduce((sum, eq) => sum + eq.setsAFavor + eq.setsEnContra, 0)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Punts Totals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{lliga.classificacio.reduce((sum, eq) => sum + eq.punts, 0)}</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
