<?php

namespace App\Modules\Club\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validació per actualitzar un membre d'equip.
 * Permet canviar el rol o activar/desactivar el membre.
 */
class UpdateEquipUsuariRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rolEquip' => 'nullable|string|in:jugador,entrenador,delegat,preparador_fisic',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'rolEquip.in' => "El rol no és vàlid. Valors permesos: jugador, entrenador, delegat, preparador_fisic",
            'isActive.boolean' => "El camp isActive ha de ser un valor booleà",
        ];
    }
}
