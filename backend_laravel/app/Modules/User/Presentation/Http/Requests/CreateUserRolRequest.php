<?php

namespace App\Modules\User\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rol' => 'required|string|in:admin,admin_club,entrenador,arbitre,jugador',
        ];
    }

    public function messages(): array
    {
        return [
            'rol.required' => 'El rol és obligatori',
            'rol.string' => 'El rol ha de ser una cadena de text',
            'rol.in' => 'El rol no és vàlid. Valors permitidos: admin, admin_club, entrenador, arbitre, jugador',
        ];
    }
}
