<?php

namespace App\Modules\League\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateStandingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lligaId' => 'required|string|exists:lligas,id',
            'equipId' => 'required|string|exists:equips,id',
            'partitsJugats' => 'required|integer|min:0',
            'partitsGuanyats' => 'required|integer|min:0',
            'partitsPerduts' => 'required|integer|min:0',
            'partitsEmpatats' => 'required|integer|min:0',
            'setsGuanyats' => 'required|integer|min:0',
            'setsPerduts' => 'required|integer|min:0',
            'jocsGuanyats' => 'required|integer|min:0',
            'jocsPerduts' => 'required|integer|min:0',
            'punts' => 'required|integer|min:0',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'lligaId.required' => 'L\'ID de la lliga és obligatori',
            'lligaId.exists' => 'La lliga seleccionada no existeix',
            'equipId.required' => 'L\'ID de l\'equip és obligatori',
            'equipId.exists' => 'L\'equip seleccionat no existeix',
            'partitsJugats.required' => 'Els partits jugats són obligatoris',
            'partitsJugats.integer' => 'Els partits jugats han de ser un número enter',
            'partitsJugats.min' => 'Els partits jugats no poden ser negatius',
            'partitsGuanyats.required' => 'Els partits guanyats són obligatoris',
            'partitsGuanyats.integer' => 'Els partits guanyats han de ser un número enter',
            'partitsGuanyats.min' => 'Els partits guanyats no poden ser negatius',
            'partitsPerduts.required' => 'Els partits perduts són obligatoris',
            'partitsPerduts.integer' => 'Els partits perduts han de ser un número enter',
            'partitsPerduts.min' => 'Els partits perduts no poden ser negatius',
            'partitsEmpatats.required' => 'Els partits empatats són obligatoris',
            'partitsEmpatats.integer' => 'Els partits empatats han de ser un número enter',
            'partitsEmpatats.min' => 'Els partits empatats no poden ser negatius',
            'setsGuanyats.required' => 'Els sets guanyats són obligatoris',
            'setsGuanyats.integer' => 'Els sets guanyats han de ser un número enter',
            'setsGuanyats.min' => 'Els sets guanyats no poden ser negatius',
            'setsPerduts.required' => 'Els sets perduts són obligatoris',
            'setsPerduts.integer' => 'Els sets perduts han de ser un número enter',
            'setsPerduts.min' => 'Els sets perduts no poden ser negatius',
            'jocsGuanyats.required' => 'Els jocs guanyats són obligatoris',
            'jocsGuanyats.integer' => 'Els jocs guanyats han de ser un número enter',
            'jocsGuanyats.min' => 'Els jocs guanyats no poden ser negatius',
            'jocsPerduts.required' => 'Els jocs perduts són obligatoris',
            'jocsPerduts.integer' => 'Els jocs perduts han de ser un número enter',
            'jocsPerduts.min' => 'Els jocs perduts no poden ser negatius',
            'punts.required' => 'Els punts són obligatoris',
            'punts.integer' => 'Els punts han de ser un número enter',
            'punts.min' => 'Els punts no poden ser negatius',
            'isActive.boolean' => 'El camp isActive ha de ser un valor booleà',
        ];
    }
}
