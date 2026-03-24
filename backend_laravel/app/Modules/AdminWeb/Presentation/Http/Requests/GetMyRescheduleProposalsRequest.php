<?php

namespace App\Modules\AdminWeb\Presentation\Http\Requests;

use App\Modules\AdminWeb\Application\DTOs\GetMyRescheduleProposalsDTO;
use Illuminate\Foundation\Http\FormRequest;

class GetMyRescheduleProposalsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'nullable|string|in:PENDENT,ACCEPTADA,REBUTJADA',
        ];
    }

    public function toDto(string $authUserId): GetMyRescheduleProposalsDTO
    {
        return new GetMyRescheduleProposalsDTO(
            userId: $authUserId,
            status: $this->validated('status'),
        );
    }
}
