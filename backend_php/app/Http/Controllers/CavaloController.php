<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cavalo;

class CavaloController extends Controller
{
    public function buscaTodos(Request $request)
    {
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);
        
        $cavalos = Cavalo::with('proprietario')
            ->offset($offset)
            ->limit($limit)
            ->get();
            
        return response()->json($cavalos);
    }

    public function buscaPorId($id)
    {
        $cavalo = Cavalo::with('proprietario')->findOrFail($id);
        return response()->json($cavalo);
    }

    public function insere(Request $request)
    {
        $data = $request->all();
        $data['id_proprietario'] = $request->user()->id_usuario ?? 1;
        $data['ativo'] = 1;
        $data['data_criacao'] = now();
        $data['data_modificacao'] = now();
        $data['pendente'] = 0;
        
        // Evitar erro strict mode no MySQL
        $data['cidade'] = $data['cidade'] ?? '';
        $data['nome_proprietario'] = $data['nome_proprietario'] ?? '';
        
        // Campos booleanos / inteiros
        $data['site'] = isset($data['site']) ? (int)$data['site'] : 0;
        $data['rsnc'] = isset($data['rsnc']) ? (int)$data['rsnc'] : 0;
        
        $cavalo = Cavalo::create($data);
        return response()->json($cavalo, 201);
    }

    public function altera(Request $request, $id)
    {
        $cavalo = Cavalo::findOrFail($id);
        $cavalo->update($request->all());
        return response()->json($cavalo);
    }

    public function deleta($id)
    {
        $cavalo = Cavalo::findOrFail($id);
        $cavalo->delete();
        return response()->json(['mensagem' => 'Cavalo excluído com sucesso']);
    }
}
