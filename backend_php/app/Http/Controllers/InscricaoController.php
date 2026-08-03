<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscricao;
use App\Services\InscricaoService;

class InscricaoController extends Controller
{
    protected $inscricaoService;

    public function __construct(InscricaoService $inscricaoService)
    {
        $this->inscricaoService = $inscricaoService;
    }

    public function buscaTodos(Request $request)
    {
        $inscricoes = Inscricao::with(['prova', 'cadastrador'])->get();
        return response()->json($inscricoes);
    }

    public function buscaPorProva($id_prova)
    {
        $inscricoes = Inscricao::with(['competidores' => function($query) {
            $query->where('excluido', 0)
                  ->with(['competidor', 'cavalo']);
        }])
        ->where('id_prova', $id_prova)
        ->where('excluido', 0)
        ->orderByRaw('ISNULL(ordem_entrada), ordem_entrada ASC, id_inscricao ASC')
        ->get();

        return response()->json($inscricoes);
    }

    public function insereVerificandoProva(Request $request)
    {
        try {
            $dadosInscricao = $request->input('inscricao');
            $competidores = $request->input('competidores', []);
            
            $inscricao = $this->inscricaoService->insereVerificandoProva($dadosInscricao, $competidores);
            
            return response()->json([
                'status' => true,
                'inscricao' => $inscricao
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Inscricao Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'titulo' => 'Erro na Inscrição',
                'mensagem' => $e->getMessage()
            ], 400);
        }
    }

    public function deleta($id)
    {
        $inscricao = Inscricao::findOrFail($id);
        $inscricao->excluido = true;
        $inscricao->save();
        
        return response()->json(['mensagem' => 'Inscrição excluída com sucesso']);
    }
}
