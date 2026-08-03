<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class LegacyResultadosController extends Controller
{
    public function getResultadosAntigos()
    {
        // Buscar resultados de evento com nome do evento
        $resultadosEvento = DB::table('resultado_evento')
            ->join('evento', 'evento.id_evento', '=', 'resultado_evento.id_evento')
            ->select(
                'resultado_evento.*',
                'evento.titulo as nome_evento'
            )
            ->orderBy('resultado_evento.data_criacao', 'desc')
            ->limit(100)
            ->get();

        // Buscar resultados de campeonato com nome do campeonato
        $resultadosCampeonato = DB::table('resultado_campeonato')
            ->join('campeonato', 'campeonato.id_campeonato', '=', 'resultado_campeonato.id_campeonato')
            ->select(
                'resultado_campeonato.*',
                'campeonato.nome as nome_campeonato'
            )
            ->orderBy('resultado_campeonato.data_criacao', 'desc')
            ->limit(100)
            ->get();

        return response()->json([
            'eventos' => $resultadosEvento,
            'campeonatos' => $resultadosCampeonato
        ]);
    }
}
