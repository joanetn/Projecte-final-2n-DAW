import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificacions, usePropostesEnviades } from "@/queries/notificacions.queries";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import {
    Send,
    Inbox,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    Building2,
    HelpCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePlantilla } from "@/queries/entrenador.queries";

interface PropostaExtra {
    fromEquipId: string;
    toEquipId: string;
    dataHora: string;
    pistaId?: string;
    partitId?: string;
    estat?: string;
}

interface Notificacio {
    id: string;
    usuariId: string;
    titol: string;
    missatge: string;
    tipus: string;
    read: boolean;
    created_at: string;
    extra?: PropostaExtra;
}

const HistorialPropostes = () => {
    const { user } = useAuth();
    const { data: notificacionsData, isLoading: loadingNotifs } = useNotificacions(user?.id?.toString());
    const { data: plantillaData } = usePlantilla();

    const equipId = plantillaData?.equip?.id?.toString();

    // Query separada per obtenir les propostes enviades pel meu equip
    const { data: propostesEnviadesData, isLoading: loadingEnviades } = usePropostesEnviades(equipId);

    const isLoading = loadingNotifs || loadingEnviades;

    // Propostes rebudes (de les meves notificacions, tipus = 'proposta')
    const rebudes = (notificacionsData || []).filter(
        (n: Notificacio) => n.tipus === 'proposta' && n.extra
    );

    // Propostes enviades (query separada que busca per fromEquipId)
    const enviades = propostesEnviadesData || [];

    const getEstatBadge = (estat?: string) => {
        switch (estat?.toUpperCase()) {
            case 'ACCEPTAT':
                return (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Acceptada
                    </Badge>
                );
            case 'REBUTJAT':
                return (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 gap-1">
                        <XCircle className="h-3 w-3" />
                        Rebutjada
                    </Badge>
                );
            case 'PENDENT':
            default:
                return (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 gap-1">
                        <Clock className="h-3 w-3" />
                        Pendent
                    </Badge>
                );
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "d MMM yyyy, HH:mm", { locale: ca });
        } catch {
            return dateStr;
        }
    };

    const PropostaCard = ({ proposta, tipus }: { proposta: Notificacio; tipus: 'enviada' | 'rebuda' }) => (
        <Card className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={`
                            p-2 rounded-full
                            ${tipus === 'enviada'
                                ? 'bg-blue-100 dark:bg-blue-900'
                                : 'bg-purple-100 dark:bg-purple-900'}
                        `}>
                            {tipus === 'enviada'
                                ? <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                : <Inbox className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                    {tipus === 'enviada' ? 'Enviada a' : 'Rebuda de'} Equip #{tipus === 'enviada' ? proposta.extra?.toEquipId : proposta.extra?.fromEquipId}
                                </span>
                                {getEstatBadge(proposta.extra?.estat)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Data proposada: {proposta.extra?.dataHora}</span>
                                </div>
                                {proposta.extra?.pistaId && (
                                    <div className="flex items-center gap-1">
                                        <Building2 className="h-3.5 w-3.5" />
                                        <span>Pista #{proposta.extra.pistaId}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Creada: {formatDate(proposta.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Propostes Enviades */}
            <Card className="shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Send className="h-5 w-5 text-blue-500" />
                        Propostes Enviades
                        <Badge variant="secondary" className="ml-auto">
                            {enviades.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        {enviades.length > 0 ? (
                            enviades.map((p: Notificacio) => (
                                <PropostaCard key={p.id} proposta={p} tipus="enviada" />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                <HelpCircle className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-sm">No has enviat cap proposta</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Propostes Rebudes */}
            <Card className="shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Inbox className="h-5 w-5 text-purple-500" />
                        Propostes Rebudes
                        <Badge variant="secondary" className="ml-auto">
                            {rebudes.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        {rebudes.length > 0 ? (
                            rebudes.map((p: Notificacio) => (
                                <PropostaCard key={p.id} proposta={p} tipus="rebuda" />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                <HelpCircle className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-sm">No has rebut cap proposta</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Resum estadístic */}
            <Card className="lg:col-span-2 shadow-lg">
                <CardContent className="py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-blue-600">{enviades.length}</p>
                            <p className="text-sm text-muted-foreground">Total enviades</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-purple-600">{rebudes.length}</p>
                            <p className="text-sm text-muted-foreground">Total rebudes</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-green-600">
                                {[...enviades, ...rebudes].filter((p: Notificacio) => p.extra?.estat?.toUpperCase() === 'ACCEPTAT').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Acceptades</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-amber-600">
                                {[...enviades, ...rebudes].filter((p: Notificacio) => !p.extra?.estat || p.extra?.estat?.toUpperCase() === 'PENDENT').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Pendents</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HistorialPropostes;
