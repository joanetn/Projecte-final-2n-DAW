<?php

/**
 * Request de validació per crear un PartitJugador.
 *
 * Valida que el partit, jugador i equip existeixin a la base de dades.
 * Els punts per defecte són 0 si no es proporcionen.
 */

namespace App\Modules\Lineup\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePartitJugadorRequest extends FormRequest
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
            'punts' => 'nullable|integer|min:0',
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
            'punts.min' => 'Els punts no poden ser negatius',
        ];
    }
}
