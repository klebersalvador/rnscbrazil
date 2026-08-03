<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Raca;

class RacaController extends Controller
{
    public function index()
    {
        $racas = Raca::orderBy('descricao')->get();
        return response()->json($racas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'descricao' => 'required|string|max:200',
            'abreviacao' => 'required|string|max:5',
        ]);

        $raca = Raca::create([
            'descricao' => $request->descricao,
            'abreviacao' => strtoupper($request->abreviacao),
            'data_criacao' => now(),
            'data_modificacao' => now()
        ]);

        return response()->json($raca, 201);
    }

    public function update(Request $request, $id)
    {
        $raca = Raca::findOrFail($id);

        $request->validate([
            'descricao' => 'required|string|max:200',
            'abreviacao' => 'required|string|max:5',
        ]);

        $raca->update([
            'descricao' => $request->descricao,
            'abreviacao' => strtoupper($request->abreviacao),
            'data_modificacao' => now()
        ]);

        return response()->json($raca);
    }

    public function destroy($id)
    {
        $raca = Raca::findOrFail($id);
        
        try {
            $raca->delete();
            return response()->json(['mensagem' => 'Raça excluída com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['mensagem' => 'Não é possível excluir esta raça pois ela está em uso.'], 400);
        }
    }
}
