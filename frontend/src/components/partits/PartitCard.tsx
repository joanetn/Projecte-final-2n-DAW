import { format } from "date-fns";
import { ca } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { postProposta } from "@/services/entrenador.service";
import { usePlantilla } from "@/queries/entrenador.queries";

interface PartitCardProps {
    partit: any;
    showSets?: boolean;
}

const PartitCard = ({ partit, showSets = false }: PartitCardProps) => {
    const dataFormatejada = format(new Date(partit.dataHora), "d MMMM yyyy - HH:mm", { locale: ca });
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [showPropostaForm, setShowPropostaForm] = useState(false);
    const [dataHora, setDataHora] = useState(partit.dataHora || '');
    const [loading, setLoading] = useState(false);
    const plantilla = usePlantilla();
    const myEquipId = plantilla.data?.equip?.id;
    const canPropose = myEquipId && partit.local?.id && myEquipId === partit.local.id;

    const comprovarAlineacio = async () => {
        navigate(`/entrenador/partits/${partit.id}/alineacio`)
    }

    const enviarProposta = async () => {
        try {
            setLoading(true);

            const body = {
                fromEquipId: partit.local?.id,
                toEquipId: partit.visitant?.id,
                dataHora,
                partitId: partit.id
            };

            await postProposta(body);
            showToast({ type: 'success', title: 'Proposta enviada', description: 'S\'ha enviat la proposta correctament.' });
            setShowPropostaForm(false);
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
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{dataFormatejada}</span>
                        </div>
                        {partit.pista && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
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
                        <p className="text-sm font-semibold text-gray-700">Sets:</p>
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
                        <div className="mt-2 p-3 border rounded bg-gray-50">
                            <label className="block text-sm mb-1">Data i hora</label>
                            <input value={dataHora} onChange={e => setDataHora(e.target.value)} className="w-full border px-2 py-1 mb-2" />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={enviarProposta} disabled={loading}>{loading ? 'Enviant...' : 'Enviar proposta'}</Button>
                                <Button size="sm" variant="ghost" onClick={() => setShowPropostaForm(false)}>Cancel·lar</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default PartitCard;