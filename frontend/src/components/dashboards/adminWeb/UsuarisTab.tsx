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
import {
    Search,
    RefreshCw,
    Loader2,
    Pencil,
    Trash2,
    ToggleRight,
    ToggleLeft,
} from "lucide-react";
import { useUsuarisAdmin } from "@/queries/adminWeb.queries";
import { useToggleUsuariActiu, useCanviarRolsUsuari, useEliminarUsuari } from "@/mutations/adminWeb.mutations";
import { useToast } from "@/components/ui/Toast";

interface UsuariAdmin {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    nivell?: string;
    avatar?: string;
    isActive: boolean;
    rols: string[];
}

export function UsuarisTab() {
    const { showToast } = useToast();
    const [cerca, setCerca] = useState("");
    const [filtre, setFiltre] = useState<string>("tots");
    const { data, isLoading, refetch } = useUsuarisAdmin({
        cerca: cerca || undefined,
        actiu: filtre === "actius" ? "true" : filtre === "inactius" ? "false" : undefined,
    });
    const toggleMutation = useToggleUsuariActiu();
    const canviarRolsMutation = useCanviarRolsUsuari();
    const eliminarMutation = useEliminarUsuari();
    const [selectedUser, setSelectedUser] = useState<UsuariAdmin | null>(null);
    const [showRolesDialog, setShowRolesDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const ROLS_DISPONIBLES = ["JUGADOR", "ENTRENADOR", "ARBITRE", "ADMIN_EQUIP", "ADMIN_WEB"];

    const handleToggleRol = (rol: string) => {
        setSelectedRoles((prev) =>
            prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
        );
    };

    const handleSaveRoles = () => {
        if (selectedUser && selectedRoles.length > 0) {
            canviarRolsMutation.mutate(
                { usuariId: selectedUser.id, rols: selectedRoles },
                {
                    onSuccess: () => {
                        showToast({ title: "Rols actualitzats", type: "success" });
                        setShowRolesDialog(false);
                        setSelectedUser(null);
                    },
                    onError: () => {
                        showToast({ title: "Error al canviar els rols", type: "error" });
                    }
                }
            );
        }
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            eliminarMutation.mutate(selectedUser.id, {
                onSuccess: () => {
                    showToast({ title: "Usuari eliminat", type: "success" });
                    setShowDeleteDialog(false);
                    setSelectedUser(null);
                },
                onError: () => {
                    showToast({ title: "Error al eliminar l'usuari", type: "error" });
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
                    <CardTitle>Gestió d'Usuaris</CardTitle>
                    <CardDescription>
                        Administra els usuaris de la plataforma. Total: {data?.total || 0}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cercar per nom o email..."
                                value={cerca}
                                onChange={(e) => setCerca(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filtre} onValueChange={setFiltre}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Estat" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg">
                                <SelectItem value="tots">Tots</SelectItem>
                                <SelectItem value="actius">Actius</SelectItem>
                                <SelectItem value="inactius">Inactius</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => refetch()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rols</TableHead>
                                    <TableHead>Estat</TableHead>
                                    <TableHead className="text-right">Accions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.usuaris.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.nom}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.rols.map((rol) => (
                                                    <Badge
                                                        key={rol}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {rol}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.isActive ? "default" : "secondary"}
                                                className={user.isActive ? "bg-green-500" : "bg-red-500 text-white"}
                                            >
                                                {user.isActive ? "Actiu" : "Inactiu"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        toggleMutation.mutate(user.id);
                                                    }}
                                                    disabled={toggleMutation.isPending}
                                                >
                                                    {user.isActive ? (
                                                        <ToggleRight className="h-4 w-4" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setSelectedRoles(user.rols);
                                                        setShowRolesDialog(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setSelectedUser(user);
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

            <Dialog open={showRolesDialog} onOpenChange={setShowRolesDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Editar Rols</DialogTitle>
                        <DialogDescription>
                            Canvia els rols de {selectedUser?.nom}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label className="mb-3 block">Selecciona els rols:</Label>
                        <div className="flex flex-wrap gap-2">
                            {ROLS_DISPONIBLES.map((rol) => (
                                <button
                                    key={rol}
                                    onClick={() => handleToggleRol(rol)}
                                    className={`px-3 py-2 rounded-md border transition-colors ${selectedRoles.includes(rol)
                                        ? "bg-green-500 text-white border-green-600"
                                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                                        }`}
                                >
                                    {rol}
                                </button>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRolesDialog(false)}>
                            Cancel·lar
                        </Button>
                        <Button
                            onClick={handleSaveRoles}
                            disabled={canviarRolsMutation.isPending || selectedRoles.length === 0}
                        >
                            {canviarRolsMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Desar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar usuari?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estàs segur que vols eliminar a {selectedUser?.nom}? Aquesta acció no es pot desfer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDeleteUser}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
