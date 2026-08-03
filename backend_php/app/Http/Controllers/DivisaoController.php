<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Divisao;

class DivisaoController extends Controller
{
    public function buscaTodos(Request $request)
    {
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);
        
        $divisoes = Divisao::with('regras')->offset($offset)
            ->limit($limit)
            ->get();
            
        return response()->json($divisoes);
    }

    public function buscarFiltro(Request $request)
    {
        $filtro = $request->input('filtro', []);
        $query = Divisao::with('regras');
        
        if (!empty($filtro['nome'])) {
            $query->where('nome', 'like', '%' . $filtro['nome'] . '%');
        }
        
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);
        
        $divisoes = $query->offset($offset)->limit($limit)->get();
        return response()->json($divisoes);
    }

    public function buscaPorId($id)
    {
        $divisao = Divisao::with('regras')->findOrFail($id);
        return response()->json($divisao);
    }

    public function insere(Request $request)
    {
        $divisao = Divisao::create($request->all());
        if ($request->has('regras')) {
            $regras = $this->formatarRegrasSync($request->input('regras'));
            $divisao->regras()->sync($regras);
        }
        return response()->json($divisao, 201);
    }

    public function altera(Request $request, $id)
    {
        $divisao = Divisao::findOrFail($id);
        $divisao->update($request->all());
        if ($request->has('regras')) {
            $regras = $this->formatarRegrasSync($request->input('regras'));
            $divisao->regras()->sync($regras);
        }
        return response()->json($divisao);
    }

    private function formatarRegrasSync($regras)
    {
        // Se vier como array simples (ex: [1, 2, 3])
        if (isset($regras[0]) && !is_array($regras[0])) {
            return $regras;
        }

        // Se vier com parâmetros (ex: [{"id_regra": 1, "parametro1": "10"}])
        $formatted = [];
        foreach ($regras as $regra) {
            $id = $regra['id_regra'];
            $pivot = [];
            if (isset($regra['parametro1'])) $pivot['parametro1'] = $regra['parametro1'];
            if (isset($regra['parametro2'])) $pivot['parametro2'] = $regra['parametro2'];
            if (isset($regra['parametro3'])) $pivot['parametro3'] = $regra['parametro3'];
            if (isset($regra['parametro4'])) $pivot['parametro4'] = $regra['parametro4'];
            $formatted[$id] = $pivot;
        }
        return $formatted;
    }

    public function deleta($id)
    {
        $divisao = Divisao::findOrFail($id);
        $divisao->delete();
        return response()->json(['mensagem' => 'Divisão excluída com sucesso']);
    }
}
