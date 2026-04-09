export type InvitationStatus = 'pendent' | 'acceptada' | 'rebutjada' | 'cancelada';

export interface Invitacio {
    id: string;
    equipId: string;
    equipNom?: string;
    usuariId: string;
    usuariNom?: string;
    tipus?: string;
    missatge?: string;
    estat: InvitationStatus;
    status: 'PENDENT' | 'ACCEPTADA' | 'REBUTJADA' | 'CANCELADA';
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    dataCreacio?: string;
}

export interface CreateInvitacioData {
    equipId: string;
    usuariId: string;
    missatge?: string;
}

export interface InvitacioCandidate {
    id: string;
    nom: string;
    email: string;
    tipus: 'JUGADOR' | 'ENTRENADOR';
}
