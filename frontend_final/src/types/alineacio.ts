export interface JugadorAlineacio {
    usuariId: string;
    nom?: string;
    posicio?: string;
}

export interface Alineacio {
    id?: string;
    partitId: string;
    equipId: string;
    jugadors: JugadorAlineacio[];
    dataCreacio?: string;
}

export interface GuardarJugadorAlineacio {
    jugadorId: string;
    posicio: string;
}

export interface GuardarAlineacioPayload {
    partitId: string;
    equipId: string;
    jugadors: GuardarJugadorAlineacio[];
}
