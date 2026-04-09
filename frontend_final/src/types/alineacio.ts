export interface JugadorAlineacio {
    usuariId: string;
    nom?: string;
    dorsal?: number;
    posicio?: string;
    titular: boolean;
    teSeguir?: boolean;
    lesionat?: boolean;
}

export interface Alineacio {
    id?: string;
    partitId: string;
    equipId: string;
    jugadors: JugadorAlineacio[];
    dataCreacio?: string;
}
