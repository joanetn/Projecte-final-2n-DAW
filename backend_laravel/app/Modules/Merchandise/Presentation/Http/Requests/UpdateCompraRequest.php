<?php

namespace App\Modules\Merchandise\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantitat' => 'nullable|integer|min:1',
            'total' => 'nullable|numeric|min:0',
            'pagat' => 'nullable|boolean',
            'status' => 'nullable|string|in:PENDENT,COMPLETADA,CANCELADA',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'quantitat.min' => 'La quantitat mínima és 1.',
            'total.numeric' => 'El total ha de ser un valor numèric.',
            'status.in' => "L'estat ha de ser PENDENT, COMPLETADA o CANCELADA.",
        ];
    }
}
