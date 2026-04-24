<?php

namespace App\Modules\Lineup\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAlineacioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'partitId' => 'required|string|exists:partits,id',
            'equipId' => 'required|string|exists:equips,id',
            'jugadorId' => 'required_without:jugadors|string|exists:usuaris,id',
            'posicio' => 'nullable|string|max:50',
            'jugadors' => 'sometimes|array|min:1',
            'jugadors.*.jugadorId' => 'required_without:jugadors.*.id|string|exists:usuaris,id',
            'jugadors.*.id' => 'required_without:jugadors.*.jugadorId|string|exists:usuaris,id',
            'jugadors.*.posicio' => 'nullable|string|max:50',
        ];
    }
    public function messages(): array
    {
        return [
            'partitId.required' => 'El partit és obligatori',
            'partitId.exists' => 'El partit no existeix',
            'jugadorId.required_without' => 'El jugador és obligatori',
            'jugadorId.exists' => 'El jugador no existeix',
            'equipId.required' => "L'equip és obligatori",
            'equipId.exists' => "L'equip no existeix",
            'posicio.max' => 'La posició no pot tenir més de 50 caràcters',
            'jugadors.array' => 'Els jugadors han de ser una llista',
            'jugadors.min' => 'Cal indicar almenys un jugador',
            'jugadors.*.jugadorId.required_without' => 'Cada jugador necessita un identificador',
            'jugadors.*.jugadorId.exists' => 'Un dels jugadors no existeix',
            'jugadors.*.id.required_without' => 'Cada jugador necessita un identificador',
            'jugadors.*.id.exists' => 'Un dels jugadors no existeix',
            'jugadors.*.posicio.max' => 'La posició no pot tenir més de 50 caràcters',
        ];
    }
}
