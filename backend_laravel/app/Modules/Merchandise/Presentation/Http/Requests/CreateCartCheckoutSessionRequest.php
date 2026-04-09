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
            'successUrl' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $normalizedUrl = str_replace(
                        '{CHECKOUT_SESSION_ID}',
                        'cs_test_placeholder',
                        (string) $value,
                    );

                    if (!filter_var($normalizedUrl, FILTER_VALIDATE_URL)) {
                        $fail('La URL de retorn (success) no és vàlida.');
                    }
                },
            ],
            'cancelUrl' => 'required|url',
        ];
    }

    public function messages(): array
    {
        return [
            'successUrl.required' => 'La URL de retorn (success) és obligatòria.',
            'cancelUrl.required' => 'La URL de cancel·lació és obligatòria.',
            'cancelUrl.url' => 'La URL de cancel·lació no és vàlida.',
        ];
    }
}
