<?php

/**
 * Request de validació per crear una Instal·lació.
 *
 * Laravel executa automàticament les regles de validació abans d'arribar al controlador.
 * Si la validació falla, retorna un error 422 amb els missatges personalitzats en català.
 * El camp 'nom' és obligatori; la resta són opcionals.
 */

namespace App\Modules\Venue\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateInstalacioRequest extends FormRequest
{
    // Permet que qualsevol enviï la petició (sense autenticació per ara)
    public function authorize(): bool
    {
        return true;
    }

    // Regles de validació per cada camp de la instal·lació
    public function rules(): array
    {
        return [
            'nom' => 'required|string|min:2|max:255',
            'adreca' => 'nullable|string|max:255',
            'telefon' => 'nullable|string|max:20',
            'tipusPista' => 'nullable|string|max:100',
            'numPistes' => 'nullable|integer|min:0|max:100',
            'clubId' => 'nullable|string|exists:clubs,id',
        ];
    }

    // Missatges d'error personalitzats en català
    public function messages(): array
    {
        return [
            'nom.required' => "El nom de la instal·lació és obligatori",
            'nom.string' => "El nom ha de ser una cadena de text",
            'nom.min' => "El nom ha de tenir almenys 2 caràcters",
            'nom.max' => "El nom no pot excedir 255 caràcters",
            'adreca.max' => "L'adreça no pot excedir 255 caràcters",
            'telefon.max' => "El telèfon no pot excedir 20 caràcters",
            'tipusPista.max' => "El tipus de pista no pot excedir 100 caràcters",
            'numPistes.integer' => "El número de pistes ha de ser un número enter",
            'numPistes.min' => "El número de pistes no pot ser negatiu",
            'numPistes.max' => "El número de pistes no pot excedir 100",
            'clubId.exists' => "El club indicat no existeix",
        ];
    }
}
