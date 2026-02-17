<?php

namespace App\Modules\User\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|min:5|max:255',
            'email' => 'required|email|unique:usuaris,email|max:255',
            'contrasenya' => 'required|string|min:8',
            'telefon' => 'nullable|string|max:20',
            'dataNaixement' => 'required|date|before_or_equal:today',
            'avatar' => 'nullable|string|max:500',
            'dni' => 'nullable|string|max:20',
            'nivell' => 'required|string|in:principant,intermedi,avançat',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'El nom és obligatori',
            'nom.string' => 'El nom ha de ser una cadena de text',
            'nom.min' => 'El nom ha de tenir almenys nom i primer cognomen (mínim 5 caràcters)',
            'nom.max' => 'El nom no pot excedir 255 caràcters',
            'email.required' => 'L\'email és obligatori',
            'email.email' => 'L\'email ha de ser vàlid',
            'email.unique' => 'L\'email ja està registrat',
            'contrasenya.required' => 'La contrasenya és obligatòria',
            'contrasenya.min' => 'La contrasenya ha de tenir almenys 8 caràcters',
            'telefon.string' => 'El telèfon ha de ser una cadena de text',
            'telefon.max' => 'El telèfon no pot excedir 20 caràcters',
            'dataNaixement.required' => 'La data de naixement és obligatòria',
            'dataNaixement.date' => 'La data de naixement ha de ser una data vàlida',
            'dataNaixement.before_or_equal' => 'La data de naixement no pot ser posterior a avui',
            'dni.string' => 'El DNI ha de ser una cadena de text',
            'dni.max' => 'El DNI no pot excedir 20 caràcters',
        ];
    }
}
