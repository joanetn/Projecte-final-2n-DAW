import type {
    Invitacio,
    InvitationStatus,
    InvitacioCandidate,
} from '@/services/dto/invitacio.dto';
import { extractArray, unwrapApiData } from '@/services/shared/response-utils';

type Dictionary = Record<string, unknown>;

const toStatusLabel = (estat: InvitationStatus): Invitacio['status'] => {
    if (estat === 'acceptada') return 'ACCEPTADA';
    if (estat === 'rebutjada') return 'REBUTJADA';
    if (estat === 'cancelada') return 'CANCELADA';
    return 'PENDENT';
};

export const normalizeInvitacio = (value: unknown): Invitacio => {
    const item = (value ?? {}) as Dictionary;
    const equip = (item.equip ?? {}) as Dictionary;
    const usuari = (item.usuari ?? {}) as Dictionary;

    const estatRaw = String(item.estat ?? item.status ?? 'pendent').toLowerCase();
    const estat: InvitationStatus = ['acceptada', 'rebutjada', 'cancelada'].includes(estatRaw)
        ? (estatRaw as InvitationStatus)
        : 'pendent';

    const createdAt = (item.createdAt ?? item.dataCreacio) as string | undefined;

    return {
        id: String(item.id ?? ''),
        equipId: String(item.equipId ?? equip.id ?? ''),
        equipNom: (item.equipNom ?? equip.nom) as string | undefined,
        usuariId: String(item.usuariId ?? usuari.id ?? ''),
        usuariNom: (item.usuariNom ?? usuari.nom) as string | undefined,
        missatge: item.missatge as string | undefined,
        estat,
        status: toStatusLabel(estat),
        isActive: item.isActive as boolean | undefined,
        createdAt,
        updatedAt: item.updatedAt as string | undefined,
        dataCreacio: createdAt,
    };
};

export const normalizeInvitacionsPayload = (payload: unknown): Invitacio[] => {
    const data = unwrapApiData<unknown>(payload);
    const raw = extractArray<unknown>(data, ['invitacions']);

    return raw.map(normalizeInvitacio);
};

export const normalizeInvitacioCandidatesPayload = (payload: unknown): InvitacioCandidate[] => {
    const data = unwrapApiData<unknown>(payload);
    const raw = extractArray<unknown>(data);

    return raw
        .map((item): InvitacioCandidate => {
            const candidate = (item ?? {}) as Dictionary;
            const tipus = String(candidate.tipus ?? 'JUGADOR').toUpperCase() === 'ENTRENADOR'
                ? 'ENTRENADOR'
                : 'JUGADOR';

            return {
                id: String(candidate.id ?? ''),
                nom: String(candidate.nom ?? ''),
                email: String(candidate.email ?? ''),
                tipus,
            };
        })
        .filter((candidate) => candidate.id.length > 0);
};
