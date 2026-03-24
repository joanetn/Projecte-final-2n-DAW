<?php

namespace App\Modules\AdminWeb\Presentation\Http\Requests;

use App\Modules\AdminWeb\Application\DTOs\RespondMatchRescheduleProposalDTO;
use Illuminate\Foundation\Http\FormRequest;

class RespondMatchRescheduleProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'accio' => 'required|string|in:ACCEPTAR,RECHAZAR',
            'respostaText' => 'nullable|string|max:1000',
        ];
    }

    public function toDto(string $proposalId, string $authUserId): RespondMatchRescheduleProposalDTO
    {
        return new RespondMatchRescheduleProposalDTO(
            proposalId: $proposalId,
            requestUserId: $authUserId,
            action: (string) $this->validated('accio'),
            responseText: $this->validated('respostaText'),
        );
    }
}
