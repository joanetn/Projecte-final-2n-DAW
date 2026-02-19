<?php

namespace App\Modules\League\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\LeagueCategory;

class UpdateLeagueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoriaValues = implode(',', LeagueCategory::values());
        return [
            'nom' => 'nullable|string|max:255',
            'categoria' => "nullable|string|in:{$categoriaValues}",
            'dataInici' => 'nullable|date',
            'dataFi' => 'nullable|date|after_or_equal:dataInici',
            'status' => 'nullable|string|in:NOT_STARTED,ON_PROGRESS,FINISHED',
            'isActive' => 'nullable|boolean',
            +'logo_url' => 'nullable|string|url|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.string' => 'El nom de la lliga ha de ser una cadena de text',
            'nom.max' => 'El nom de la lliga no pot tenir més de 255 caràcters',
            'categoria.in' => 'La categoria deve ser un dels valors: ' . implode(', ', LeagueCategory::values()),
            'dataInici.date' => 'La data d\'inici no és una data vàlida',
            'dataFi.date' => 'La data de fi no és una data vàlida',
            'dataFi.after_or_equal' => 'La data de fi ha de ser igual o posterior a la data d\'inici',
            'status.in' => 'L\'estat ha de ser NOT_STARTED, ON_PROGRESS o FINISHED',
            'isActive.boolean' => 'El camp isActive ha de ser un valor booleà',
            'logo_url.url' => 'La URL del logo no és vàlida',
            'logo_url.max' => 'La URL del logo no pot tenir més de 500 caràcters',
        ];
    }
}
