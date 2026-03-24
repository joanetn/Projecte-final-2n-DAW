<?php

namespace App\Modules\Auth\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Dades de l'usuari
            'nom'            => 'required|string|min:5|max:255',
            'email'          => 'required|email|unique:usuaris,email|max:255',
            'contrasenya'    => 'required|string|min:8',
            'telefon'        => 'nullable|string|max:20',
            'dataNaixement'  => 'required|date|before_or_equal:today',
            'avatar'         => 'nullable|string|max:500',
            'dni'            => 'nullable|string|max:20',

            // Rols (opcionales pero si vienen, deben ser válidos)
            'rols'           => 'nullable|array|min:1',
            'rols.*'         => 'string|in:JUGADOR,ENTRENADOR,ARBITRE',

            // Dades del dispositiu (igual que login)
            'deviceId'       => 'required|string|max:255',
            'deviceType'     => 'nullable|string|max:50',
            'browser'        => 'nullable|string|max:100',
            'os'             => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required'           => 'El nom és obligatori',
            'nom.min'                => 'El nom ha de tenir almenys 5 caràcters',
            'email.required'         => 'L\'email és obligatori',
            'email.email'            => 'El format de l\'email no és vàlid',
            'email.unique'           => 'L\'email ja està registrat',
            'contrasenya.required'   => 'La contrasenya és obligatòria',
            'contrasenya.min'        => 'La contrasenya ha de tenir almenys 8 caràcters',
            'dataNaixement.required' => 'La data de naixement és obligatòria',
            'dataNaixement.date'     => 'La data de naixement ha de ser una data vàlida',
            'dataNaixement.before_or_equal' => 'La data de naixement no pot ser posterior a avui',
            'deviceId.required'      => 'El deviceId és obligatori',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $roles = $this->input('rols');

            if (!is_array($roles) || empty($roles)) {
                return;
            }

            $normalizedRoles = array_values(array_unique(array_filter(
                array_map(
                    static fn($role) => is_string($role) ? strtoupper(trim($role)) : '',
                    $roles
                ),
                static fn($role) => $role !== ''
            )));

            if (in_array('ARBITRE', $normalizedRoles, true) && count($normalizedRoles) > 1) {
                $validator->errors()->add('rols', 'Si selecciones ARBITRE, no pots seleccionar altres rols.');
            }
        });
    }
}
