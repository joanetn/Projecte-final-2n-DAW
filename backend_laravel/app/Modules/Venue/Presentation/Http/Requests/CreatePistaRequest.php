<?php

/**
 * Request de validació per crear una Pista.
 *
 * El camp instalacioId arriba per la ruta (URL), no pel body del request.
 * Per tant, validem nom i tipus (opcional).
 */

namespace App\Modules\Venue\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePistaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|min:1|max:255',
            'tipus' => 'nullable|string|max:100',
        ];
    }

    // Missatges d'error personalitzats en català
    public function messages(): array
    {
        return [
            'nom.required' => "El nom de la pista és obligatori",
            'nom.string' => "El nom ha de ser una cadena de text",
            'nom.min' => "El nom ha de tenir almenys 1 caràcter",
            'nom.max' => "El nom no pot excedir 255 caràcters",
            'tipus.string' => "El tipus ha de ser una cadena de text",
            'tipus.max' => "El tipus no pot excedir 100 caràcters",
        ];
    }
}
