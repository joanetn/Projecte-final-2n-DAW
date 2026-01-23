export interface Seguro {
    id: string;
    usuariId: string;
    dataInici: string;
    dataFi: string;
    preu: number;
    estatPagament: "PAGAT" | "PENDENT" | "CANCELAT";
    metodePagament: "STRIPE" | "SIMULAT";
    stripePaymentId: string | null;
    stripeSessionId: string | null;
    created_at: string;
    updated_at: string;
    isActive: boolean;
}

export interface EstatSeguroResponse {
    teSeguro: boolean;
    seguro: {
        id: string;
        dataInici: string;
        dataFi: string;
        diesRestants: number;
        estatPagament: string;
        stripePaymentId: string | null;
    } | null;
    missatge: string;
    preu: number;
}

export interface CrearSessioPagamentResponse {
    mode: "stripe" | "simulat";
    sessionId?: string;
    seguroId?: string;
    url?: string | null;
    missatge?: string;
    preu?: number;
}

export interface ConfirmarPagamentResponse {
    success: boolean;
    seguro: Seguro;
    missatge: string;
}

export interface HistorialSegurosResponse {
    seguros: Seguro[];
    total: number;
}

export interface ValidarJugadorResponse {
    jugadorId: string;
    teSeguro: boolean;
    potSerAlineat: boolean;
}

export interface ValidarJugadorsAlineacioResponse {
    valid: boolean;
    jugadors: ValidarJugadorResponse[];
    jugadorsSenseSeguro: string[];
    missatge: string;
}

// Tipus per enriquir jugadors amb info de segur
export interface JugadorAmbSeguro {
    id: string;
    nom: string;
    teSeguro: boolean;
    [key: string]: any;
}
