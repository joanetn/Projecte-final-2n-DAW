import { usePartitsPendents, usePlantilla } from "@/queries/entrenador.queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassificacioLliga from "@/components/entrenador/ClassificacioLliga";
import CalendariPartits from "@/components/entrenador/CalendariPartits";
import EstadistiquesJugadors from "@/components/entrenador/EstadistiquesJugadors";
import HistorialPropostes from "@/components/entrenador/HistorialPropostes";
import { Users, Trophy, Calendar, BarChart3, FileText } from "lucide-react";
import Invitacions from "@/components/entrenador/Invitacions";
import { useValidarJugadorsAlineacio } from "@/queries/seguro.queries";
import { useMemo } from "react";
import { PlantillaTab } from "@/components/dashboards/entrenador/PlantillaTab";
import { FutursTab } from "@/components/dashboards/entrenador/FutursTab";
const DashboardEntrenador = () => {
    const plantilla = usePlantilla();
    const partitsPendents = usePartitsPendents();
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
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {}
            <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                    Dashboard Entrenador
                </h2>
            </div>
            <Tabs defaultValue="plantilla" className="w-full">
                {}
                <TabsList className="grid w-full grid-cols-7 mb-6">
                    <TabsTrigger value="plantilla" className="flex items-center gap-1">
                        <Users className="w-4 h-4 hidden sm:inline" />
                        <span>Plantilla</span>
                    </TabsTrigger>
                    {
}
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
                    <TabsTrigger value="invitacions" className="flex items-center gap-1">
                        <FileText className="w-4 h-4 hidden sm:inline" />
                        <span>Invitacions</span>
                    </TabsTrigger>
                </TabsList>
                {}
                <TabsContent value="plantilla">
                    <PlantillaTab
                        plantilla={plantilla}
                        jugadorsSenseSeguro={jugadorsSenseSeguro}
                        segurosMap={segurosMap}
                    />
                </TabsContent>
                {}
                {}
                <TabsContent value="futurs">
                    <FutursTab partitsPendents={partitsPendents} />
                </TabsContent>
                {}
                <TabsContent value="classificacio">
                    <ClassificacioLliga />
                </TabsContent>
                {}
                <TabsContent value="calendari">
                    <CalendariPartits />
                </TabsContent>
                {}
                <TabsContent value="estadistiques">
                    <EstadistiquesJugadors />
                </TabsContent>
                {}
                <TabsContent value="propostes">
                    <HistorialPropostes />
                </TabsContent>
                <TabsContent value="invitacions">
                    <Invitacions />
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default DashboardEntrenador;
