import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    ClipboardList,
    RefreshCw,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { ActaForm } from "@/components/arbitre/ActaForm";
import { ActaDetall } from "@/components/arbitre/ActaDetall";
import type { PartitPendentActa, Acta, Incidencia, SetResultat } from "@/types/acta";
import { usePartitsPendentsActa, useMevesActes } from "@/queries/acta.queries";
import { useCrearActa, useValidarActa, useEliminarActa, useActualitzarActa } from "@/mutations/acta.mutations";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/badge";
import { PartitsPendentsTab } from "@/components/dashboards/arbitre/PartitsPendentsTab";
import { MevesActesTab } from "@/components/dashboards/arbitre/MevesActesTab";
type Vista = "llistat" | "crear" | "detall" | "editar";
const DashboardArbitre = () => {
    const [vistaActual, setVistaActual] = useState<Vista>("llistat");
    const [partitSeleccionat, setPartitSeleccionat] = useState<PartitPendentActa | null>(null);
    const [actaSeleccionada, setActaSeleccionada] = useState<Acta | null>(null);
    const [cercador, setCercador] = useState("");
    const { showToast } = useToast();
    const { data: partitsPendentsData, isLoading: loadingPartits, refetch: refetchPartits } = usePartitsPendentsActa();
    const { data: mevesActesData, isLoading: loadingActes, refetch: refetchActes } = useMevesActes();
    const crearActaMutation = useCrearActa();
    const actualitzarActaMutation = useActualitzarActa();
    const validarActaMutation = useValidarActa();
    const eliminarActaMutation = useEliminarActa();
    const partitsPendents = partitsPendentsData?.partits || [];
    const mevesActes = mevesActesData?.actes || [];
    const handleCrearActa = (partit: any) => {
        if (partit) {
            setPartitSeleccionat(partit);
            setVistaActual("crear");
        }
    };
    const handleSubmitActa = (data: {
        partitId: string | number;
        sets: SetResultat[];
        observacions: string;
        incidencies: Incidencia[];
    }) => {
        crearActaMutation.mutate(
            {
                partitId: data.partitId,
                sets: data.sets,
                observacions: data.observacions,
                incidencies: data.incidencies.length > 0 ? data.incidencies : undefined,
            },
            {
                onSuccess: () => {
                    showToast({
                        type: "success",
                        title: "Acta creada",
                        description: "L'acta s'ha creat correctament",
                    });
                    setVistaActual("llistat");
                    setPartitSeleccionat(null);
                },
                onError: (error) => {
                    showToast({
                        type: "error",
                        title: "Error",
                        description: error.message || "No s'ha pogut crear l'acta",
                    });
                },
            }
        );
    };
    const handleVeureActa = (actaId: string) => {
        const acta = mevesActes.find((a) => a.id === actaId);
        if (acta) {
            setActaSeleccionada(acta);
            setVistaActual("detall");
        }
    };
    const handleEditarActa = (actaId: string) => {
        const acta = mevesActes.find((a) => a.id === actaId);
        if (acta) {
            setActaSeleccionada(acta);
            setVistaActual("editar");
        }
    };
    const handleSubmitEditarActa = (data: {
        partitId: string | number;
        sets: SetResultat[];
        observacions: string;
        incidencies: Incidencia[];
    }) => {
        if (!actaSeleccionada) return;
        actualitzarActaMutation.mutate(
            {
                id: actaSeleccionada.id,
                data: {
                    sets: data.sets,
                    observacions: data.observacions,
                    incidencies: data.incidencies.length > 0 ? data.incidencies : undefined,
                },
            },
            {
                onSuccess: () => {
                    showToast({
                        type: "success",
                        title: "Acta actualitzada",
                        description: "L'acta s'ha actualitzat correctament",
                    });
                    setVistaActual("llistat");
                    setActaSeleccionada(null);
                },
                onError: (error) => {
                    showToast({
                        type: "error",
                        title: "Error",
                        description: error.message || "No s'ha pogut actualitzar l'acta",
                    });
                },
            }
        );
    };
    const handleValidarActa = (actaId: string) => {
        validarActaMutation.mutate(
            { id: actaId },
            {
                onSuccess: () => {
                    showToast({
                        type: "success",
                        title: "Acta validada",
                        description: "L'acta s'ha validat correctament",
                    });
                    if (actaSeleccionada?.id === actaId) {
                        setActaSeleccionada({ ...actaSeleccionada, validada: true, dataValidacio: new Date().toISOString() });
                    }
                },
                onError: (error) => {
                    showToast({
                        type: "error",
                        title: "Error",
                        description: error.message || "No s'ha pogut validar l'acta",
                    });
                },
            }
        );
    };
    const handleEliminarActa = (actaId: string) => {
        eliminarActaMutation.mutate(
            { id: actaId },
            {
                onSuccess: () => {
                    showToast({
                        type: "success",
                        title: "Acta eliminada",
                        description: "L'acta s'ha eliminat correctament",
                    });
                    if (vistaActual === "detall") {
                        setVistaActual("llistat");
                        setActaSeleccionada(null);
                    }
                },
                onError: (error) => {
                    showToast({
                        type: "error",
                        title: "Error",
                        description: error.message || "No s'ha pogut eliminar l'acta",
                    });
                },
            }
        );
    };
    const handleTornar = () => {
        setVistaActual("llistat");
        setPartitSeleccionat(null);
        setActaSeleccionada(null);
    };
    const actesFiltrades = mevesActes.filter((acta) => {
        const cerca = cercador.toLowerCase();
        return (
            acta.partit?.local?.nom?.toLowerCase().includes(cerca) ||
            acta.partit?.visitant?.nom?.toLowerCase().includes(cerca) ||
            acta.observacions?.toLowerCase().includes(cerca)
        );
    });
    const totalActes = mevesActes.length;
    const actesValidadas = mevesActes.filter((a) => a.validada).length;
    const actesPendents = mevesActes.filter((a) => !a.validada).length;
    if (vistaActual === "crear" && partitSeleccionat) {
        return (
            <div className="container mx-auto p-6 max-w-3xl">
                <ActaForm
                    partit={partitSeleccionat}
                    onSubmit={handleSubmitActa}
                    onCancel={handleTornar}
                    isLoading={crearActaMutation.isPending}
                />
            </div>
        );
    }
    if (vistaActual === "detall" && actaSeleccionada) {
        return (
            <div className="container mx-auto p-6 max-w-3xl">
                <ActaDetall
                    acta={actaSeleccionada}
                    onTornar={handleTornar}
                    onEditar={!actaSeleccionada.validada ? handleEditarActa : undefined}
                    onValidar={!actaSeleccionada.validada ? handleValidarActa : undefined}
                    isValidating={validarActaMutation.isPending}
                />
            </div>
        );
    }
    if (vistaActual === "editar" && actaSeleccionada) {
        const partitPerEditar: PartitPendentActa = {
            id: actaSeleccionada.partit?.id || actaSeleccionada.partitId,
            jornadaId: 0,
            localId: actaSeleccionada.partit?.local?.id || "",
            visitantId: actaSeleccionada.partit?.visitant?.id || "",
            dataHora: actaSeleccionada.partit?.dataHora || actaSeleccionada.created_at,
            pistaId: "",
            status: "COMPLETAT",
            isActive: true,
            local: actaSeleccionada.partit?.local || null,
            visitant: actaSeleccionada.partit?.visitant || null,
        };
        return (
            <div className="container mx-auto p-6 max-w-3xl">
                <ActaForm
                    partit={partitPerEditar}
                    actaExistent={actaSeleccionada}
                    onSubmit={handleSubmitEditarActa}
                    onCancel={handleTornar}
                    isLoading={actualitzarActaMutation.isPending}
                />
            </div>
        );
    }
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FileText className="h-8 w-8" />
                        Gestió d'Actes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Crea i gestiona les actes dels partits que has arbitrat
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{partitsPendents.length}</p>
                                <p className="text-xs text-muted-foreground">Partits pendents d'acta</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalActes}</p>
                                <p className="text-xs text-muted-foreground">Total actes creades</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{actesValidadas}</p>
                                <p className="text-xs text-muted-foreground">Actes validades</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{actesPendents}</p>
                                <p className="text-xs text-muted-foreground">Pendents de validar</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="pendents" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="pendents" className="gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Partits Pendents
                        {partitsPendents.length > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {partitsPendents.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="actes" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Les Meves Actes
                        {mevesActes.length > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {mevesActes.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>
                { }
                <TabsContent value="pendents" className="space-y-4">
                    <PartitsPendentsTab
                        loadingPartits={loadingPartits}
                        partitsPendents={partitsPendents}
                        onCrearActa={handleCrearActa}
                    />
                </TabsContent>
                <TabsContent value="actes" className="space-y-4">
                    <MevesActesTab
                        loadingActes={loadingActes}
                        actesFiltrades={actesFiltrades}
                        cercador={cercador}
                        onCercadorChange={setCercador}
                        onVeure={handleVeureActa}
                        onEditar={handleEditarActa}
                        onEliminar={handleEliminarActa}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default DashboardArbitre;
