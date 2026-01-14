import React, { useState } from "react";
import { useRegister } from "../mutations/auth.mutations";
import { RegisterData } from "../types/auth";
import { useNavigate } from "react-router-dom";

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
    // const isSuccess = mutation.status === "success";



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
        <div
            style={{
                maxWidth: 450,
                margin: "2rem auto",
                padding: "1rem",
                border: "1px solid gray",
                borderRadius: 8,
            }}
        >
            <h2 style={{ textAlign: "center" }}>Registrar Usuari</h2>

            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Nom:</label>
                    <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                    {formErrors.nom && <p style={{ color: "red" }}>{formErrors.nom}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                    {formErrors.email && (
                        <p style={{ color: "red" }}>{formErrors.email}</p>
                    )}
                </div>

                {/* Contraseña */}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Contrasenya:</label>
                    <input
                        type="contrasenya"
                        name="contrasenya"
                        value={form.contrasenya}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                    {formErrors.contrasenya && (
                        <p style={{ color: "red" }}>{formErrors.contrasenya}</p>
                    )}
                </div>

                {/* Roles */}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Roles:</label>
                    <div>
                        {availableRoles.map(role => (
                            <label key={role} style={{ display: "block", marginTop: 4 }}>
                                <input
                                    type="checkbox"
                                    value={role}
                                    checked={form.rol?.includes(role)}
                                    onChange={handleChange}
                                />{" "}
                                {role}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        backgroundColor: "dodgerblue",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                >
                    {isLoading ? "Registrant..." : "Registrar"}
                </button>

                {/* Error global */}
                {isError && (
                    <p style={{ color: "red", marginTop: 8 }}>
                        {(error as Error).message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default Register;
