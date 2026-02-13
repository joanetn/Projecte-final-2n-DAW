<?php

namespace App\Modules\Invitation\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RespondreInvitacioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'estat' => 'required|string|in:acceptada,rebutjada',
        ];
    }

    public function messages(): array
    {
        return [
            'estat.required' => "L'estat és obligatori",
            'estat.in' => "L'estat ha de ser: acceptada o rebutjada",
        ];
    }
}
