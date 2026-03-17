<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemQuantityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantitat' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'quantitat.required' => 'La quantitat és obligatòria.',
            'quantitat.integer' => 'La quantitat ha de ser un número enter.',
            'quantitat.min' => 'La quantitat mínima és 1.',
        ];
    }
}
