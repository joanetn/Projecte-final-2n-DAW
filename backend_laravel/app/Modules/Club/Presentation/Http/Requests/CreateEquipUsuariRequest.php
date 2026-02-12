<?php

namespace App\Modules\Club\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validació per afegir un membre a un equip.
 * L'equipId arriba per la ruta. Validem l'usuariId i el rolEquip.
 */
class CreateEquipUsuariRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'usuariId' => 'required|string|exists:usuaris,id',
            'rolEquip' => 'required|string|in:jugador,entrenador,delegat,preparador_fisic',
        ];
    }

    public function messages(): array
    {
        return [
            'usuariId.required' => "L'ID de l'usuari és obligatori",
            'usuariId.exists' => "L'usuari indicat no existeix",
            'rolEquip.required' => "El rol dins l'equip és obligatori",
            'rolEquip.in' => "El rol no és vàlid. Valors permesos: jugador, entrenador, delegat, preparador_fisic",
        ];
    }
}
