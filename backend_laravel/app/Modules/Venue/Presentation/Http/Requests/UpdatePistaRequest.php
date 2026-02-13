<?php

namespace App\Modules\Venue\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePistaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'nullable|string|min:1|max:255',
            'tipus' => 'nullable|string|max:100',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.string' => "El nom ha de ser una cadena de text",
            'nom.min' => "El nom ha de tenir almenys 1 caràcter",
            'nom.max' => "El nom no pot excedir 255 caràcters",
            'tipus.string' => "El tipus ha de ser una cadena de text",
            'tipus.max' => "El tipus no pot excedir 100 caràcters",
            'isActive.boolean' => "El camp isActive ha de ser un valor booleà",
        ];
    }
}
