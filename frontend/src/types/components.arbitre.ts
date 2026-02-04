import { Acta, PartitPendentActa, SetResultat, Incidencia } from '@/types/acta';

export interface ActaFormProps {
    partit: PartitPendentActa;
    actaExistent?: Acta;
    onSubmit: (data: {
        partitId: string | number;
        sets: SetResultat[];
        observacions: string;
        incidencies: Incidencia[];
    }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface ActaCardProps {
    acta: Acta;
    onVeure: (actaId: string) => void;
    onEditar?: (actaId: string) => void;
    onEliminar?: (actaId: string) => void;
}

export interface ActaDetallProps {
    acta: Acta;
    onClose?: () => void;
    onEdit?: (acta: Acta) => void;
    onDelete?: (actaId: string) => void;
}

export interface PartitPendentCardProps {
    partit: PartitPendentActa;
    onCrearActa: (partit: PartitPendentActa) => void;
}
