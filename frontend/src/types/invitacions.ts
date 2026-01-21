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
}