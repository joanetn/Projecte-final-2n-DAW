<?php

namespace App\Modules\Invitation\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateInvitacioEquipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'equipId' => 'required|string|exists:equips,id',
            'usuariId' => 'required|string|exists:usuaris,id',
            'missatge' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'equipId.required' => "L'equip és obligatori",
            'equipId.exists' => "L'equip indicat no existeix",
            'usuariId.required' => "L'usuari és obligatori",
            'usuariId.exists' => "L'usuari indicat no existeix",
            'missatge.max' => 'El missatge no pot excedir 1000 caràcters',
        ];
    }
}
