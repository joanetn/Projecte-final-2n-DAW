import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

interface ClassificacioTabProps {
    classificacio: UseQueryResult<any, unknown>;
}

export function ClassificacioTab({ classificacio }: ClassificacioTabProps) {
    if (classificacio.isLoading) {
        return (
            <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    Carregant classificació...
                </span>
            </div>
        );
    }

    if (classificacio.isError) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant la classificació
                </CardContent>
            </Card>
        );
    }

    if (classificacio.data) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            Classificació - {classificacio.data.lliga?.nom}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">#</th>
                                        <th className="text-left p-2">Equip</th>
                                        <th className="text-center p-2">PJ</th>
                                        <th className="text-center p-2">PG</th>
                                        <th className="text-center p-2">PP</th>
                                        <th className="text-center p-2">Punts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classificacio.data.classificacio?.map((equip: any, index: any) => (
                                        <tr
                                            key={equip.equipId}
                                            className={`border-b hover:bg-muted/50 ${
                                                index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-orange-50' : ''
                                            }`}
                                        >
                                            <td className="p-2 font-bold">
                                                {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />}
                                                {index + 1}
                                            </td>
                                            <td className="p-2">
                                                {equip.nom}
                                            </td>
                                            <td className="text-center p-2">
                                                {equip.partitsJugats}
                                            </td>
                                            <td className="text-center p-2 text-green-600 font-semibold">
                                                {equip.victories}
                                            </td>
                                            <td className="text-center p-2 text-red-600 font-semibold">
                                                {equip.derrotes}
                                            </td>
                                            <td className="text-center p-2 font-bold text-lg">
                                                {equip.punts}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
