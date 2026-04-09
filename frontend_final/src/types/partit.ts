export interface Partit {
    id: string;
    localId: string;
    visitantId: string;
    localNom?: string;
    visitantNom?: string;
    dataHora: string;
    ubicacio?: string;
    lligaId?: string;
    lligaNom?: string;
    status: 'PENDENT' | 'PROGRAMAT' | 'EN_CURS' | 'COMPLETAT' | 'CANCELAT' | 'SENSE_ARBITRE';
    arbitreId?: string;
    arbitreNom?: string;
    setsLocal?: number;
    setsVisitant?: number;
}

export interface CreatePartitData {
    localId: string;
    visitantId: string;
    dataHora: string;
    ubicacio?: string;
    lligaId?: string;
}
