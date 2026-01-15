import { usePlantilla } from "@/queries/entrenador.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, History, CalendarDays } from "lucide-react";

const DashboardEntrenador = () => {
    const { data, isLoading, isError } = usePlantilla();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">
                    Dashboard Entrenador
                </h2>
            </div>

            <Tabs defaultValue="plantilla" className="w-full">
                {/* Menu */}
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="plantilla">Plantilla</TabsTrigger>
                    <TabsTrigger value="jugats">Partits jugats</TabsTrigger>
                    <TabsTrigger value="futurs">Partits futurs</TabsTrigger>
                </TabsList>

                {/* ───────────── Plantilla ───────────── */}
                <TabsContent value="plantilla">
                    {isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                            <span className="ml-2 text-gray-600">
                                Carregant plantilla...
                            </span>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center text-red-600">
                            Error carregant la plantilla
                        </div>
                    )}

                    {!isLoading && data && data.length === 0 && (
                        <div className="text-center text-gray-500">
                            No hi ha jugadors a la plantilla
                        </div>
                    )}

                    {!isLoading && data && data.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.map((usuari) => (
                                <Card
                                    key={usuari.id}
                                    className="hover:shadow-md transition"
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">
                                            {usuari.nom}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">
                                            {usuari.email}
                                        </p>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {usuari.rols.map((rol) => (
                                                <Badge
                                                    key={rol}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {rol}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* ───────────── Partits jugats ───────────── */}
                <TabsContent value="jugats">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <History className="h-5 w-5 text-gray-600" />
                            <CardTitle>Partits jugats</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-600 space-y-2">
                            <p>
                                En aquest apartat podràs consultar tots els
                                partits ja disputats per l’equip.
                            </p>
                            <p>
                                Es mostraran resultats, data del partit,
                                rivals i estadístiques bàsiques.
                            </p>
                            <p className="text-sm italic">
                                (Funcionalitat pendent d’implementar)
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ───────────── Partits futurs ───────────── */}
                <TabsContent value="futurs">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-gray-600" />
                            <CardTitle>Partits futurs</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-600 space-y-2">
                            <p>
                                Ací podràs veure els pròxims partits programats
                                de l’equip.
                            </p>
                            <p>
                                Inclourà dates, horaris, rivals i seu del
                                partit.
                            </p>
                            <p className="text-sm italic">
                                (Encara no disponible)
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardEntrenador;
