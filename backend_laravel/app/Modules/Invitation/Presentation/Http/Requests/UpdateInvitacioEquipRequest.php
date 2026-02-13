<?php

namespace App\Modules\Invitation\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvitacioEquipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'missatge' => 'nullable|string|max:1000',
            'estat' => 'nullable|string|in:pendent,acceptada,rebutjada,cancelada',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'missatge.max' => 'El missatge no pot excedir 1000 caràcters',
            'estat.in' => "L'estat ha de ser: pendent, acceptada, rebutjada o cancelada",
            'isActive.boolean' => 'El camp isActive ha de ser un valor booleà',
        ];
    }
}
