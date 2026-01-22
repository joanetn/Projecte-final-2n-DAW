export interface Jugador {
    id: string;
    nom: string;
    email: string;
    nivell: string;
    avatar: string;
    telefon: string;
}

export interface JugadorsDisponiblesResponse {
    jugadors: Jugador[];
    total: number;
}

export interface InvitacioData {
    missatge: string;
    jugadorId: string;
}

export interface InvitacioResponse {
    id: string;
    usuariId: string;
    titol: string;
    missatge: string;
    tipus: string;
    read: boolean;
    created_at: Date;
    extra: {
        invitacioId: string;
        equipId: string;
        equipNom: string;
        missatge: string;
    }
}

export interface InvitacionsEnviadesResponse {
    invitacions: [{
        id: string;
        equipId: string;
        jugadorId: string;
        enviadaPer: string;
        missatge: string;
        estat: string;
        created_at: string;
        updated_at: string;
        isActive: string;
        jugador: {
            id: string;
            nom: string;
            email: string;
            nivell: string;
            avatar: string;
        }
    }],
    total: number;
}

export interface InvitacionsRebudesResponse {
    invitacions: [{
        id: string;
        equipId: string;
        jugadorId: string;
        enviadaPer: string;
        missatge: string;
        estat: string;
        created_at: string;
        updated_at: string;
        isActive: string;
        jugador: {
            id: string;
            nom: string;
            email: string;
            nivell: string;
            avatar: string;
        }
    }],
    equip: {
        id: string;
        nom: string;
        categoria: string;
    },
    enviadaPer: {
        id: string;
        nom: string;
    },
    total: number;
}