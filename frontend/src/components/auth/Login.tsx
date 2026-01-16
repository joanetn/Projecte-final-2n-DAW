import { useLogin } from "../../mutations/auth.mutations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoginData } from "../../types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const schema = yup.object().shape({
    email: yup.string().required("El camp email és obligatori"),
    contrasenya: yup.string().required("El camp contrasenya és obligatori"),
});

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        resolver: yupResolver(schema),
    });

    const mutation = useLogin();
    const navigate = useNavigate();
    const { login } = useAuth();

    const isLoading = mutation.status === "pending";
    const isError = mutation.status === "error";
    const error = mutation.error;

    const onSubmit = (data: LoginData) => {
        mutation.mutate(data, {
            onSuccess: (res) => {
                login(res.usuari);
                navigate("/");
            },
            onError: (err: any) => {
                console.error("Error de login:", err);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                            Iniciar sessió
                        </h2>
                        <p className="text-sm text-gray-600">
                            Introdueix les teves credencials per continuar
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nom@exemple.com"
                                {...register("email")}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contrasenya">Contrasenya</Label>
                            <Input
                                id="contrasenya"
                                type="password"
                                placeholder="••••••••"
                                {...register("contrasenya")}
                                className={errors.contrasenya ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.contrasenya && (
                                <p className="text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.contrasenya.message}
                                </p>
                            )}
                        </div>

                        {isError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-800">{(error as Error).message}</p>
                            </div>
                        )}

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Entrant..." : "Entrar"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            No tens compte?{" "}
                            <a href="/register" className="font-medium text-gray-900 hover:underline">
                                Registra't
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
