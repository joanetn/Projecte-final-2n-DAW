<?php

namespace App\Modules\Club\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validació per actualitzar un Club.
 * Tots els camps són nullable perquè es pot fer un update parcial (només els camps que canvien).
 */
class UpdateClubRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'nullable|string|min:3|max:255',
            'descripcio' => 'nullable|string|max:1000',
            'adreca' => 'nullable|string|max:255',
            'ciutat' => 'nullable|string|max:100',
            'codiPostal' => 'nullable|string|max:10',
            'provincia' => 'nullable|string|max:100',
            'telefon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'web' => 'nullable|string|max:500',
            'anyFundacio' => 'nullable|integer|min:1800|max:' . date('Y'),
            'creadorId' => 'nullable|string|exists:usuaris,id',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.string' => 'El nom ha de ser una cadena de text',
            'nom.min' => 'El nom ha de tenir almenys 3 caràcters',
            'nom.max' => 'El nom no pot excedir 255 caràcters',
            'descripcio.max' => 'La descripció no pot excedir 1000 caràcters',
            'email.email' => "L'email no és vàlid",
            'anyFundacio.integer' => "L'any de fundació ha de ser un número enter",
            'anyFundacio.min' => "L'any de fundació no pot ser anterior a 1800",
            'anyFundacio.max' => "L'any de fundació no pot ser posterior a l'any actual",
            'creadorId.exists' => "El creador indicat no existeix",
            'isActive.boolean' => "El camp isActive ha de ser un valor booleà",
        ];
    }
}
