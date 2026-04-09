<?php

namespace App\Modules\League\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateRoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'dataInici' => 'required|date',
            'dataFi' => 'nullable|date|after_or_equal:dataInici',
            'lligaId' => 'required|string|exists:lligues,id',
            'status' => 'required|string|in:NOT_STARTED,ON_PROGRESS,FINISHED',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'El nom de la jornada és obligatori',
            'nom.string' => 'El nom de la jornada ha de ser una cadena de text',
            'nom.max' => 'El nom de la jornada no pot excedir 255 caràcters',
            'dataInici.required' => 'La data d\'inici de la jornada és obligatoria',
            'dataInici.date' => 'La data d\'inici no és una data vàlida',
            'dataFi.date' => 'La data de fi no és una data vàlida',
            'dataFi.after_or_equal' => 'La data de fi ha de ser igual o posterior a la data d\'inici',
            'lligaId.required' => 'L\'ID de la lliga és obligatori',
            'lligaId.exists' => 'La lliga seleccionada no existeix',
            'status.required' => 'L\'estat de la jornada és obligatori',
            'status.in' => 'L\'estat ha de ser NOT_STARTED, ON_PROGRESS o FINISHED',
            'isActive.boolean' => 'El camp isActive ha de ser un valor booleà',
        ];
    }
}
