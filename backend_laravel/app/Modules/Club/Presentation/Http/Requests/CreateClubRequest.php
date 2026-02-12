<?php

namespace App\Modules\Club\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validació per crear un Club.
 * Laravel executa automàticament les regles de validació abans d'arribar al controlador.
 * Si la validació falla, retorna un error 422 amb els missatges personalitzats.
 */
class CreateClubRequest extends FormRequest
{
    // Permet que qualsevol enviï la petició (sense autenticació per ara)
    public function authorize(): bool
    {
        return true;
    }

    // Regles de validació per cada camp del club
    public function rules(): array
    {
        return [
            'nom' => 'required|string|min:3|max:255',
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
        ];
    }

    // Missatges d'error personalitzats en català
    public function messages(): array
    {
        return [
            'nom.required' => 'El nom del club és obligatori',
            'nom.string' => 'El nom ha de ser una cadena de text',
            'nom.min' => 'El nom ha de tenir almenys 3 caràcters',
            'nom.max' => 'El nom no pot excedir 255 caràcters',
            'descripcio.max' => 'La descripció no pot excedir 1000 caràcters',
            'email.email' => "L'email no és vàlid",
            'anyFundacio.integer' => "L'any de fundació ha de ser un número enter",
            'anyFundacio.min' => "L'any de fundació no pot ser anterior a 1800",
            'anyFundacio.max' => "L'any de fundació no pot ser posterior a l'any actual",
            'creadorId.exists' => "El creador indicat no existeix",
        ];
    }
}
