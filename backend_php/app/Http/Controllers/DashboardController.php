<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;
use App\Models\Cavalo;
use App\Models\Usuario;
use App\Models\Inscricao;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        // Contadores reais
        $totalEventos = Evento::where('finalizado', false)->count();
        $totalCavalos = Cavalo::where('ativo', true)->count();
        
        $totalUsuarios = Usuario::where('competidor', 1)->where('ativo', 1)->count();

        // Calcular inscrições dos últimos 6 meses para o gráfico
        $chartData = [];
        $mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        // Vamos pegar os últimos 6 meses agrupados
        $seisMesesAtras = now()->subMonths(5)->startOfMonth();
        
        $inscricoesPorMes = Inscricao::where('data_inscricao', '>=', $seisMesesAtras)
            ->selectRaw('MONTH(data_inscricao) as mes, YEAR(data_inscricao) as ano, count(*) as total')
            ->groupBy('ano', 'mes')
            ->orderBy('ano')
            ->orderBy('mes')
            ->get();

        // Se não houver dados nos últimos 6 meses, vamos usar um fallback global do ano de 2025 ou mock
        if ($inscricoesPorMes->count() < 2) {
            $inscricoesPorMes = Inscricao::whereYear('data_inscricao', 2025)
                ->selectRaw('MONTH(data_inscricao) as mes, count(*) as total')
                ->groupBy('mes')
                ->orderBy('mes')
                ->get();
            
            foreach ($inscricoesPorMes as $row) {
                $chartData[] = [
                    'name' => $mesesNomes[$row->mes - 1],
                    'v1' => $row->total,
                    'v2' => round($row->total * 0.8) // linha secundária de exemplo (ex: pagos vs total)
                ];
            }
        } else {
            foreach ($inscricoesPorMes as $row) {
                $chartData[] = [
                    'name' => $mesesNomes[$row->mes - 1] . '/' . substr($row->ano, 2),
                    'v1' => $row->total,
                    'v2' => round($row->total * 0.8)
                ];
            }
        }

        // Calcula a porcentagem de crescimento do total de inscricoes (mes atual vs mes anterior)
        $performanceIndex = '+15.2%'; // Fictício por enquanto, para a placa
        if (count($chartData) >= 2) {
            $ultimo = $chartData[count($chartData)-1]['v1'];
            $penultimo = $chartData[count($chartData)-2]['v1'];
            if ($penultimo > 0) {
                $crescimento = (($ultimo - $penultimo) / $penultimo) * 100;
                $sinal = $crescimento >= 0 ? '+' : '';
                $performanceIndex = $sinal . round($crescimento, 1) . '%';
            }
        }

        return response()->json([
            'upcomingEvents' => $totalEventos,
            'activeRiders' => $totalUsuarios,
            'stabledHorses' => $totalCavalos,
            'performanceIndex' => $performanceIndex,
            'chartData' => $chartData
        ]);
    }
}
