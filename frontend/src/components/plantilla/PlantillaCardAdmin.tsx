import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShieldCheck, ShieldAlert, UserMinus, Edit, MoreVertical, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { type PlantillaCardAdminProps } from "@/types/components.plantilla";
const ROLS_DISPONIBLES = [
    { id: "JUGADOR", label: "Jugador" },
    { id: "ENTRENADOR", label: "Entrenador" },
    { id: "ADMIN_EQUIP", label: "Administrador" },
];
const PlantillaCardAdmin = ({
    usuari,
    teSeguro,
    onCanviarRol,
    onDonarBaixa,
    isCurrentUser = false
}: PlantillaCardAdminProps) => {
    const [showBaixaDialog, setShowBaixaDialog] = useState(false);
    const [showRolDialog, setShowRolDialog] = useState(false);
    const getRolsActuals = () => {
        if (Array.isArray(usuari.rolsEquip)) {
            return usuari.rolsEquip;
        }
        return usuari.rolEquip ? [usuari.rolEquip] : [];
    };
    const [rolsSeleccionats, setRolsSeleccionats] = useState<string[]>(getRolsActuals());
    const toggleRol = (rolId: string) => {
        setRolsSeleccionats(prev => {
            if (prev.includes(rolId)) {
                if (prev.length === 1) return prev;
                return prev.filter(r => r !== rolId);
            }
            return [...prev, rolId];
        });
    };
    const handleConfirmarBaixa = () => {
        onDonarBaixa(usuari.id);
        setShowBaixaDialog(false);
    };
    const handleConfirmarRol = () => {
        onCanviarRol(usuari.id, rolsSeleccionats);
        setShowRolDialog(false);
    };
    const handleOpenRolDialog = () => {
        setRolsSeleccionats(getRolsActuals());
        setShowRolDialog(true);
    };
    return (
        <>
            <Card className={`hover:shadow-md transition ${teSeguro === false ? 'border-orange-300 bg-orange-50/30 dark:bg-orange-950/20' : ''}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{usuari.nom}</CardTitle>
                                {teSeguro !== undefined && (
                                    teSeguro ? (
                                        <span title="Segur pagat">
                                            <ShieldCheck className="h-4 w-4 text-green-600" />
                                        </span>
                                    ) : (
                                        <span title="Sense segur">
                                            <ShieldAlert className="h-4 w-4 text-orange-500" />
                                        </span>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{usuari.email}</p>
                            {usuari.telefon && (
                                <p className="text-xs text-muted-foreground/70 mt-1">{usuari.telefon}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {usuari.avatar && (
                                <img
                                    src={usuari.avatar}
                                    alt={usuari.nom}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            )}
                            {!isCurrentUser && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                                        <DropdownMenuLabel>Accions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleOpenRolDialog}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Canviar rols
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setShowBaixaDialog(true)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <UserMinus className="h-4 w-4 mr-2" />
                                            Donar de baixa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {usuari.nivell && (
                        <p className="text-sm text-muted-foreground mb-2">Nivell: {usuari.nivell}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {}
                        {(usuari.rolsEquip || [usuari.rolEquip]).map((rol: string) => (
                            <Badge key={rol} className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-green-300 dark:border-green-700">
                                {rol === "ADMIN_EQUIP" ? "Admin" : rol === "ENTRENADOR" ? "Entrenador" : "Jugador"}
                            </Badge>
                        ))}
                        {usuari.rolsGlobals?.map((rol: string) => (
                            <Badge key={rol} variant="secondary" className="text-xs">
                                {rol}
                            </Badge>
                        ))}
                        {teSeguro === false && (
                            <Badge variant="destructive" className="text-xs gap-1">
                                <ShieldAlert className="h-3 w-3" />
                                Sense segur
                            </Badge>
                        )}
                        {isCurrentUser && (
                            <Badge variant="default" className="text-xs">
                                Tu
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
            {}
            <AlertDialog open={showBaixaDialog} onOpenChange={setShowBaixaDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Donar de baixa membre</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estàs segur que vols donar de baixa a <strong>{usuari.nom}</strong> de l'equip?
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                                <p className="text-sm"><strong>Email:</strong> {usuari.email}</p>
                                <p className="text-sm"><strong>Rol actual:</strong> {usuari.rolEquip}</p>
                            </div>
                            <p className="mt-3 text-sm text-orange-600">
                                ⚠️ Aquesta acció eliminarà el membre de l'equip, però no eliminarà el seu compte d'usuari.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleConfirmarBaixa}
                        >
                            Donar de baixa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {}
            <AlertDialog open={showRolDialog} onOpenChange={setShowRolDialog}>
                <AlertDialogContent className="bg-white border border-gray-200 shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900">Gestionar rols del membre</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div>
                                <p className="mb-4 text-gray-700">
                                    Selecciona els rols per a <strong className="text-gray-900">{usuari.nom}</strong>:
                                </p>
                                <div className="flex flex-col gap-2">
                                    {ROLS_DISPONIBLES.map((rol) => {
                                        const isSelected = rolsSeleccionats.includes(rol.id);
                                        return (
                                            <button
                                                key={rol.id}
                                                type="button"
                                                onClick={() => toggleRol(rol.id)}
                                                className={`
                                                    flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all
                                                    ${isSelected
                                                        ? 'bg-green-100 border-green-500 text-green-800'
                                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                                                    }
                                                `}
                                            >
                                                <span className="font-medium">{rol.label}</span>
                                                {isSelected && (
                                                    <Check className="h-5 w-5 text-green-600" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Fes clic sobre un rol per activar-lo o desactivar-lo. Ha de tenir almenys un rol.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRolsSeleccionats(getRolsActuals())}>
                            Cancel·lar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmarRol}>
                            Guardar canvis
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
export default PlantillaCardAdmin;
