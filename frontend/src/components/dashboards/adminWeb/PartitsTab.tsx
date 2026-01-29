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
import { usePartitsAdmin, useEquipsAdmin, useArbitresAdmin } from "@/queries/adminWeb.queries";
import { useCrearPartit, useActualitzarPartit, useEliminarPartit, useAssignarArbitre } from "@/mutations/adminWeb.mutations";
import { useToast } from "@/components/ui/Toast";
import { PartitAdmin } from "@/types/partits";

export function PartitsTab() {
    const { showToast } = useToast();
    const [cerca, setCerca] = useState("");
    const [statusFiltre, setStatusFiltre] = useState<string>("tots");
    const { data, isLoading, refetch } = usePartitsAdmin({
        cerca: cerca || undefined,
        status: statusFiltre !== "tots" ? statusFiltre : undefined,
    });
    const { data: equipsData } = useEquipsAdmin();
    const { data: arbitresData } = useArbitresAdmin();
    const crearMutation = useCrearPartit();
    const actualitzarMutation = useActualitzarPartit();
    const eliminarMutation = useEliminarPartit();
    const assignarArbitreMutation = useAssignarArbitre();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedPartit, setSelectedPartit] = useState<PartitAdmin | null>(null);
    const [formData, setFormData] = useState({
        localId: "",
        visitantId: "",
        data: "",
        hora: "",
        ubicacio: "",
        arbitreId: "",
    });

    const handleCreate = () => {
        crearMutation.mutate(formData, {
            onSuccess: () => {
                showToast({ title: "Partit creat", type: "success" });
                setShowCreateDialog(false);
                setFormData({ localId: "", visitantId: "", data: "", hora: "", ubicacio: "", arbitreId: "" });
            },
            onError: () => {
                showToast({ title: "Error al crear el partit", type: "error" });
            }
        });
    };

    const handleUpdate = () => {
        if (selectedPartit) {
            actualitzarMutation.mutate(
                { partitId: selectedPartit.id, data: formData },
                {
                    onSuccess: () => {
                        showToast({ title: "Partit actualitzat", type: "success" });
                        setShowEditDialog(false);
                        setSelectedPartit(null);
                    },
                    onError: () => {
                        showToast({ title: "Error al actualitzar el partit", type: "error" });
                    }
                }
            );
        }
    };

    const handleDelete = () => {
        if (selectedPartit) {
            eliminarMutation.mutate(selectedPartit.id, {
                onSuccess: () => {
                    showToast({ title: "Partit eliminat", type: "success" });
                    setShowDeleteDialog(false);
                    setSelectedPartit(null);
                },
                onError: () => {
                    showToast({ title: "Error al eliminar el partit", type: "error" });
                }
            });
        }
    };

    const handleAssignarArbitre = (partitId: string, arbitreId: string) => {
        assignarArbitreMutation.mutate({ partitId, arbitreId: arbitreId || null }, {
            onSuccess: () => {
                showToast({ title: "Àrbitre assignat", type: "success" });
            }
        });
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
                            <CardTitle>Gestió de Partits</CardTitle>
                            <CardDescription>
                                Administra els partits. Total: {data?.total || 0}
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nou Partit
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cercar partits..."
                                value={cerca}
                                onChange={(e) => setCerca(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFiltre} onValueChange={setStatusFiltre}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Estat" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg">
                                <SelectItem value="tots">Tots</SelectItem>
                                <SelectItem value="PENDENT">Pendents</SelectItem>
                                <SelectItem value="FINALITZAT">Finalitzats</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => refetch()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Local</TableHead>
                                    <TableHead>Visitant</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Resultat</TableHead>
                                    <TableHead>Àrbitre</TableHead>
                                    <TableHead>Estat</TableHead>
                                    <TableHead className="text-right">Accions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.partits.map((partit) => (
                                    <TableRow key={partit.id}>
                                        <TableCell className="font-medium">{partit.localNom}</TableCell>
                                        <TableCell>{partit.visitantNom}</TableCell>
                                        <TableCell>{partit.data}</TableCell>
                                        <TableCell>
                                            {partit.status === "FINALITZAT"
                                                ? `${partit.setsLocal} - ${partit.setsVisitant}`
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={partit.arbitreId || "none"}
                                                onValueChange={(val) => handleAssignarArbitre(partit.id, val === "none" ? "" : val)}
                                            >
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue placeholder="Assignar" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-lg">
                                                    <SelectItem value="none">Cap</SelectItem>
                                                    {arbitresData?.arbitres.map((arb) => (
                                                        <SelectItem key={arb.id} value={arb.id}>
                                                            {arb.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={partit.status === "FINALITZAT" ? "default" : "secondary"}
                                                className={
                                                    partit.status === "FINALITZAT"
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500 text-black"
                                                }
                                            >
                                                {partit.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedPartit(partit);
                                                        setFormData({
                                                            localId: partit.localId,
                                                            visitantId: partit.visitantId,
                                                            data: partit.data,
                                                            hora: partit.hora || "",
                                                            ubicacio: partit.ubicacio || "",
                                                            arbitreId: partit.arbitreId || "",
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
                                                        setSelectedPartit(partit);
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
                        <DialogTitle>Nou Partit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Equip Local</Label>
                                <Select
                                    value={formData.localId}
                                    onValueChange={(val) => setFormData({ ...formData, localId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border shadow-lg">
                                        {equipsData?.equips.map((eq) => (
                                            <SelectItem key={eq.id} value={eq.id}>
                                                {eq.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Equip Visitant</Label>
                                <Select
                                    value={formData.visitantId}
                                    onValueChange={(val) => setFormData({ ...formData, visitantId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border shadow-lg">
                                        {equipsData?.equips
                                            .filter((eq) => eq.id !== formData.localId)
                                            .map((eq) => (
                                                <SelectItem key={eq.id} value={eq.id}>
                                                    {eq.nom}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Data</Label>
                                <Input
                                    type="date"
                                    value={formData.data}
                                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Hora</Label>
                                <Input
                                    type="time"
                                    value={formData.hora}
                                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Ubicació</Label>
                            <Input
                                value={formData.ubicacio}
                                onChange={(e) => setFormData({ ...formData, ubicacio: e.target.value })}
                                placeholder="Pista, club..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel·lar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={
                                !formData.localId ||
                                !formData.visitantId ||
                                !formData.data ||
                                crearMutation.isPending
                            }
                        >
                            {crearMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Crear
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Editar Partit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Data</Label>
                                <Input
                                    type="date"
                                    value={formData.data}
                                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Hora</Label>
                                <Input
                                    type="time"
                                    value={formData.hora}
                                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Ubicació</Label>
                            <Input
                                value={formData.ubicacio}
                                onChange={(e) => setFormData({ ...formData, ubicacio: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Àrbitre</Label>
                            <Select
                                value={formData.arbitreId || "none"}
                                onValueChange={(val) => setFormData({ ...formData, arbitreId: val === "none" ? "" : val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un àrbitre" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                    <SelectItem value="none">Cap</SelectItem>
                                    {arbitresData?.arbitres.map((arb) => (
                                        <SelectItem key={arb.id} value={arb.id}>
                                            {arb.nom}
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
                        <AlertDialogTitle>Eliminar partit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estàs segur que vols eliminar aquest partit?
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
