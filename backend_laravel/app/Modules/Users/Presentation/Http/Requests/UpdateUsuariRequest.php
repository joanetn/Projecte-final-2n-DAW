<?php

namespace App\Modules\Users\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuariRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $usuariId = $this->route('id');

        return [
            'nom' => 'sometimes|string|max:255',
            'email' => "sometimes|email|unique:usuaris,email,{$usuariId},id",
            'telefon' => 'nullable|string|max:20',
            'dataNaixement' => 'nullable|date',
            'nivell' => 'nullable|string|max:50',
            'avatar' => 'nullable|string',
            'dni' => "nullable|string|max:20|unique:usuaris,dni,{$usuariId},id",
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'El email ya está registrado',
            'dni.unique' => 'El DNI ya está registrado',
        ];
    }
}
