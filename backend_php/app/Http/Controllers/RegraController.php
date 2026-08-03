<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regra;

class RegraController extends Controller
{
    public function index()
    {
        $regras = Regra::all();
        return response()->json($regras);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required',
            'descricao' => 'required',
            'expressao' => 'required',
            'parametros' => 'required',
            'tipo_regra' => 'nullable|integer',
            'regra_aplicante' => 'required|integer',
        ]);
        
        $regra = Regra::create($request->all());
        return response()->json($regra, 201);
    }

    public function update(Request $request, $id)
    {
        $regra = Regra::findOrFail($id);
        $regra->update($request->all());
        return response()->json($regra);
    }

    public function destroy($id)
    {
        $regra = Regra::findOrFail($id);
        $regra->delete();
        return response()->json(['message' => 'Regra deletada com sucesso']);
    }
}
