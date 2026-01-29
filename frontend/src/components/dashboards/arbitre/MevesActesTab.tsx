import { Card, CardContent } from "@/components/ui/card";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ActaCard } from "@/components/arbitre/ActaCard";

interface MevesActesTabProps {
    loadingActes: boolean;
    actesFiltrades: any[];
    cercador: string;
    onCercadorChange: (value: string) => void;
    onVeure: (actaId: string) => void;
    onEditar: (actaId: string) => void | undefined;
    onEliminar: (actaId: string) => void | undefined;
}

export function MevesActesTab({
    loadingActes,
    actesFiltrades,
    cercador,
    onCercadorChange,
    onVeure,
    onEditar,
    onEliminar,
}: MevesActesTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cercar per equip o observacions..."
                        value={cercador}
                        onChange={(e) => onCercadorChange(e.target.value)}
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
                                {cercador
                                    ? "No s'han trobat actes"
                                    : "Encara no has creat cap acta"}
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
                            onVeure={onVeure}
                            onEditar={
                                !acta.validada ? onEditar : undefined
                            }
                            onEliminar={
                                !acta.validada ? onEliminar : undefined
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
