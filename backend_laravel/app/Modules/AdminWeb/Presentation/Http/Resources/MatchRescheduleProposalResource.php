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
                'partit' => $proposal->partit,
            ];
        }

        return (array) $proposal;
    }
}
