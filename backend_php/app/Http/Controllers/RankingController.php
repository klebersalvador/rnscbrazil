<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Campeonato;

class RankingController extends Controller
{
    /**
     * Retorna o ranking somado de todas as etapas (eventos) de um campeonato,
     * separado por Divisões.
     */
    public function getRankingCampeonato($id_campeonato)
    {
        // Verifica se o campeonato existe
        $campeonato = Campeonato::findOrFail($id_campeonato);

        // Busca o ranking consolidado via query builder
        $resultados = DB::table('inscricao_competidor')
            ->join('inscricao', 'inscricao.id_inscricao', '=', 'inscricao_competidor.id_inscricao')
            ->join('prova', 'prova.id_prova', '=', 'inscricao.id_prova')
            ->join('evento', 'evento.id_evento', '=', 'prova.id_evento')
            ->join('usuario as competidor', 'competidor.id_usuario', '=', 'inscricao_competidor.id_competidor')
            ->join('divisao', 'divisao.id_divisao', '=', 'prova.id_divisao')
            ->where('evento.id_campeonato', $id_campeonato)
            ->where('inscricao.excluido', 0)
            ->whereNotNull('inscricao.classificacao') // Apenas quem correu e não foi SAT (SAT = null)
            ->select(
                'divisao.id_divisao',
                'divisao.nome as divisao_nome',
                'competidor.id_usuario',
                'competidor.nome as competidor_nome',
                DB::raw('SUM(inscricao_competidor.pontos_campeonato) as total_pontos'),
                DB::raw('COUNT(inscricao.id_inscricao) as total_passadas')
            )
            ->groupBy('divisao.id_divisao', 'divisao.nome', 'competidor.id_usuario', 'competidor.nome')
            ->orderBy('divisao.nome')
            ->orderBy('total_pontos', 'desc')
            ->get();

        // Estruturar a resposta por divisão para facilitar o frontend
        $rankingAgrupado = [];
        
        foreach ($resultados as $row) {
            $divisaoId = $row->id_divisao;
            
            if (!isset($rankingAgrupado[$divisaoId])) {
                $rankingAgrupado[$divisaoId] = [
                    'id_divisao' => $divisaoId,
                    'nome' => $row->divisao_nome,
                    'competidores' => []
                ];
            }
            
            $rankingAgrupado[$divisaoId]['competidores'][] = [
                'id_competidor' => $row->id_usuario,
                'nome' => $row->competidor_nome,
                'total_pontos' => (int) $row->total_pontos,
                'total_passadas' => (int) $row->total_passadas
            ];
        }

        return response()->json([
            'campeonato' => $campeonato,
            'ranking' => array_values($rankingAgrupado)
        ]);
    }
}
