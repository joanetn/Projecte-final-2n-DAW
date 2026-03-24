<?php

namespace App\Modules\AdminWeb\Infrastructure\Persistence\Mappers;

use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\RescheduleProposalModel;

class RescheduleProposalMapper
{
    /** @return array<string, mixed> */
    public static function toArray(RescheduleProposalModel $proposal): array
    {
        return [
            'id' => $proposal->id,
            'partitId' => $proposal->partitId,
            'equipProposaId' => $proposal->equipProposaId,
            'equipProposaNom' => $proposal->equipProposa?->nom,
            'equipReceptorId' => $proposal->equipReceptorId,
            'equipReceptorNom' => $proposal->equipReceptor?->nom,
            'proposatPerUsuariId' => $proposal->proposatPerUsuariId,
            'proposatPerUsuariNom' => $proposal->proposatPerUsuari?->nom,
            'dataHoraProposada' => $proposal->dataHoraProposada?->toISOString(),
            'motiu' => $proposal->motiu,
            'estat' => $proposal->estat,
            'respostaText' => $proposal->respostaText,
            'respostaPerUsuariId' => $proposal->respostaPerUsuariId,
            'respostaPerUsuariNom' => $proposal->respostaPerUsuari?->nom,
            'respostaAt' => $proposal->respostaAt?->toISOString(),
            'createdAt' => $proposal->created_at?->toISOString(),
            'partit' => [
                'id' => $proposal->partit?->id,
                'localId' => $proposal->partit?->localId,
                'localNom' => $proposal->partit?->local?->nom,
                'visitantId' => $proposal->partit?->visitantId,
                'visitantNom' => $proposal->partit?->visitant?->nom,
                'dataHoraActual' => $proposal->partit?->dataHora?->toISOString(),
                'status' => $proposal->partit?->status,
            ],
        ];
    }
}
