<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campeonato;

class CampeonatoController extends Controller
{
    public function buscaTodos(Request $request)
    {
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);
        
        $campeonatos = Campeonato::with('organizador')
            ->orderBy('id_campeonato', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();
            
        return response()->json($campeonatos);
    }

    public function buscarFiltro(Request $request)
    {
        $filtro = $request->input('filtro', []);
        $query = Campeonato::with('organizador');
        
        if (!empty($filtro['nome'])) {
            $query->where('nome', 'like', '%' . $filtro['nome'] . '%');
        }
        if (isset($filtro['ativo'])) {
            $query->where('ativo', $filtro['ativo']);
        }
        
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);
        
        $campeonatos = $query->offset($offset)->limit($limit)->get();
        return response()->json($campeonatos);
    }

    public function insere(Request $request)
    {
        $data = $request->all();
        $campeonato = Campeonato::create($data);
        return response()->json($campeonato, 201);
    }

    public function buscaPorId($id)
    {
        $campeonato = Campeonato::with('organizador')->findOrFail($id);
        return response()->json($campeonato);
    }

    public function altera(Request $request, $id)
    {
        $campeonato = Campeonato::findOrFail($id);
        $campeonato->update($request->all());
        return response()->json($campeonato);
    }

    public function deleta($id)
    {
        $campeonato = Campeonato::findOrFail($id);
        $campeonato->delete();
        return response()->json(['mensagem' => 'Campeonato excluído com sucesso']);
    }
}
