import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    ClipboardList,
    Search,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock,
} from "lucide-react";

// Importa els components d'àrbitre
import { PartitPendentCard } from "@/components/arbitre/PartitPendentCard";
import { ActaCard } from "@/components/arbitre/ActaCard";
import { ActaForm } from "@/components/arbitre/ActaForm";
import { ActaDetall } from "@/components/arbitre/ActaDetall";

// Importa els tipus
import type { PartitPendentActa, Acta, Incidencia, SetResultat } from "@/types/acta";

// ============================================
// NOTA: Aquesta pàgina té la part VISUAL feta.
// Tu has d'implementar la part FUNCIONAL:
// - Queries (useQuery) per obtenir dades del backend
// - Mutations (useMutation) per crear/editar/validar/eliminar actes
// - Gestió d'estat i navegació
// ============================================

type Vista = "llistat" | "crear" | "detall" | "editar";

const DashboardArbitre = () => {
    // Estats per controlar la vista actual
    const [vistaActual, setVistaActual] = useState<Vista>("llistat");
    const [partitSeleccionat, setPartitSeleccionat] = useState<PartitPendentActa | null>(null);
    const [actaSeleccionada, setActaSeleccionada] = useState<Acta | null>(null);
    const [cercador, setCercador] = useState("");

    // ============================================
    // TODO: Implementa les queries aquí
    // Exemple:
    // const { data: partitsPendents, isLoading: loadingPartits } = useQuery({
    //   queryKey: ["partits-pendents-acta"],
    //   queryFn: getPartitsPendentsActa,
    // });
    //
    // const { data: mevesActes, isLoading: loadingActes } = useQuery({
    //   queryKey: ["meves-actes"],
    //   queryFn: getMevesActes,
    // });
    // ============================================

    // Dades de prova (elimina això quan tinguis les queries)
    const partitsPendentsMock: PartitPendentActa[] = [
        {
            id: "1",
            jornadaId: 5,
            localId: "eq1",
            visitantId: "eq2",
            dataHora: "2025-01-15T18:00:00Z",
            pistaId: "p1",
            status: "COMPLETAT",
            isActive: true,
            local: { id: "eq1", nom: "Padel Club Barcelona" },
            visitant: { id: "eq2", nom: "Tennis Badalona" },
        },
        {
            id: "2",
            jornadaId: 5,
            localId: "eq3",
            visitantId: "eq4",
            dataHora: "2025-01-14T19:30:00Z",
            pistaId: "p2",
            status: "COMPLETAT",
            isActive: true,
            local: { id: "eq3", nom: "Club Esportiu Manresa" },
            visitant: { id: "eq4", nom: "Padel Sabadell" },
        },
    ];

    const mevesActesMock: Acta[] = [
        {
            id: "a1",
            partitId: "p3",
            arbitreId: "3",
            sets: [
                { numeroSet: 1, jocsLocal: 6, jocsVisitant: 4, tiebreak: false, puntsLocalTiebreak: null, puntsVisitantTiebreak: null },
                { numeroSet: 2, jocsLocal: 6, jocsVisitant: 3, tiebreak: false, puntsLocalTiebreak: null, puntsVisitantTiebreak: null },
            ],
            setsLocal: 2,
            setsVisitant: 0,
            observacions: "Partit jugat amb normalitat. Bon comportament dels jugadors.",
            incidencies: null,
            validada: true,
            dataValidacio: "2025-01-10T20:00:00Z",
            created_at: "2025-01-10T19:30:00Z",
            isActive: true,
            partit: {
                id: "p3",
                dataHora: "2025-01-10T18:00:00Z",
                local: { id: "eq5", nom: "Padel Girona" },
                visitant: { id: "eq6", nom: "Club Terrassa" },
            },
        },
        {
            id: "a2",
            partitId: "p4",
            arbitreId: "3",
            sets: [
                { numeroSet: 1, jocsLocal: 4, jocsVisitant: 6, tiebreak: false, puntsLocalTiebreak: null, puntsVisitantTiebreak: null },
                { numeroSet: 2, jocsLocal: 7, jocsVisitant: 6, tiebreak: true, puntsLocalTiebreak: 7, puntsVisitantTiebreak: 5 },
                { numeroSet: 3, jocsLocal: 3, jocsVisitant: 6, tiebreak: false, puntsLocalTiebreak: null, puntsVisitantTiebreak: null },
            ],
            setsLocal: 1,
            setsVisitant: 2,
            observacions: "Alguns moments de tensió però es va resoldre tot correctament.",
            incidencies: [
                {
                    id: "inc1",
                    set: 2,
                    tipus: "ADVERTENCIA",
                    descripcio: "Advertència verbal per protesta reiterada",
                },
            ],
            validada: false,
            dataValidacio: null,
            created_at: "2025-01-12T20:00:00Z",
            isActive: true,
            partit: {
                id: "p4",
                dataHora: "2025-01-12T19:00:00Z",
                local: { id: "eq7", nom: "Padel Lleida" },
                visitant: { id: "eq8", nom: "Club Reus" },
            },
        },
    ];

    // Usa les dades mock mentre no tinguis les queries
    const partitsPendents = partitsPendentsMock;
    const mevesActes = mevesActesMock;
    const loadingPartits = false;
    const loadingActes = false;

    // ============================================
    // TODO: Implementa les mutations aquí
    // Exemple:
    // const crearActaMutation = useMutation({
    //   mutationFn: crearActa,
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["partits-pendents-acta"]);
    //     queryClient.invalidateQueries(["meves-actes"]);
    //     setVistaActual("llistat");
    //   },
    // });
    // ============================================

    // Handlers (connecta'ls amb les mutations)
    const handleCrearActa = (partitId: string | number) => {
        const partit = partitsPendents.find((p) => String(p.id) === String(partitId));
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
        // TODO: Crida a la mutation crearActa
        console.log("Crear acta:", data);
        // crearActaMutation.mutate(data);
        setVistaActual("llistat");
    };

    const handleVeureActa = (actaId: string) => {
        const acta = mevesActes.find((a) => a.id === actaId);
        if (acta) {
            setActaSeleccionada(acta);
            setVistaActual("detall");
        }
    };

    const handleEditarActa = (actaId: string) => {
        // TODO: Implementa l'edició
        console.log("Editar acta:", actaId);
    };

    const handleValidarActa = (actaId: string) => {
        // TODO: Crida a la mutation validarActa
        console.log("Validar acta:", actaId);
    };

    const handleEliminarActa = (actaId: string) => {
        // TODO: Crida a la mutation eliminarActa
        console.log("Eliminar acta:", actaId);
    };

    const handleTornar = () => {
        setVistaActual("llistat");
        setPartitSeleccionat(null);
        setActaSeleccionada(null);
    };

    // Filtrar actes per cercador
    const actesFiltrades = mevesActes.filter((acta) => {
        const cerca = cercador.toLowerCase();
        return (
            acta.partit?.local?.nom?.toLowerCase().includes(cerca) ||
            acta.partit?.visitant?.nom?.toLowerCase().includes(cerca) ||
            acta.observacions?.toLowerCase().includes(cerca)
        );
    });

    // Estadístiques
    const totalActes = mevesActes.length;
    const actesValidadas = mevesActes.filter((a) => a.validada).length;
    const actesPendents = mevesActes.filter((a) => !a.validada).length;

    // ============================================
    // RENDERITZAT
    // ============================================

    // Vista: Crear nova acta
    if (vistaActual === "crear" && partitSeleccionat) {
        return (
            <div className="container mx-auto p-6 max-w-3xl">
                <ActaForm
                    partit={partitSeleccionat}
                    onSubmit={handleSubmitActa}
                    onCancel={handleTornar}
                    isLoading={false} // TODO: crearActaMutation.isPending
                />
            </div>
        );
    }

    // Vista: Detall d'una acta
    if (vistaActual === "detall" && actaSeleccionada) {
        return (
            <div className="container mx-auto p-6 max-w-3xl">
                <ActaDetall
                    acta={actaSeleccionada}
                    onTornar={handleTornar}
                    onEditar={!actaSeleccionada.validada ? handleEditarActa : undefined}
                    onValidar={!actaSeleccionada.validada ? handleValidarActa : undefined}
                    isValidating={false} // TODO: validarActaMutation.isPending
                />
            </div>
        );
    }

    // Vista: Llistat principal
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Capçalera */}
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

            {/* Estadístiques */}
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

            {/* Tabs */}
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

                {/* Tab: Partits pendents d'acta */}
                <TabsContent value="pendents" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Partits Completats Sense Acta</CardTitle>
                            <CardDescription>
                                Aquests partits ja s'han jugat i necessiten que creïs l'acta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingPartits ? (
                                <div className="flex items-center justify-center py-12">
                                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : partitsPendents.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                    <p className="text-lg font-medium">Tot al dia!</p>
                                    <p className="text-muted-foreground">
                                        No tens partits pendents de crear acta
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {partitsPendents.map((partit) => (
                                        <PartitPendentCard
                                            key={partit.id}
                                            partit={partit}
                                            onCrearActa={handleCrearActa}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Les meves actes */}
                <TabsContent value="actes" className="space-y-4">
                    {/* Cercador */}
                    <div className="flex gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cercar per equip o observacions..."
                                value={cercador}
                                onChange={(e) => setCercador(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {loadingActes ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : actesFiltrades.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-lg font-medium">
                                        {cercador ? "No s'han trobat actes" : "Encara no has creat cap acta"}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {cercador
                                            ? "Prova amb una altra cerca"
                                            : "Quan arbitris un partit i es completi, podràs crear l'acta des d'aquí"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {actesFiltrades.map((acta) => (
                                <ActaCard
                                    key={acta.id}
                                    acta={acta}
                                    onVeure={handleVeureActa}
                                    onEditar={!acta.validada ? handleEditarActa : undefined}
                                    onEliminar={!acta.validada ? handleEliminarActa : undefined}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardArbitre;