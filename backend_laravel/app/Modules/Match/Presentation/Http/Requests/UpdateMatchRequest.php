<?php

namespace App\Modules\Match\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'jornadaId' => 'nullable|string|exists:jornadas,id',
            'localId' => 'nullable|string|exists:equips,id',
            'visitantId' => 'nullable|string|exists:equips,id|different:localId',
            'dataHora' => 'nullable|date',
            'pistaId' => 'nullable|string|exists:pistas,id',
            'arbitreId' => 'nullable|string|exists:usuaris,id',
            'status' => 'nullable|in:PENDENT,COMPLETAT,CANCELAT',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'localId.exists' => 'L\'equip local no existeix',
            'visitantId.exists' => 'L\'equip visitant no existeix',
            'visitantId.different' => 'L\'equip visitant ha de ser diferent del local',
            'dataHora.date' => 'La data del partit no és vàlida',
            'status.in' => 'L\'estat ha de ser PENDENT, COMPLETAT o CANCELAT',
        ];
    }
}
