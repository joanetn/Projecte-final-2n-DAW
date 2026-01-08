<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        return Usuario::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            "nom" => "required|string|max:255",
            "email" => "required|email|unique:usuarios,email",
            "password" => "required|string|min:6",
            "rol" => "required|in:JUGADOR,ENTRENADOR,ADMIN_EQUIP,ADMIN_WEB,ARBITRE,SUPERADMIN"
        ]);

        $usuario = Usuario::create([
            "nom" => $request->nom,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "rol" => $request->rol,
        ]);

        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        return Usuario::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:usuarios,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'rol' => 'sometimes|in:JUGADOR,ENTRENADOR,ADMIN_EQUIP,ADMIN_WEB,ARBITRE,SUPERADMIN',
        ]);

        if ($request->has('password')) {
            $request->merge(['password' => Hash::make($request->password)]);
        }

        $usuario->update($request->all());

        return response()->json($usuario, 200);
    }

    public function destroy($id)
    {
        Usuario::destroy($id);
        return response()->json(null, 204);
    }
}
