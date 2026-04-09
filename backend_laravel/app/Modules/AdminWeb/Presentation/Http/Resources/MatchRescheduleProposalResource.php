<?php

namespace App\Modules\AdminWeb\Presentation\Http\Resources;

use App\Modules\AdminWeb\Domain\Entities\MatchRescheduleProposal;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchRescheduleProposalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $proposal = $this->resource;

        if ($proposal instanceof MatchRescheduleProposal) {
            return [
                'id' => $proposal->id,
                'partitId' => $proposal->partitId,
                'equipProposaId' => $proposal->equipProposaId,
                'equipProposaNom' => $proposal->equipProposaNom,
                'equipReceptorId' => $proposal->equipReceptorId,
                'equipReceptorNom' => $proposal->equipReceptorNom,
                'proposatPerUsuariId' => $proposal->proposatPerUsuariId,
                'proposatPerUsuariNom' => $proposal->proposatPerUsuariNom,
                'dataHoraProposada' => $proposal->dataHoraProposada,
                'motiu' => $proposal->motiu,
                'estat' => $proposal->estat,
                'respostaText' => $proposal->respostaText,
                'respostaPerUsuariId' => $proposal->respostaPerUsuariId,
                'respostaPerUsuariNom' => $proposal->respostaPerUsuariNom,
                'respostaAt' => $proposal->respostaAt,
                'createdAt' => $proposal->createdAt,
                'updatedAt' => $proposal->updatedAt ?? null,
                'partit' => $proposal->partit ? [
                    'id' => $proposal->partit->id ?? $proposal->partit['id'],
                    'dataHora' => $proposal->partit->dataHora ?? $proposal->partit['dataHora'],
                    'status' => $proposal->partit->status ?? $proposal->partit['status'],
                    'jornadaId' => $proposal->partit->jornadaId ?? $proposal->partit['jornadaId'],
                    'arbitreId' => $proposal->partit->arbitreId ?? $proposal->partit['arbitreId'] ?? null,
                    'pistaId' => $proposal->partit->pistaId ?? $proposal->partit['pistaId'] ?? null,
                    'localEquipId' => $proposal->partit->localEquipId ?? $proposal->partit['localEquipId'],
                    'visitantEquipId' => $proposal->partit->visitantEquipId ?? $proposal->partit['visitantEquipId'],
                    'golesLocal' => $proposal->partit->golesLocal ?? $proposal->partit['golesLocal'],
                    'golesVisitant' => $proposal->partit->golesVisitant ?? $proposal->partit['golesVisitant'],
                    'isActive' => $proposal->partit->isActive ?? $proposal->partit['isActive'],
                    'createdAt' => $proposal->partit->createdAt ?? $proposal->partit['createdAt'] ?? $proposal->partit['created_at'] ?? null,
                    'updatedAt' => $proposal->partit->updatedAt ?? $proposal->partit['updatedAt'] ?? $proposal->partit['updated_at'] ?? null,
                ] : null,
            ];
        }

        return (array) $proposal;
    }
}
