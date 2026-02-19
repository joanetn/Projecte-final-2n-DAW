<?php

namespace App\Modules\League\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\LeagueCategory;

class CreateLeagueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoriaValues = implode(',', LeagueCategory::values());
        return [
            'nom' => 'required|string|max:255',
            'categoria' => "required|string|in:{$categoriaValues}",
            'dataInici' => 'required|date',
            'dataFi' => 'nullable|date|after_or_equal:dataInici',
            'status' => 'required|string|in:NOT_STARTED,ON_PROGRESS,FINISHED',
            'isActive' => 'nullable|boolean',
            'logo_url' => 'nullable|string|url|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'El nom de la lliga és obligatori',
            'categoria.required' => 'La categoria de la lliga és obligatoria',
            'categoria.in' => 'La categoria deve ser un dels valors: ' . implode(', ', LeagueCategory::values()),
            'dataInici.required' => 'La data d\'inici de la lliga és obligatoria',
            'dataInici.date' => 'La data d\'inici no es una fecha válida',
            'dataFi.date' => 'La data de fin no es una fecha válida',
            'dataFi.after_or_equal' => 'La data de fin debe ser igual o posterior a la fecha de inicio',
            'status.required' => 'El estado de la lliga es obligatorio',
            'status.in' => 'El estado debe ser NOT_STARTED, ON_PROGRESS o FINISHED',
            'isActive.boolean' => 'El campo isActive debe ser un valor booleano',
            'logo_url.url' => 'La URL del logo no es válida',
            'logo_url.max' => 'La URL del logo no puede ser mayor a 500 carácteres',
        ];
    }
}
