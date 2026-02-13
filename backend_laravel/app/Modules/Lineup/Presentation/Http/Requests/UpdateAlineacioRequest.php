<?php

/**
 * Request de validació per actualitzar una Alineació.
 *
 * Tots els camps són opcionals (patch parcial).
 * Només valida els camps que es proporcionen.
 */

namespace App\Modules\Lineup\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAlineacioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'posicio' => 'nullable|string|max:50',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'posicio.max' => 'La posició no pot tenir més de 50 caràcters',
        ];
    }
}
