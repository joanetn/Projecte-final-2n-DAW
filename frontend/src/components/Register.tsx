import React, { useState } from "react";
import { useRegister } from "../mutations/auth.mutations";
import { RegisterData } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const availableRoles = ["JUGADOR", "ENTRENADOR", "ARBITRE"];

const Register = () => {
    const [form, setForm] = useState<RegisterData>({
        nom: "",
        email: "",
        contrasenya: "",
        rol: [],
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const mutation = useRegister();
    const { mutate } = mutation;
    const isLoading = mutation.status === "pending";
    const isError = mutation.status === "error";
    const error = mutation.error;

    const validate = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!form.nom.trim()) errors.nom = "El nom és obligatori";
        if (!form.email.trim()) errors.email = "El email és obligatori";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email no vàlid";
        if (!form.contrasenya.trim()) errors.contrasenya = "La contrasenya és obligatòria";
        else if (form.contrasenya.length < 6)
            errors.contrasenya = "La contrasenya ha de tenir mínim 6 caràcters";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (value === "ARBITRE") {
                setForm(prev => ({
                    ...prev,
                    rol: checked ? ["ARBITRE"] : [],
                }));
            } else {
                setForm(prev => ({
                    ...prev,
                    rol: checked
                        ? [...(prev.rol?.filter(r => r !== "ARBITRE") || []), value]
                        : prev.rol?.filter(r => r !== value),
                }));
            }
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        mutate(form, {
            onSuccess: () => {
                alert("Usuari registrat correctament!");
                navigate("/login");
            },
            onError: (err: any) => {
                alert(err.message);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                            Crear compte
                        </h2>
                        <p className="text-sm text-gray-600">
                            Omple els camps per començar a jugar
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <Label htmlFor="nom">
                                Nom complet
                            </Label>
                            <Input
                                id="nom"
                                type="text"
                                name="nom"
                                placeholder="Joan Nácher"
                                value={form.nom}
                                onChange={handleChange}
                                className={formErrors.nom ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formErrors.nom && (
                                <p className="text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {formErrors.nom}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="nom@exemple.com"
                                value={form.email}
                                onChange={handleChange}
                                className={formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formErrors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Contrasenya */}
                        <div className="space-y-1.5">
                            <Label htmlFor="contrasenya">
                                Contrasenya
                            </Label>
                            <Input
                                id="contrasenya"
                                type="password"
                                name="contrasenya"
                                placeholder="Mínim 6 caràcters"
                                value={form.contrasenya}
                                onChange={handleChange}
                                className={formErrors.contrasenya ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formErrors.contrasenya && (
                                <p className="text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {formErrors.contrasenya}
                                </p>
                            )}
                        </div>

                        {/* Roles */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Selecciona els teus rols
                            </Label>
                            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                {availableRoles.map(role => (
                                    <label
                                        key={role}
                                        className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            value={role}
                                            checked={form.rol?.includes(role)}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {role === "JUGADOR" && "Jugador"}
                                            {role === "ENTRENADOR" && "Entrenador"}
                                            {role === "ARBITRE" && "Àrbitre"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {isError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-800">{(error as Error).message}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            {isLoading ? "Registrant..." : "Crear compte"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Ja tens compte?{" "}
                            <a
                                href="/login"
                                className="font-medium text-gray-900 hover:underline"
                            >
                                Inicia sessió
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;