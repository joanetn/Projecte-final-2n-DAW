<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCartCheckoutSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'successUrl' => 'required|url',
            'cancelUrl' => 'required|url',
        ];
    }

    public function messages(): array
    {
        return [
            'successUrl.required' => 'La URL de retorn (success) és obligatòria.',
            'successUrl.url' => 'La URL de retorn (success) no és vàlida.',
            'cancelUrl.required' => 'La URL de cancel·lació és obligatòria.',
            'cancelUrl.url' => 'La URL de cancel·lació no és vàlida.',
        ];
    }
}
