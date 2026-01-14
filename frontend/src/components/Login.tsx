import { useLogin } from "../mutations/auth.mutations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoginData } from "../types/auth";

const schema = yup.object().shape({
    usuari: yup.string().required("El camp usuari és obligatori"),
    contrasenya: yup.string().required("El camp contrasenya és obligatori"),
});

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: yupResolver(schema),
    });

    const mutation = useLogin();
    const isLoading = mutation.status === "pending";
    const isError = mutation.status === "error";
    const error = mutation.error;

    const onSubmit = (data: LoginData) => {
        mutation.mutate(data);
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sessió</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Usuari</label>
                    <input type="text" {...register("usuari")} />
                    {errors.usuari && (
                        <div className="error">{errors.usuari.message}</div>
                    )}
                </div>
                <div>
                    <label>Contrasenya</label>
                    <input type="password" {...register("contrasenya")} />
                    {errors.contrasenya && (
                        <div className="error">{errors.contrasenya.message}</div>
                    )}
                </div>
                {isError && <div className="error">{(error as Error).message}</div>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Entrant..." : "Entrar"}
                </button>
            </form>
        </div>
    );
};

export default Login;