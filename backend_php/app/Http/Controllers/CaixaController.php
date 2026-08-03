<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InscricaoCompetidor;
use App\Models\Evento;
use Illuminate\Support\Facades\DB;

class CaixaController extends Controller
{
    /**
     * Lista todos os competidores que possuem inscrições (pagas ou não) em um evento.
     */
    public function listaPorEvento(Request $request, $id_evento)
    {
        $agrupar_por = $request->query('agrupar', 'competidor');
        
        $registros = InscricaoCompetidor::with(['competidor', 'inscricao.prova.divisao', 'inscricao.cadastrador'])
            ->whereHas('inscricao.prova', function($query) use ($id_evento) {
                $query->where('id_evento', $id_evento);
            })
            ->where('excluido', 0)
            ->whereHas('inscricao', function($query) {
                $query->where('excluido', 0);
            })
            ->get();

        $devedores = [];

        foreach ($registros as $reg) {
            if ($agrupar_por === 'cadastrador') {
                $id_group = $reg->inscricao->id_cadastrador;
                if (!$id_group || !$reg->inscricao->cadastrador) continue;
                $nome = $reg->inscricao->cadastrador->nome ?? $reg->inscricao->cadastrador->login ?? 'Desconhecido';
                $cpf = $reg->inscricao->cadastrador->cpf ?? '';
            } else {
                $id_group = $reg->id_competidor;
                if (!$id_group || !$reg->competidor) continue;
                $nome = $reg->competidor->nome ?? 'Sem Nome';
                $cpf = $reg->competidor->cpf ?? '';
            }

            if (!isset($devedores[$id_group])) {
                $devedores[$id_group] = [
                    'id_grupo' => $id_group,
                    'nome' => $nome,
                    'cpf' => $cpf,
                    'total_devido' => 0,
                    'total_pago' => 0,
                    'qtd_inscricoes' => 0,
                    'inscricoes' => []
                ];
            }

            $preco = floatval($reg->inscricao->prova->preco_inscricao ?? 0);
            $devedores[$id_group]['qtd_inscricoes']++;

            if ($reg->inscricao_paga) {
                $devedores[$id_group]['total_pago'] += $preco;
            } else {
                $devedores[$id_group]['total_devido'] += $preco;
            }

            if ($agrupar_por === 'cadastrador') {
                $prova_nome = ($reg->inscricao->prova->divisao->nome ?? 'Prova Desconhecida') . ' (' . ($reg->competidor->nome ?? 'Sem Nome') . ')';
            } else {
                $prova_nome = $reg->inscricao->prova->divisao->nome ?? 'Prova Desconhecida';
            }

            $devedores[$id_group]['inscricoes'][] = [
                'id_inscricao_competidor' => $reg->id_inscricao_competidor,
                'id_inscricao' => $reg->id_inscricao,
                'prova_nome' => $prova_nome,
                'preco' => $preco,
                'pago' => (bool) $reg->inscricao_paga,
            ];
        }

        // Ordenar alfabeticamente
        usort($devedores, function($a, $b) {
            return strcmp($a['nome'], $b['nome']);
        });

        return response()->json(array_values($devedores));
    }

    /**
     * Dá baixa (pagamento) em múltiplas inscrições de uma vez.
     */
    public function pagarInscricoes(Request $request)
    {
        $ids = $request->input('ids', []); // Array de id_inscricao_competidor

        if (empty($ids)) {
            return response()->json(['mensagem' => 'Nenhuma inscrição selecionada.'], 400);
        }

        try {
            DB::transaction(function () use ($ids) {
                InscricaoCompetidor::whereIn('id_inscricao_competidor', $ids)
                    ->update(['inscricao_paga' => 1]);
            });

            return response()->json(['mensagem' => 'Pagamentos registrados com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['mensagem' => 'Erro ao registrar pagamentos', 'erro' => $e->getMessage()], 500);
        }
    }
}
