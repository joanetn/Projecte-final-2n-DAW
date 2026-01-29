export interface PropostaExtra {
    fromEquipId: string;
    toEquipId: string;
    dataHora: string;
    pistaId?: string;
    partitId?: string;
    estat?: string;
    fromEquipNom?: string;
    toEquipNom?: string;
    pistaNom?: string;
}
export interface Notificacio {
    id: string;
    usuariId: string;
    titol: string;
    missatge: string;
    tipus: string;
    read: boolean;
    created_at: string;
    extra?: PropostaExtra;
}
export interface Pista {
    id: string;
    nom: string;
    tipus: string;
    instalacioId: number;
    isActive: boolean;
}
