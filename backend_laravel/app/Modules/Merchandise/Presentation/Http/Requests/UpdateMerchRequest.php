<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use App\Enums\MerchBrand;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

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
            'marca' => ['nullable', new Enum(MerchBrand::class)],
            'preu' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.max' => 'El nom no pot superar els 255 caràcters.',
            'marca.enum' => 'La marca seleccionada no és vàlida. Marques disponibles: ' . implode(', ', MerchBrand::values()),
            'preu.numeric' => 'El preu ha de ser un valor numèric.',
            'preu.min' => 'El preu no pot ser negatiu.',
            'stock.integer' => "L'estoc ha de ser un nombre enter.",
            'stock.min' => "L'estoc no pot ser negatiu.",
        ];
    }
}
