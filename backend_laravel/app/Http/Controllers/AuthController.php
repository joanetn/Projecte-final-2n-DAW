<?php

namespace App\Http\Controllers;

use App\Models\Usuaris;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'usuari' => 'required|string',
            'contrasenya' => 'required|string|min:6',
        ]);

        $input = $request->usuari;

        if (filter_var($input, FILTER_VALIDATE_EMAIL)) {
            $usuari = Usuaris::where('email', $input)->first();
        } else {
            $usuari = Usuaris::where('nom', $input)->first();
        }

        if (!$usuari) {
            return response()->json(['message' => 'Usuari no trobat'], 404);
        }

        if (!$usuari) {
            return response()->json(['message' => 'Contrasenya incorrecta'], 401);
        }

        if (!Hash::check($request->contrasenya, $usuari->contrasenya)) {
            return response()->json(['message' => 'Contrasenya incorrecta'], 401);
        }

        $usuari->load('rols');

        return response()->json([
            'usuari' => $usuari
        ], 200);
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                "nom" => "required|string|max:255",
                "email" => "required|email|unique:\"Usuari\",email",
                "contrasenya" => "required|string|min:6",
                "rol" => "required|array|min:1",
                "rol.*" => "in:JUGADOR,ENTRENADOR,ARBITRE"
            ]);

            // Ensure ARBITRE role is exclusive
            if (in_array('ARBITRE', $request->rol) && count($request->rol) > 1) {
                return response()->json([
                    'message' => 'El rol ARBITRE no pot coexistir amb altres rols.'
                ], 422);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validació',
                'errors' => $e->errors()
            ], 422);
        }

        $usuario = Usuaris::create([
            "nom" => $request->nom,
            "email" => $request->email,
            "contrasenya" => Hash::make($request->contrasenya),
        ]);

        foreach ($request->rol as $rol) {
            $usuario->rols()->create([
                'rol' => $rol,
                'isActive' => true,
            ]);
        }

        $usuario->load('rols');

        return response()->json($usuario, 201);
    }
}