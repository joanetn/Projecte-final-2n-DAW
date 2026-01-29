import {
    usePlantillaAdminEquip,
    useClassificacioAdminEquip,
    useCalendariAdminEquip,
    useEstadistiquesAdminEquip
} from "@/queries/adminEquip.queries";
import { useCanviarRolMembre, useDonarBaixaMembre } from "@/mutations/adminEquip.mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantillaCardAdmin from "@/components/plantilla/PlantillaCardAdmin";
import { Loader2, Users, Trophy, Calendar, BarChart3, ShieldAlert, Settings } from "lucide-react";
import { useValidarJugadorsAlineacio } from "@/queries/seguro.queries";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

const DashboardAdminEquip = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const plantilla = usePlantillaAdminEquip();
    const classificacio = useClassificacioAdminEquip();
    const calendari = useCalendariAdminEquip();
    const estadistiques = useEstadistiquesAdminEquip();

    const canviarRolMutation = useCanviarRolMembre();
    const donarBaixaMutation = useDonarBaixaMembre();

    // Obtenir IDs de tots els jugadors per validar seguros
    const jugadorIds = useMemo(() => {
        if (!plantilla.data) return [];
        return plantilla.data.plantilla.jugadors.map(j => j.id);
    }, [plantilla.data]);

    const { data: validacioSeguros } = useValidarJugadorsAlineacio(jugadorIds);

    // Mapa de jugador -> teSeguro
    const segurosMap = useMemo(() => {
        const map: Record<string, boolean> = {};
        if (validacioSeguros?.jugadors) {
            validacioSeguros.jugadors.forEach(j => {
                map[j.jugadorId] = j.teSeguro;
            });
        }
        return map;
    }, [validacioSeguros]);

    // Comptar jugadors sense segur
    const jugadorsSenseSeguro = useMemo(() => {
        if (!plantilla.data) return 0;
        return plantilla.data.plantilla.jugadors.filter(j => segurosMap[j.id] === false).length;
    }, [plantilla.data, segurosMap]);

    const handleCanviarRol = (membreId: string, rols: string[]) => {
        // Enviem el primer rol com a principal (el backend espera un sol rol per ara)
        // Però guardem tots els rols seleccionats
        const nouRol = rols.join(','); // Enviem tots separats per comes
        canviarRolMutation.mutate(
            { membreId, nouRol },
            {
                onSuccess: () => {
                    showToast({ type: 'success', title: 'Rols actualitzats', description: "S'han actualitzat els rols correctament." });
                    plantilla.refetch();
                },
                onError: (error: any) => {
                    showToast({ type: 'error', title: 'Error', description: error.response?.data?.error || "Error canviant els rols" });
                }
            }
        );
    };

    const handleDonarBaixa = (membreId: string) => {
        donarBaixaMutation.mutate({ membreId }, {
            onSuccess: () => {
                showToast({ type: 'success', title: 'Baixa completada', description: "S'ha donat de baixa el membre correctament." });
                plantilla.refetch();
            },
            onError: (error: any) => {
                showToast({ type: 'error', title: 'Error', description: error.response?.data?.error || "Error donant de baixa" });
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                    Dashboard Administrador d'Equip
                </h2>
            </div>

            <Tabs defaultValue="plantilla" className="w-full">
                {/* Menu - sin tab de "Futurs" porque no puede alinear */}
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="plantilla" className="flex items-center gap-1">
                        <Users className="w-4 h-4 hidden sm:inline" />
                        <span>Plantilla</span>
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

                            {/* Avís per gestionar membres */}
                            <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800">
                                <CardContent className="pt-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">💡</span>
                                        <div>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                                Eines d'administració
                                            </p>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                Utilitza el menú (⋮) de cada targeta per gestionar els membres:
                                                pots canviar els seus rols o donar-los de baixa de l'equip.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Entrenadores */}
                            {plantilla.data.plantilla.entrenadors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                                        Entrenadors ({plantilla.data.plantilla.entrenadors.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {plantilla.data.plantilla.entrenadors.map((usuari) => (
                                            <PlantillaCardAdmin
                                                key={usuari.id}
                                                usuari={usuari}
                                                onCanviarRol={handleCanviarRol}
                                                onDonarBaixa={handleDonarBaixa}
                                                isCurrentUser={String(user?.id) === String(usuari.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Jugadores */}
                            {plantilla.data.plantilla.jugadors.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Jugadors ({plantilla.data.plantilla.jugadors.length})
                                        </h3>
                                        {jugadorsSenseSeguro > 0 && (
                                            <div className="flex items-center gap-1 text-sm text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                                                <ShieldAlert className="h-4 w-4" />
                                                {jugadorsSenseSeguro} sense segur
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {plantilla.data.plantilla.jugadors.map((usuari) => (
                                            <PlantillaCardAdmin
                                                key={usuari.id}
                                                usuari={usuari}
                                                teSeguro={segurosMap[usuari.id]}
                                                onCanviarRol={handleCanviarRol}
                                                onDonarBaixa={handleDonarBaixa}
                                                isCurrentUser={String(user?.id) === String(usuari.id)}
                                            />
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
                                            <PlantillaCardAdmin
                                                key={usuari.id}
                                                usuari={usuari}
                                                onCanviarRol={handleCanviarRol}
                                                onDonarBaixa={handleDonarBaixa}
                                                isCurrentUser={String(user?.id) === String(usuari.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* ════════════ Classificació ════════════ */}
                <TabsContent value="classificacio">
                    {classificacio.isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                                Carregant classificació...
                            </span>
                        </div>
                    )}

                    {classificacio.isError && (
                        <Card>
                            <CardContent className="pt-6 text-center text-red-600">
                                Error carregant la classificació
                            </CardContent>
                        </Card>
                    )}

                    {classificacio.data && (
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
                                                {classificacio.data.classificacio?.map((equip, index) => (
                                                    <tr
                                                        key={equip.equipId}
                                                        className={`border-b hover:bg-muted/50 ${equip.esElMeuEquip ? 'bg-primary/10 font-semibold' : ''
                                                            }`}
                                                    >
                                                        <td className="p-2">{index + 1}</td>
                                                        <td className="p-2">
                                                            {equip.equipNom}
                                                            {equip.esElMeuEquip && (
                                                                <span className="ml-2 text-xs text-primary">(Tu)</span>
                                                            )}
                                                        </td>
                                                        <td className="text-center p-2">{equip.partitsJugats}</td>
                                                        <td className="text-center p-2 text-green-600">{equip.partitsGuanyats}</td>
                                                        <td className="text-center p-2 text-red-600">{equip.partitsPerduts}</td>
                                                        <td className="text-center p-2 font-bold">{equip.punts}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* ════════════ Calendari ════════════ */}
                <TabsContent value="calendari">
                    {calendari.isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                                Carregant calendari...
                            </span>
                        </div>
                    )}

                    {calendari.isError && (
                        <Card>
                            <CardContent className="pt-6 text-center text-red-600">
                                Error carregant el calendari
                            </CardContent>
                        </Card>
                    )}

                    {calendari.data && (
                        <div className="space-y-4">
                            {calendari.data.partits?.length === 0 && (
                                <Card>
                                    <CardContent className="pt-6 text-center text-muted-foreground">
                                        No hi ha partits programats
                                    </CardContent>
                                </Card>
                            )}

                            {calendari.data.partits?.map((partit) => (
                                <Card key={partit.id} className={`${partit.esElMeuEquip ? 'border-primary' : ''
                                    }`}>
                                    <CardContent className="pt-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className={`font-medium ${partit.equipLocalId === calendari.data?.equipId
                                                    ? 'text-primary' : ''
                                                    }`}>
                                                    {partit.equipLocalNom}
                                                </p>
                                            </div>
                                            <div className="px-4 text-center">
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(partit.data).toLocaleDateString('ca-ES', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </p>
                                                <p className="font-bold text-lg">VS</p>
                                                {partit.hora && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {partit.hora}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className={`font-medium ${partit.equipVisitantId === calendari.data?.equipId
                                                    ? 'text-primary' : ''
                                                    }`}>
                                                    {partit.equipVisitantNom}
                                                </p>
                                            </div>
                                        </div>
                                        {partit.ubicacio && (
                                            <p className="text-xs text-muted-foreground text-center mt-2">
                                                📍 {partit.ubicacio}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* ════════════ Estadístiques ════════════ */}
                <TabsContent value="estadistiques">
                    {estadistiques.isLoading && (
                        <div className="flex items-center justify-center h-[40vh]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                                Carregant estadístiques...
                            </span>
                        </div>
                    )}

                    {estadistiques.isError && (
                        <Card>
                            <CardContent className="pt-6 text-center text-red-600">
                                Error carregant les estadístiques
                            </CardContent>
                        </Card>
                    )}

                    {estadistiques.data && (
                        <div className="space-y-6">
                            {/* Estadístiques generals */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="pt-4 text-center">
                                        <p className="text-3xl font-bold text-primary">
                                            {estadistiques.data.partitsJugats || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Partits Jugats</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-4 text-center">
                                        <p className="text-3xl font-bold text-green-600">
                                            {estadistiques.data.partitsGuanyats || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Victòries</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-4 text-center">
                                        <p className="text-3xl font-bold text-red-600">
                                            {estadistiques.data.partitsPerduts || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Derrotes</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-4 text-center">
                                        <p className="text-3xl font-bold">
                                            {estadistiques.data.setsAFavor || 0} - {estadistiques.data.setsEnContra || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Sets (F/C)</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Estadístiques per jugador */}
                            {estadistiques.data.jugadors && estadistiques.data.jugadors.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Estadístiques per Jugador</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-2">Jugador</th>
                                                        <th className="text-center p-2">PJ</th>
                                                        <th className="text-center p-2">PG</th>
                                                        <th className="text-center p-2">PP</th>
                                                        <th className="text-center p-2">% Victòries</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {estadistiques.data.jugadors.map((jugador) => (
                                                        <tr key={jugador.id} className="border-b hover:bg-muted/50">
                                                            <td className="p-2">{jugador.nom}</td>
                                                            <td className="text-center p-2">{jugador.partitsJugats}</td>
                                                            <td className="text-center p-2 text-green-600">{jugador.partitsGuanyats}</td>
                                                            <td className="text-center p-2 text-red-600">{jugador.partitsPerduts}</td>
                                                            <td className="text-center p-2">
                                                                {jugador.partitsJugats > 0
                                                                    ? Math.round((jugador.partitsGuanyats / jugador.partitsJugats) * 100)
                                                                    : 0
                                                                }%
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardAdminEquip;
