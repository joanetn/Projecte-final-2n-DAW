<?php

namespace App\Modules\AdminWeb\Presentation\Http\Requests;

use App\Modules\AdminWeb\Application\DTOs\CreateMatchRescheduleProposalDTO;
use Illuminate\Foundation\Http\FormRequest;

class CreateMatchRescheduleProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dataHoraProposada' => 'required|date',
            'motiu' => 'nullable|string|max:1000',
        ];
    }

    public function toDto(string $matchId, string $authUserId): CreateMatchRescheduleProposalDTO
    {
        return new CreateMatchRescheduleProposalDTO(
            matchId: $matchId,
            requestUserId: $authUserId,
            proposedDateTime: (string) $this->validated('dataHoraProposada'),
            reason: $this->validated('motiu'),
        );
    }
}
