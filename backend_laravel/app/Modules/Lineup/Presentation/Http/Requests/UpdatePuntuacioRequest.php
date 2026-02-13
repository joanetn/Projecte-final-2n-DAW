<?php

/**
 * Request de validació per actualitzar una Puntuació.
 *
 * Tots els camps són opcionals (patch parcial).
 * Valida que els punts siguin positius si es proporcionen.
 */

namespace App\Modules\Lineup\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePuntuacioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'punts' => 'nullable|integer|min:0',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'punts.min' => 'Els punts no poden ser negatius',
        ];
    }
}
