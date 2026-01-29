import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useEstadistiquesAdminWeb } from "@/queries/adminWeb.queries";

export function ResumTab() {
    const { data: stats, isLoading, refetch } = useEstadistiquesAdminWeb();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Resum General</h2>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualitzar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Usuaris</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.usuaris.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-green-600">{stats?.usuaris.actius || 0} actius</span>
                            {" · "}
                            <span className="text-red-600">{stats?.usuaris.inactius || 0} inactius</span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Equips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.equips.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-green-600">{stats?.equips.actius || 0} actius</span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Lligues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.lligues.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-green-600">{stats?.lligues.actives || 0} actives</span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Partits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.partits.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-yellow-600">{stats?.partits.pendents || 0} pendents</span>
                            {" · "}
                            <span className="text-green-600">{stats?.partits.completats || 0} completats</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Àrbitres</CardTitle>
                    <CardDescription>Total d'àrbitres disponibles a la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-primary">{stats?.arbitres.total || 0}</div>
                </CardContent>
            </Card>
        </div>
    );
}
