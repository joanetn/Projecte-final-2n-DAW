<?php

namespace App\Http\Controllers;

use App\Models\Usuaris;
use App\Models\Usuaris_info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UsuarisController extends Controller
{

    public function voreTot()
    {
        return Usuaris_info::all();
    }

    public function index()
    {
        return Usuaris::all();
    }

    public function show($id)
    {
        return Usuaris::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuaris::findOrFail($id);

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
        Usuaris::destroy($id);
        return response()->json(null, 204);
    }

    public function canviRol(Request $request, $id)
    {
        $request->validate([
            'rol' => 'required|in:JUGADOR,ENTRENADOR,ADMIN_EQUIP,ADMIN_WEB,ARBITRE,SUPERADMIN'
        ]);

        $usuari = Usuaris::findOrFail($id);

        $usuari->rols()->firstOrCreate(
            ['rol' => $request->rol],
            ['isActive' => true]
        );

        return response()->json($usuari->load('rols'), 200);
    }
}
