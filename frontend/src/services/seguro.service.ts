import { backend_rapid } from "@/api/axios";
import {
    EstatSeguroResponse,
    CrearSessioPagamentResponse,
    ConfirmarPagamentResponse,
    HistorialSegurosResponse,
    ValidarJugadorResponse,
    ValidarJugadorsAlineacioResponse
} from "@/types/seguro";
export const getEstatSeguro = async (): Promise<EstatSeguroResponse> => {
    try {
        const res = await backend_rapid.get<EstatSeguroResponse>("/seguro/estat");
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al obtenir l'estat del segur";
        console.error("Error en getEstatSeguro:", err);
        throw new Error(message);
    }
};
export const crearSessioPagament = async (): Promise<CrearSessioPagamentResponse> => {
    try {
        const res = await backend_rapid.post<CrearSessioPagamentResponse>("/seguro/crear-sessio-pagament");
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al crear la sessió de pagament";
        console.error("Error en crearSessioPagament:", err);
        throw new Error(message);
    }
};
export const confirmarPagament = async (sessionId: string): Promise<ConfirmarPagamentResponse> => {
    try {
        const res = await backend_rapid.post<ConfirmarPagamentResponse>("/seguro/confirmar-pagament", { sessionId });
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al confirmar el pagament";
        console.error("Error en confirmarPagament:", err);
        throw new Error(message);
    }
};
export const confirmarPagamentSimulat = async (): Promise<ConfirmarPagamentResponse> => {
    try {
        const res = await backend_rapid.post<ConfirmarPagamentResponse>("/seguro/confirmar-pagament-simulat");
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al confirmar el pagament simulat";
        console.error("Error en confirmarPagamentSimulat:", err);
        throw new Error(message);
    }
};
export const getHistorialSeguros = async (): Promise<HistorialSegurosResponse> => {
    try {
        const res = await backend_rapid.get<HistorialSegurosResponse>("/seguro/historial");
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al obtenir l'historial de seguros";
        console.error("Error en getHistorialSeguros:", err);
        throw new Error(message);
    }
};
export const validarSeguroJugador = async (jugadorId: string): Promise<ValidarJugadorResponse> => {
    try {
        const res = await backend_rapid.get<ValidarJugadorResponse>(`/seguro/validar/${jugadorId}`);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al validar el segur del jugador";
        console.error("Error en validarSeguroJugador:", err);
        throw new Error(message);
    }
};
export const validarJugadorsPerAlineacio = async (jugadorIds: string[]): Promise<ValidarJugadorsAlineacioResponse> => {
    try {
        const res = await backend_rapid.post<ValidarJugadorsAlineacioResponse>("/seguro/validar-alineacio", { jugadorIds });
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.error || "Error al validar els jugadors";
        console.error("Error en validarJugadorsPerAlineacio:", err);
        throw new Error(message);
    }
};
