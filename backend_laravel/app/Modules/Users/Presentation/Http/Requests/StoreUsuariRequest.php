<?php

namespace App\Modules\Users\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuariRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:usuaris,email',
            'contrasenya' => 'required|string|min:8',
            'telefon' => 'nullable|string|max:20',
            'dataNaixement' => 'nullable|date',
            'nivell' => 'nullable|string|max:50',
            'avatar' => 'nullable|string',
            'dni' => 'nullable|string|max:20|unique:usuaris,dni',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'El nombre es obligatorio',
            'email.required' => 'El email es obligatorio',
            'email.email' => 'El email debe ser válido',
            'email.unique' => 'El email ya está registrado',
            'contrasenya.required' => 'La contraseña es obligatoria',
            'contrasenya.min' => 'La contraseña debe tener al menos 8 caracteres',
            'dni.unique' => 'El DNI ya está registrado',
        ];
    }
}
