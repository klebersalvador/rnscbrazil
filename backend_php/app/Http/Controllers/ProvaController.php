<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prova;

class ProvaController extends Controller
{
    public function buscaTodos(Request $request)
    {
        $query = Prova::with(['evento', 'divisao.regras'])->withCount('inscricoes');
        
        if ($request->has('id_evento')) {
            $query->where('id_evento', $request->query('id_evento'));
        }
        
        $provas = $query->get();
        return response()->json($provas);
    }

    public function buscaPorId($id)
    {
        $prova = Prova::with(['evento', 'divisao'])->findOrFail($id);
        return response()->json($prova);
    }

    public function insere(Request $request)
    {
        $data = $request->all();
        
        // Defaults for required non-nullable fields according to SQL strict mode
        $data['data_criacao'] = now();
        $data['prova_finalizada'] = false;
        $data['iniciada'] = false;
        $data['draw'] = false;
        $data['inscricao_bloqueada'] = false;
        
        $data['handicap_minimo_prova'] = $data['handicap_minimo_prova'] ?? 0;
        $data['taxa_administrativa'] = $data['taxa_administrativa'] ?? 10.00;
        $data['preco_inscricao'] = $data['preco_inscricao'] ?? 0.00;
        $data['porcentagem_premiacao'] = $data['porcentagem_premiacao'] ?? 50.00;
        $data['tipo_prova'] = $data['tipo_prova'] ?? 1; // Default to integer to pass strict mode

        $prova = Prova::create($data);
        return response()->json($prova, 201);
    }

    public function altera(Request $request, $id)
    {
        $prova = Prova::findOrFail($id);
        $prova->update($request->all());
        return response()->json($prova);
    }

    public function deleta($id)
    {
        $prova = Prova::findOrFail($id);
        
        // Verifica se tem inscricoes
        if ($prova->inscricoes()->count() > 0) {
            return response()->json(['mensagem' => 'Não é possível excluir uma prova com inscrições'], 400);
        }
        
        $prova->delete();
        return response()->json(['mensagem' => 'Prova excluída com sucesso']);
    }
}
