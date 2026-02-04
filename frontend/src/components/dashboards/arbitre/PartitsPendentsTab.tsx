import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, Clock, Calendar, MapPin } from "lucide-react";
import { PartitPendentCard } from "@/components/arbitre/PartitPendentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMarcarPartitCompletat } from "@/mutations/acta.mutations";
import { useToast } from "@/components/ui/Toast";

interface PartitsPendentsTabProps {
    loadingPartits: boolean;
    partitsPendents: any[];
    onCrearActa: (partit: any) => void;
}

export function PartitsPendentsTab({
    loadingPartits,
    partitsPendents,
    onCrearActa,
}: PartitsPendentsTabProps) {
    const marcarCompletMutation = useMarcarPartitCompletat();
    const { showToast } = useToast();

    const partitsPendentsStatus = partitsPendents.filter(p => p.status === "PENDENT");
    const partitsCompletats = partitsPendents.filter(p => p.status === "COMPLETAT");

    const handleMarcarComplet = (partitId: string) => {
        marcarCompletMutation.mutate(partitId, {
            onSuccess: () => {
                showToast({
                    type: "success",
                    title: "Partit completat",
                    description: "El partit s'ha marcat com a completat"
                });
            },
            onError: (error) => {
                showToast({
                    type: "error",
                    title: "Error",
                    description: error.message || "No s'ha pogut marcar el partit com a completat"
                });
            }
        });
    };

    const PartitPendentStatusCard = ({ partit }: { partit: any }) => {
        const dataPartit = new Date(partit.dataHora);
        const dataFormatejada = dataPartit.toLocaleDateString("ca-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        const horaFormatejada = dataPartit.toLocaleTimeString("ca-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            {partit.local?.nom || "Equip Local"} vs {partit.visitant?.nom || "Equip Visitant"}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendent
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{dataFormatejada} - {horaFormatejada}</span>
                    </div>
                    {partit.ubicacio && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{partit.ubicacio}</span>
                        </div>
                    )}
                    <div className="pt-2">
                        <Button
                            onClick={() => handleMarcarComplet(partit.id)}
                            className="w-full gap-2"
                            disabled={marcarCompletMutation.isPending}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {marcarCompletMutation.isPending ? "Marcant..." : "Marcar com a Completat"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        Partits Assignats Pendents
                    </CardTitle>
                    <CardDescription>
                        Partits que t'han assignat i encara no s'han jugat
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingPartits ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : partitsPendentsStatus.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                No tens partits pendents d'arbitrar
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {partitsPendentsStatus.map((partit) => (
                                <PartitPendentStatusCard key={partit.id} partit={partit} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Partits Completats Sense Acta
                    </CardTitle>
                    <CardDescription>
                        Aquests partits ja s'han jugat i necessiten que creïs l'acta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingPartits ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : partitsCompletats.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                No tens partits pendents de crear acta
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {partitsCompletats.map((partit) => (
                                <PartitPendentCard
                                    key={partit.id}
                                    partit={partit}
                                    onCrearActa={onCrearActa}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
