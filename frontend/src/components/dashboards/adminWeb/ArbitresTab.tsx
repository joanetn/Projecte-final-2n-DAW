import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RefreshCw, Loader2 } from "lucide-react";
import { useArbitresAdmin } from "@/queries/adminWeb.queries";

export function ArbitresTab() {
    const { data, isLoading, refetch } = useArbitresAdmin();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Àrbitres</CardTitle>
                            <CardDescription>
                                Llista d'àrbitres disponibles. Total: {data?.total || 0}
                            </CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => refetch()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telèfon</TableHead>
                                    <TableHead>Partits Assignats</TableHead>
                                    <TableHead>Partits Pendents</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.arbitres.map((arbitre) => (
                                    <TableRow key={arbitre.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {arbitre.avatar && (
                                                    <img
                                                        alt={arbitre.nom}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                )}
                                                {arbitre.nom}
                                            </div>
                                        </TableCell>
                                        <TableCell>{arbitre.email}</TableCell>
                                        <TableCell>{arbitre.telefon || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{arbitre.partitsAssignats}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={arbitre.partitsPendents > 0 ? "default" : "secondary"}
                                                className={arbitre.partitsPendents > 0 ? "bg-yellow-500 text-black" : ""}
                                            >
                                                {arbitre.partitsPendents}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
