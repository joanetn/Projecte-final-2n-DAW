<?php
namespace App\Modules\Lineup\Presentation\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class CreatePuntuacioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'partitId' => 'required|string|exists:partits,id',
            'jugadorId' => 'required|string|exists:usuaris,id',
            'punts' => 'nullable|integer|min:0',
        ];
    }
    public function messages(): array
    {
        return [
            'partitId.required' => 'El partit és obligatori',
            'partitId.exists' => 'El partit no existeix',
            'jugadorId.required' => 'El jugador és obligatori',
            'jugadorId.exists' => 'El jugador no existeix',
            'punts.min' => 'Els punts no poden ser negatius',
        ];
    }
}
