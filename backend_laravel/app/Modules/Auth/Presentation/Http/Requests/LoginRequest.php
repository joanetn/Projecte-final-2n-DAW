<?php

namespace App\Modules\Auth\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string|min:1',
            'deviceId' => 'required|string|max:255',
            'deviceType' => 'nullable|string|max:50',
            'browser' => 'nullable|string|max:100',
            'os' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El email es obligatorio',
            'email.email' => 'El formato del email no es válido',
            'password.required' => 'La contraseña es obligatoria',
            'deviceId.required' => 'El deviceId es obligatorio',
        ];
    }
}
