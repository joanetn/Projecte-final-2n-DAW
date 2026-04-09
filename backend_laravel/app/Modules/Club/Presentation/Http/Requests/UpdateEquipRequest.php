<?php

namespace App\Modules\Club\Presentation\Http\Requests;

use App\Enums\LeagueCategory;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validació per actualitzar un Equip.
 * Tots els camps són nullable per permetre updates parcials.
 */
class UpdateEquipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoriaValues = implode(',', LeagueCategory::values());

        return [
            'nom' => 'nullable|string|min:2|max:255',
            'categoria' => "nullable|string|in:{$categoriaValues}",
            'lligaId' => 'nullable|string|exists:lligues,id',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.string' => "El nom ha de ser una cadena de text",
            'nom.min' => "El nom ha de tenir almenys 2 caràcters",
            'nom.max' => "El nom no pot excedir 255 caràcters",
            'categoria.string' => "La categoria ha de ser una cadena de text",
            'categoria.in' => 'La categoria ha de ser un dels valors: ' . implode(', ', LeagueCategory::values()),
            'lligaId.exists' => "La lliga indicada no existeix",
            'isActive.boolean' => "El camp isActive ha de ser un valor booleà",
        ];
    }
}
