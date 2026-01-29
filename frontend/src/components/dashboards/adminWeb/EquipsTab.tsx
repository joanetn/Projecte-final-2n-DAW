import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    DialogDescription,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw, Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useEquipsAdmin, useLliguesAdmin } from "@/queries/adminWeb.queries";
import { useCrearEquip, useActualitzarEquip, useEliminarEquip } from "@/mutations/adminWeb.mutations";
import { useToast } from "@/components/ui/Toast";

interface EquipAdmin {
    id: string;
    nom: string;
    categoria: string;
    isActive: boolean;
    lliga: { id: string; nom: string } | null;
    totalMembres: number;
}

export function EquipsTab() {
    const { showToast } = useToast();
    const [cerca, setCerca] = useState("");
    const { data, isLoading, refetch } = useEquipsAdmin({ cerca: cerca || undefined });
    const { data: lliguesData } = useLliguesAdmin();
    const crearMutation = useCrearEquip();
    const actualitzarMutation = useActualitzarEquip();
    const eliminarMutation = useEliminarEquip();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedEquip, setSelectedEquip] = useState<EquipAdmin | null>(null);
    const [formData, setFormData] = useState({ nom: "", categoria: "", lligaId: "" });

    const handleCreate = () => {
        crearMutation.mutate(formData, {
            onSuccess: () => {
                showToast({ title: "Equip creat", type: "success" });
                setShowCreateDialog(false);
                setFormData({ nom: "", categoria: "", lligaId: "" });
            },
            onError: () => {
                showToast({ title: "Error al crear l'equip", type: "error" });
            }
        });
    };

    const handleUpdate = () => {
        if (selectedEquip) {
            actualitzarMutation.mutate(
                { equipId: selectedEquip.id, data: formData },
                {
                    onSuccess: () => {
                        showToast({ title: "Equip actualitzat", type: "success" });
                        setShowEditDialog(false);
                        setSelectedEquip(null);
                    },
                    onError: () => {
                        showToast({ title: "Error al actualitzar l'equip", type: "error" });
                    }
                }
            );
        }
    };

    const handleDelete = () => {
        if (selectedEquip) {
            eliminarMutation.mutate(selectedEquip.id, {
                onSuccess: () => {
                    showToast({ title: "Equip eliminat", type: "success" });
                    setShowDeleteDialog(false);
                    setSelectedEquip(null);
                },
                onError: () => {
                    showToast({ title: "Error al eliminar l'equip", type: "error" });
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
                            <CardTitle>Gestió d'Equips</CardTitle>
                            <CardDescription>
                                Administra els equips. Total: {data?.total || 0}
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nou Equip
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cercar equips..."
                                value={cerca}
                                onChange={(e) => setCerca(e.target.value)}
                                className="pl-9"
                            />
                        </div>
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
                                    <TableHead>Lliga</TableHead>
                                    <TableHead>Membres</TableHead>
                                    <TableHead>Estat</TableHead>
                                    <TableHead className="text-right">Accions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.equips.map((equip) => (
                                    <TableRow key={equip.id}>
                                        <TableCell className="font-medium">{equip.nom}</TableCell>
                                        <TableCell>{equip.categoria || "-"}</TableCell>
                                        <TableCell>{equip.lliga?.nom || "Sense lliga"}</TableCell>
                                        <TableCell>{equip.totalMembres}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={equip.isActive ? "default" : "secondary"}
                                                className={equip.isActive ? "bg-green-500" : "bg-red-500 text-white"}
                                            >
                                                {equip.isActive ? "Actiu" : "Inactiu"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedEquip(equip);
                                                        setFormData({
                                                            nom: equip.nom,
                                                            categoria: equip.categoria || "",
                                                            lligaId: equip.lliga?.id || "",
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
                                                        setSelectedEquip(equip);
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
                        <DialogTitle>Nou Equip</DialogTitle>
                        <DialogDescription>Crea un nou equip a la plataforma</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Nom de l'equip</Label>
                            <Input
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder="Nom de l'equip"
                            />
                        </div>
                        <div>
                            <Label>Categoria</Label>
                            <Input
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                placeholder="Ex: Primera, Segona..."
                            />
                        </div>
                        <div>
                            <Label>Lliga</Label>
                            <Select
                                value={formData.lligaId}
                                onValueChange={(val) => setFormData({ ...formData, lligaId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una lliga" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                    <SelectItem value="">Sense lliga</SelectItem>
                                    {lliguesData?.lligues.map((lliga) => (
                                        <SelectItem key={lliga.id} value={lliga.id}>
                                            {lliga.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <DialogTitle>Editar Equip</DialogTitle>
                        <DialogDescription>Modifica les dades de l'equip</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Nom de l'equip</Label>
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
                        <div>
                            <Label>Lliga</Label>
                            <Select
                                value={formData.lligaId}
                                onValueChange={(val) => setFormData({ ...formData, lligaId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una lliga" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                    <SelectItem value="">Sense lliga</SelectItem>
                                    {lliguesData?.lligues.map((lliga) => (
                                        <SelectItem key={lliga.id} value={lliga.id}>
                                            {lliga.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <AlertDialogTitle>Eliminar equip?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estàs segur que vols eliminar l'equip "{selectedEquip?.nom}"?
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
