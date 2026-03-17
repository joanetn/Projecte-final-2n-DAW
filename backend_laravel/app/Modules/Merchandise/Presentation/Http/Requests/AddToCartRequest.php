<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'merchId' => 'required|uuid|exists:merchs,id',
            'quantitat' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'merchId.required' => 'El producte és obligatori.',
            'merchId.uuid' => 'El producte ha de tenir un format UUID vàlid.',
            'merchId.exists' => 'El producte especificat no existeix.',
            'quantitat.required' => 'La quantitat és obligatòria.',
            'quantitat.integer' => 'La quantitat ha de ser un número enter.',
            'quantitat.min' => 'La quantitat mínima és 1.',
        ];
    }
}
