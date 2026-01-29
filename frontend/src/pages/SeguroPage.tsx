import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEstatSeguro, useHistorialSeguros } from "@/queries/seguro.queries";
import { useCrearSessioPagament, useConfirmarPagament, useConfirmarPagamentSimulat } from "@/mutations/seguro.mutations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    CreditCard,
    Clock,
    CheckCircle,
    AlertTriangle,
    Loader2,
    History,
    Euro
} from "lucide-react";
const SeguroPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { data: estatSeguro, isLoading: loadingEstat, refetch: refetchEstat } = useEstatSeguro();
    const { data: historial, isLoading: loadingHistorial } = useHistorialSeguros();
    const crearSessio = useCrearSessioPagament();
    const confirmarPagament = useConfirmarPagament();
    const confirmarSimulat = useConfirmarPagamentSimulat();
    useEffect(() => {
        const success = searchParams.get("success");
        const sessionId = searchParams.get("session_id");
        const canceled = searchParams.get("canceled");
        if (success === "true" && sessionId) {
            confirmarPagament.mutate(sessionId, {
                onSuccess: () => {
                    setShowSuccessMessage(true);
                    refetchEstat();
                    setSearchParams({});
                },
                onError: (error) => {
                    setErrorMessage(error.message);
                    setSearchParams({});
                }
            });
        }
        if (canceled === "true") {
            setErrorMessage("El pagament ha estat cancel·lat. Pots tornar-ho a intentar.");
            setSearchParams({});
        }
    }, [searchParams]);
    const handlePagar = async () => {
        setErrorMessage(null);
        crearSessio.mutate(undefined, {
            onSuccess: (data) => {
                if (data.mode === "stripe" && data.url) {
                    window.location.href = data.url;
                } else if (data.mode === "simulat") {
                    handlePagarSimulat();
                }
            },
            onError: (error) => {
                setErrorMessage(error.message);
            }
        });
    };
    const handlePagarSimulat = () => {
        confirmarSimulat.mutate(undefined, {
            onSuccess: () => {
                setShowSuccessMessage(true);
                refetchEstat();
            },
            onError: (error) => {
                setErrorMessage(error.message);
            }
        });
    };
    const isLoading = loadingEstat || crearSessio.isPending || confirmarPagament.isPending || confirmarSimulat.isPending;
    const formatData = (dataStr: string) => {
        return new Date(dataStr).toLocaleDateString('ca-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    El Meu Segur
                </h1>
                <p className="text-muted-foreground mt-2">
                    El segur és obligatori per poder ser alineat en partits i unir-te a equips.
                </p>
            </div>
            { }
            {showSuccessMessage && (
                <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800 dark:text-green-200">
                                    Pagament completat correctament!
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    El teu segur ja està actiu. Ara pots unir-te a equips i ser alineat.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            { }
            {errorMessage && (
                <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                            <div>
                                <p className="font-semibold text-red-800 dark:text-red-200">
                                    Error
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            { }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {estatSeguro?.teSeguro ? (
                            <>
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                Segur Actiu
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="h-5 w-5 text-orange-500" />
                                Sense Segur
                            </>
                        )}
                    </CardTitle>
                    <CardDescription>
                        {estatSeguro?.missatge || "Carregant informació del segur..."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingEstat ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : estatSeguro?.teSeguro && estatSeguro.seguro ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Data d'inici</p>
                                    <p className="font-semibold">{formatData(estatSeguro.seguro.dataInici)}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Data de fi</p>
                                    <p className="font-semibold">{formatData(estatSeguro.seguro.dataFi)}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Dies restants</p>
                                    <p className="font-semibold flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {estatSeguro.seguro.diesRestants} dies
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Estat</p>
                                    <Badge variant="default" className="bg-green-600">
                                        {estatSeguro.seguro.estatPagament}
                                    </Badge>
                                </div>
                            </div>
                            { }
                            {estatSeguro.seguro.diesRestants <= 30 && (
                                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                        <p className="text-yellow-800 dark:text-yellow-200">
                                            El teu segur caduca aviat! Renova'l abans de {formatData(estatSeguro.seguro.dataFi)}.
                                        </p>
                                    </div>
                                    <Button
                                        className="mt-3"
                                        onClick={handlePagar}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <CreditCard className="h-4 w-4 mr-2" />
                                        )}
                                        Renovar Segur - {estatSeguro.preu}€
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <ShieldAlert className="h-16 w-16 mx-auto text-orange-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Necessites el segur per jugar</h3>
                            <p className="text-muted-foreground mb-6">
                                Sense el segur no podràs unir-te a cap equip ni ser alineat en partits.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-6 max-w-sm mx-auto mb-6">
                                <p className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                                    <Euro className="h-8 w-8" />
                                    {estatSeguro?.preu || 25}
                                </p>
                                <p className="text-sm text-muted-foreground">per any</p>
                            </div>
                            <Button
                                size="lg"
                                onClick={handlePagar}
                                disabled={isLoading}
                                className="min-w-[200px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <CreditCard className="h-4 w-4 mr-2" />
                                )}
                                Pagar Segur
                            </Button>
                            { }
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePagarSimulat}
                                    disabled={isLoading}
                                >
                                    {confirmarSimulat.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Pagament Simulat (Dev)
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            { }
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Historial de Seguros
                    </CardTitle>
                    <CardDescription>
                        Tots els teus seguros anteriors
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingHistorial ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : historial && historial.seguros.length > 0 ? (
                        <div className="space-y-3">
                            {historial.seguros.map((seguro) => {
                                const esVigent = new Date(seguro.dataFi) > new Date();
                                return (
                                    <div
                                        key={seguro.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${esVigent ? 'bg-green-50 dark:bg-green-600 border-green-200' : 'bg-muted/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {esVigent ? (
                                                <ShieldCheck className="h-5 w-5 text-green-950" />
                                            ) : (
                                                <Shield className="h-5 w-5 text-muted-foreground" />
                                            )}
                                            <div>
                                                <p className="font-medium">
                                                    {formatData(seguro.dataInici)} - {formatData(seguro.dataFi)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {seguro.metodePagament === "STRIPE" ? "Pagat amb targeta" : "Pagament simulat"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={esVigent ? "default" : "secondary"}>
                                                {esVigent ? "Vigent" : "Caducat"}
                                            </Badge>
                                            <p className="text-sm font-medium mt-1">{seguro.preu}€</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No tens cap segur en l'historial</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
export default SeguroPage;
