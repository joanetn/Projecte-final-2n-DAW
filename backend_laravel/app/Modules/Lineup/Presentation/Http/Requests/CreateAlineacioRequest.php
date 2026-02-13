<?php

/**
 * Request de validació per crear una Alineació.
 *
 * Valida les dades d'entrada del request HTTP abans de passar-les al controller.
 * Assegura que el partitId, jugadorId i equipId existeixin a la base de dades.
 * Retorna missatges d'error personalitzats en català.
 */

namespace App\Modules\Lineup\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAlineacioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'partitId' => 'required|string|exists:partits,id',
            'jugadorId' => 'required|string|exists:usuaris,id',
            'equipId' => 'required|string|exists:equips,id',
            'posicio' => 'nullable|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'partitId.required' => 'El partit és obligatori',
            'partitId.exists' => 'El partit no existeix',
            'jugadorId.required' => 'El jugador és obligatori',
            'jugadorId.exists' => 'El jugador no existeix',
            'equipId.required' => "L'equip és obligatori",
            'equipId.exists' => "L'equip no existeix",
            'posicio.max' => 'La posició no pot tenir més de 50 caràcters',
        ];
    }
}
