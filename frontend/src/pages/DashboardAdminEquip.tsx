import {
    usePlantillaAdminEquip,
    useClassificacioAdminEquip,
    useCalendariAdminEquip,
    useEstadistiquesAdminEquip
} from "@/queries/adminEquip.queries";
import { useCanviarRolMembre, useDonarBaixaMembre } from "@/mutations/adminEquip.mutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, Calendar, BarChart3, Settings, UserPlus } from "lucide-react";
import { useValidarJugadorsAlineacio } from "@/queries/seguro.queries";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PlantillaTab } from "@/components/dashboards/adminEquip/PlantillaTab";
import { ClassificacioTab } from "@/components/dashboards/adminEquip/ClassificacioTab";
import { CalendariTab } from "@/components/dashboards/adminEquip/CalendariTab";
import { EstadistiquesTab } from "@/components/dashboards/adminEquip/EstadistiquesTab";
import FitxarTab from "@/components/adminEquip/FitxarTab";
const DashboardAdminEquip = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const plantilla = usePlantillaAdminEquip();
    const classificacio = useClassificacioAdminEquip();
    const calendari = useCalendariAdminEquip();
    const estadistiques = useEstadistiquesAdminEquip();
    const canviarRolMutation = useCanviarRolMembre();
    const donarBaixaMutation = useDonarBaixaMembre();
    const jugadorIds = useMemo(() => {
        if (!plantilla.data) return [];
        return plantilla.data.plantilla.jugadors.map(j => j.id);
    }, [plantilla.data]);
    const { data: validacioSeguros } = useValidarJugadorsAlineacio(jugadorIds);
    const segurosMap = useMemo(() => {
        const map: Record<string, boolean> = {};
        if (validacioSeguros?.jugadors) {
            validacioSeguros.jugadors.forEach(j => {
                map[j.jugadorId] = j.teSeguro;
            });
        }
        return map;
    }, [validacioSeguros]);
    const jugadorsSenseSeguro = useMemo(() => {
        if (!plantilla.data) return 0;
        return plantilla.data.plantilla.jugadors.filter(j => segurosMap[j.id] === false).length;
    }, [plantilla.data, segurosMap]);
    const handleCanviarRol = (membreId: string, rols: string[]) => {
        const nouRol = rols.join(',');
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
            {}
            <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                    Dashboard Administrador d'Equip
                </h2>
            </div>
            <Tabs defaultValue="plantilla" className="w-full">
                {}
                <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="plantilla" className="flex items-center gap-1">
                        <Users className="w-4 h-4 hidden sm:inline" />
                        <span>Plantilla</span>
                    </TabsTrigger>
                    <TabsTrigger value="invitacions" className="flex items-center gap-1">
                        <UserPlus className="w-4 h-4 hidden sm:inline" />
                        <span>Fitxar</span>
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
                {}
                <TabsContent value="plantilla">
                    <PlantillaTab
                        plantilla={plantilla}
                        jugadorsSenseSeguro={jugadorsSenseSeguro}
                        segurosMap={segurosMap}
                        user={user}
                        onCanviarRol={handleCanviarRol}
                        onDonarBaixa={handleDonarBaixa}
                    />
                </TabsContent>
                {}
                <TabsContent value="invitacions">
                    <FitxarTab />
                </TabsContent>
                {}
                <TabsContent value="classificacio">
                    <ClassificacioTab classificacio={classificacio} />
                </TabsContent>
                {}
                <TabsContent value="calendari">
                    <CalendariTab calendari={calendari} />
                </TabsContent>
                {}
                <TabsContent value="estadistiques">
                    <EstadistiquesTab estadistiques={estadistiques} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default DashboardAdminEquip;
