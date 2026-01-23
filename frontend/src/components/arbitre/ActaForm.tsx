import { useState } from "react";
import { PartitPendentActa, Incidencia, SetResultat } from "@/types/acta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Trash2, AlertTriangle, FileText, X } from "lucide-react";

interface ActaFormProps {
    partit: PartitPendentActa;
    onSubmit: (data: {
        partitId: string | number;
        sets: SetResultat[];
        observacions: string;
        incidencies: Incidencia[];
    }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

// Tipus d'incidències apropiades per a PÀDEL
const TIPUS_INCIDENCIA = [
    { value: "ADVERTENCIA", label: "Advertència", color: "bg-yellow-100 text-yellow-700" },
    { value: "CONDUCTA_ANTIESPORTIVA", label: "Conducta antiesportiva", color: "bg-red-100 text-red-700" },
    { value: "LESIO", label: "Lesió", color: "bg-orange-100 text-orange-700" },
    { value: "PROBLEMA_MATERIAL", label: "Problema de material/pista", color: "bg-blue-100 text-blue-700" },
    { value: "RETARD", label: "Retard", color: "bg-purple-100 text-purple-700" },
    { value: "ALTRE", label: "Altre", color: "bg-gray-100 text-gray-700" },
];

// Set buit inicial
const createEmptySet = (numeroSet: number): SetResultat => ({
    numeroSet,
    jocsLocal: 0,
    jocsVisitant: 0,
    tiebreak: false,
    puntsLocalTiebreak: null,
    puntsVisitantTiebreak: null,
});

export function ActaForm({ partit, onSubmit, onCancel, isLoading }: ActaFormProps) {
    // Estat per als sets (mínim 2, màxim 3)
    const [sets, setSets] = useState<SetResultat[]>([
        createEmptySet(1),
        createEmptySet(2),
    ]);
    const [observacions, setObservacions] = useState<string>("");
    const [incidencies, setIncidencies] = useState<Incidencia[]>([]);

    // Formulari nova incidència
    const [novaIncidencia, setNovaIncidencia] = useState({
        set: "1",
        tipus: "ADVERTENCIA" as Incidencia["tipus"],
        descripcio: "",
    });

    const dataPartit = new Date(partit.dataHora);
    const dataFormatejada = dataPartit.toLocaleDateString("ca-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // Calcular sets guanyats
    const calcularSetsGuanyats = () => {
        let setsLocal = 0;
        let setsVisitant = 0;
        sets.forEach(set => {
            if (set.jocsLocal > set.jocsVisitant) setsLocal++;
            else if (set.jocsVisitant > set.jocsLocal) setsVisitant++;
        });
        return { setsLocal, setsVisitant };
    };

    // Actualitzar un set
    const updateSet = (index: number, field: keyof SetResultat, value: number | boolean | null) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    // Afegir tercer set
    const afegirTercerSet = () => {
        if (sets.length < 3) {
            setSets([...sets, createEmptySet(3)]);
        }
    };

    // Eliminar tercer set
    const eliminarTercerSet = () => {
        if (sets.length === 3) {
            setSets(sets.slice(0, 2));
        }
    };

    const afegirIncidencia = () => {
        if (!novaIncidencia.descripcio.trim()) return;

        const incidencia: Incidencia = {
            id: `inc-${Date.now()}`,
            set: parseInt(novaIncidencia.set) || undefined,
            tipus: novaIncidencia.tipus,
            descripcio: novaIncidencia.descripcio,
        };

        setIncidencies([...incidencies, incidencia]);
        setNovaIncidencia({ set: "1", tipus: "ADVERTENCIA", descripcio: "" });
    };

    const eliminarIncidencia = (id: string) => {
        setIncidencies(incidencies.filter((i) => i.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            partitId: partit.id,
            sets,
            observacions,
            incidencies,
        });
    };

    const tipusToColor = (tipus: string) => {
        return TIPUS_INCIDENCIA.find((t) => t.value === tipus)?.color || "bg-gray-100";
    };

    // Validar que almenys un set estigui complet
    const algunSetComplet = sets.some(s => s.jocsLocal > 0 || s.jocsVisitant > 0);
    const { setsLocal, setsVisitant } = calcularSetsGuanyats();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Capçalera del partit */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Nova Acta del Partit
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {partit.local?.nom || "Local"} vs {partit.visitant?.nom || "Visitant"}
                            </CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onCancel}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{dataFormatejada}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Resultat per Sets */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Resultat del Partit</CardTitle>
                            <CardDescription>Introdueix el resultat de cada set</CardDescription>
                        </div>
                        {algunSetComplet && (
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                {setsLocal} - {setsVisitant}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Header amb noms */}
                    <div className="grid grid-cols-[1fr_80px_80px_100px] gap-2 text-sm font-medium text-center">
                        <div></div>
                        <div className="truncate">{partit.local?.nom || "Local"}</div>
                        <div className="truncate">{partit.visitant?.nom || "Visitant"}</div>
                        <div>Tiebreak</div>
                    </div>

                    {/* Sets */}
                    {sets.map((set, index) => (
                        <div key={set.numeroSet} className="space-y-2">
                            <div className="grid grid-cols-[1fr_80px_80px_100px] gap-2 items-center">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">Set {set.numeroSet}</Badge>
                                    {index === 2 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-red-500"
                                            onClick={eliminarTercerSet}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={set.jocsLocal || ""}
                                    onChange={(e) => updateSet(index, "jocsLocal", parseInt(e.target.value) || 0)}
                                    className="text-center font-bold"
                                    placeholder="0"
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={set.jocsVisitant || ""}
                                    onChange={(e) => updateSet(index, "jocsVisitant", parseInt(e.target.value) || 0)}
                                    className="text-center font-bold"
                                    placeholder="0"
                                />
                                <div className="flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={set.tiebreak}
                                        onChange={(e) => updateSet(index, "tiebreak", e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Tiebreak punts */}
                            {set.tiebreak && (
                                <div className="grid grid-cols-[1fr_80px_80px_100px] gap-2 items-center pl-4">
                                    <div className="text-xs text-muted-foreground">Punts tiebreak:</div>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={set.puntsLocalTiebreak ?? ""}
                                        onChange={(e) => updateSet(index, "puntsLocalTiebreak", parseInt(e.target.value) || null)}
                                        className="text-center text-sm h-8"
                                        placeholder="0"
                                    />
                                    <Input
                                        type="number"
                                        min="0"
                                        value={set.puntsVisitantTiebreak ?? ""}
                                        onChange={(e) => updateSet(index, "puntsVisitantTiebreak", parseInt(e.target.value) || null)}
                                        className="text-center text-sm h-8"
                                        placeholder="0"
                                    />
                                    <div></div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Botó afegir 3r set */}
                    {sets.length < 3 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={afegirTercerSet}
                        >
                            <Plus className="h-4 w-4" />
                            Afegir 3r Set
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Observacions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Observacions Reglamentàries</CardTitle>
                    <CardDescription>
                        Descriu com s'ha desenvolupat el partit a nivell reglamentari
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={observacions}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setObservacions(e.target.value)}
                        placeholder="Escriu les observacions sobre el desenvolupament del partit, comportament dels jugadors, compliment del reglament..."
                        rows={5}
                        className="resize-none"
                    />
                </CardContent>
            </Card>

            {/* Incidències */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Incidències
                    </CardTitle>
                    <CardDescription>
                        Registra les incidències ocorregudes durant el partit
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Llista d'incidències */}
                    {incidencies.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {incidencies.map((inc) => (
                                <div
                                    key={inc.id}
                                    className="flex items-start justify-between p-3 border rounded-lg bg-muted/50"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className={tipusToColor(inc.tipus)}>
                                                {TIPUS_INCIDENCIA.find((t) => t.value === inc.tipus)?.label}
                                            </Badge>
                                            {inc.set && (
                                                <span className="text-xs text-muted-foreground">
                                                    Set {inc.set}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm">{inc.descripcio}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => eliminarIncidencia(inc.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Formulari nova incidència */}
                    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-sm">Tipus d'incidència</Label>
                                <Select
                                    value={novaIncidencia.tipus}
                                    onValueChange={(value) =>
                                        setNovaIncidencia({ ...novaIncidencia, tipus: value as Incidencia["tipus"] })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIPUS_INCIDENCIA.map((tipus) => (
                                            <SelectItem key={tipus.value} value={tipus.value}>
                                                {tipus.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm">Set (opcional)</Label>
                                <Select
                                    value={novaIncidencia.set}
                                    onValueChange={(value) =>
                                        setNovaIncidencia({ ...novaIncidencia, set: value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Set 1</SelectItem>
                                        <SelectItem value="2">Set 2</SelectItem>
                                        <SelectItem value="3">Set 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm">Descripció</Label>
                            <Textarea
                                value={novaIncidencia.descripcio}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setNovaIncidencia({ ...novaIncidencia, descripcio: e.target.value })
                                }
                                placeholder="Descriu la incidència..."
                                rows={2}
                                className="mt-1 resize-none"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={afegirIncidencia}
                            disabled={!novaIncidencia.descripcio.trim()}
                        >
                            <Plus className="h-4 w-4" />
                            Afegir Incidència
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Botons d'acció */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel·lar
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || !algunSetComplet}
                >
                    {isLoading ? "Guardant..." : "Guardar Acta"}
                </Button>
            </div>
        </form>
    );
}
