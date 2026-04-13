<?php

namespace App\Modules\Notifications\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnqueueNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userId' => 'sometimes|string',
            'suceso' => 'required|string|max:255',
            'channels' => 'required|array|min:1',
            'channels.*' => 'string|in:Email,WhatsApp,SMS,Push',
            'tone' => 'sometimes|string|in:PROFESIONAL,INFORMAL,URGENTE',
            'data' => 'sometimes|array',
        ];
    }

    public function messages(): array
    {
        return [
            'suceso.required' => 'El suceso es requerido',
            'suceso.string' => 'El suceso debe ser texto',
            'suceso.max' => 'El suceso no puede exceder 255 caracteres',
            'channels.required' => 'Los canales son requeridos',
            'channels.array' => 'Los canales deben ser un array',
            'channels.min' => 'Al menos un canal es requerido',
            'channels.*.in' => 'Canal inválido. Debe ser: Email, WhatsApp, SMS o Push',
            'tone.in' => 'Tone debe ser: PROFESIONAL, INFORMAL o URGENTE',
            'data.array' => 'Data debe ser un array',
        ];
    }
}
