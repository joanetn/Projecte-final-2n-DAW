import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Users, Trophy, Calendar, Shield, BarChart3, Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import {
    useEstadistiquesAdminWeb,
    useUsuarisAdmin,
    useEquipsAdmin,
    useLliguesAdmin,
    usePartitsAdmin,
    useArbitresAdmin,
} from "@/queries/adminWeb.queries";
import {
    useToggleUsuariActiu,
    useCanviarRolsUsuari,
    useEliminarUsuari,
    useCrearEquip,
    useActualitzarEquip,
    useEliminarEquip,
    useCrearLliga,
    useActualitzarLliga,
    useEliminarLliga,
    useCrearPartit,
    useActualitzarPartit,
    useEliminarPartit,
    useAssignarArbitre,
} from "@/mutations/adminWeb.mutations";
import { useToast } from "@/components/ui/Toast";

// ═══════════════════════════════════════════════════════════════
// COMPONENT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function DashboardAdminWeb() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Panell d'Administració
                </h1>

                <Tabs defaultValue="resum" className="space-y-4">
                    <TabsList className="grid grid-cols-6 w-full bg-white border">
                        <TabsTrigger value="resum" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Resum</span>
                        </TabsTrigger>
                        <TabsTrigger value="usuaris" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Usuaris</span>
                        </TabsTrigger>
                        <TabsTrigger value="equips" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span className="hidden sm:inline">Equips</span>
                        </TabsTrigger>
                        <TabsTrigger value="lligues" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span className="hidden sm:inline">Lligues</span>
                        </TabsTrigger>
                        <TabsTrigger value="partits" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline">Partits</span>
                        </TabsTrigger>
                        <TabsTrigger value="arbitres" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Àrbitres</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="resum">
                        <ResumTab />
                    </TabsContent>

                    <TabsContent value="usuaris">
                        <UsuarisTab />
                    </TabsContent>

                    <TabsContent value="equips">
                        <EquipsTab />
                    </TabsContent>

                    <TabsContent value="lligues">
                        <LliguesTab />
                    </TabsContent>

                    <TabsContent value="partits">
                        <PartitsTab />
                    </TabsContent>

                    <TabsContent value="arbitres">
                        <ArbitresTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// TAB: RESUM (ESTADÍSTIQUES)
// ═══════════════════════════════════════════════════════════════

function ResumTab() {
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

// ═══════════════════════════════════════════════════════════════
// TAB: USUARIS
// ═══════════════════════════════════════════════════════════════

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

interface EquipAdmin {
    id: string;
    nom: string;
    categoria: string;
    isActive: boolean;
    lliga: { id: string; nom: string } | null;
    totalMembres: number;
}

interface LligaAdmin {
    id: string;
    nom: string;
    categoria: string;
    isActive: boolean;
    totalEquips: number;
}

interface PartitAdmin {
    id: string;
    localId: string;
    localNom: string;
    visitantId: string;
    visitantNom: string;
    data: string;
    hora?: string;
    ubicacio?: string;
    status: string;
    setsLocal: number;
    setsVisitant: number;
    arbitreId?: string;
    isActive: boolean;
}

interface ArbitreAdmin {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    avatar?: string;
    partitsAssignats: number;
    partitsPendents: number;
}

function UsuarisTab() {
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

            {/* Dialog per canviar rols */}
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

            {/* Alert Dialog per eliminar */}
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

// ═══════════════════════════════════════════════════════════════
// TAB: EQUIPS
// ═══════════════════════════════════════════════════════════════

function EquipsTab() {
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

            {/* Dialog Crear Equip */}
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

            {/* Dialog Editar Equip */}
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

            {/* Alert Delete */}
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

// ═══════════════════════════════════════════════════════════════
// TAB: LLIGUES
// ═══════════════════════════════════════════════════════════════

function LliguesTab() {
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

            {/* Dialog Crear Lliga */}
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

            {/* Dialog Editar Lliga */}
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

            {/* Alert Delete */}
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

// ═══════════════════════════════════════════════════════════════
// TAB: PARTITS
// ═══════════════════════════════════════════════════════════════

function PartitsTab() {
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
                                                value={partit.arbitreId || ""}
                                                onValueChange={(val) => handleAssignarArbitre(partit.id, val)}
                                            >
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue placeholder="Assignar" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-lg">
                                                    <SelectItem value="">Cap</SelectItem>
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

            {/* Dialog Crear Partit */}
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

            {/* Dialog Editar Partit */}
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
                                value={formData.arbitreId}
                                onValueChange={(val) => setFormData({ ...formData, arbitreId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un àrbitre" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                    <SelectItem value="">Cap</SelectItem>
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

            {/* Alert Delete */}
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

// ═══════════════════════════════════════════════════════════════
// TAB: ÀRBITRES
// ═══════════════════════════════════════════════════════════════

function ArbitresTab() {
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
                                                        src={arbitre.avatar}
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
