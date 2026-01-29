import { useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useLliguesAdmin } from "@/queries/adminWeb.queries";
import { useCrearLliga, useActualitzarLliga, useEliminarLliga } from "@/mutations/adminWeb.mutations";
import { useToast } from "@/components/ui/Toast";
import { LligaAdmin } from "@/types/lligues";

export function LliguesTab() {
    const { showToast } = useToast();
    const { data, isLoading, refetch } = useLliguesAdmin();
    const crearMutation = useCrearLliga();
    const actualitzarMutation = useActualitzarLliga();
    const eliminarMutation = useEliminarLliga();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedLliga, setSelectedLliga] = useState<LligaAdmin | null>(null);
    const [formData, setFormData] = useState({ nom: "", categoria: "" });

    const handleCreate = () => {
        crearMutation.mutate(formData, {
            onSuccess: () => {
                showToast({ title: "Lliga creada", type: "success" });
                setShowCreateDialog(false);
                setFormData({ nom: "", categoria: "" });
            },
            onError: () => {
                showToast({ title: "Error al crear la lliga", type: "error" });
            }
        });
    };

    const handleUpdate = () => {
        if (selectedLliga) {
            actualitzarMutation.mutate(
                { lligaId: selectedLliga.id, data: formData },
                {
                    onSuccess: () => {
                        showToast({ title: "Lliga actualitzada", type: "success" });
                        setShowEditDialog(false);
                        setSelectedLliga(null);
                    },
                    onError: () => {
                        showToast({ title: "Error al actualitzar la lliga", type: "error" });
                    }
                }
            );
        }
    };

    const handleDelete = () => {
        if (selectedLliga) {
            eliminarMutation.mutate(selectedLliga.id, {
                onSuccess: () => {
                    showToast({ title: "Lliga eliminada", type: "success" });
                    setShowDeleteDialog(false);
                    setSelectedLliga(null);
                },
                onError: () => {
                    showToast({ title: "Error al eliminar la lliga", type: "error" });
                }
            });
        }
    };

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
                            <CardTitle>Gestió de Lligues</CardTitle>
                            <CardDescription>
                                Administra les lligues. Total: {data?.total || 0}
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Lliga
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        <Button variant="outline" onClick={() => refetch()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Equips</TableHead>
                                    <TableHead>Estat</TableHead>
                                    <TableHead className="text-right">Accions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.lligues.map((lliga) => (
                                    <TableRow key={lliga.id}>
                                        <TableCell className="font-medium">{lliga.nom}</TableCell>
                                        <TableCell>{lliga.categoria || "-"}</TableCell>
                                        <TableCell>{lliga.totalEquips}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={lliga.isActive ? "default" : "secondary"}
                                                className={lliga.isActive ? "bg-green-500" : "bg-red-500 text-white"}
                                            >
                                                {lliga.isActive ? "Activa" : "Inactiva"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedLliga(lliga);
                                                        setFormData({
                                                            nom: lliga.nom,
                                                            categoria: lliga.categoria || "",
                                                        });
                                                        setShowEditDialog(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setSelectedLliga(lliga);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Nova Lliga</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Nom</Label>
                            <Input
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder="Nom de la lliga"
                            />
                        </div>
                        <div>
                            <Label>Categoria</Label>
                            <Input
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                placeholder="Categoria"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel·lar
                        </Button>
                        <Button onClick={handleCreate} disabled={!formData.nom || crearMutation.isPending}>
                            {crearMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Crear
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Editar Lliga</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Nom</Label>
                            <Input
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Categoria</Label>
                            <Input
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel·lar
                        </Button>
                        <Button onClick={handleUpdate} disabled={actualitzarMutation.isPending}>
                            {actualitzarMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Desar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar lliga?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estàs segur que vols eliminar la lliga "{selectedLliga?.nom}"?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
