import type { Equip, Lliga } from '@/types/club';

interface RawLligaEquip {
    id?: unknown;
    nom?: unknown;
    categoria?: unknown;
}

interface RawLliga {
    id?: unknown;
    nom?: unknown;
    categoria?: unknown;
    dataInici?: unknown;
    dataFi?: unknown;
    status?: unknown;
    isActive?: unknown;
    equips?: unknown;
}

interface RawMembre {
    id?: unknown;
    usuariId?: unknown;
    equipId?: unknown;
    rolEquip?: unknown;
    isActive?: unknown;
    nom?: unknown;
    email?: unknown;
    teSeguir?: unknown;
    lesionat?: unknown;
    dataLesio?: unknown;
    usuari?: {
        id?: unknown;
        nom?: unknown;
        email?: unknown;
        teSeguir?: unknown;
        lesionat?: unknown;
        dataLesio?: unknown;
    };
}

export const normalizeLliga = (value: unknown): Lliga => {
    const lliga = (value ?? {}) as RawLliga;
    const equipsRaw = Array.isArray(lliga.equips) ? lliga.equips : [];

    return {
        id: String(lliga.id ?? ''),
        nom: String(lliga.nom ?? ''),
        categoria: lliga.categoria as string | undefined,
        dataInici: lliga.dataInici as string | undefined,
        dataFi: lliga.dataFi as string | undefined,
        status: lliga.status as string | undefined,
        isActive: lliga.isActive as boolean | undefined,
        equips: equipsRaw.map((equip) => {
            const item = equip as RawLligaEquip;
            return {
                id: String(item.id ?? ''),
                nom: String(item.nom ?? ''),
                categoria: item.categoria as string | undefined,
            };
        }),
    };
};

export const normalizeMembres = (raw: unknown[]): Array<{
    id: string;
    usuariId: string;
    equipId: string;
    rolEquip?: string;
    isActive?: boolean;
    nom?: string;
    email?: string;
    teSeguir?: boolean;
    lesionat?: boolean;
    dataLesio?: string;
}> => {
    return raw.map((value) => {
        const item = (value ?? {}) as RawMembre;
        const user = (item.usuari ?? {}) as RawMembre['usuari'];

        return {
            id: String(item.id ?? ''),
            usuariId: String(item.usuariId ?? user?.id ?? ''),
            equipId: String(item.equipId ?? ''),
            rolEquip: item.rolEquip as string | undefined,
            isActive: item.isActive as boolean | undefined,
            nom: (item.nom ?? user?.nom) as string | undefined,
            email: (item.email ?? user?.email) as string | undefined,
            teSeguir: (item.teSeguir ?? user?.teSeguir) as boolean | undefined,
            lesionat: (item.lesionat ?? user?.lesionat) as boolean | undefined,
            dataLesio: (item.dataLesio ?? user?.dataLesio) as string | undefined,
        };
    });
};

export const normalizeEquip = (value: unknown): Equip => {
    const equip = (value ?? {}) as Record<string, unknown>;

    return {
        id: String(equip.id ?? ''),
        nom: String(equip.nom ?? 'Equip sense nom'),
        categoria: equip.categoria as string | undefined,
        lligaId: equip.lligaId as string | undefined,
        lligaNom: equip.lligaNom as string | undefined,
        clubId: equip.clubId as string | undefined,
        isActive: equip.isActive as boolean | undefined,
        rolMeu: equip.rolMeu as string | undefined,
        createdAt: equip.createdAt as string | undefined,
    };
};
