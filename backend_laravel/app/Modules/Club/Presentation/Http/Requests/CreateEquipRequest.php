<?php

namespace App\Modules\Club\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validació per crear un Equip.
 * El clubId arriba per la ruta (URL), no pel body del request.
 * Per tant, validem nom, categoria i lligaId opcionals.
 */
class CreateEquipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|min:2|max:255',
            'categoria' => 'required|string|max:100',
            'lligaId' => 'nullable|string|exists:lligas,id',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => "El nom de l'equip és obligatori",
            'nom.string' => "El nom ha de ser una cadena de text",
            'nom.min' => "El nom ha de tenir almenys 2 caràcters",
            'nom.max' => "El nom no pot excedir 255 caràcters",
            'categoria.required' => "La categoria és obligatòria",
            'categoria.string' => "La categoria ha de ser una cadena de text",
            'lligaId.exists' => "La lliga indicada no existeix",
        ];
    }
}
