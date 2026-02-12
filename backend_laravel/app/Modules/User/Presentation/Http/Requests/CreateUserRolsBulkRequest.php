<?php

namespace App\Modules\User\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRolsBulkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['required', 'in:admin,admin_club,entrenador,arbitre,jugador'],
        ];
    }

    public function messages(): array
    {
        return [
            'roles.required' => "El camp 'roles' és obligatori",
            'roles.array' => "El camp 'roles' ha de ser un array",
            'roles.min' => "Ha de proporcionar almenys un rol",
            'roles.*.in' => "Un o més rols no són vàlids. Rols permesos: admin, admin_club, entrenador, arbitre, jugador",
        ];
    }
}
