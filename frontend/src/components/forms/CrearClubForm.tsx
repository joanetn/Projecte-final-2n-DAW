import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/Toast";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Users,
    Trophy,
    Plus,
    Trash2,
    Loader2,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Shield,
    Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCrearClub, useInscriureLliga } from "@/mutations/club.mutations";
import { useLliguesDisponibles } from "@/queries/club.queries";
import { cn } from "@/lib/utils";

interface Instalacio {
    nom: string;
    adreca: string;
    telefon: string;
    tipusPista: string;
    numPistes: number;
}

interface ClubFormData {
    nom: string;
    descripcio: string;
    adreca: string;
    ciutat: string;
    codiPostal: string;
    provincia: string;
    telefon: string;
    email: string;
    web: string;
    anyFundacio: number;
    equipNom: string;
    equipCategoria: string;
    instalacions: Instalacio[];
    lliguesSeleccionades: string[];
}

const CATEGORIES = [
    "Aleví Masculí",
    "Aleví Femení",
    "Infantil Masculí",
    "Infantil Femení",
    "Cadet Masculí",
    "Cadet Femení",
    "Júnior Masculí",
    "Júnior Femení",
    "Senior Masculí",
    "Senior Femení",
    "Veterà Masculí",
    "Veterà Femení",
];

const TIPUS_PISTA = [
    "Indoor",
    "Outdoor",
    "Indoor/Outdoor",
    "Coberta",
    "Descoberta",
];

const STEPS = [
    { id: 1, title: "Informació del Club", icon: Building2 },
    { id: 2, title: "Ubicació i Contacte", icon: MapPin },
    { id: 3, title: "Instal·lacions", icon: Trophy },
    { id: 4, title: "Primer Equip", icon: Users },
    { id: 5, title: "Inscripció a Lligues", icon: Calendar },
];

export function CrearClubForm() {
    const { user, refreshUser } = useAuth();
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isOpen, setIsOpen] = useState(false);

    const { data: lliguesData, isLoading: loadingLligues } = useLliguesDisponibles();
    const crearClubMutation = useCrearClub();
    const inscriureMutation = useInscriureLliga();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        trigger,
        reset,
    } = useForm<ClubFormData>({
        defaultValues: {
            nom: "",
            descripcio: "",
            adreca: "",
            ciutat: "",
            codiPostal: "",
            provincia: "",
            telefon: "",
            email: user?.email || "",
            web: "",
            anyFundacio: new Date().getFullYear(),
            equipNom: "",
            equipCategoria: "",
            instalacions: [],
            lliguesSeleccionades: [],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "instalacions",
    });

    const watchedLligues = watch("lliguesSeleccionades");

    const handleNext = async () => {
        const fieldsToValidate = getFieldsForStep(currentStep);
        const isStepValid = await trigger(fieldsToValidate as any);
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleFinalSubmit = async () => {
        const isValid = await trigger();
        if (isValid) {
            const data = watch() as ClubFormData;
            await onSubmit(data);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const getFieldsForStep = (step: number): (keyof ClubFormData)[] => {
        switch (step) {
            case 1:
                return ["nom", "descripcio", "anyFundacio"];
            case 2:
                return ["adreca", "ciutat", "codiPostal", "provincia", "telefon", "email"];
            case 3:
                return ["instalacions"];
            case 4:
                return ["equipNom", "equipCategoria"];
            case 5:
                return ["lliguesSeleccionades"];
            default:
                return [];
        }
    };

    const toggleLliga = (lligaId: string) => {
        const current = watchedLligues || [];
        if (current.includes(lligaId)) {
            setValue(
                "lliguesSeleccionades",
                current.filter((id) => id !== lligaId)
            );
        } else {
            setValue("lliguesSeleccionades", [...current, lligaId]);
        }
    };

    const onSubmit = async (data: ClubFormData) => {
        try {
            const result = await crearClubMutation.mutateAsync({
                club: {
                    nom: data.nom,
                    descripcio: data.descripcio,
                    adreca: data.adreca,
                    ciutat: data.ciutat,
                    codiPostal: data.codiPostal,
                    provincia: data.provincia,
                    telefon: data.telefon,
                    email: data.email,
                    web: data.web,
                    anyFundacio: data.anyFundacio,
                },
                equip: {
                    nom: data.equipNom,
                    categoria: data.equipCategoria,
                },
                instalacions: data.instalacions,
            });

            if (result.success && data.lliguesSeleccionades.length > 0) {
                for (const lligaId of data.lliguesSeleccionades) {
                    await inscriureMutation.mutateAsync({
                        equipId: result.equipId,
                        lligaId,
                    });
                }
            }

            showToast({
                title: "Club creat correctament!",
                description: `Ara ets administrador de ${data.nom}`,
                type: "success",
            });

            // Refrescar usuari per actualitzar els rols al menú
            await refreshUser();

            reset();
            setCurrentStep(1);
            setIsOpen(false);
        } catch (error) {
            showToast({
                title: "Error al crear el club",
                type: "error",
            });
        }
    };

    const addInstalacio = () => {
        append({
            nom: "",
            adreca: "",
            telefon: "",
            tipusPista: "",
            numPistes: 1,
        });
    };

    const isArbitre = user?.rols?.includes("ARBITRE");

    if (isArbitre) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="group cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/60 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                            <Plus className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Crea el teu propi Club</h3>
                        <p className="text-muted-foreground max-w-xs">
                            Funda el teu club, crea equips i competeix en les millors lligues
                        </p>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        Crear Nou Club
                    </DialogTitle>
                    <DialogDescription>
                        Completa tots els passos per fundar el teu club i començar a competir
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {STEPS.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                            isCompleted
                                                ? "bg-green-500 text-white"
                                                : isActive
                                                ? "bg-primary text-white ring-4 ring-primary/20"
                                                : "bg-gray-200 text-gray-500"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                            <StepIcon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-xs mt-2 text-center max-w-[80px]",
                                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                                        )}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "w-12 h-1 mx-2 rounded transition-colors",
                                            isCompleted ? "bg-green-500" : "bg-gray-200"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Step 1: Club Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="nom" className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        Nom del Club *
                                    </Label>
                                    <Input
                                        id="nom"
                                        placeholder="Ex: Club Pàdel Barcelona"
                                        {...register("nom", { required: "El nom és obligatori" })}
                                        className="mt-1"
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="descripcio">Descripció del Club</Label>
                                    <Textarea
                                        id="descripcio"
                                        placeholder="Explica la història i missió del teu club..."
                                        {...register("descripcio")}
                                        className="mt-1 min-h-[120px]"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="anyFundacio">Any de Fundació</Label>
                                    <Input
                                        id="anyFundacio"
                                        type="number"
                                        min={1800}
                                        max={new Date().getFullYear()}
                                        {...register("anyFundacio", { valueAsNumber: true })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location & Contact */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="adreca" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Adreça *
                                    </Label>
                                    <Input
                                        id="adreca"
                                        placeholder="Carrer Principal, 123"
                                        {...register("adreca", { required: "L'adreça és obligatòria" })}
                                        className="mt-1"
                                    />
                                    {errors.adreca && (
                                        <p className="text-sm text-red-500 mt-1">{errors.adreca.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ciutat">Ciutat *</Label>
                                    <Input
                                        id="ciutat"
                                        placeholder="Barcelona"
                                        {...register("ciutat", { required: "La ciutat és obligatòria" })}
                                        className="mt-1"
                                    />
                                    {errors.ciutat && (
                                        <p className="text-sm text-red-500 mt-1">{errors.ciutat.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="codiPostal">Codi Postal *</Label>
                                    <Input
                                        id="codiPostal"
                                        placeholder="08001"
                                        {...register("codiPostal", {
                                            required: "El codi postal és obligatori",
                                            pattern: {
                                                value: /^[0-9]{5}$/,
                                                message: "Codi postal no vàlid",
                                            },
                                        })}
                                        className="mt-1"
                                    />
                                    {errors.codiPostal && (
                                        <p className="text-sm text-red-500 mt-1">{errors.codiPostal.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="provincia">Província *</Label>
                                    <Input
                                        id="provincia"
                                        placeholder="Barcelona"
                                        {...register("provincia", { required: "La província és obligatòria" })}
                                        className="mt-1"
                                    />
                                    {errors.provincia && (
                                        <p className="text-sm text-red-500 mt-1">{errors.provincia.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="telefon" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Telèfon *
                                    </Label>
                                    <Input
                                        id="telefon"
                                        placeholder="+34 912 345 678"
                                        {...register("telefon", { required: "El telèfon és obligatori" })}
                                        className="mt-1"
                                    />
                                    {errors.telefon && (
                                        <p className="text-sm text-red-500 mt-1">{errors.telefon.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="info@club.com"
                                        {...register("email", {
                                            required: "L'email és obligatori",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Email no vàlid",
                                            },
                                        })}
                                        className="mt-1"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="web" className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Pàgina Web
                                    </Label>
                                    <Input
                                        id="web"
                                        placeholder="https://www.club.com"
                                        {...register("web")}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Facilities */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Instal·lacions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Afegeix les pistes i instal·lacions del club (opcional)
                                    </p>
                                </div>
                                <Button type="button" onClick={addInstalacio} variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Afegir Instal·lació
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            No has afegit cap instal·lació encara.
                                            <br />
                                            Pots afegir-les ara o més tard.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <Card key={field.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base">
                                                        Instal·lació {index + 1}
                                                    </CardTitle>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label>Nom de la Instal·lació</Label>
                                                    <Input
                                                        placeholder="Pista Central"
                                                        {...register(`instalacions.${index}.nom`)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Adreça</Label>
                                                    <Input
                                                        placeholder="Mateixa que el club o altra"
                                                        {...register(`instalacions.${index}.adreca`)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Tipus de Pista</Label>
                                                    <Select
                                                        onValueChange={(val) =>
                                                            setValue(`instalacions.${index}.tipusPista`, val)
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue placeholder="Selecciona tipus" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            {TIPUS_PISTA.map((tipus) => (
                                                                <SelectItem key={tipus} value={tipus}>
                                                                    {tipus}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Nombre de Pistes</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        {...register(`instalacions.${index}.numPistes`, {
                                                            valueAsNumber: true,
                                                        })}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: First Team */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">Crea el teu primer equip</h3>
                                <p className="text-muted-foreground">
                                    Seràs automàticament l'administrador d'aquest equip
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="equipNom" className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Nom de l'Equip *
                                    </Label>
                                    <Input
                                        id="equipNom"
                                        placeholder="Ex: Club Pàdel Barcelona A"
                                        {...register("equipNom", { required: "El nom de l'equip és obligatori" })}
                                        className="mt-1"
                                    />
                                    {errors.equipNom && (
                                        <p className="text-sm text-red-500 mt-1">{errors.equipNom.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="equipCategoria">Categoria *</Label>
                                    <Controller
                                        name="equipCategoria"
                                        control={control}
                                        rules={{ required: "La categoria és obligatòria" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecciona categoria" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.equipCategoria && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.equipCategoria.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="flex items-start gap-4 py-4">
                                    <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900">
                                            Rol d'Administrador d'Equip
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Com a fundador, tindràs permisos d'ADMIN_EQUIP per gestionar
                                            jugadors, entrenadors i inscripcions a lligues.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Step 5: League Registration */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">Inscriu-te a Lligues</h3>
                                <p className="text-muted-foreground">
                                    Selecciona les lligues on vols competir (opcional)
                                </p>
                            </div>

                            {loadingLligues ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : lliguesData?.lligues?.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            No hi ha lligues disponibles per inscriure's en aquest moment.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {lliguesData?.lligues?.map((lliga: any) => {
                                        const isSelected = watchedLligues?.includes(lliga.id);
                                        return (
                                            <Card
                                                key={lliga.id}
                                                className={cn(
                                                    "cursor-pointer transition-all duration-200",
                                                    isSelected
                                                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                                                        : "hover:border-primary/50"
                                                )}
                                                onClick={() => toggleLliga(lliga.id)}
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-base">
                                                                {lliga.nom}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                {lliga.categoria}
                                                            </CardDescription>
                                                        </div>
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center mt-1",
                                                            isSelected 
                                                                ? "bg-primary border-primary" 
                                                                : "border-gray-300"
                                                        )}>
                                                            {isSelected && (
                                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            Inici:{" "}
                                                            {lliga.dataInici
                                                                ? new Date(lliga.dataInici).toLocaleDateString()
                                                                : "Per determinar"}
                                                        </span>
                                                    </div>
                                                    {lliga.equipsScrits && (
                                                        <Badge variant="secondary" className="mt-2">
                                                            {lliga.equipsScrits} equips inscrits
                                                        </Badge>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}

                            {watchedLligues?.length > 0 && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="py-4">
                                        <p className="text-sm text-green-800">
                                            <strong>Lligues seleccionades:</strong>{" "}
                                            {watchedLligues.length} lliga(s)
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    <Separator className="my-6" />

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button type="button" onClick={handleNext}>
                                Següent
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleFinalSubmit}
                                disabled={crearClubMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {crearClubMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creant Club...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Crear Club
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
