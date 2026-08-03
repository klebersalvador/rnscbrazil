<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Pontuacao;

class PontuacaoController extends Controller
{
    public function index()
    {
        $pontuacoes = Pontuacao::all();
        return response()->json($pontuacoes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required',
            'tipo' => 'required',
            'regras_json' => 'required',
            'ativo' => 'boolean'
        ]);
        
        $pontuacao = Pontuacao::create($request->all());
        return response()->json($pontuacao, 201);
    }

    public function update(Request $request, $id)
    {
        $pontuacao = Pontuacao::findOrFail($id);
        $pontuacao->update($request->all());
        return response()->json($pontuacao);
    }

    public function destroy($id)
    {
        $pontuacao = Pontuacao::findOrFail($id);
        $pontuacao->delete();
        return response()->json(['message' => 'Regra de pontuação deletada com sucesso']);
    }
}
