<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'usuariId' => 'required|uuid|exists:usuaris,id',
            'merchId' => 'required|uuid|exists:merchs,id',
            'quantitat' => 'required|integer|min:1',
            'total' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'usuariId.required' => "L'usuari és obligatori.",
            'usuariId.exists' => "L'usuari especificat no existeix.",
            'merchId.required' => 'El producte és obligatori.',
            'merchId.exists' => 'El producte especificat no existeix.',
            'quantitat.required' => 'La quantitat és obligatòria.',
            'quantitat.min' => 'La quantitat mínima és 1.',
        ];
    }
}
