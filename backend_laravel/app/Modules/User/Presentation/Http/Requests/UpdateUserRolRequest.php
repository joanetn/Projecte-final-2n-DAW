<?php

namespace App\Modules\User\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'isActive' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'isActive.required' => "El camp 'isActive' és obligatori",
            'isActive.boolean' => "El camp 'isActive' ha de ser booleà",
        ];
    }
}
