import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { PartitPendentCard } from "@/components/arbitre/PartitPendentCard";

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
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Partits Completats Sense Acta
                    </CardTitle>
                    <CardDescription>
                        Aquests partits ja s'han jugat i necessiten que creïs
                        l'acta
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
                                    onSelectPartit={onCrearActa}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
