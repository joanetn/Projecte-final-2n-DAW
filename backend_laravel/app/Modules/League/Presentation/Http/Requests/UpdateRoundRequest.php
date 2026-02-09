<?php

namespace App\Modules\League\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'nullable|string|max:255',
            'dataInici' => 'nullable|date',
            'dataFi' => 'nullable|date|after_or_equal:dataInici',
            'status' => 'nullable|string|in:NOT_STARTED,ON_PROGRESS,FINISHED',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.string' => 'El nom de la jornada ha de ser una cadena de text',
            'nom.max' => 'El nom de la jornada no pot excedir 255 caràcters',
            'dataInici.date' => 'La data d\'inici no és una data vàlida',
            'dataFi.date' => 'La data de fi no és una data vàlida',
            'dataFi.after_or_equal' => 'La data de fi ha de ser igual o posterior a la data d\'inici',
            'status.in' => 'L\'estat ha de ser NOT_STARTED, ON_PROGRESS o FINISHED',
            'isActive.boolean' => 'El camp isActive ha de ser un valor booleà',
        ];
    }
}
