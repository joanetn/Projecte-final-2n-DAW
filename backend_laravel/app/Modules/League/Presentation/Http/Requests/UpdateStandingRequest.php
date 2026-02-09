<?php

namespace App\Modules\League\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStandingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'partitsJugats' => 'nullable|integer|min:0',
            'partitsGuanyats' => 'nullable|integer|min:0',
            'partitsPerduts' => 'nullable|integer|min:0',
            'partitsEmpatats' => 'nullable|integer|min:0',
            'setsGuanyats' => 'nullable|integer|min:0',
            'setsPerduts' => 'nullable|integer|min:0',
            'jocsGuanyats' => 'nullable|integer|min:0',
            'jocsPerduts' => 'nullable|integer|min:0',
            'punts' => 'nullable|integer|min:0',
            'isActive' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'partitsJugats.integer' => 'Els partits jugats han de ser un número enter',
            'partitsJugats.min' => 'Els partits jugats no poden ser negatius',
            'partitsGuanyats.integer' => 'Els partits guanyats han de ser un número enter',
            'partitsGuanyats.min' => 'Els partits guanyats no poden ser negatius',
            'partitsPerduts.integer' => 'Els partits perduts han de ser un número enter',
            'partitsPerduts.min' => 'Els partits perduts no poden ser negatius',
            'partitsEmpatats.integer' => 'Els partits empatats han de ser un número enter',
            'partitsEmpatats.min' => 'Els partits empatats no poden ser negatius',
            'setsGuanyats.integer' => 'Els sets guanyats han de ser un número enter',
            'setsGuanyats.min' => 'Els sets guanyats no poden ser negatius',
            'setsPerduts.integer' => 'Els sets perduts han de ser un número enter',
            'setsPerduts.min' => 'Els sets perduts no poden ser negatius',
            'jocsGuanyats.integer' => 'Els jocs guanyats han de ser un número enter',
            'jocsGuanyats.min' => 'Els jocs guanyats no poden ser negatius',
            'jocsPerduts.integer' => 'Els jocs perduts han de ser un número enter',
            'jocsPerduts.min' => 'Els jocs perduts no poden ser negatius',
            'punts.integer' => 'Els punts han de ser un número enter',
            'punts.min' => 'Els punts no poden ser negatius',
            'isActive.boolean' => 'El camp isActive ha de ser un valor booleà',
        ];
    }
}
