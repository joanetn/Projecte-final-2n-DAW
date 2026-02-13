<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMerchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'nullable|string|max:255',
            'marca' => 'nullable|string|max:255',
            'preu' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.max' => 'El nom no pot superar els 255 caràcters.',
            'preu.numeric' => 'El preu ha de ser un valor numèric.',
            'preu.min' => 'El preu no pot ser negatiu.',
            'stock.integer' => "L'estoc ha de ser un nombre enter.",
            'stock.min' => "L'estoc no pot ser negatiu.",
        ];
    }
}
