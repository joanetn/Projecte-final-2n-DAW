import { format } from "date-fns";
import { ca } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, MapPin, Clock, Send } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { postProposta } from "@/services/entrenador.service";
import { usePlantilla } from "@/queries/entrenador.queries";
import { usePistes } from "@/queries/notificacions.queries";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface PartitCardProps {
    partit: any;
    showSets?: boolean;
}

const PartitCard = ({ partit, showSets = false }: PartitCardProps) => {
    const dataFormatejada = format(new Date(partit.dataHora), "d MMMM yyyy - HH:mm", { locale: ca });
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [showPropostaForm, setShowPropostaForm] = useState(false);
    const [proposedDate, setProposedDate] = useState('');
    const [proposedTime, setProposedTime] = useState('');
    const [selectedPistaId, setSelectedPistaId] = useState('');
    const [loading, setLoading] = useState(false);
    const plantilla = usePlantilla();
    const { data: pistes = [] } = usePistes();
    const myEquipId = plantilla.data?.equip?.id;
    const canPropose = myEquipId && partit.local?.id && myEquipId === partit.local.id;

    const comprovarAlineacio = async () => {
        navigate(`/entrenador/partits/${partit.id}/alineacio`)
    }

    const enviarProposta = async () => {
        if (!proposedDate || !proposedTime) {
            showToast({ type: 'error', title: 'Error', description: 'Has de seleccionar data i hora.' });
            return;
        }

        try {
            setLoading(true);
            const dataHora = `${proposedDate}T${proposedTime}:00.000Z`;

            const body = {
                fromEquipId: partit.local?.id,
                toEquipId: partit.visitant?.id,
                dataHora,
                pistaId: selectedPistaId || undefined,
                partitId: partit.id
            };

            await postProposta(body);
            showToast({ type: 'success', title: 'Proposta enviada', description: 'S\'ha enviat la proposta correctament.' });
            setShowPropostaForm(false);
            setProposedDate('');
            setProposedTime('');
            setSelectedPistaId('');
        } catch (err) {
            console.error(err);
            showToast({ type: 'error', title: 'Error', description: "No s'ha pogut enviar la proposta." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">
                            {partit.local?.nom} vs {partit.visitant?.nom}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{dataFormatejada}</span>
                        </div>
                        {partit.pista && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{partit.pista.nom}</span>
                            </div>
                        )}
                    </div>
                    <Badge
                        variant={partit.status === "COMPLETAT" ? "default" : "secondary"}
                    >
                        {partit.status}
                    </Badge>
                </div>
            </CardHeader>

            {showSets && partit.sets && partit.sets.length > 0 && (
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Sets:</p>
                        {partit.sets.map((set: any) => (
                            <div key={set.id} className="flex items-center gap-4 text-sm">
                                <span className="font-medium">Set {set.numeroSet}:</span>
                                <span>
                                    {set.jocsLocal} - {set.jocsVisit}
                                </span>
                                {set.tiebreak && (
                                    <Badge variant="outline" className="text-xs">
                                        TB: {set.puntsLocalTiebreak}-{set.puntsVisitTiebreak}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
            {!showSets && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={() => comprovarAlineacio()}
                        >
                            Alinear
                        </Button>

                        {canPropose && (
                            <Button size="sm" variant="outline" onClick={() => setShowPropostaForm(s => !s)}>
                                Proposar data
                            </Button>
                        )}
                    </div>

                    {showPropostaForm && (
                        <div className="mt-3 p-4 border border-primary/20 rounded-lg bg-primary/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-medium text-sm">Proposar nova data i hora</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <Label htmlFor="date" className="text-xs flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Data
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={proposedDate}
                                        onChange={e => setProposedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="time" className="text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Hora
                                    </Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={proposedTime}
                                        onChange={e => setProposedTime(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 mb-3">
                                <Label htmlFor="pista" className="text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Pista
                                </Label>
                                <Select value={selectedPistaId} onValueChange={setSelectedPistaId}>
                                    <SelectTrigger className="h-9 bg-background">
                                        <SelectValue placeholder="Selecciona una pista" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg">
                                        {pistes.map((pista) => (
                                            <SelectItem key={pista.id} value={pista.id}>
                                                {pista.nom} ({pista.tipus})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={enviarProposta}
                                    disabled={loading || !proposedDate || !proposedTime}
                                    className="flex items-center gap-1"
                                >
                                    <Send className="w-3 h-3" />
                                    {loading ? 'Enviant...' : 'Enviar proposta'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setShowPropostaForm(false)}>
                                    Cancel·lar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default PartitCard;