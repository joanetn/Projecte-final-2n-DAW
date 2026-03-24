<?php

namespace App\Modules\AdminWeb\Presentation\Http\Requests;

use App\Modules\AdminWeb\Application\DTOs\GenerateLeagueFixturesDTO;
use Illuminate\Foundation\Http\FormRequest;

class GenerateLeagueFixturesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'force' => 'nullable|boolean',
        ];
    }

    public function toDto(string $leagueId): GenerateLeagueFixturesDTO
    {
        return new GenerateLeagueFixturesDTO(
            leagueId: $leagueId,
            force: (bool) $this->boolean('force'),
        );
    }
}
