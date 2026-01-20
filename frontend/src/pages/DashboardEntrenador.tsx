import { usePartitsJugats, usePartitsPendents, usePlantilla } from "@/queries/entrenador.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantillaCard from "@/components/plantilla/PlantillaCard";
import PartitCard from "@/components/partits/PartitCard";
import ClassificacioLliga from "@/components/entrenador/ClassificacioLliga";
import CalendariPartits from "@/components/entrenador/CalendariPartits";
import EstadistiquesJugadors from "@/components/entrenador/EstadistiquesJugadors";
import HistorialPropostes from "@/components/entrenador/HistorialPropostes";
import { Loader2, Users, Trophy, Calendar, BarChart3, FileText } from "lucide-react";

const DashboardEntrenador = () => {
    const plantilla = usePlantilla();
    const partitsJugats = usePartitsJugats();
    const partitsPendents = usePartitsPendents();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                    Dashboard Entrenador
                </h2>
            </div>

            <Tabs defaultValue="plantilla" className="w-full">
                {/* Menu */}
                <TabsList className="grid w-full grid-cols-7 mb-6">
                    <TabsTrigger value="plantilla" className="flex items-center gap-1">
                        <Users className="w-4 h-4 hidden sm:inline" />
                        <span>Plantilla</span>
                    </TabsTrigger>
                    <TabsTrigger value="jugats" className="flex items-center gap-1">
                        <span>Jugats</span>
                    </TabsTrigger>
                    <TabsTrigger value="futurs" className="flex items-center gap-1">
                        <span>Futurs</span>
                    </TabsTrigger>
                    <TabsTrigger value="classificacio" className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 hidden sm:inline" />
                        <span>Classificació</span>
                    </TabsTrigger>
                    <TabsTrigger value="calendari" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 hidden sm:inline" />
                        <span>Calendari</span>
                    </TabsTrigger>
                    <TabsTrigger value="estadistiques" className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 hidden sm:inline" />
                        <span>Stats</span>
                    </TabsTrigger>
                    <TabsTrigger value="propostes" className="flex items-center gap-1">
                        <FileText className="w-4 h-4 hidden sm:inline" />
                        <span>Propostes</span>
                    </TabsTrigger>
                </TabsList>

                {/* ════════════ Plantilla ════════════ */}
                <TabsContent value="plantilla">
                    {plantilla.isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                                Carregant plantilla...
                            </span>
                        </div>
                    )}

                    {plantilla.isError && (
                        <div className="text-center text-red-600">
                            Error carregant la plantilla
                        </div>
                    )}

                    {!plantilla.isLoading && plantilla.data && plantilla.data.total === 0 && (
                        <div className="text-center text-muted-foreground">
                            No hi ha jugadors a la plantilla
                        </div>
                    )}

                    {!plantilla.isLoading && plantilla.data && plantilla.data.total > 0 && (
                        <div className="space-y-8">
                            {/* Info del equipo */}
                            {plantilla.data.equip && (
                                <Card className="bg-primary/10 border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            {plantilla.data.equip.nom}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Categoria: {plantilla.data.equip.categoria}
                                        </p>
                                    </CardHeader>
                                </Card>
                            )}

                            {/* Entrenadores */}
                            {plantilla.data.plantilla.entrenadors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                                        Entrenadors ({plantilla.data.plantilla.entrenadors.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {plantilla.data.plantilla.entrenadors.map((usuari) => (
                                            <PlantillaCard key={usuari.id} usuari={usuari} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Jugadores */}
                            {plantilla.data.plantilla.jugadors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                                        Jugadors ({plantilla.data.plantilla.jugadors.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {plantilla.data.plantilla.jugadors.map((usuari) => (
                                            <PlantillaCard key={usuari.id} usuari={usuari} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Administradores */}
                            {plantilla.data.plantilla.administradors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                                        Administradors ({plantilla.data.plantilla.administradors.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {plantilla.data.plantilla.administradors.map((usuari) => (
                                            <PlantillaCard key={usuari.id} usuari={usuari} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* ════════════ Partits jugats ════════════ */}
                <TabsContent value="jugats">
                    {partitsJugats.isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                                Carregant partits...
                            </span>
                        </div>
                    )}

                    {partitsJugats.isError && (
                        <Card>
                            <CardContent className="pt-6 text-center text-red-600">
                                Error carregant els partits jugats
                            </CardContent>
                        </Card>
                    )}

                    {!partitsJugats.isLoading && partitsJugats.data && partitsJugats.data.total === 0 && (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                No hi ha partits jugats encara
                            </CardContent>
                        </Card>
                    )}

                    {!partitsJugats.isLoading && partitsJugats.data && partitsJugats.data.total > 0 && (
                        <div className="space-y-4">
                            {partitsJugats.data.partits.map((partit) => (
                                <PartitCard key={partit.id} partit={partit} showSets />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* ════════════ Partits futurs ════════════ */}
                <TabsContent value="futurs">
                    {partitsPendents.isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                                Carregant partits...
                            </span>
                        </div>
                    )}

                    {partitsPendents.isError && (
                        <Card>
                            <CardContent className="pt-6 text-center text-red-600">
                                Error carregant els partits pendents
                            </CardContent>
                        </Card>
                    )}

                    {!partitsPendents.isLoading && partitsPendents.data && partitsPendents.data.total === 0 && (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                No hi ha partits pendents
                            </CardContent>
                        </Card>
                    )}

                    {!partitsPendents.isLoading && partitsPendents.data && partitsPendents.data.total > 0 && (
                        <div className="space-y-4">
                            {partitsPendents.data.partits.map((partit) => (
                                <PartitCard key={partit.id} partit={partit} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* ════════════ Classificació ════════════ */}
                <TabsContent value="classificacio">
                    <ClassificacioLliga />
                </TabsContent>

                {/* ════════════ Calendari ════════════ */}
                <TabsContent value="calendari">
                    <CalendariPartits />
                </TabsContent>

                {/* ════════════ Estadístiques ════════════ */}
                <TabsContent value="estadistiques">
                    <EstadistiquesJugadors />
                </TabsContent>

                {/* ════════════ Historial Propostes ════════════ */}
                <TabsContent value="propostes">
                    <HistorialPropostes />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardEntrenador;